// start namespace elo
var elo = new Object();
elo = {

  getIndexValueByName: function(sord, groupName, defaultValue) {
    var objKeys = sord.objKeys;
    for (var i = 0; i < objKeys.length; i++) {
      var key = objKeys[i];
      if (key.name == groupName) {
        return this.formatKeyData(key.data);
      }
    }
    
    return defaultValue;
  },
  
  getIndexValue: function (Sord, lineNo) {
    var objKey = Sord.getObjKeys()[lineNo];
    if (!objKey) {
      return "";
    }

    return this.formatKeyData(objKey.data);
  },

  formatKeyData: function(keyData) {
    if (keyData && keyData.length > 0) {
      if (keyData.length == 1) {
        return keyData[0] + "";
      } else {
        var result = "";
        var i;
        for (i = 0; i < keyData.length; i++) {
          result = result + "¶" + keyData[i];
        }
        result = result.substr(1);
        return result;
      }
    } else {
      return "";
    }
  },
  
  setIndexValueByName: function(sord, groupName, value) {
    var objKeys = sord.objKeys;
    for (var i = 0; i < objKeys.length; i++) {
      if (objKeys[i].name == groupName) {
        this.setIndexValue(sord, i, value);
        return;
      }
    }
  },
  
  setIndexValue: function (sord, lineNo, text) {
     if (text) {
      text = String(text);
      var objKey = sord.objKeys[lineNo];
      if (text.indexOf("¶") > -1) {
        var keyData = text.split("¶");
        objKey.data = keyData;
      } else {
        objKey.data = [ text ];
      }
    } else {
     if (text != null) {
       var text = String(text);
       if (text.equals("")) {
         var objKeyData = sord.objKeys[lineNo].data;
         if ((objKeyData) && (objKeyData.length > 0) && (objKeyData[0] != "" )) {
           sord.objKeys[lineNo].data = [text];
         }
       }
     }
   }
  },

  preparePath: function (destPath) {
    return elo.prepareDynPath(destPath, "");
  },

  prepareDynPath: function (destPath, memo) {
    log.debug("PreparePath: " + destPath);
    var temp = destPath.split("¶¶¶.");
    if (temp.length == 2) {
      EM_FOLDERMASK = temp[0];
      destPath = temp[1];
    } else {
      EM_FOLDERMASK = "1";
    }

    try {
      var allowCreate = false;
      var checkOutPath = destPath;
      if (isNaN(destPath)) {
        checkOutPath = "ARCPATH:" + destPath;
        allowCreate = true;
      }
      var editInfo = ixConnect.ix().checkoutSord(checkOutPath, EditInfoC.mbOnlyId, LockC.NO);
      log.debug("Path found, GUID: " + editInfo.getSord().getGuid() + "   ID: " + editInfo.getSord().getId());
      EM_PARENT_ID = editInfo.getSord().getId();
      EM_PARENT_ACL = editInfo.getSord().getAclItems();
      return editInfo.getSord().getId();
    } catch (e) {
      log.debug("Path not found, create new: " + destPath + ", use foldermask: " + EM_FOLDERMASK);
    }

    if (!allowCreate) {
      return -1;
    }

    EM_PARENT_ID = -1;

    items = destPath.split("¶");

    var sordList = new Array(items.length - 1);

    var i;
    for (i = 1; i < items.length; i++) {
      log.debug("Split " + i + " : " + items[i]);
      var sord = new Sord();
      sord.setMask(EM_FOLDERMASK);
      sord.setName(items[i]);

      if (i == (items.length - 1)) {
        sord.setDesc(memo);
      }

      sordList[i - 1] = sord;
    }

    log.debug("now checkinSordPath");
    var ids = ixConnect.ix().checkinSordPath("1", sordList, new SordZ(SordC.mbName | SordC.mbMask | SordC.mbDesc | SordC.mbObjKeys));
    log.debug("checkin done: id: " + ids[ids.length - 1]);

    return ids[ids.length - 1];
  },

  loadBaseData: function (Sord) {
    NAME = String(Sord.name);
    DOCDATE = String(Sord.getXDateIso());
    ARCDATE = String(Sord.getIDateIso());
    OBJCOLOR = String(Sord.kind);
    OBJDESC = String(Sord.desc);
    OBJTYPE = String(Sord.type);
    ARCHIVINGMODE = Sord.getDetails().getArchivingMode() - 2000;
    ACL = elo.getACLString(Sord);
    BACKUP_ACL = ACL;
  },

  storeBaseData: function (Sord) {
    if (NAME != "") {
      Sord.setName(NAME);
    }
    Sord.setXDateIso(DOCDATE);
    Sord.setIDateIso(ARCDATE);
    Sord.setKind(OBJCOLOR);
    Sord.setDesc(OBJDESC);
    Sord.setType(OBJTYPE);
    Sord.getDetails().setArchivingMode(ARCHIVINGMODE + 2000);
    elo.processAcl(Sord);
  },

  fillupAclItem: function (aclItem, oneItem) {
    if (oneItem == "PARENT") {  
      aclItem.type = AclItemC.TYPE_INHERIT;  
      return;  
    }  
    
    var parts = oneItem.split(":");
    var cnt = parts.length;
    if (cnt > 1) {
      var itemType = AclItemC.TYPE_GROUP;
      var access = parts[0];
      var mask = 0;
      if (access.indexOf("R") >= 0) {
        mask = mask | 1;
      }
      if (access.indexOf("W") >= 0) {
        mask = mask | 2;
      }
      if (access.indexOf("D") >= 0) {
        mask = mask | 4;
      }
      if (access.indexOf("E") >= 0) {
        mask = mask | 8;
      }
      if (access.indexOf("L") >= 0) {
        mask = mask | 16;
      }
      if (access.indexOf("U") >= 0) {
        itemType = AclItemC.TYPE_USER;
      }
      aclItem.setAccess(mask);
      aclItem.setName(parts[1]);
      aclItem.setType(itemType);

      if (cnt > 2) {
        var andGroups = new Array(cnt - 2);
        var i;
        for (i = 2; i < cnt; i++) {
          andGroups[i - 2] = new IdName();
          andGroups[i - 2].setName(parts[i]);
        }
        aclItem.setAndGroups(andGroups);
      }
    }
  },


  processAcl: function (Sord) {
    if (ACL == "PARENT") {
      var aclItems = new Array(1);
      var parentAcl = new AclItem(0, 0, "", AclItemC.TYPE_INHERIT);
      aclItems[0] = parentAcl;
      Sord.setAclItems(aclItems);
    } else if (ACL != "") {
      var items = ACL.split("¶");
      var cnt = items.length;
      var aclItems = new Array(cnt);
      var i;

      for (i = 0; i < cnt; i++) {
        aclItems[i] = new AclItem();
      }

      Sord.setAclItems(aclItems);
    }

    for (i = 0; i < cnt; i++) {
      elo.fillupAclItem(aclItems[i], items[i]);
    }

  },

  getACLString: function (Sord) {
    var sb = new StringBuilder();
    var i;
    var cnt = Sord.aclItems.length;

    for (i = 0; i < cnt; i++) {
      if (i != 0) {
        sb.append("¶");
      }

      var itemType = Sord.aclItems[i].getType();
      if (itemType == AclItemC.TYPE_USER) {
        sb.append("U");
      }

      var mask = Sord.aclItems[i].getAccess();
      if (mask & 1) {
        sb.append("R");
      };
      if (mask & 2) {
        sb.append("W");
      };
      if (mask & 4) {
        sb.append("D");
      };
      if (mask & 8) {
        sb.append("E");
      };
      if (mask & 16) {
        sb.append("L");
      };
      sb.append(":");
      sb.append(Sord.aclItems[i].getName());

      var andGroups = Sord.aclItems[i].getAndGroups();
      if (andGroups) {
        var k;
        for (k = 0; k < andGroups.length; k++) {
          sb.append(":");
          sb.append(andGroups[k].getName());
        }
      }
    }

    return sb.toString();
  },

  processResultSet: function () {
    var i;
    for (i = 0; i < Sords.length; i++) {
      if (ruleset.getStop && ruleset.getStop()) {
        log.debug("Abort processResultSet, interrupted");
        return;
      }
      
      bt.processObject(Sords[i]);
    }

    if (!ruleset.getInterval().isManuallyTriggered()) {
      ruleset.setStatusMessage("Wait.");
    }
  },

  changeMask: function (Sord, newMaskId) {
    log.debug("Switch to new MaskId: " + newMaskId);
    var editInfo = ixConnect.ix().changeSordMask(Sord, newMaskId, EditInfoC.mbSord);
    Sord.setMask(editInfo.getSord().getMask());
    Sord.setMaskName(editInfo.getSord().getMaskName());
    Sord.setObjKeys(editInfo.getSord().getObjKeys());
  },

  pad: function (val, len) {
    val = String(val);
    while (val.length < len) val = "0" + val;
    return val;
  },

  toDayAsIso: function() {
    var dt = new Date();
    var mon = dt.getMonth() + 1;
    var day = dt.getDate();
    var txt = "" + dt.getFullYear() + ((mon < 10) ? ("0" + mon) : mon) + ((day < 10) ? ("0" + day) : day);

    return txt;
  },

  convertDateToUTC: function (date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  },

  isoDate: function (date) {
    return elo.pad(date.getFullYear(), 4) + elo.pad(date.getMonth() + 1, 2) + elo.pad(date.getDate(), 2);
  },

  timeStamp: function(date) {
    return elo.pad(date.getFullYear(), 4) + "." +
           elo.pad(date.getMonth() + 1, 2) + "." +
           elo.pad(date.getDate(), 2) + "." +
           elo.pad(date.getHours(), 2) + "." +
           elo.pad(date.getMinutes(), 2) + "." +
           elo.pad(date.getSeconds(), 2);
  },

  decodeDate: function (text) {
    if (text == "") {
      return text;
    }
    if (text.charAt(0) == '+') {
      text = text.substring(1);
      var now = new Date();

      var dateOffset = (24 * 60 * 60 * 1000) * text;
      now.setTime(now.getTime() + dateOffset);

      return elo.isoDate(now);
    } else if (text.charAt(0) == '-') {
      text = text.substring(1);
      var now = new Date();

      var dateOffset = 0 - ((24 * 60 * 60 * 1000) * text);
      now.setTime(now.getTime() + dateOffset);

      return elo.isoDate(now);
    } else {
      return text;
    }
  },

  setAnswer: function (text) {
    ruleset.setStatusMessage(text);
  },

  setDownloadFile: function (fileName, contentType) {
    ruleset.setDownloadFile(fileName, contentType);
  },

  logStackTrace: function (exception) {
    var e2 = exception.rhinoException;
    if (e2) {
      log.debug(e2.scriptStackTrace);

      var sw = new StringWriter();
      var pw = new PrintWriter(sw, true);
      e2.printStackTrace(pw);
      pw.flush();
      sw.flush();

      log.debug(sw.toString());
    }
  },

 dynamicKeywordsObject: function(dynResult){
   var items = {};
   if(typeof dynResult == "undefinied") {
     return items;	
   }

   var groupNames = dynResult.keyNames;
   var dynResultTable = dynResult.table;

   for(var i=0; i<dynResultTable.size(); i++){
      var currRow = dynResultTable.get(i);       
      var obj = new Object();
      for (var j=0; j<currRow.size(); j++){
        if (groupNames && groupNames.get(j)){
	   obj[groupNames.get(j)] = currRow.get(j);
	}
      } 
      items[i] = obj;
   }

   return items;
 }

}
// end of namespace elo



// Initializes a new instance of the StringBuilder class
// and appends the given value if supplied

function StringBuilder(value) {
  this.strings = new Array("");
  this.append(value);
}

// Appends the given value to the end of this instance.
StringBuilder.prototype.append = function (value) {
  if (value) {
    this.strings.push(value);
  }
}

// Clears the string buffer
StringBuilder.prototype.clear = function () {
  this.strings.length = 1;
}

// Converts this instance to a String.
StringBuilder.prototype.toString = function () {
  return this.strings.join("");
}