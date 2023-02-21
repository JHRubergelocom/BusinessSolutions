function getScriptButton1Name() {
  return "Start Flow";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  var view = workspace.activeView;
  var item = view.firstSelected;
  if (item && (item.docMaskName == "Bestellung")) {
    startWorkflow(item);
  } else {
    workspace.setFeedbackMessage("Bitte wählen Sie eine Bestellung aus.");
  }
}

function startWorkflow(item) {
  var objId = item.id;
  var name = item.name;
  tasks.startWorkflow(objId, "Bestellungsbearbeitung zu " + name, 19);
}