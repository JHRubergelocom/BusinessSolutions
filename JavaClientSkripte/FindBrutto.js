importPackage(Packages.de.elo.client);
importPackage(Packages.com.jacob.com);
importPackage(Packages.com.jacob.activeX);
importPackage(Packages.com.ms.activeX);
importPackage(Packages.com.ms.com);

function getScriptButton1Name() {
  return "Brutto suchen";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function inversNumericSort(a, b) {
  return b - a;
}

function fmtBetrag(betragNumber) {
  var betrag = String(betragNumber);
  return betrag.substring(0, betrag.length - 2) + "," + betrag.substring(betrag.length - 2) + " EURO";
}

function eloIndexDialogSetDocMask() {
  var id = indexDialog.id;
  var item = archive.getElement(id);

  if (indexDialog.getObjKeyValue(1) == "*") {
    var result = getValuesFromItem(item);
    if (result) {
      var brutto = fmtBetrag(result.brutto);
      indexDialog.setObjKeyValue(1, brutto);
    }
  }
}

function eloScriptButton1Start() {
  var item = workspace.activeView.firstSelected;
  var result = getValuesFromItem(item);
  var msg = formatMessage(result, values[0]);
  workspace.showInfoBox("Betrag", msg);
}

function getValuesFromItem(item) {
  var text = getFulltextString(item);
  var values = collectValues(text);
  values.sort(inversNumericSort);
  var result = findBruttoNettoMwstTripel(values);

  return result;
}

function getFulltextString(item) {
  var file = item.getFulltextFile(null);
  var text = Packages.de.elo.client.ioutil.FileUtil.readTextFileUTF(file);
  return text;
}

function collectValues(text) {
  var values = new Array();
  var regex = new RegExp("(\\-)?(([0-9]{1,3}([,][0-9][0-9][0-9])*[.])|([0-9]{1,3}([.][0-9][0-9][0-9])*[,])|([0-9]+[,.]))[0-9][0-9]([^0-9.,]|$)", "gi");
  var allMatches = String(text).match(regex);
  for (var i = 0; i < allMatches.length; i++) {
    var match = allMatches[i];
    match = match.substring(0, match.length - 1);
    var nextVal = match.replace(/[,.]/gi, "");
    values.push(parseInt(nextVal, 10));
  }
  return values;
}

function findBruttoNettoMwstTripel(values) {
  var len = values.length;

  for (var brutto = 0; brutto < (len - 2); brutto++) {
    var bruttoBetrag = values[brutto];
    var nettoBetrag = Math.round(bruttoBetrag / 1.19);
    var mwstBetrag = bruttoBetrag - nettoBetrag;

    for (var netto = brutto + 1; netto < (len - 1); netto++) {
      if (values[netto] == nettoBetrag) {

        for (var mwst = netto + 1; mwst < len; mwst++) {
          if (values[mwst] == mwstBetrag) {
            var result = new Object();
            result.brutto = bruttoBetrag;
            result.netto = nettoBetrag;
            result.mwst = mwstBetrag;
            return result;
          }

          if (values[mwst] < mwstBetrag) {
            break;
          }
        }
      } else if (values[netto] < nettoBetrag) {
        break;
      }
    }
  }

  return undefined;
}
  
function formatMessage(bruttoNettoMwst, biggestValue) {
  var msg;
  if (bruttoNettoMwst) {
    msg = "<html><big>Brutto: " + fmtBetrag(bruttoNettoMwst.brutto) +
          "<br>Netto: " + fmtBetrag(bruttoNettoMwst.netto) +
          "<br>MWSt: " + fmtBetrag(bruttoNettoMwst.mwst) + "</big></html>";
  } else {
    msg = "Größter Betrag: " + fmtBetrag(biggestValue);
  }
  return msg;
}

