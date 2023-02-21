function eloIndexDialogSetDocMask(){
  replaceRechnungskontrolle();
}

function eloIndexDialogOkStart() {
  storeRechnungskontrolle();
}

var rechnungskontrolle;

function replaceRechnungskontrolle() {
  if (indexDialog.docMaskName == "Rechnung") {
    var key = indexDialog.getObjKey(5);
    key.visible = false;

    var actValue = indexDialog.getObjKeyValue(5);
    var state = actValue == "Ja";
    rechnungskontrolle = indexDialog.addCheckBox(1, 14, 9, 33, "Rechungsprüfung erfolgreich abgeschlossen", state);
    rechnungskontrolle.setColor(255, 80, 80);
    rechnungskontrolle.setBold(true);
  }
}

function storeRechnungskontrolle() {
  var text = "Nein";
  if (rechnungskontrolle.isChecked()) {
    text = "Ja";
  }

  indexDialog.setObjKeyValue(5, text);
}
