importPackage(Packages.java.lang);
importPackage(Packages.de.elo.client.ioutil);
importPackage(Packages.java.io);

function getScriptButton1Name() {
  return "Execute";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  doExecute();
}

function doExecute() {
  var command = "C:\\Temp\\dirlist.bat";
  // dirlist.bat enthält folgenden Inhalt:
  // dir c:\temp >c:\temp\dirlist.txt
  //
  log.debug("Execute command: " + command);
  var p = Runtime.getRuntime().exec(command);
  p.waitFor();

  var file = new File("c:\\temp\\dirlist.txt");
  var result = String(FileUtil.readTextFile(file));
  result = result.replace(/\</g, "{");
  result = result.replace(/\>/g, "}");
  result = result.replace(/\n/g, "<br>");
  workspace.showInfoBox("TEMP", result);
}
