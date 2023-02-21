
//@include lib_Class.js
//@include lib_sol.common.FileUtils.js
//@include lib_RhinoManager.js

function getScriptButton403Name() {
  return "License check test - RhinoManager";
}

function getScriptButtonPositions() {
  return "403,Development Internal,Tools";
}

function eloScriptButton403Start() {
  var result, className, filePath, message;

  message = "ClassName eingeben";

  className = String(workspace.showSimpleInputBox("License check test - RhinoManager", message, "sol.learning.Test"));

  filePath = "c:/Temp/License.txt";

  result = RhinoManager.registerClass(className);

  sol.common.FileUtils.writeStringToFile(filePath, result);

  java.awt.Desktop.desktop.open(new java.io.File(filePath));
}
