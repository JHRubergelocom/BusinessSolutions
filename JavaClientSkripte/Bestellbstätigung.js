importPackage(Packages.com.jacob.com);
importPackage(Packages.com.jacob.activeX);
importPackage(Packages.com.ms.activeX);
importPackage(Packages.com.ms.com);

function eloFlowConfirmDialogOkStart() {
  var dialog = dialogs.flowConfirmDialog;
  var node = dialog.currentNode;
  if (node.name == "Prüfung der Bestellpositionen") {
    var nodes = dialog.selectedSuccessors;
    if (nodes) {
      var success = nodes[0].name == "Bestellung versenden";
      sendMessage(success);
    }
  }
}

function sendMessage(success) {
  var subject;
  var message;
  if (success) {
    subject = "Bestellung wird versandt";
    message = "Ihre gewünschte Bestellung...";
  } else {
    subject = "Artikel nicht verfügbar";
    message = "Leider sind nicht alle bestellten...";
  }

  ComThread.InitSTA();
  try {
    var app = new ActiveXComponent("Outlook.Application");
    var mail = Dispatch.call( app, "CreateItem", 0).toDispatch();
    Dispatch.put(mail, "Subject", subject);
    Dispatch.put(mail, "Body", message);

    Dispatch.call(mail, "Display");
  } catch (e) {
    log.info("Error: " + e);
  } finally {
    ComThread.Release();
  }
}

