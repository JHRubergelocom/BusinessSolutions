// ELO AddRights Library

var addr = new Addr();

function Addr() {
  this.templateRoot = "ARCPATH:¶Administration¶UserManager¶";
  this.taskCache = {};
}

/**
*/
Addr.prototype.process = function(node) {
  log.info(node.nodeName);
  if (node.nodeComment == "processUserRights") {
    this.getUserInfo(node);
    this.getMapInfo(node);
    this.processGroups();
    this.setUserInfo();
    log.info("weiterleiten");
    EM_WF_NEXT = "0";
  }
}

Addr.prototype.processGroups = function() {
  var addGroups = {};
  var subGroups = {};
  
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    var itemId = item.id;
    
    if (item.add) {
      if (this.userTasks.indexOf(itemId) < 0) {
        this.userTasks.push(itemId);
      }
    } else {
      var removePos = this.userTasks.indexOf(itemId);
      if (removePos >= 0) {
        var groups = this.getGroups(itemId);
        this.userTasks.splice(removePos, 1);
        this.insertGroups(subGroups, groups);
      }
    }
  }
  
  for (var i = 0; i < this.userTasks.length; i++) {
    var id = this.userTasks[i];
    var groups = this.getGroups(id);
    this.insertGroups(addGroups, groups);
  }

  this.addGroups = addGroups;
  this.subGroups = subGroups;  
}

Addr.prototype.insertGroups = function(dest, groups) {
  for (var i = 0; i < groups.length; i++) {
    var grp = groups[i];
    dest[grp] = grp;
  }
}

Addr.prototype.getUserInfo = function(node) {
  var objId = node.objId;
  this.userData = ixConnect.ix().checkoutSord(objId, EditInfoC.mbSord, LockC.NO).sord;
  var desc = String(this.userData.desc.trim());
  this.userTasks = (desc) ? desc.split(/,/g) : [];
  
  var name = this.userData.name;
  var parts = name.split("\\.");
  this.userInfo = ixConnect.ix().checkoutUsers( [parts[1]], CheckoutUsersC.BY_IDS_RAW, LockC.NO)[0];
}

Addr.prototype.setUserInfo = function() {
  var report = "Zugeteilte Aufgaben: <br>";
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    var prefix = (item.add) ? "<br>+ " : "<br>- ";
    var name = this.taskCache[item.id].name;
    report = report + prefix + name;
  }
  ix.addFeedComment(this.userData.guid, 0, report);
  
  this.userData.desc = this.userTasks.join(",");
  ixConnect.ix().checkinSord(this.userData, SordC.mbAll, LockC.NO);
  
  var oldGroups = this.userInfo.groupList;
  var newGroups = [];
  for (var i = 0; i < oldGroups.length; i++) {
    var grp = oldGroups[i];
    if (!this.subGroups[grp]) {
      newGroups.push(grp);
    }
  }
  
  for each (grp in this.addGroups) {
    newGroups.push(grp);
  }
  
  this.userInfo.groupList = newGroups;
  ixConnect.ix().checkinUsers( [this.userInfo], CheckinUsersC.WRITE, LockC.NO);
}

Addr.prototype.getGroups = function(taskId) {
  var taskInfo = ixConnect.ix().checkoutSord(taskId, EditInfoC.mbSord, LockC.NO).sord;
  this.taskCache[taskId] = taskInfo;
  
  var parts = taskInfo.desc.split("###");
  var groups = parts[1].split(",");
  for (var i = 0; i < groups.length; i++) {
    groups[i] = String(groups[i].trim());
  }
  
  return groups;
}

Addr.prototype.getMapInfo = function(node) {
  var entries = ixConnect.ix().checkoutMap( MapDomainC.DOMAIN_WORKFLOW_ACTIVE, node.flowId, null, LockC.NO).items;
  var info = {};
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    info[entry.key] = entry.value;
  }
  
  var result = [];
  for (var cnt = 1; cnt < 100; cnt++) {
    var addSub = info["URAS" + cnt];
    if (!addSub) {
      break;
    }
    addSub = String(addSub.trim());
    
    var id = info["URID" + cnt];
    if (!id) {
      break;
    }
    id = String(id.trim());
    
    var item = {add: addSub === "ADD", id: id};
    result.push(item);
  }
  
  this.items = result;
}