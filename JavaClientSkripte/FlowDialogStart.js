function eloFlowConfirmDialogStart() {
  var taskItem = workspace.activeView.firstSelected;
  if (taskItem) {
    var item = taskItem.archiveElement;
    if (item.docMaskName == "Bestellung") {
      var kundeOk = item.getObjKeyValue("Kunde") != "";
      var datumOk = item.getObjKeyValue("BEDatum") != "";
      if (!kundeOk || !datumOk) {
        workspace.showInfoBox("ELO", "Verschlagwortung unvollständig.");
        return -1;
      }
    }
  }

  return 1;
}
