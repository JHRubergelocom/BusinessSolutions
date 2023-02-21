// if (EM_WF_NODE.nodeName.indexOf("FreezeForm") > -1) {
//  FreezeForm.execute(EM_WF_NODE, EM_ACT_SORD, "NewVersion");
// }

// Required application:
//  wkhtmltopdf (64-bit)
//   http://wkhtmltopdf.org

importPackage(Packages.java.io);
importPackage(Packages.java.util);
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.org.apache.commons.lang.time);

var FreezeForm = {

  cfg: {

    wkhtmltopdfRelativePath: "\\wkhtmltopdf\\bin\\wkhtmltopdf.exe",

    maskId: 0,

    title: "Workflow form",

    dateTimeFormat: "yyyy-MM-dd HH:mm:ss"
  },

  execute: function (wfCollectNode, sord, mode, forward) {

    var formName = this.getFormName(wfCollectNode);

    var ticket = ixConnect.loginResult.clientInfo.ticket;
    var language = ixConnect.loginResult.clientInfo.language;

    var urlParams = [];
    urlParams.push("wfid=" + wfCollectNode.flowId);
    urlParams.push("nodeid=" + wfCollectNode.nodeId);
    urlParams.push("ticket=" + ticket);
    urlParams.push("lang=" + language);

    var url = this.getWfBaseUrl() + "/" + formName + ".jsp?" + urlParams.join("&");

    var tempFile = this.createTempFileWithSordName(sord, ".pdf");

    this.convertHtmlToPdf(url, tempFile.absolutePath);

    if (sord.type < SordC.LBT_DOCUMENT) {
      this.importDocument(sord, tempFile);
    } else {
      switch (String(mode)) {
      case "NewVersion":
        this.importVersion(sord, tempFile);
        break;
      default:
        this.saveAttachment(sord, tempFile);
        break;
      }
    }

    this.deleteTempFileAndFolder(tempFile);

    if (forward) {
      EM_WF_NEXT = "0";
    }
  },


  getWkhtmltopdfPath: function () {

    if (!this.wkhtmltopdfPath) {
      this.wkhtmltopdfPath = this.getProgramFilesDirPath() + this.cfg.wkhtmltopdfRelativePath;
    }
    return this.wkhtmltopdfPath;
  },


  getProgramFilesDirPath: function () {

    if (!this.programFilesDirPath) {
      this.programFilesDirPath = System.getenv("ProgramFiles");
      if (!this.programFilesDirPath) {
        log.warn("'ProgramFiles' path is empty.");
      }
    }
    return this.programFilesDirPath;
  },

  getWfBaseUrl: function () {

    if (!this.wfBaseUrl) {
      this.wfBaseUrl = this.getUserOption("Client.1398.1.0.Options.EloWfUrl.", UserProfileC.USERID_ALL);
      if (!this.wfBaseUrl) {
        log.warn("ELOwf base URL is empty.");
      }
    }
    return this.wfBaseUrl;
  },

  getUserOption: function (key, userId) {

    var keyValue = new KeyValue(key, "");
    var userProfile = new UserProfile([keyValue], userId);
    userProfile = ixConnect.ix().checkoutUserProfile(userProfile, LockC.NO);
    if (userProfile) {
      var options = userProfile.options;
      if (options.length > 0) {
        return options[0].value;
      }
    }
    return "";
  },

  getFormName: function (wfCollectNode) {

    var wfdiag = wf.readActiveWorkflow(false);
    var currentNode = wfdiag.nodes[wfCollectNode.nodeId];
    var formSpec = currentNode.formSpec;
    if (!formSpec) {
      log.warn("Property 'formSpec' is empty: node.name=" + currentNode.name);
      return "";
    }
    var formStartPos = formSpec.indexOf("[") + 1;
    var formEndPos = formSpec.indexOf("(");
    return formSpec.substring(formStartPos, formEndPos);
  },


  convertHtmlToPdf: function (url, destPath) {

    this.executeProgram([this.getWkhtmltopdfPath(), "-O", "Portrait", url, destPath]);
  },

  executeProgram: function (args) {

    log.debug("Execute program: \"" + args.join("\" \"") + "\"");
    var processBuilder = new ProcessBuilder(Arrays.asList(args));
    processBuilder.redirectErrorStream(true);
    var process = processBuilder.start();
    var scanner = new Scanner(process.inputStream).useDelimiter("\\Z");
    while (scanner.hasNextLine()) {
      log.debug(scanner.nextLine());
    }
    scanner.close();
    var returnCode = process.waitFor();
    log.debug("returnCode=" + returnCode);
  },

  createTempFileWithSordName: function (sord, extension) {

    var osTempDir = System.getProperty("java.io.tmpdir");
    var tempDir = new File(osTempDir + File.separator + "ELOas_" + System.nanoTime());
    tempDir.mkdir();
    var tempFile = new File(tempDir.absolutePath + File.separator + this.clearSpecialChars(sord.name) + extension);
    return tempFile;
  },

  clearSpecialChars: function (fileName) {
    fileName = String(fileName);
    var newFileName = fileName.replace(/[&\/\#,+()$~%.'":*?<>{}]/g, "");
    return newFileName;
  },

  deleteTempFileAndFolder: function (tempFile) {

    var tempDir = tempFile.parentFile;
    tempFile["delete"]();
    tempDir["delete"]();
  },

  saveAttachment: function (sord, file) {

    var editInfo = ixConnect.ix().checkoutDoc(sord.id, null, EditInfoC.mbSordDocAtt, LockC.NO);

    editInfo.document.atts = [new DocVersion()];
    editInfo.document.atts[0].pathId = editInfo.document.docs[0].pathId;
    editInfo.document.atts[0].ext = ixConnect.getFileExt(file);
    editInfo.document = ixConnect.ix().checkinDocBegin(editInfo.document);

    editInfo.document.atts[0].uploadResult = ixConnect.upload(editInfo.document.atts[0].url, file);
    editInfo.document = ixConnect.ix().checkinDocEnd(null, null, editInfo.document, LockC.YES);
    log.debug("Append frozen form as attachment: sord.id=" + editInfo.document.objId + ", attachment.id=" + editInfo.document.atts[0].id);
  },

  importVersion: function (sord, file) {

    var editInfo = ixConnect.ix().checkoutDoc(sord.id, null, EditInfoC.mbDocument, LockC.IF_FREE);
    var document = editInfo.document;
    document.docs[0].ext = ixConnect.getFileExt(file);
    document = ixConnect.ix().checkinDocBegin(document);
    document.docs[0].uploadResult = ixConnect.upload(document.docs[0].url, file);
    document = ixConnect.ix().checkinDocEnd(null, null, document, LockC.YES);
    log.debug("Import frozen form as version: sord.id=" + editInfo.document.objId + ", doc.id=" + document.docs[0].id+ file);
  },

  importDocument: function (sord, file) {

    var editInfo = ixConnect.ix().createDoc(sord.id, "", null, EditInfoC.mbSordDocAtt);

    editInfo.sord.name = this.cfg.title + " " + DateFormatUtils.format(new Date(), this.cfg.dateTimeFormat);
    editInfo.sord.mask = this.cfg.maskId;

    editInfo.document.docs = [new DocVersion()];
    editInfo.document.docs[0].ext = ixConnect.getFileExt(file);
    editInfo.document.docs[0].pathId = editInfo.sord.path;
    editInfo.document.docs[0].encryptionSet = editInfo.sord.details.encryptionSet;
    editInfo.document = ixConnect.ix().checkinDocBegin(editInfo.document);
    editInfo.document.docs[0].uploadResult = ixConnect.upload(editInfo.document.docs[0].url, file);
    editInfo.document = ixConnect.ix().checkinDocEnd(editInfo.sord, SordC.mbAll, editInfo.document, LockC.NO);
    log.debug("Import frozen form as document: sord.id=" + editInfo.document.objId + ", sord.name=" + editInfo.sord.name);
  }
};
