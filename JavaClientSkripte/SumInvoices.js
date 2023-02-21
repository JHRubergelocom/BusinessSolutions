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
  var view = workspace.activeView;
  var items = view.allSelected;

  var summe = 0.0;
  while (items.hasMoreElements()) {
    var item = items.nextElement();

    var betragString = item.getObjKeyValue(1);
    var betrag = parseFloat(betragString);

    if (!isNaN(betrag)) {
      summe = summe + betrag;
    }
  }

  workspace.showInfoBox("ELO", "Rechnungssumme: " + summe + " EURO");
}
