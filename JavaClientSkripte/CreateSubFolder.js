importPackage(Packages.de.elo.client);
importPackage(Packages.com.jacob.com);
importPackage(Packages.com.jacob.activeX);
importPackage(Packages.com.ms.activeX);
importPackage(Packages.com.ms.com);

function getScriptButton1Name() {
  return "Unterverteilung";
}

function getScriptButtonPositions() {
  return "1,home,view";
}


function eloScriptButton1Start() {
  var folder = workspace.activeView.firstSelected;
  var items = folder.children;

  var count = 0;
  while (items.hasMoreElements()) {
    var item = items.nextElement();
    var folderName = item.name.substring(0, 1);

    var destId = folder.addPath("¶" + folderName, 1);
    var destElem = archive.getElement(destId);
    item.moveToFolder(destElem, false);
    count++;
  }

  workspace.activeView.refreshArchive();
  workspace.setFeedbackMessage("Vorgang abgeschlossen, " + count + " Einträge verschoben.") ;
}
