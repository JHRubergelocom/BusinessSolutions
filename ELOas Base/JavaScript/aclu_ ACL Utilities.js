// JavaScript Dokument
var aclu = new ELOAclUtils();

function ELOAclUtils() {
}

ELOAclUtils.prototype.aclsSplitGroup = function(connection, fromGroup, toGroup1, toGroup2) {
  this.processAcls(connection, 1, fromGroup, toGroup1, toGroup2, 31, 31);
}

ELOAclUtils.prototype.aclsMergeGroups = function(connection, mergeGroup1, mergeGroup2, toGroup) {
  this.processAcls(connection, 2, mergeGroup1, mergeGroup2, toGroup, 0, 0);
}

ELOAclUtils.prototype.aclsRemoveGroup = function(connection, group) {
  this.processAcls(connection, 3, group, 0, 0, 0, 0);
}

ELOAclUtils.prototype.processAcls = function(connection, mode, group1, group2, group3, access2, access3) {
  db.init(connection);
  var dbcn = EM_connections[connection].dbcn;
  var stmt = dbcn.createStatement();
  
  var fromGroup = 0;
  var toGroup1 = 3;
  var toGroup2 = 12;
  
  var cmd;
  var sGroup1 = aclu.encode20Bit(group1);
  var sGroup2 = aclu.encode20Bit(group2);
  
  switch (mode) {
    case 1:
      // Eine Gruppe in zwei Gruppen aufsplitten
      cmd = "select distinct objacl from thiele.dbo.objekte where objacl like '%7_" + sGroup1 + "%'";
      break;
      
    case 2:
      // Zwei Gruppen in eine Gruppe zusammenfügen
      cmd = "select distinct objacl from thiele.dbo.objekte where objacl like '%7_" + sGroup1 + "%' and objacl like '%7_" + sGroup2 + "%'";
      break;
      
    case 3:
      // Anwender/ Gruppe löschen
      cmd = "select distinct objacl from thiele.dbo.objekte where objacl like '%7_" + sGroup1 + "%'";
      break;
  }
      
  var result = stmt.executeQuery(cmd);
  var modifications = new Array();
  log.debug("Collect Change List");
  
  while (result.next()) {
    var acl = result.getString(1)
    log.debug("ACL: " + acl);
    var items = this.splitAcl(acl);
    var newItems;
    
    switch (mode) {
      case 1:
        newItems = this.splitGroup(items, group1, group2, access2, group3, access3);
        break;
        
      case 2:
        newItems = this.mergeGroups(items, group1, group2, group3, 10);
        break;
        
      case 3:
        newItems = this.removeGroup(items, group1);
        break;
    }
    
    var newAcl = aclu.joinAcl(newItems);
    
    var job = new Object();
    job.oldAcl = acl;
    job.newAcl = newAcl;
    modifications.push(job);
    
    log.debug("NEW: " + newAcl);
  }
  
  result.close();
  
  log.debug("Update DB ACLs");
  for (var i = 0; i < modifications.length; i++) {
    var job = modifications[i];
    var ucmd = "update thiele.dbo.objekte set objacl = '" + job.newAcl +
               "' where objacl = '" + job.oldAcl + "'";
    log.info("CMD: " + ucmd);
    stmt.executeUpdate(ucmd);
  }
  
  stmt.close();
}

// intern, codiert einen 5 Bit Wert in ein Zeichen
ELOAclUtils.prototype.encodeDigit = function(value) {
  if (value > 25) {
    return String.fromCharCode(value + 22);
  } else {
    return String.fromCharCode(value + 65);
  }
}

// intern, liest aus einem Zeichen ein 5 Bit Wert aus
ELOAclUtils.prototype.decodeDigit = function(valueString, position) {
  var val = valueString.charCodeAt(position);
  if (val > 64) {
    return val - 65;
  } else {
    return val - 22;
  }
}

// intern, codiert einen 20 Bit Wert in 4 Zeichen
ELOAclUtils.prototype.encode20Bit = function(value) {
  var res = "";
  
  for (var i = 0; i < 4; i++) {
    var part = value & 31;
    res += this.encodeDigit(part);
    
    value = value / 32;
  }
  
  return res;
}

// intern, liest aus 4 Zeichen einen 20 Bit Wert aus
ELOAclUtils.prototype.decode20Bit = function(value) {
  value = String(value);
  
  var res = 0;
  for (var i = value.length - 1; i >= 0; i--) {
    res = (res * 32) + this.decodeDigit(value, i);
  }
  
  return res;
}

// Bildet einen 6 Zeichen acl String aus der Anwender oder Gruppennummer,
// den Zugriffsrechten und dem Typ (6: Schlüssel, 7: User/Group)
ELOAclUtils.prototype.getAcl = function(userOrGroupId, accessMask, aclType) {
  var res = "7";
  
  if (aclType != undefined) {
    res = aclType;
  }
  
  res += this.encodeDigit(accessMask);
  res += this.encode20Bit(userOrGroupId);
  
  return res;
}

// Spaltet einen acl String in ein Array von ACL Items auf
ELOAclUtils.prototype.splitAcl = function(aclString) {
  aclString = String(aclString);
  var res = new Array();
  var len = aclString.length;
  
  var andGroupCounter = 0;
  var isInAndGroup = false;
  var lastItem;
  
  for (var i = 0; i < len; i += 6) {
    var item = new Object();
    item.id = this.decode20Bit(aclString.substring(i + 2, i + 6));
    item.access = this.decodeDigit(aclString, i + 1);
    item.type = aclString.substring(i, i + 1);
    
    if (item.access == 0) {
      if (!isInAndGroup) {
        andGroupCounter++;
        lastItem.andGroupId = andGroupCounter;
        isInAndGroup = true;
      }
      
      item.andGroupId = andGroupCounter;
    } else {
      isInAndGroup = false;
      item.andGroupId = 0;
    }
    
    res.push(item);
    lastItem = item;
  }
  
  return res;
}

// Fügt ein ACL Items Array zu einem acl String zusammen
ELOAclUtils.prototype.joinAcl = function(aclItemList) {
  var res = "";
  
  for (var i = 0; i < aclItemList.length; i++) {
    if (aclItemList[i].type == "*") {
      continue;
    }
    
    res += this.getAcl(aclItemList[i].id, aclItemList[i].access, aclItemList[i].type);
  }
  
  return res;
}

// Entfernt eine Gruppe aus der ACL
ELOAclUtils.prototype.removeGroup = function(aclItemList, searchGroup) {
  for (var i = 0; i < aclItemList.length; i++) {
    var item = aclItemList[i];
    if ((item.id == searchGroup) && (item.type == '7')) {
      var oldaccess = item.access;
      aclItemList.splice(i, 1);
      if ((i < aclItemList.length) && (aclItemList[i].access == 0)) {
        // entfernter Eintrag war Starteintrag einer UND Gruppe, 
        // Berechtigungen auf neuen Starteintrag übertragen.
        aclItemList[i].access = oldaccess;
      }
      i--;
    }
  }
  
  return aclItemList;
}

// Fügt zwei Gruppen zu einer Gruppe zusammen. Die beiden Gruppen dürfen nicht Mitglied
// unterschiedlicher UND Gruppen sein und sie dürfen jeweils nur einmal vorkommen.
ELOAclUtils.prototype.mergeGroups = function(aclItemList, mergeGroup1, mergeGroup2, destGroup, mergeMode) {
  for (var g1 = 0; g1 < aclItemList.length; g1++) {
    var item1 = aclItemList[g1];
    if ((item1.id == mergeGroup1) && (item1.type == "7")) {
      var startg2 = 0;
      var endg2 = aclItemList.length;
      
      if (item1.andGroupId > 0) {
        // Nur diese UND Gruppe durchsuchen
        startg2 = g1 + 1;
        var actAG = item1.andGroupId;
        
        for (var l = startg2; l < aclItemList.length; l++) {
          var litem = aclItemList[l];
          if (litem.andGroupId != actAG) {
            endg2 = l;
            break;
          }
        }
      }
        
      for (var g2 = 0; g2 < aclItemList.length; g2++) {
        var item2 = aclItemList[g2];
        if ((item2.id == mergeGroup2) && (item2.type == "7")) {
          var acl1 = item1.access;
          var acl2 = item2.access;
          var acl = acl1;
          switch (mergeMode) {
                        case 1:
                            acl = acl1;
                            break;
                        case 2:
                            acl = acl2;
                            break;
                        case 10:
                            acl = acl1 | acl2;
                            break;
                        case 20:
                            acl = acl2 & acl2;
                            break;
          }
          item1.id = destGroup;
          item1.access = acl;
          aclItemList.splice(g2, 1);
          break;
        }
      }
      
      return aclItemList;
    }
  }
  
  return aclItemList;
}

// Teilt eine Gruppe in zwei Gruppen auf. Dabei kann eine BitMaske
// mit den maximalen Rechten bestimmt werden.
ELOAclUtils.prototype.splitGroup = function(aclItemList, searchGroup, destGroup1, maxAccess1, destGroup2, maxAccess2) {
  for (var i = 0; i < aclItemList.length; i++) {
    var item = aclItemList[i];
    if ((item.id == searchGroup) && (item.type == '7')) {
      var oldaccess = item.access;
      var newaccess1 = oldaccess & maxAccess1;
      var newaccess2 = oldaccess & maxAccess2;
      
      var newItem1 = null;
      var newItem2 = null;
      
      if ((oldaccess == 0) || (newaccess1 > 0)) {
        newItem1 = new Object();
        newItem1.id = destGroup1;
        newItem1.access = newaccess1;
        newItem1.type = item.type;
        newItem1.andGroupId = item.andGroupId;
      }
      
      if ((oldaccess == 0) || (newaccess2 > 0)) {
        newItem2 = new Object();
        newItem2.id = destGroup2;
        newItem2.access = newaccess2;
        newItem2.type = item.type;
        newItem2.andGroupId = item.andGroupId;
      }
      
      if ((newItem1 == null) && (newItem2 == null)) {
        aclItemList.splice(i, 1);
        if ((i < aclItemList.length) && (aclItemList[i].access == 0)) {
          // entfernter Eintrag war Starteintrag einer UND Gruppe, 
          // Berechtigungen auf neuen Starteintrag übertragen.
          aclItemList[i].access = oldaccess;
        }
        i--;
      } else if ((newItem1 != null) && (newItem2 == null)) {
        aclItemList[i] = newItem1;
      } else if ((newItem1 == null) && (newItem2 != null)) {
        aclItemList[i] = newItem2;
      } else {
        aclItemList[i] = newItem1;
        aclItemList.splice(i + 1, 0, newItem2);
      }      
    }
  }
  
  return aclItemList;
}

// Entfernt redundante Einträge aus der ACL
ELOAclUtils.prototype.sanityze = function(aclItems) {
  for (var i = 0; i < aclItems.length; i++) {
    var item = aclItems[i];
    if (item.andGroupId == 0) {
      for (var j = i + 1; j < aclItems.length; j++) {
        var item2 = aclItems[j];
        if ((item2.andGroupId == 0) && (item2.id == item.id) && (item2.type == item.type)) {
          item.access = item.access | item2.access;
          aclItems.splice(j, 1);
          j--;
        }
      }
    } else {
      var agi = item.andGroupId;
      for (var k = i + 1; k < aclItems.length; k++) {
        var item3 = aclItems[k];
        if (item3.andGroupId != agi) {
          break;
        }
        
        if ((item3.id == item.id) && (item3.type == item.type)) {
          aclItems.splice(k, 1);
          k--;
        }
      }
    }
  }
  
  return aclItems;
}
        
     
ELOAclUtils.prototype.toString = function(aclItems) {
  var res = new Array();
  
  for (var i = 0; i < aclItems.length; i++) {
    var item = aclItems[i];
    res.push("Id: " + item.id + ", Ac: " + item.access + ", Ty: " + item.type + ", Gp: " + item.andGroupId);
  }
  
  return res.join(" ## ");
}
