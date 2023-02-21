function eloIndexDialogSetDocMask(){
  updateSwl();
}

function eloIndexDialogObjKey1Exit() {
  updateSwl();
}

function updateSwl() {
  if (indexDialog.docMaskName == "Dokumente Allgemein") {
    var kategorie = indexDialog.getObjKeyValue(1);
    var bereichKey = indexDialog.getObjKey(2);

    if (kategorie == "Sachbuch") {
      bereichKey.setKeywords("BERSA");
    } else if (kategorie == "Bildband") {
      bereichKey.setKeywords("BERBI");
    } else if (kategorie == "Belletristik") {
      bereichKey.setKeywords("BERBE");
    }
  }
}
