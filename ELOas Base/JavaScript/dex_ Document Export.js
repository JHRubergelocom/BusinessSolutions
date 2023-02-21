var dexRoot = "c:\\temp\\";


// start of namespace dex
var dex = new Object();
dex = {

  processDoc: function (Sord) {
    log.debug("Status: " + PDSTATUS + ", Name: " + NAME);

    if (PDSTATUS == "Aktiv: zur Löschung vorgesehen") {
      return dex.deleteDoc(Sord);
    } else if (PDSTATUS == "Aktiv: Freigegeben") {
      return dex.exportDoc(Sord);
    }

    return "";
  },

  deleteDoc: function (Sord) {
    dex.deleteFile(PDPATH1);
    dex.deleteFile(PDPATH2);
    dex.deleteFile(PDPATH3);
    dex.deleteFile(PDPATH4);
    dex.deleteFile(PDPATH5);

    PDSTATUS = "Nicht mehr aktiv / Gel�scht";
    return Sord.getDoc();
  },

  deleteFile: function (destPath) {
    if (destPath == "") {
      return;
    }

    var file = new File(dexRoot + destPath);
    if (file.exists()) {
      log.debug("Delete expired version: " + dexRoot + destPath);
      file["delete"]();
    }
  },

  exportDoc: function (Sord) {
    var editInfo = ixConnect.ix().checkoutDoc(Sord.getId(), null, EditInfoC.mbSordDoc, LockC.NO);
    var url = editInfo.document.docs[0].getUrl();
    dex.copyFile(url, PDPATH1);
    dex.copyFile(url, PDPATH2);
    dex.copyFile(url, PDPATH3);
    dex.copyFile(url, PDPATH4);
    dex.copyFile(url, PDPATH5);

    return Sord.getDoc();
  },

  copyFile: function (url, destPath) {
    if (destPath == "") {
      return;
    }

    log.debug("Path: " + dexRoot + destPath);
    var file = new File(dexRoot + destPath);
    if (file.exists()) {
      log.debug("Delete old version.");
      file["delete"]();
    }

    ixConnect.download(url, file);
  },

  asString: function (sourcePath) {
    var file = new File(dexRoot + sourcePath);
    var text = FileUtils.readFileToString(file, "UTF-8");
    return text;
  },

  asFile: function(destPath, data, encoding) {
    var file = new File(dexRoot + destPath);
    FileUtils.write(file, data, encoding);
  }
}
// end of namespace dex