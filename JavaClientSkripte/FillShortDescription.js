
function eloIndexDialogNameEnter() {
  if (indexDialog.docMaskName == "Bestellung") {
    indexDialog.name = "Bitte keine Eingaben vornehmen, das Feld wird automatisch gefüllt";
  }
}

function eloIndexDialogNameExit() {
  setCalculatedName();
}

function eloIndexDialogObjKeyExit() {
  setCalculatedName();
}

function setCalculatedName() {
  if (indexDialog.docMaskName == "Bestellung") {
    var name = indexDialog.getObjKeyValue(0);
    var kdnr = indexDialog.getObjKeyValue(2);
    indexDialog.name = kdnr + " : " + name;
  }
}