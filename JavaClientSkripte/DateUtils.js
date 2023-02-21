function getScriptButton1Name() {
  return "Utils";
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
  var dialog = workspace.createGridDialog("Datumsfunktionen", 2, 15);
  var panel = dialog.gridPanel;
  panel.setBackground(255, 255, 240);

  var label = dialog.addLabel(1, 1, 2, "Datumsfunktionen");
  label.bold = true;
  label.fontSize = 18;

  var line = 3;
  var date = utils.dateFromIso("20111231");
  addEntry(dialog, "Date from ISO: 20111231", date, line++);

  var dispDate = utils.displayDateFromIso("20111231");
  addEntry(dialog, "Display date from ISO: 20111231", dispDate, line++);

  var dispDateTime = utils.displayDateFromIsoWithTime("201112311539");
  addEntry(dialog, "Display date and time: 201112311539", dispDateTime, line++);

  var eloDate = utils.eloDateFromJavaDate(date);
  addEntry(dialog, "ELO Date: 31.12.2011", eloDate, line++);

  var now = utils.getNow(-60);
  addEntry(dialog, "Now minus 60 minutes", now, line++);

  addEntry(dialog, "Begin of Day", utils.getDateWithoutTime(now), line++);

  addEntry(dialog, "Today", utils.today, line++);
  addEntry(dialog, "Tomorrow", utils.tomorrow, line++);
  addEntry(dialog, "Yesterday", utils.yesterday, line++);

  addEntry(dialog, "One hour ago", utils.isoFromDate(now), line++);
  addEntry(dialog, "Valid ISO ? : 20111231143955", utils.isValidIsoDate("20111231143955"), line++);
  addEntry(dialog, "Valid ISO ? : 201112", utils.isValidIsoDate("201112"), line++);

  dialog.show();
}
