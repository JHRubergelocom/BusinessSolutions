importPackage(Packages.de.elo.client);
importPackage(Packages.java.io);

function getScriptButton1Name() {
  return "AddVersion";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  var actDocument = workspace.activeView.firstSelected;
  var docFile = new File("c:\\temp\\test.docx");
  actDocument.addVersion(docFile, "2.0", "Automatisch generiert", false, true);
  workspace.setFeedbackMessage("Neue Version erstellt");
}
