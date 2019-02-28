function getScriptButton1Name() {
  return "Hello";
}

function eloScriptButton1Start(){
  var view = workspace.activeView;
  var item = view.firstSelected;
  var user = workspace.userName;
  workspace.showInfoBox("ELO", "Hello " + user + " bei " + item.name);

  if (log.isDebugEnabled()) {
    log.debug("Ausgewählter Eintrag: " + item.name);
  }

  log.info("Aktiver Anwender: " + user);
}

function getScriptButtonPositions() {
  return "1,home,view";
}
