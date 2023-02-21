importPackage(Packages.de.elo.client);
importPackage(Packages.java.io);

function getScriptButton1Name() {
  return "AddDocument";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  var actFolder = workspace.activeView.firstSelected;
  var docFileName = "c:\\temp\\test.docx";

  var newDoc = actFolder.prepareDocument(0);
  newDoc.name = "Word Testdokument";
  actFolder.addDocument(newDoc, docFileName);
  workspace.setFeedbackMessage("Neues Dokument erstellt");
}

