importPackage(Packages.de.elo.client);
importPackage(Packages.com.jacob.com);
importPackage(Packages.com.jacob.activeX);
importPackage(Packages.com.ms.activeX);
importPackage(Packages.com.ms.com);
importPackage(Packages.java.io);

var cleanup = new Array();

function getScriptButton1Name() {
  return "Send All";
}

function getScriptButtonPositions() {
  return "1,home,view";
}

function eloScriptButton1Start(){
  clearOldFiles();
  exportToOutlook();
}

function exportToOutlook() {
  var items = workspace.activeView.allSelected;
  var subject = "";
  var body = "";
  
  ComThread.InitSTA();
  try {
    var app = new ActiveXComponent("Outlook.Application");
    var mail = Dispatch.call( app, "CreateItem", 0).toDispatch();
    var attachments = Dispatch.get(mail, "Attachments").toDispatch();
    var tempPath = workspace.directories.tempDir;
    
    while (items.hasMoreElements()) {
      var item = items.nextElement();
      if (subject == "") {
        subject = item.name;
      }
      
      body = body + item.name + "\n\n";
      var sord = item.loadSord();
      body = body + sord.desc + "\n";
      body = body + "------------------\n\n";

      addAttachment(attachments, item, tempPath);
    }

    Dispatch.put(mail, "Subject", " Dokument: " + subject);
    Dispatch.put(mail, "Body", body);

    Dispatch.call(mail, "Display");
  } catch (e) {
    log.info("Error: " + e);
  } finally {
    ComThread.Release();
  }
}

function clearOldFiles() {
  for (var i = 0; i < cleanup.length; i++) {
    var delFile = cleanup[i];
    delFile["delete"]();
  }

  cleanup = new Array();
}

function addAttachment(attachments, item, path) {
  var file = item.file;
  var ext = utils.getFileExtension(file);
  var docName = File.separator + item.name + "." + ext;
  var destination = utils.getUniqueFile(path, docName);
  utils.copyFile(file, destination);
  cleanup.push(destination);

  Dispatch.call(attachments, "Add", destination.path);
}
