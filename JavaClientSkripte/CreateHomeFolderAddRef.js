importPackage(Packages.de.elo.ix.client);

function getScriptButton1Name() {
  return "Merken";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  var view = workspace.activeView;
  var item = view.firstSelected;
  if (item) {
    merken(item);
  }
}

function merken(item) {
  var msg = "Neuen Home Eintrag hinzugenommen.";
  var path = "¶Mitarbeiter¶" + workspace.userName;
  var home;

  try {
    home = archive.getElementByArcpath(path);
  } catch(e) {
    var root = archive.getElement(1);
    var homeId = root.addPath(path, "1");
    home = archive.getElement(homeId);

    var sord = home.loadSord();
    var userId = workspace.userId;
    var acl = new AclItem(31, userId, "", 1);
    var aclItems = new Array(1);
    aclItems[0] = acl;
    sord.aclItems = aclItems;
    home.sord = sord;
    msg = "Neuen Home Ordner angelegt.";
  }

  home.addReference(item);

  workspace.setFeedbackMessage(msg);
}