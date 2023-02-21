importPackage(Packages.de.elo.client);
importPackage(Packages.com.jacob.com);
importPackage(Packages.com.jacob.activeX);
importPackage(Packages.com.ms.activeX);
importPackage(Packages.com.ms.com);

function getScriptButton1Name() {
  return "Hello";
}

function getScriptButtonPositions() {
  return "1,home,view";
}


function eloScriptButton1Start() {
  var message = "Hier bitte den neuen Kundennamen eingeben"
  var value = workspace.showSimpleInputBox("ELO", message, "");

  if (value) {
    var root = archive.getElement(1);

    var basePath = "¶Kunden¶" + value + "¶";
    root.addPath(basePath + "Bestellungen", 1);
    root.addPath(basePath + "Korrespondenz", 1);
    root.addPath(basePath + "Rechnungen", 1);

    workspace.activeView.refreshArchive();
    workspace.setFeedbackMessage("Kundenodner angelegt");
  }
}
