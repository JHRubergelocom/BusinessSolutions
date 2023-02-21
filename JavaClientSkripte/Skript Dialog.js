function getScriptButton1Name() {
  return "Hello";
}

function eloScriptButton1Start(){
  var myDialog = workspace.createGridDialog("ELO Script Dialog", 2, 3);
  myDialog.addLabel(1, 1, 1, "Wo wollen Sie die Bearbeitung protokollieren?");
  var logStandard = myDialog.addCheckBox(2, 1, 1, "Standardprotokoll", true);
  var logEvent = myDialog.addCheckBox(2, 2, 1, "Ereignisübersicht", false);
  var result = myDialog.show();

  if (result) {
    var standardChecked = logStandard.checked;
    var eventChecked = logEvent.checked;
    log.info("Auswahl: " + standardChecked + " : " + eventChecked);
  }
}

function getScriptButtonPositions() {
  return "1,home,view";
}
