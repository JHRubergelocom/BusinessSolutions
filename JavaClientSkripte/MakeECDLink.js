function getScriptButton1Name() {
  return "Lesezeichen";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  var view = workspace.activeView;
  var item = view.firstSelected;
  if (item) {
    createEcdLink(item);
  } else {
    workspace.setFeedbackMessage("Bitte wählen Sie einen Eintrag aus.");
  }
}

function createEcdLink(item) {
  var arcName = archive.archiveName;
  var objId = item.id;
  var ecdName = buildName(item);
  var tempName = getDesktopDir() + "\\" + ecdName + ".ecd";
  var msg = "EP\r\nA" + arcName + "\r\nI" + objId + "\r\n";
  var file = new Packages.java.io.File(tempName);
  Packages.org.apache.commons.io.FileUtils.writeStringToFile(file, msg);
  workspace.setFeedbackMessage("Lesezeichen angelegt");
}

function buildName(item) {
  var name = String(item.name);
  var cleanName = name.replace(/\<|\>|\:|\\|\/|\*|\?|\||\~/g, "_");
  return cleanName;
}

function getDesktopDir() {
  var home = Packages.java.lang.System.getProperty("user.home", "");
  return home + "\\Desktop";
}