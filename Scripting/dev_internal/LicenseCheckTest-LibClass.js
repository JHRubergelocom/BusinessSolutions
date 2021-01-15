
//@include lib_Class.js

function getScriptButton404Name() {
  return "License check test - LibClass";
}

function getScriptButtonPositions() {
  return "404,Development Internal,Tools";
}

function eloScriptButton404Start() {
  var className;

  className = "sol.learning.Test";

  RhinoManager.registerClass(className);

  workspace.setFeedbackMessage("License for '" + className + "' is valid.");
}
