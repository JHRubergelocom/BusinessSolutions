function getScriptButton1Name() {
  return "Hello";
}

function eloScriptButton1Start(){
  var dirs = workspace.directories;

  log.info("Das Startverzeichnis liegt hier: " + dirs.baseDir);
  log.info("Das CheckOut Verzeichnis liegt hier: " + dirs.checkOutDir);
  log.info("Der Dokumenten Cache liegt hier: " + dirs.docCacheDir);
  log.info("Das Postboxverzeichnis liegt hier: " + dirs.inTrayDir);
  log.info("Das temporäre Verzeichnis liegt hier: " + dirs.tempDir);
  log.info("Das Thumbnail Verzeichnis liegt hier: " + dirs.thumbsDir);
  log.info("Das Papierkorbverzeichnis liegt hier: " + dirs.trashDir);
}

function getScriptButtonPositions() {
  return "1,home,view";
}
