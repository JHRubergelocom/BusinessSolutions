importPackage(Packages.de.elo.ix.client);

function getScriptButton1Name() {
  return "Search";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  doSearch();
}

function doSearch() {
  var findInfo = new FindInfo();
  var findByIndex = new FindByIndex();

  findByIndex.maskId = 8;
  findByIndex.setIDateIso("20110101...20111231");
  findInfo.findByIndex = findByIndex;

  var count = 0;
  var value = 0.0;
  var idx = 0;
  var findResult = ixc.findFirstSords(findInfo, 200, SordC.mbAllIndex);
  for (;;) {
    var sords = findResult.sords;
    for (var i = 0; i < sords.length; i++) {
      log.debug("Invoice: " + sords[i].name);
      count++
      
      var key = sords[i].objKeys[1];
      if (key && key.data && (key.data.length > 0)) {}
        var betrag = parseFloat(key.data[0]);
        if (!isNaN(betrag)) {
          value += betrag;
        }
    }

    if (!findResult.moreResults) {
      break;
    }

    idx += sords.length;
    findResult = ixc.findNextSords(findResult.searchId, idx, 200, SordC.mbAllIndex);
  }

  ixc.findClose(findResult.searchId);

  workspace.showInfoBox("ELO", "Anzahl Rechnungen: " + count + ", Wert: " + value);

 }