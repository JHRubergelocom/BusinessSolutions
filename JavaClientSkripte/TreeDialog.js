function getScriptButton1Name() {
  return "Hello";
}

function eloScriptButton1Start(){
  var folderId = workspace.showTreeSelectDialog("Zielordner ausw�hlen", "Bitte w�hlen Sie den gew�nschten Projektordner aus.", 1, false, true, true);
  var item = archive.getElement(folderId);
  workspace.setFeedbackMessage("Neuer Projektordner: " + item.name);
}

function getScriptButtonPositions() {
  return "1,home,view";
}
