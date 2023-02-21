function eloFlowConfirmDialogOkStart() {
  var flowDialog = dialogs.flowConfirmDialog;
  var successors = flowDialog.selectedSuccessors;

  var message;
  if (successors) {
    message = "FlowConfirm Ok Clicked : " + successors.join(", ");
  } else {
    message = "Keine Nachfolger ausgew�hlt";
  }
  workspace.showInfoBox("ELO",  message);
}

