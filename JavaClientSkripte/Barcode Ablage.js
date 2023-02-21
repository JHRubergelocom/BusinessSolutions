importPackage(Packages.de.elo.client);
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.java.util);
importPackage(Packages.java.io);

const barcodeDesc = "R(0,0,1000,1000)L(1,50)T(16843007)";
const searchMask = 8;
const searchGroup = "RECHOK";
var reportData;

function getScriptButton1Name() {
  return "Versionsupdate";
}

function getScriptButtonPositions() {
  return "1,home,new";
}


function eloScriptButton1Start(){
  startReport();
  var items = intray.allSelected;

  while (items.hasMoreElements()) {
    var item = items.nextElement();
    try {
      processItem(item);
    } catch(e) {
      report(e);
    }
  }
  intray.refresh();
  showReport();
}

function processItem(item) {
  var barcodes = item.getBarcodes(barcodeDesc);
  var iterator = barcodes.iterator();
  if (iterator.hasNext()) {
    var barc = iterator.next();
    var destination = findItem(searchMask, searchGroup, barc);
    if (destination) {
      // workspace.showInfoBox("BARC", "Item " + barc + " found: " + destination.id);
      var intrayFile = new File(item.filePath);
      destination.addVersion(intrayFile, "", "", false, false);
      intrayFile["delete"]();
      report("Neue Version angelegt für : " + barc + " - " + destination.name);
    }
  } else {
    throw "Es wurde kein Barcode gefunden : " + item.name;
  }
}

function findItem(maskId, groupName, value) {
  var found = null;

  var findInfo = new FindInfo();
  var findByIndex = new FindByIndex();

  findByIndex.maskId = maskId;
  var objKeys = new Array(1);
  var objKey = new ObjKey();
  objKey.name = groupName;
  objKey.data = [value];
  objKeys[0] = objKey
  findByIndex.objKeys = objKeys;

  findInfo.findByIndex = findByIndex;

  var findResult;

  try {
    findResult = ixc.findFirstSords(findInfo, 3, SordC.mbAllIndex);
    ixc.findClose(findResult.searchId);
  } catch (e) {
    throw "Es ist ein Fehler bei der Suche des Ablageziels aufgetreten : " + value;
    log.info(e);
  }

  var sords = findResult.sords;
  if (sords.length > 0) {
    if (sords.length > 1) {
      throw "Das Ablageziel ist nicht eindeutig : " + value;
    }

    var id = sords[0].id;
    found = archive.getElement(id);
    if (found.isStructure()) {
      throw "Das Ablageziel ist kein Dokument : " + value;
    }
  } else {
    throw "Das Ablageziel ist nicht vorhanden : " + value;
  }

  return found;
}

function report(message) {
  reportData.push(message);
}

function showReport() {
  var message = "<html>" + reportData.join("<br>") + "</html>";
  workspace.showInfoBox("Barcode Ablage", message);
}

function startReport() {
  reportData = new Array();
}
