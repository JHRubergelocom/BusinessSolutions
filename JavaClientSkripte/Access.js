function getScriptButton1Name() {
  return "Access";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  checkUtils();
}

function addEntry(dialog, name, value, line) {
  dialog.addLabel(1, line, 1, name);
  dialog.addLabel(2, line, 1, value);
}

function checkUtils() {
  var dialog = workspace.createGridDialog("Anwenderrechte", 2, 25);
  var panel = dialog.gridPanel;
  panel.setBackground(255, 255, 240);

  var label = dialog.addLabel(1, 1, 2, "Anwenderrechte");
  label.bold = true;
  label.fontSize = 18;

  var line = 3;
  var access = workspace.userRights;

  addEntry(dialog, "Ordner anlegen", access.hasAddStructureRight(), line++);
  addEntry(dialog, "Hauptadministrator", access.hasAdminRight(), line++);
  addEntry(dialog, "Verfallsdatum ändern", access.hasChangeDelDateRight(), line++);
  addEntry(dialog, "Verschlagwortungsmaske ändern", access.hasChangeMaskRight(), line++);
  addEntry(dialog, "Passwort ändern", access.hasChangePasswordRight(), line++);
  addEntry(dialog, "Berechtigungseinstellungen ändern", access.hasChangePermissionsRight(), line++);
  addEntry(dialog, "Revisionslevel ändern", access.hasChangeRevLevelRight(), line++);
  addEntry(dialog, "Dokumente löschen", access.hasDeleteDocumentRight(), line++);
  addEntry(dialog, "Dokumentenversionen löschen", access.hasDeleteDocVersionRight(), line++);
  addEntry(dialog, "Ordner löschen", access.hasDeleteStructureRight(), line++);
  addEntry(dialog, "Archivstruktur bearbeiten", access.hasEditArchiveRight(), line++);
  addEntry(dialog, "Dokumente bearbeiten", access.hasEditDocumentRight(), line++);
  addEntry(dialog, "Stichwortlisten bearbeiten", access.hasEditKeywordListsRight(), line++);
  addEntry(dialog, "Replikationskreise bearbeiten", access.hasEditReplSetsRight(), line++);
  addEntry(dialog, "Scannereinstellungen bearbeiten", access.hasEditScanRight(), line++);
  addEntry(dialog, "Skripte bearbeiten", access.hasEditScriptRight(), line++);
  addEntry(dialog, "Workflows bearbeiten", access.hasEditWorkflowRight(), line++);
  addEntry(dialog, "Daten exportieren", access.hasExportRight(), line++);
  addEntry(dialog, "Daten importieren", access.hasImportRight(), line++);
  addEntry(dialog, "Dokumentendateien anzeigen", access.hasShowDocumentRight(), line++);
  addEntry(dialog, "Workflows starten", access.hasStartWorkflowRight(), line++);

  dialog.show();
}

