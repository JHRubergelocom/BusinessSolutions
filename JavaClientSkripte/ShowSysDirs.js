
function getScriptButton1Name() {
  return "SysDirs";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  showSysDirs();
}

function addDir(dialog, dirName, dirPath, line) {
  dialog.addLabel(1, line, 1, dirName);
  dialog.addLabel(2, line, 1, dirPath);
}

function showSysDirs() {
  var dialog = workspace.createGridDialog("Systemverzeichnisse", 2, 11);
  var panel = dialog.gridPanel;
  panel.setBackground(255, 255, 240);

  var label = dialog.addLabel(1, 1, 2, "Systemverzeichnisse");
  label.bold = true;
  label.fontSize = 18;

  var line = 3;
  var dirs = workspace.directories;
  addDir(dialog, "Base Dir", dirs.baseDir, line++);
  addDir(dialog, "In Bearbeitung Dir", dirs.checkOutDir, line++);
  addDir(dialog, "Dokumenten Cache Dir", dirs.docCacheDir, line++);
  addDir(dialog, "Postbox Dir", dirs.inTrayDir, line++);
  addDir(dialog, "Stempel Dir", dirs.stampsDir, line++);
  addDir(dialog, "Temp Dateien", dirs.tempDir, line++);
  addDir(dialog, "Thumbnails Dir", dirs.thumbsDir, line++);
  addDir(dialog, "Papierkorb", dirs.trashDir, line++);

  dialog.show();
}
