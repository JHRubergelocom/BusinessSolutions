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
    newAcls[i + 1] = aclItems[i];
  }

  var newItem = new AclItem(1, 9999, "", 0);
  newAcls[0] = newItem;

  sord.aclItems = newAcls;
  item.sord = sord;
}