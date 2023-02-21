
//@include lib_Class.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.AsUtils.js

importPackage(java.io);

/**
 * Functions to create an invoice template and to transfer the values of a template to
 * another invoice.
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 */
sol.define("sol.pubsec.jc.ImportFilingPlan", {

  singleton: true,

  start: function () {
    var me = this,
        file, firstSelected, extension, questionBoxText, questionBoxResult, templateFolder, templateSord, templateElement;

    me.config = sol.create("sol.common.Config", { compose: "/pubsec/Configuration/pubsec.config" }).config;
    file = me.chooseFile();
    if (!file) {
      return;
    }
    me.view = workspace.activeView;
    firstSelected = me.view.firstSelected;
    if (!firstSelected || firstSelected.isDocument()) {
      return;
    }
    extension = utils.getFileExtension(file).toLowerCase();
    if ((extension != "xlsx") && (extension != "csv")) {
      workspace.showAlertBox(me.getText("sol.pubsec.client.importFilingPlan.alert.title"), "<h3>" + me.getText("sol.pubsec.client.importFilingPlan.alert.msgWrongExtension") + "</h3>");
      return;
    }
    questionBoxText = String("<h3>" + me.getText("sol.pubsec.client.importFilingPlan.questionBox.text") + "</h3>");
    questionBoxText = questionBoxText.replace("{0}", file.name);
    questionBoxText = questionBoxText.replace("{1}", firstSelected.name);

    questionBoxResult = workspace.showQuestionBox(me.getText("sol.pubsec.client.importFilingPlan.questionBox.title"), questionBoxText);
    if (!questionBoxResult) {
      return;
    }

    templateFolder = me.getImportFolder();
    templateSord = templateFolder.prepareDocument(me.getDefaultDocMask());
    templateElement = templateFolder.addDocument(templateSord, file.absolutePath);

    me.startFolderId = firstSelected.id;
    me.templObjId = templateElement.id;

    me.backgroundJob = workspace.startBackgroundProcess("Import filing plan", "sol_pubsec_jc_importFilingPlaner_run");
  },

  /**
   * @private
   * Retrieves the archive folder where the filing plan should be stored.
   * @return {de.elo.client.scripting.items.ArchiveElement}
   */
  getImportFolder: function () {
    var me = this,
        target, objId;
    target = me.config.filingPlan.templateFolderId;
    objId = sol.common.RepoUtils.getObjId(target);
    if (!objId) {
      throw "Target does not exist: '" + target + "'";
    }
    return archive.getElement(objId);
  },

  run: function () {
    var me = this,
        responseObj;

    responseObj = sol.common.AsUtils.callAs({
      solutionNameForAsConfig: "pubsec",
      ruleName: me.config.rulesetNames.importFilingPlan,
      param2Obj: {
        templObjId: me.templObjId,
        startFolderId: me.startFolderId
      },
      trustAllHosts: true,
      trustAllCerts: true
    });

    me.view.refreshArchive();

    if (responseObj && responseObj.responseOk) {
      workspace.setFeedbackMessage(me.getText("sol.pubsec.client.importFilingPlan.msgimportFilingPlaned"));
    }
    me.backgroundJob.setFinished();
  },

  chooseFile: function () {
    var me = this,
        fileChooser, documentsDir, returnCode;

    fileChooser = new javax.swing.JFileChooser();
    fileChooser.dialogTitle = me.getText("sol.pubsec.client.importFilingPlan.fileChooser.title");
    fileChooser.fileFilter = new javax.swing.filechooser.FileNameExtensionFilter(me.getText("sol.pubsec.client.importFilingPlan.fileChooser.fileFilterName"), "csv", "xlsx");

    documentsDir = new File(java.lang.System.getProperty("user.home") + File.separator + "Documents");
    if (documentsDir.exists()) {
      fileChooser.currentDirectory = documentsDir;
    }

    returnCode = fileChooser.showOpenDialog(null);
    if (returnCode == javax.swing.JFileChooser.APPROVE_OPTION) {
      return fileChooser.selectedFile;
    }
  },

  getDefaultDocMask: function () {
    var sord = ixc.createDoc("1", "", null, EditInfoC.mbSord).sord;
    return sord.mask;
  },

  /**
   * Helper function to get a localized text of a specific key.
   * @param {String} key Key for the text constant.
   * @return {String} Localized text constant.
   */
  getText: function (key) {
    return String(utils.getText("sol.pubsec.client", key));
  }
});

function sol_pubsec_jc_importFilingPlaner_run() {
  sol.pubsec.jc.ImportFilingPlan.run();
}

function getScriptButton715Name() {
  return utils.getText("sol.pubsec.client", "sol.pubsec.client.ribbon.btnImportFilingPlan");
}

function getScriptButton715Tooltip() {
  return utils.getText("sol.pubsec.client", "sol.pubsec.client.ribbon.btnImportFilingPlan.tooltip");
}

function eloScriptButton715Start() {
  return sol.pubsec.jc.ImportFilingPlan.start();
}

function getScriptButtonPositions() {
  return "715,archive,export";
}
