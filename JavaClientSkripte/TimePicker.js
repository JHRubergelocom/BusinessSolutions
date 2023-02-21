function eloIndexDialogSetDocMask(){
  createDialogButton();
}

function createDialogButton() {
  if (indexDialog.docMaskName == "Marketing") {
    indexDialog.addButton(1, 19, 7, 7, "Ändern", "selectStart");
  }
}

function selectStart() {
  var oldTime = indexDialog.getObjKeyValue(4);
  var newTime = selectTime("Startzeitpunkt auswählen", oldTime);

  if (newTime != null) {
    indexDialog.setObjKeyValue(4, newTime);
  }
}

var enableEvents = false;
var dialog;
var label;
var time;

function selectTime(title, presetTime) {
  dialog = workspace.createGridDialog("Uhrzeit auswählen", 6, 6);
  label = dialog.addLabel(1, 1, 5, title);
  label.fontSize = 18;

  time = dialog.addTextField(6, 1, 1);
  time.setBold( true );
  time.addChangeEvent( "editTime" );

  var panel = dialog.panel;
  // Stundenauswahl erzeugen
  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 3; col++) {
      panel.addToggleButton( col + 1, row + 3, 1, row * 3 + col + 7, "changeTime", "hours" );
    }
  }

  // Minutenauswahl erzeugen
  var minutes = ["00", "15", "30", "45", "10", "20", "40", "50"];
  for (row = 0; row < 4; row++) {
    for (col = 0; col < 2; col++) {
      panel.addToggleButton( col + 5, row + 3, 1, minutes[row + col * 4], "changeTime", "minutes" );
    }
  }
  enableEvents = true;
  time.text = presetTime;
  var ok = dialog.show();
  enableEvents = false;

  if (ok) {
    return time.text;
  } else {
    return null;
  }
}

function changeTime() {
  if (enableEvents) {
    enableEvents = false;
    var panel = dialog.panel;
    var h = panel.getSelectedButton( "hours" );
    if (h == null) h = "0";
    var m = panel.getSelectedButton( "minutes" );
    if (m == null) m = "00";
    time.setText( h + ":" + m );
    enableEvents = true;
  }
}

function editTime() {
  if (enableEvents) {
    enableEvents = false;

    var panel = dialog.panel;
    var text = time.text;
    var items = text.split(":");
    if (items.length == 2) {
      var hours = parseInt(items[0]);
      panel.setSelectedButton( "hours", hours );

      var minutes = parseInt(items[1]);
      panel.setSelectedButton( "minutes", (minutes == 0) ? "00" : minutes );
    }
    enableEvents = true;
  }
}

