importPackage(Packages.de.elo.client);
importPackage(Packages.de.elo.ix.client);

function getScriptButton1Name() {
  return "Access";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  showAccess();
}

function showAccess() {
  var item = workspace.activeView.firstSelected;
  if (item) {
    var sord = item.loadSord();
    var access = sord.access;
    workspace.setFeedbackMessage(access);

    var dialog = workspace.createGridDialog("Objektrechte", 2, 9);
    var panel = dialog.gridPanel;
    panel.setBackground(255, 255, 240);

    var txt = "Objektrechte zu '" + item.name + "'";
    var label = dialog.addLabel(1, 1, 2, txt);
    label.bold = true;
    label.fontSize = 18;

    var line = 3;
    var canRead = (access & AccessC.LUR_READ) != 0;
    var canWrite = (access & AccessC.LUR_WRITE) != 0;
    var canDelete = (access & AccessC.LUR_DELETE) != 0;
    var canEdit = (access & AccessC.LUR_EDIT) != 0;
    var canList = (access & AccessC.LUR_LIST) != 0;

    addEntry(dialog, "Lesen", canRead, line++);
    addEntry(dialog, "Schreiben", canWrite, line++);
    addEntry(dialog, "Löschen", canDelete, line++);
    addEntry(dialog, "Datei ändern", canEdit, line++);
    addEntry(dialog, "Untereinträge ändern", canList, line++);

    dialog.show();
  }

}

function addEntry(dialog, name, value, line) {
  dialog.addLabel(1, line, 1, name);
  dialog.addLabel(2, line, 1, value);
}

