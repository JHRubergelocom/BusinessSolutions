function eloIndexDialogSetDocMask(){
  createDialogButton();
}

function createDialogButton() {
  if (indexDialog.docMaskName == "Marketing") {
    indexDialog.addButton(1, 20, 8, 7, "Ändern", "miniDialog");
  }
}

var dialog;
var label;
var time;

function miniDialog() {
  dialog = workspace.createGridDialog("Aufwand eingeben", 7, 6);
  label = dialog.addLabel(3, 1, 5, "Einfache Stunden und Minuten Auswahl");
  label.fontSize = 18;

  time = dialog.addTextField(1, 1, 1);

  var panel = dialog.gridPanel;
  // Stundenauswahl erzeugen
  for (var row = 0; row < 3; row++) {
    for (var col = 0; col < 3; col++) {
      panel.addToggleButton( col + 1, row + 3, 1, row * 3 + col, "changeTime", "hours" );
    }
  }

  // Minutenauswahl erzeugen
  for (row = 0; row < 3; row++) {
    for (col = 0; col < 2; col++) {
      panel.addToggleButton( col + 5, row + 3, 1, (row * 2 + col) * 10, "changeTime", "minutes" );
    }
  }
  var ok = dialog.show();

  if (ok) {
    indexDialog.setObjKeyValue(4, time.text);
  }
}

function changeTime() {
  var h = "0";
  var m = "00";
  
  var panel = dialog.gridPanel;
  var selh = panel.getSelectedButton( "hours" );
  if (selh) {
    h = selh.text;
  }
  
  var selm = panel.getSelectedButton( "minutes" );
  if (selm) {
    m = selm.text;
    if (m == "0") {
      m = "00";
    }
  }
  
  time.setText( h + ":" + m );
}

