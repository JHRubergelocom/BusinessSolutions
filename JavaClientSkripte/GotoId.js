function getScriptButton1Name() {
  return "GotoId";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  gotoId();
}

function gotoId() {
  var lastId = archive.getUserOption("EloJ.S.Script.ELODemo.LastId", "");
  var id = workspace.showSimpleInputBox("ELO", "Geben Sie bitte die gewünschte ELO Objekt Id ein.", lastId);
  if (id) {
    workspace.gotoId(parseInt(id));
    archive.setUserOption("EloJ.S.Script.ELODemo.LastId", id);
  }
}