importPackage(Packages.de.elo.client);
importPackage(Packages.com.jacob.com);
importPackage(Packages.com.jacob.activeX);
importPackage(Packages.com.ms.activeX);
importPackage(Packages.com.ms.com);

function getScriptButton1Name() {
  return "Hello";
}

function getScriptButtonPositions() {
  return "1,home,view";
}


function eloScriptButton1Start(){
  exportToOutlook(workspace.activeView.firstSelected);
}

function exportToOutlook(item) {
  ComThread.InitSTA();
  try {
    var app = new ActiveXComponent("Outlook.Application");
    var mail = Dispatch.call( app, "CreateItem", 0).toDispatch();
    Dispatch.put(mail, "Subject", "Dokument: " + item.name);
    var sord = item.loadSord();
    Dispatch.put(mail, "Body", sord.desc);
    var attachments = Dispatch.get(mail, "Attachments").toDispatch();
    Dispatch.call(attachments, "Add", item.file.path);

    Dispatch.call(mail, "Display");
  } catch (e) {
    log.info("Error: " + e);
  } finally {
    ComThread.Release();
  }
}
