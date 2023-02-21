function getScriptButton1Name() {
  return "Hello";
}

function eloScriptButton1Start(){
  var folderId = workspace.showTreeSelectDialog("Zielordner auswählen", "Bitte wählen Sie den gewünschten Projektordner aus.", 1, false, true, true);
  var item = archive.getElement(folderId);
  workspace.setFeedbackMessage("Neuer Projektordner: " + item.name);
}

function getScriptButtonPositions() {
  return "1,home,view";
}
