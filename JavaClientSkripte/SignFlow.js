var inputField;

function eloFlowConfirmDialogStart() {
  var dialog = dialogs.flowConfirmDialog;
  var node = dialog.currentNode;
  if (node.name != "Unterschrift") {
    return;
  }

  var panel = dialog.addGridPanel(2,3);
  var ltxt = "Vor dem Weiterleiten bitte unterschreiben.";
  var label = panel.addLabel(1, 1, 2, ltxt);
  label.fontSize = 18;
  label.bold = true;
  label.setColor(200, 30, 30);

  inputField = panel.addTextField(1,2, 1);

  var desc =
    "<html>Ohne Unterschrift ist keine Weiterleitung des Workflows möglich.<br>" +
    "Mit der Unterschrift bestätigen Sie, dass Sie alle Daten geprüft haben.<br>" +
    "Verwenden Sie bitte Ihr firmeninternes Namenskürzel zur Signatur.</html>"
  var remark = panel.addLabel(1,3,2, desc);
  remark.fontSize = 10;
}

function eloFlowConfirmDialogOkStart() {
  if (inputField) {
    var text = inputField.text;
    if (text == "") {
      var error = "Ohne Unterschrift kann die Freigabe nicht erfolgen.";
      workspace.showInfoBox("Workflow weiterleiten", error);
      return -1;
    }
  }

  return 1;
}
