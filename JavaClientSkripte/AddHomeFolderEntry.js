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
  var path = "¶Mitarbeiter¶" + workspace.userName;
  var home = archive.getElementByArcpath(path);

  home.addReference(item);

  workspace.setFeedbackMessage("Neuen Home Eintrag hinzugenommen.");
}