function eloIndexDialogSetDocMask(){
  addControls()
}


function addControls() {
  if (indexDialog.docMaskName == "Bestellung") {
    indexDialog.addLabel(1, 1, 9, 13, "Wichtigkeit");
    indexDialog.addButton(1, 14, 9, 12, "Prio A", "message");
    indexDialog.addButton(1, 27, 9, 12, "Prio B", "message");
    indexDialog.addButton(1, 40, 9, 12, "Prio C", "message");
    indexDialog.addButton(1, 53, 9, 12, "Prio D", "message");

    indexDialog.addLabel(1, 1, 10, 13, "Versendeinfo")
    indexDialog.addCheckBox(1, 14, 10, 30, "Eilige Sendung", false);
    indexDialog.addCheckBox(1, 14, 11, 30, "Zerbrechlich", false);
    indexDialog.addCheckBox(1, 14, 12, 30, "Wertvolle Fracht", false);

    var textField = indexDialog.addTextField(1, 27, 11, 20);
    textField.text = "Vorsicht Glas";

    indexDialog.addComboBox(1, 27, 12, 20, ["100 EUR", "1000 EUR", "10.000 EUR"], false);

    indexDialog.addLabel(1, 1, 13, 13, "Versandart");
    var list = indexDialog.addList(1, 14, 13, 33, 3);
    list.data = ["DHL, Selbstabholer", "UPS, Selbstabholer", "Hermes Versand, Lieferservice"];
  }
}

function message() {
  workspace.setFeedbackMessage("klick...");
}
