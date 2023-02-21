function getScriptButton1Name() {
  return "SysInfo";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  showSysInfo();
}

function showSysInfo() {
  var masks = getMasks();
  var numRows = 11 + masks.length;

  var dialog = workspace.createGridDialog("Systeminformation", 2, numRows);
  var panel = dialog.gridPanel;
  panel.setBackground(255, 255, 240);
  
  var label = dialog.addLabel(1, 1, 2, "Systeminformation");
  label.bold = true;
  label.fontSize = 18;

  var line = 3;
  dialog.addLabel(1, line, 1, "Anmeldename");
  dialog.addLabel(2, line++, 1, workspace.userName);
  line++;
  
  dialog.addLabel(1, line, 1, "Archivname");
  dialog.addLabel(2, line++, 1, archive.archiveName);
  var arcElem = archive.getElement(1);
  dialog.addLabel(2, line++, 1, arcElem.name);
  line++;

  dialog.addLabel(1, line, 1, "Eingestellte Sprache");
  dialog.addLabel(2, line++, 1, workspace.language);
  archive.setUserOption("EloJ.S.Script.ELO.LastId", "784");
  var lastId = archive.getUserOption("EloJ.S.Script.ELO.LastId", "");
  dialog.addLabel(1, line, 1, "Letzte GotoId Position");
  dialog.addLabel(2, line++, 1, lastId);
  line++;

  dialog.addLabel(1, line, 1, "Verschlagwortungsmasken");
  for (var i = 0; i < masks.length; i++) {
    dialog.addLabel(2, line++, 1, masks[i]);
  }
  dialog.show();
}

function getMasks() {
  var masksList = archive.getDocMasks(true, true, true);
  var masks = new Array();

  var iter = masksList.iterator();
  while (iter.hasNext()) {
    var item = iter.next();
    masks.push(item.name);
  }

  masks.sort();
  return masks;
}