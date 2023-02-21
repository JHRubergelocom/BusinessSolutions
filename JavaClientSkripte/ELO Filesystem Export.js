importPackage(Packages.java.io);

function getScriptButton1Name() {
  return "Hello";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  var view = workspace.activeView;
  var item = view.firstSelected;

  doExport(item);
}


function doExport(item) {
  var actPath = "c:\\temp\\export";
  var actLevel = 1;
  processLevel(actLevel, actPath, item);
  
}

function processLevel(level, path, item) {
  if (level > 32) {
    return;
  }
  
  var fileName = buildName(item);
  if (item.isDocument()) {
    var file = item.file;
    var ext = utils.getFileExtension(file);
    var docPath = path + File.separator + fileName + "." + ext;
    var destination = new File(docPath);
    utils.copyFile(file, destination);
  } else {
    var newPath = path + File.separator + fileName;
    var baseDir = new File(newPath);
    baseDir.mkdir();

    var children = item.children;
    while (children.hasMoreElements()) {
      var child = children.nextElement();
      processLevel(level + 1, newPath, child);
    }
  }
}

function buildName(item) {
  var name = String(item.name);
  var cleanName = name.replace(/\<|\>|\:|\\|\/|\*|\?|\||\~/g, "_");
  return cleanName;
}
