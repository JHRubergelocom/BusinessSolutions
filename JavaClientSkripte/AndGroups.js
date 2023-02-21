importPackage(Packages.de.elo.ix.client);

function getScriptButton1Name() {
  return "Freigeben";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  var view = workspace.activeView;
  var item = view.firstSelected;
  if (item) {
    freigabe(item);
  }
}

function freigabe(item) {
  var sord = item.loadSord();
  var aclItems = sord.aclItems;
  var len = aclItems.length;

  var newAcls = new Array(len + 1);
  for (var i = 0; i < len; i++) {
    var acl = aclItems[i];
    if (acl.id == 30) {
      var msg = "Ein GF Dokument kann nicht freigegeben werden.";
      workspace.showInfoBox("Freigabe", msg)
      return;
    }

    newAcls[i + 1] = acl;
  }

  var newItem = new AclItem(1, 40, "", 0);
  var andGroups = new Array(2);
  andGroups[0] = new IdName("", 41, "");
  andGroups[1] = new IdName("", 15, "");
  newItem.andGroups = andGroups;
  newAcls[0] = newItem;

  sord.aclItems = newAcls;
  item.sord = sord;
  workspace.setFeedbackMessage("Berechtiung erweitert.");
}