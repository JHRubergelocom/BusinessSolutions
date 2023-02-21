
function getScriptButton1Name() {
  return "Hello";
}

function getScriptButtonPositions() {
  return "1,home,view";
}


function eloScriptButton1Start(){
  var archives = archiveViews.getArchiveViews();

  var allArchives = "";
  var iterator = archives.iterator();
  while (iterator.hasNext()) {
    var item = iterator.next();
    var name = item.name;
    allArchives = allArchives + name + "<br>";
  }

  workspace.showInfoBox("ELO", allArchives);
}
