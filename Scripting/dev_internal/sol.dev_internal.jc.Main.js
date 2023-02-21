/* eslint valid-jsdoc: 0 */

importPackage(Packages.de.elo.ix.client);
importPackage(org.apache.commons.io);

importClass(Packages.de.elo.client.scripting.constants.CONSTANTS);

//@include lib_Class.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.FileUtils.js
//@include lib_sol.common.ZipUtils.js
//@include lib_sol.common.ExecUtils.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.jc.ActionHandler.js
//@include lib_sol.common.jc.CommonDialogs.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.jc.ClipboardUtils.js
//@include lib_sol.dev_internal.jc.ReloadForms.js
//@include lib_sol.dev_internal.jc.Tasks.js
//@include lib_sol.dev_internal.jc.BuildSqlScripts.js
//@include lib_sol.dev_internal.jc.RunEloShellScript.js
//@include lib_sol.dev_internal.jc.MoveToStoragePath.js
//@include lib_sol.dev_internal.jc.ResetRights.js
//@include lib_sol.dev_internal.jc.ChangeOwner
//@include lib_sol.dev_internal.jc.CreateScript.js
//@include lib_sol.dev_internal.jc.CreateConfig.js
//@include lib_sol.dev_internal.jc.SetMask.js
//@include lib_sol.dev_internal.jc.WorkflowTemplate.js
//@include lib_sol.dev_internal.jc.CreateMiniAppLicense.js
//@include lib_sol.dev_internal.jc.Git.js
//@include lib_sol.dev.jc.CreatePackage.js
//@include lib_RhinoManager.js

sol.ns("sol.dev_internal");
sol.dev_internal.extraTabNo = 92;
sol.dev_internal.extraTabName = "TAB_SOL_DEVINTERN";
sol.dev_internal.bandBaseNo = 10;

/**
 * @class sol.dev_internal.jc.Main
 * @singleton
 *
 * @author Business Solutions, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.AsyncUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.FileUtils
 * @requires sol.common.ZipUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.jc.CommonDialogs
 * @requires sol.dev_internal.jc.CreateScript
 * @requires sol.dev_internal.jc.CreateConfig
 * @requires sol.dev_internal.jc.Tasks
 * @requires sol.dev_internal.jc.CreateAsInstallCmd
 * @requires sol.dev_internal.jc.CreateMiniAppLicense
 *
 */

/**
 * @member global.dev.JavaClientEvents
 * For ribbon extensions with the RibbonAdapter.
 * These can only be applied during this event. Ribbon extensions
 * cannot be taken into account later on.
 */
function eloExpandRibbon() {
  var tab, bandNo, bandDocker, bandJavaDoc, bandLogs, bandReload, bandDate, bandEncryption,
      bandEdit, bandDelete, bandSQL, bandLicense, bandIXPlugIns, bandAcl, bandNormalize,
      bandInvoice, bandSordType, bandBatchImport, bandWorkflow, bandElo, bandSession,
      bandJava,
      btnStack, btnTomcat, btnAdminConsole, btnAppManager, btnWebClient,
      btnPGAdmin, btnIxAPI, btnELOData, btnIXLog, btnASLog, btnWFLog, btnReloadIX,
      btnEncryptString, btnDecryptString, btnEditWithVSCode, btnDelete, btnBuildSqlScripts,
      btnCheckLicenses, btnCreateMiniAppLicense, btnInstallIXPlugIn, btnShowIXPlugIns,
      btnApplyDXXML, btnDecodeACLString, btnSetOwner, btnExtractZugferd, btnSetMaskELOscripts,
      btnSetMaskBasicEntry, btnMoveAllDocumentsToELOSYS, btnResetRightsRecursive,
      btnInstallSordTypes, btnChangeOwnerToAdministrator, btnGetExtendWfRightsConfig, btnDownloadSordMapBlobs,
      btnResetBatchimportStatus, btnConvertToInternalDate, btnHandoffToServiceUser, btnShowJavaInfo,
      btnShowMaskInfo, btnGetTicket, btnShowSessions, btnTaskInfo, btnGetMD5, btnLicenseCheckTestLibClass;

  if (!workspace.userRights.hasAdminRight()) {
    return "";
  }

  tab = ribbon.addTab(sol.dev_internal.extraTabNo, null, sol.dev_internal.extraTabName);
  tab.setTitle("Development Internal");

  bandNo = sol.dev_internal.bandBaseNo;

  bandDocker = ribbon.addBand(tab.getId(), bandNo++, "bandDocker");
  bandDocker.setTitle("Docker");
  bandJavaDoc = ribbon.addBand(tab.getId(), bandNo++, "bandJavaDoc");
  bandJavaDoc.setTitle("JavaDoc");
  bandLogs = ribbon.addBand(tab.getId(), bandNo++, "bandLogs");
  bandLogs.setTitle("Logs");
  bandReload = ribbon.addBand(tab.getId(), bandNo++, "bandReload");
  bandReload.setTitle("Reload");
  bandDate = ribbon.addBand(tab.getId(), bandNo++, "bandDate");
  bandDate.setTitle("Date");
  bandEdit = ribbon.addBand(tab.getId(), bandNo++, "bandEdit");
  bandEdit.setTitle("Edit");
  bandDelete = ribbon.addBand(tab.getId(), bandNo++, "bandDelete");
  bandDelete.setTitle("Delete");
  bandEncryption = ribbon.addBand(tab.getId(), bandNo++, "bandEncryption");
  bandEncryption.setTitle("Encryption");
  bandAcl = ribbon.addBand(tab.getId(), bandNo++, "bandAcl");
  bandAcl.setTitle("ACL");
  bandNormalize = ribbon.addBand(tab.getId(), bandNo++, "bandNormalize");
  bandNormalize.setTitle("Normalize");
  bandSQL = ribbon.addBand(tab.getId(), bandNo++, "bandSQL");
  bandSQL.setTitle("SQL");
  bandLicense = ribbon.addBand(tab.getId(), bandNo++, "bandLicense");
  bandLicense.setTitle("License");
  bandIXPlugIns = ribbon.addBand(tab.getId(), bandNo++, "bandIXPlugIns");
  bandIXPlugIns.setTitle("IX Plug-ins");
  bandInvoice = ribbon.addBand(tab.getId(), bandNo++, "bandDX");
  bandInvoice.setTitle("Invoice");
  bandSordType = ribbon.addBand(tab.getId(), bandNo++, "bandSordType");
  bandSordType.setTitle("Sord type");
  bandBatchImport = ribbon.addBand(tab.getId(), bandNo++, "bandBatchImport");
  bandBatchImport.setTitle("Batch import");
  bandWorkflow = ribbon.addBand(tab.getId(), bandNo++, "bandWorkflow");
  bandWorkflow.setTitle("Workflow");
  bandElo = ribbon.addBand(tab.getId(), bandNo++, "bandElo");
  bandElo.setTitle("ELO");
  bandSession = ribbon.addBand(tab.getId(), bandNo++, "bandSession");
  bandSession.setTitle("Session");
  bandJava = ribbon.addBand(tab.getId(), bandNo++, "bandJava");
  bandJava.setTitle("Java");

  btnStack = ribbon.addButton(tab.getId(), bandDocker.getId(), "btnStack");
  btnStack.title = "Stack";
  btnStack.setIconName("ScriptButton505");
  btnStack.setCallback(function () {
    stack();
  }, this);

  btnTomcat = ribbon.addButton(tab.getId(), bandDocker.getId(), "btnTomcat");
  btnTomcat.title = "Tomcat";
  btnTomcat.setIconName("ScriptButton506");
  btnTomcat.setCallback(function () {
    tomcat();
  }, this);

  btnAdminConsole = ribbon.addButton(tab.getId(), bandDocker.getId(), "btnAdminConsole");
  btnAdminConsole.title = "Admin console";
  btnAdminConsole.setIconName("ScriptButton507");
  btnAdminConsole.setCallback(function () {
    adminConsole();
  }, this);

  btnAppManager = ribbon.addButton(tab.getId(), bandDocker.getId(), "btnAppManager");
  btnAppManager.title = "App manager";
  btnAppManager.setIconName("ScriptButton508");
  btnAppManager.setCallback(function () {
    appManager();
  }, this);

  btnWebClient = ribbon.addButton(tab.getId(), bandDocker.getId(), "btnWebClient");
  btnWebClient.title = "Web Client";
  btnWebClient.setIconName("ScriptButton510");
  btnWebClient.setCallback(function () {
    webClient();
  }, this);

  btnPGAdmin = ribbon.addButton(tab.getId(), bandDocker.getId(), "btnPGAdmin");
  btnPGAdmin.title = "pgAdmin";
  btnPGAdmin.setIconName("ScriptButton511");
  btnPGAdmin.setCallback(function () {
    pgAdmin();
  }, this);

  btnIxAPI = ribbon.addButton(tab.getId(), bandJavaDoc.getId(), "btnIxAPI");
  btnIxAPI.title = "IX API";
  btnIxAPI.setIconName("ScriptButton512");
  btnIxAPI.setCallback(function () {
    ixAPI();
  }, this);

  btnELOData = ribbon.addButton(tab.getId(), bandLogs.getId(), "btnELOData");
  btnELOData.title = "ELO data";
  btnELOData.setIconName("ScriptButton515");
  btnELOData.setCallback(function () {
    eloData();
  }, this);

  btnIXLog = ribbon.addButton(tab.getId(), bandLogs.getId(), "btnIXLog");
  btnIXLog.title = "IX log";
  btnIXLog.setIconName("ScriptButton516");
  btnIXLog.setCallback(function () {
    ixLog();
  }, this);

  btnASLog = ribbon.addButton(tab.getId(), bandLogs.getId(), "btnASLog");
  btnASLog.title = "AS log";
  btnASLog.setIconName("ScriptButton517");
  btnASLog.setCallback(function () {
    asLog();
  }, this);

  btnWFLog = ribbon.addButton(tab.getId(), bandLogs.getId(), "btnWFLog");
  btnWFLog.title = "WF log";
  btnWFLog.setIconName("ScriptButton518");
  btnWFLog.setCallback(function () {
    wfLog();
  }, this);

  btnReloadIX = ribbon.addButton(tab.getId(), bandReload.getId(), "btnReloadIX");
  btnReloadIX.title = "Reload IX";
  btnReloadIX.setIconName("ScriptButton519");
  btnReloadIX.setCallback(function () {
    reloadIX();
  }, this);

  btnConvertToInternalDate = ribbon.addButton(tab.getId(), bandDate.getId(), "btnConvertToInternalDate");
  btnConvertToInternalDate.title = "Convert to internal date";
  btnConvertToInternalDate.setIconName("ScriptButton559");
  btnConvertToInternalDate.setCallback(function () {
    convertToInternalDate();
  }, this);

  btnDecodeACLString = ribbon.addButton(tab.getId(), bandAcl.getId(), "btnDecodeACLString");
  btnDecodeACLString.title = "Decode ACL String";
  btnDecodeACLString.setIconName("ScriptButton546");
  btnDecodeACLString.setCallback(function () {
    decodeACLString();
  }, this);

  btnSetOwner = ribbon.addButton(tab.getId(), bandAcl.getId(), "btnSetOwner");
  btnSetOwner.title = "Set owner";
  btnSetOwner.setIconName("ScriptButton547");
  btnSetOwner.setCallback(function () {
    setOwner();
  }, this);

  btnResetRightsRecursive = ribbon.addButton(tab.getId(), bandAcl.getId(), "btnResetRightsRecursive");
  btnResetRightsRecursive.title = "Reset rights recursive";
  btnResetRightsRecursive.setIconName("ScriptButton552");
  btnResetRightsRecursive.setCallback(function () {
    resetRightsRecursive();
  }, this);

  btnSetMaskELOscripts = ribbon.addButton(tab.getId(), bandNormalize.getId(), "btnSetMaskELOscripts");
  btnSetMaskELOscripts.title = "Set mask 'ELOscripts'";
  btnSetMaskELOscripts.setIconName("ScriptButton549");
  btnSetMaskELOscripts.setCallback(function () {
    setMaskELOscripts();
  }, this);

  btnSetMaskBasicEntry = ribbon.addButton(tab.getId(), bandNormalize.getId(), "btnSetMaskBasicEntry");
  btnSetMaskBasicEntry.title = "Set mask 'Basic Entry'";
  btnSetMaskBasicEntry.setIconName("ScriptButton550");
  btnSetMaskBasicEntry.setCallback(function () {
    setMaskBasicEntry();
  }, this);

  btnMoveAllDocumentsToELOSYS = ribbon.addButton(tab.getId(), bandNormalize.getId(), "btnMoveAllDocumentsToELOSYS");
  btnMoveAllDocumentsToELOSYS.title = "Move all documents to ELOSYS";
  btnMoveAllDocumentsToELOSYS.setIconName("ScriptButton551");
  btnMoveAllDocumentsToELOSYS.setCallback(function () {
    moveAllDocumentsToELOSYS();
  }, this);

  btnEncryptString = ribbon.addButton(tab.getId(), bandEncryption.getId(), "btnEncryptString");
  btnEncryptString.title = "Encrypt string";
  btnEncryptString.setIconName("ScriptButton522");
  btnEncryptString.setCallback(function () {
    encryptString();
  }, this);

  btnDecryptString = ribbon.addButton(tab.getId(), bandEncryption.getId(), "btnDecryptString");
  btnDecryptString.title = "Decrypt string";
  btnDecryptString.setIconName("ScriptButton523");
  btnDecryptString.setCallback(function () {
    decryptString();
  }, this);

  btnEditWithVSCode = ribbon.addButton(tab.getId(), bandEdit.getId(), "btnEditWithVSCode");
  btnEditWithVSCode.title = "Edit with VSCode";
  btnEditWithVSCode.setIconName("ScriptButton524");
  btnEditWithVSCode.setCallback(function () {
    editWithVSCode();
  }, this);

  btnDelete = ribbon.addButton(tab.getId(), bandDelete.getId(), "btnDelete");
  btnDelete.title = "Delete";
  btnDelete.setIconName("ScriptButton525");
  btnDelete.setCallback(function () {
    deleteElements();
  }, this);

  btnBuildSqlScripts = ribbon.addButton(tab.getId(), bandSQL.getId(), "btnBuildSqlScripts");
  btnBuildSqlScripts.title = "Build SQL scripts";
  btnBuildSqlScripts.setIconName("ScriptButton535");
  btnBuildSqlScripts.setCallback(function () {
    buildSqlScripts();
  }, this);

  btnCheckLicenses = ribbon.addButton(tab.getId(), bandLicense.getId(), "btnCheckLicenses");
  btnCheckLicenses.title = "Check licenses";
  btnCheckLicenses.setIconName("ScriptButton540");
  btnCheckLicenses.setCallback(function () {
    checkLicenses();
  }, this);

  btnCreateMiniAppLicense = ribbon.addButton(tab.getId(), bandLicense.getId(), "btnCreateMiniAppLicense");
  btnCreateMiniAppLicense.title = "Create Mini App License";
  btnCreateMiniAppLicense.setIconName("ScriptButton541");
  btnCreateMiniAppLicense.setCallback(function () {
    createMiniAppLicense();
  }, this);

  btnLicenseCheckTestLibClass = ribbon.addButton(tab.getId(), bandLicense.getId(), "btnLicenseCheckTestLibClass");
  btnLicenseCheckTestLibClass.title = "License check test - LibClass";
  btnLicenseCheckTestLibClass.setIconName("ScriptButton404");
  btnLicenseCheckTestLibClass.setCallback(function () {
    licenseCheckTestLibClass();
  }, this);

  btnInstallIXPlugIn = ribbon.addButton(tab.getId(), bandIXPlugIns.getId(), "btnInstallIXPlugIn");
  btnInstallIXPlugIn.title = "Install IX Plug-in";
  btnInstallIXPlugIn.setIconName("ScriptButton542");
  btnInstallIXPlugIn.setCallback(function () {
    installIXPlugIn();
  }, this);

  btnShowIXPlugIns = ribbon.addButton(tab.getId(), bandIXPlugIns.getId(), "btnShowIXPlugIns");
  btnShowIXPlugIns.title = "Show IX Plug-ins";
  btnShowIXPlugIns.setIconName("ScriptButton543");
  btnShowIXPlugIns.setCallback(function () {
    showIXPlugIns();
  }, this);

  btnApplyDXXML = ribbon.addButton(tab.getId(), bandInvoice.getId(), "btnApplyDXXML");
  btnApplyDXXML.title = "Apply DX XML";
  btnApplyDXXML.setIconName("ScriptButton544");
  btnApplyDXXML.setCallback(function () {
    applyDXXML();
  }, this);

  btnExtractZugferd = ribbon.addButton(tab.getId(), bandInvoice.getId(), "btnExtractZugferd");
  btnExtractZugferd.title = "Extract Zugferd";
  btnExtractZugferd.setIconName("ScriptButton548");
  btnExtractZugferd.setCallback(function () {
    extractZugferdBtn();
  }, this);

  btnChangeOwnerToAdministrator = ribbon.addButton(tab.getId(), bandAcl.getId(), "btnChangeOwnerToAdministrator");
  btnChangeOwnerToAdministrator.title = "Change owner recursively to 'Administrator'";
  btnChangeOwnerToAdministrator.setIconName("ScriptButton554");
  btnChangeOwnerToAdministrator.setCallback(function () {
    changeOwnerToAdministrator();
  }, this);

  btnGetExtendWfRightsConfig = ribbon.addButton(tab.getId(), bandAcl.getId(), "btnGetExtendWfRightsConfig");
  btnGetExtendWfRightsConfig.title = "Get extend workflow rights configuration'";
  btnGetExtendWfRightsConfig.setIconName("ScriptButton555");
  btnGetExtendWfRightsConfig.setCallback(function () {
    getExtendWfRightsConfig();
  }, this);


  btnInstallSordTypes = ribbon.addButton(tab.getId(), bandSordType.getId(), "btnInstallSordTypes");
  btnInstallSordTypes.title = "Install sord types";
  btnInstallSordTypes.setIconName("ScriptButton553");
  btnInstallSordTypes.setCallback(function () {
    installSordTypes();
  }, this);

  btnDownloadSordMapBlobs = ribbon.addButton(tab.getId(), bandBatchImport.getId(), "btnDownloadSordMapBlobs");
  btnDownloadSordMapBlobs.title = "Download Sord map blobs";
  btnDownloadSordMapBlobs.setIconName("ScriptButton557");
  btnDownloadSordMapBlobs.setCallback(function () {
    downloadSordMapBlobs();
  }, this);

  btnResetBatchimportStatus = ribbon.addButton(tab.getId(), bandBatchImport.getId(), "btnResetBatchimportStatus");
  btnResetBatchimportStatus.title = "Reset batchimport status";
  btnResetBatchimportStatus.setIconName("ScriptButton558");
  btnResetBatchimportStatus.setCallback(function () {
    resetBatchimportStatus();
  }, this);

  btnHandoffToServiceUser = ribbon.addButton(tab.getId(), bandWorkflow.getId(), "btnHandoffToServiceUser");
  btnHandoffToServiceUser.title = "Hand-off to service user";
  btnHandoffToServiceUser.setIconName("ScriptButton560");
  btnHandoffToServiceUser.setCallback(function () {
    handoffToServiceUser();
  }, this);

  btnTaskInfo = ribbon.addButton(tab.getId(), bandWorkflow.getId(), "btnTaskInfo");
  btnTaskInfo.title = "Task info";
  btnTaskInfo.setIconName("ScriptButton574");
  btnTaskInfo.setCallback(function () {
    taskInfo();
  }, this);


  btnShowMaskInfo = ribbon.addButton(tab.getId(), bandElo.getId(), "btnShowMaskInfo");
  btnShowMaskInfo.title = "Show mask info";
  btnShowMaskInfo.setIconName("ScriptButton571");
  btnShowMaskInfo.setCallback(function () {
    showMaskInfo();
  }, this);

  btnGetMD5 = ribbon.addButton(tab.getId(), bandElo.getId(), "btnGetMD5");
  btnGetMD5.title = "Get MD5";
  btnGetMD5.setIconName("ScriptButton575");
  btnGetMD5.setCallback(function () {
    getMD5();
  }, this);

  btnGetTicket = ribbon.addButton(tab.getId(), bandSession.getId(), "btnGetTicket");
  btnGetTicket.title = "Get ticket";
  btnGetTicket.setIconName("ScriptButton572");
  btnGetTicket.setCallback(function () {
    getTicket();
  }, this);

  btnShowSessions = ribbon.addButton(tab.getId(), bandSession.getId(), "btnShowSessions");
  btnShowSessions.title = "Show sessions";
  btnShowSessions.setIconName("ScriptButton573");
  btnShowSessions.setCallback(function () {
    showSessions();
  }, this);

  btnShowJavaInfo = ribbon.addButton(tab.getId(), bandJava.getId(), "btnShowJavaInfo");
  btnShowJavaInfo.title = "Show Java info";
  btnShowJavaInfo.setIconName("ScriptButton570");
  btnShowJavaInfo.setCallback(function () {
    showJavaInfo();
  }, this);
}

function getStackHost() {

  var matches, ixUrl, stackHost;

  ixUrl = ixConnect.endpointUrl + "";
  matches = ixUrl.match(/(?:^http:\/\/)([^\/]*)/);
  stackHost = matches[1];

  return stackHost;
}

function stack() {
  var stackUrl;

  stackUrl = "http://" + getStackHost();

  java.awt.Desktop.desktop.browse(new java.net.URI(stackUrl));
}

function tomcat() {
  var tomcatUrl;

  tomcatUrl = "http://admin:elo@" + getStackHost() + "/manager/html/";

  java.awt.Desktop.desktop.browse(new java.net.URI(tomcatUrl));
}

function adminConsole() {
  var adminConsoleUrl;

  adminConsoleUrl = "http://" + getStackHost() + "/ix-Solutions/plugin/de.elo.ix.plugin.proxy/ac/";

  java.awt.Desktop.desktop.browse(new java.net.URI(adminConsoleUrl));
}

function appManager() {
  var appManagerUrl;

  appManagerUrl = "http://" + getStackHost() + "/ix-Solutions/plugin/de.elo.ix.plugin.proxy/wf/apps/app/elo.webapps.AppManager/";

  java.awt.Desktop.desktop.browse(new java.net.URI(appManagerUrl));
}

function webClient() {
  var chromePath, webClientUrl;

  webClientUrl = "http://" + getStackHost() + "/ix-Solutions/plugin/de.elo.ix.plugin.proxy/web/";

  chromePath = sol.common.ExecUtils.getProgramFilesDir() + File.separator + "Google" + File.separator + "Chrome" + File.separator + "Application" + File.separator + "Chrome.exe";

  sol.common.ExecUtils.startProcess([chromePath, "--start-maximized", webClientUrl], { wait: false });
}

function pgAdmin() {
  var dbUrl;

  dbUrl = "http://db." + getStackHost();

  java.awt.Desktop.desktop.browse(new java.net.URI(dbUrl));
}

function ixAPI() {
  var appManagerUrl;

  appManagerUrl = "http://" + getStackHost() + "/ix-Solutions/doc/EloixClient-javadoc.jar/index.html";

  java.awt.Desktop.desktop.browse(new java.net.URI(appManagerUrl));
}

function eloData() {
  var eloDataUrl;

  eloDataUrl = "http://" + getStackHost() + "/elo-data/";

  java.awt.Desktop.desktop.browse(new java.net.URI(eloDataUrl));
}

function openRemoteFile(remoteFilePath) {
  var url, filePathParts, urlString, extStartPos, tempDirPath, tempDir, fileName, filePath, dstFile, fileNamePrefix;

  urlString = "http://" + getStackHost() + remoteFilePath;
  url = new java.net.URL(urlString);
  filePathParts = remoteFilePath.split("/");
  fileName = filePathParts[filePathParts.length - 1];
  extStartPos = fileName.lastIndexOf(".");
  fileNamePrefix = fileName.substring(0, extStartPos);
  tempDir = workspace.directories.tempDir;
  tempDirPath = tempDir.canonicalPath;

  filePath = tempDirPath + File.separator + fileNamePrefix + "_" + sol.common.FileUtils.getTimeStampString() + fileName.substring(extStartPos);
  dstFile = new File(filePath);

  Packages.org.apache.commons.io.FileUtils.copyURLToFile(url, dstFile);

  java.awt.Desktop.desktop.open(dstFile);
}

function ixLog() {
  openRemoteFile("/elo-data/logs/ELO-base/ix-Solutions.log");
}

function asLog() {
  openRemoteFile("/elo-data/logs/ELO-base/as-Solutions.log");
}

function wfLog() {
  openRemoteFile("/elo-data/logs/ELO-base/wf-Solutions.log");
}

function reloadIX() {
  var connFact, conn, timeoutSeconds;

  timeoutSeconds = 600;

  connFact = sol.common.RepoUtils.createConnFact(ixConnect.connProperties, ixConnect.sessionOptions, {
    timeoutSeconds: timeoutSeconds
  });
  conn = connFact.createFromTicket(ixConnect.loginResult.clientInfo);
  conn.ix().reload();
  conn.close();
  connFact.done();

  workspace.setFeedbackMessage("IX reloaded");
}

function encryptString() {
  var des, encrypted, decrypted;

  decrypted = workspace.showInputBox("ELO", "Insert string", "", 3, -1, false, -1);

  if (!decrypted) {
    return;
  }

  des = new Packages.de.elo.utils.sec.DesEncryption();
  encrypted = des.encrypt(decrypted);
  sol.common.jc.ClipboardUtils.setText(encrypted);

  workspace.showInfoBox("ELO", "<h3>Encrypted string:</h3><br>" + encrypted);
}

function decryptString() {
  var des, encrypted, decrypted;

  encrypted = workspace.showInputBox("ELO", "Insert encrypted string", "", 3, -1, false, -1);

  if (!encrypted) {
    return;
  }

  des = new Packages.de.elo.utils.sec.DesEncryption();
  decrypted = des.decrypt(encrypted);
  sol.common.jc.ClipboardUtils.setText(decrypted);

  workspace.showInfoBox("ELO", "<h3>Decrypted string:</h3><br>" + decrypted);
}

function editWithVSCode() {
  var firstSelected, vsCodePath, documentPath;

  firstSelected = workspace.activeView.firstSelected;

  if (!firstSelected) {
    return;
  }

  if (firstSelected.class.name == "de.elo.client.scripting.items.ArchiveDocument") {
    firstSelected.checkOut();
  }

  firstSelected = workspace.activeView.firstSelected;

  if (firstSelected.class.name == "de.elo.client.scripting.items.CheckoutDocument") {
    documentPath = firstSelected.documentFile.canonicalPath;
  }

  vsCodePath = sol.common.ExecUtils.getProgramFilesDir() + File.separator + "Microsoft VS Code" + File.separator + "Code.exe";

  sol.common.ExecUtils.startProcess([vsCodePath, documentPath], { wait: false });
}

function deleteElements() {
  var counter = 0,
      view, elements, element, wfCollectNode;

  view = workspace.activeView;

  if (view instanceof ArchiveViewAdapter) {
    workspace.setWaitCursor();
    elements = view.allSelected;
    while (elements.hasMoreElements()) {
      element = elements.nextElement();
      sol.common.RepoUtils.deleteSord(element.id);
      counter++;
      workspace.setNormalCursor();
      view.refreshArchive();
    }
  } else if (view instanceof TasksViewAdapter) {
    workspace.setWaitCursor();
    elements = view.allSelected;
    while (elements.hasMoreElements()) {
      element = elements.nextElement();
      wfCollectNode = element.task.wfNode;
      if (wfCollectNode) {
        ixConnect.ix().deleteWorkFlow(wfCollectNode.flowId, WFTypeC.ACTIVE, LockC.NO);
        counter++;
      }
    }
    view.refresh();
  }

  workspace.setFeedbackMessage(counter + " element(s) deleted");
}

function buildSqlScripts() {
  sol.dev_internal.jc.BuildSqlScripts.execute();
}

function checkLicenses() {
  RhinoManager.registerClass("sol.bla");
  RhinoManager.registerClass("sol.invoice");
  RhinoManager.registerClass("sol.pubsec");
  RhinoManager.registerClass("sol.contract");
  RhinoManager.registerClass("sol.visitor");
  RhinoManager.registerClass("sol.knowledge");
  RhinoManager.registerClass("sol.recruiting");
  RhinoManager.registerClass("erp.sap.toolbox");

  workspace.setFeedbackMessage("Licenses checked");
}

function createMiniAppLicense() {
  sol.dev_internal.jc.CreateMiniAppLicense.execute();
}

function licenseCheckTestLibClass() {
  var className, message;

  message = "ClassName eingeben";
  className = String(workspace.showSimpleInputBox("License check test - LibClass", message, "sol.learning.Test"));
  RhinoManager.registerClass(className);
  workspace.setFeedbackMessage("License for '" + className + "' is valid.");
}

function installIXPlugIn() {
  var pluginFile, pluginFilePath, inputStream;

  pluginFile = sol.common.jc.CommonDialogs.showSaveDialog({
    title: "IX plug-in",
    filterName: "OSGi plug-in (*.jar)",
    filterExtension: "jar"
  });

  if (pluginFile) {
    pluginFilePath = pluginFile.canonicalPath;

    inputStream = new FileInputStream(pluginFilePath);

    ixConnect.pluginService.upload(inputStream);

    workspace.setFeedbackMessage("IX plug-in imported: " + pluginFilePath);
  }
}

function showIXPlugIns() {
  var osgiPluginDirectories, pluginInfoList, content, pluginInfoIterator, pluginInfo;

  pluginInfoList = ixConnect.pluginService.plugins;
  content = ["<h3>IX plug-ins:</h3>"];
  osgiPluginDirectories = sol.common.RepoUtils.getIxOption("osgiPluginDirectories");
  content.push("osigPluginDirectories = " + osgiPluginDirectories + "<br><br>");

  pluginInfoIterator = pluginInfoList.iterator();
  while (pluginInfoIterator.hasNext()) {
    pluginInfo = pluginInfoIterator.next();
    content.push(pluginInfo.toString() + "<br>");
  }
  workspace.showInfoBox("ELO", content.join(""));
}

function applyDXXML() {
  var view, xmlContent;
  view = workspace.activeView;
  xmlContent = org.apache.commons.io.FileUtils.readFileToString(new File("c:\\temp\\Export.xml"), "UTF-8");
  sol.common.IxUtils.execute("RF_sol_connector_dx_service_DxImporter", { subsystem: "Invoice", docClass: "Invoice/Default", objId: view.firstSelected.id, xmlContent: xmlContent });
  workspace.setFeedbackMessage("DX XML applied.");
}

function decodeACLString() {
  var userName = "",
      aclString, aclItemsIntern, i, aclItemIntern, line, accessString, content;

  aclString = workspace.showInputBox("ELO", "Insert ACL string", "", 10, 255, false, 2);

  if (!aclString) {
    return;
  }

  if (aclString.indexOf("ACL=") == 0) {
    aclString = aclString.substr(4);
  }

  content = ["<h3>ACL string: " + aclString + "</h3>"];

  aclItemsIntern = new Packages.de.elo.utils.data.AclItemIntern.crack(aclString);

  for (i = 0; i < aclItemsIntern.length; i++) {
    aclItemIntern = aclItemsIntern[i];

    try {
      userName = ixConnect.ix().getUserNames([aclItemIntern.id], CheckoutUsersC.BY_IDS_RAW)[0].name;
    } catch (ignore) {
    }

    userName = (userName + "") || "<unknown>";

    accessString = "";
    if ((aclItemIntern.rights & AccessC.LUR_READ) != 0) {
      accessString += "R";
    }
    if ((aclItemIntern.rights & AccessC.LUR_WRITE) != 0) {
      accessString += "W";
    }
    if ((aclItemIntern.rights & AccessC.LUR_DELETE) != 0) {
      accessString += "D";
    }
    if ((aclItemIntern.rightss & AccessC.LUR_EDIT) != 0) {
      accessString += "E";
    }
    if ((aclItemIntern.rights & AccessC.LUR_LIST) != 0) {
      accessString += "L";
    }

    line = "id=" + aclItemIntern.id + ", user=" + userName + ", access=" + accessString;
    content.push(line);
  }

  workspace.showInfoBox("ELO", content.join("<br>"));
}

function setOwner() {
  var userNames,
      ownerName = "",
      ownerId, elements, element, sord;

  userNames = workspace.showUserSelectionDialog(false, 1, 1, true, false);

  if (!userNames || (userNames.length == 0)) {
    return;
  }

  ownerId = userNames[0].id;
  ownerName = userNames[0].name;

  elements = workspace.activeView.allSelected;

  while (elements.hasMoreElements()) {
    element = elements.nextElement();

    sord = element.sord;
    sord.ownerId = ownerId;
    element.sord = sord;
  }

  workspace.setFeedbackMessage("Owner '" + ownerName + "' set");
}

function extractZugferdBtn() {
  var me = this,
      zugferdDirPath, zugferdDir, fileIterator, file;

  zugferdDirPath = "c:/temp/zugferd";

  zugferdDir = new java.io.File(zugferdDirPath);

  if (!zugferdDir.exists()) {
    return;
  }

  fileIterator = Packages.org.apache.commons.io.FileUtils.listFiles(zugferdDir, new Packages.org.apache.commons.io.filefilter.SuffixFileFilter([".pdf"],
    Packages.org.apache.commons.io.IOCase.INSENSITIVE), Packages.org.apache.commons.io.filefilter.TrueFileFilter.INSTANCE).iterator();

  while (fileIterator.hasNext()) {
    file = fileIterator.next();
    me.extractZugferd(file);
  }
}

function extractZugferd(file) {
  var pdfDoc, pdfDict, names, key, embeddedFiles, keyIterator, fileSpec, embeddedFile, filename, outputDirPath, outputDir, outputFilePath, outputFile, fileOutputStream;

  pdfDoc = Packages.org.apache.pdfbox.pdmodel.PDDocument.load(file);
  outputDirPath = Packages.org.apache.commons.io.FilenameUtils.removeExtension(file.canonicalPath);
  outputDir = new java.io.File(outputDirPath);
  Packages.org.apache.commons.io.FileUtils.deleteQuietly(outputDir);
  Packages.org.apache.commons.io.FileUtils.forceMkdir(outputDir);
  pdfDict = new Packages.org.apache.pdfbox.pdmodel.PDDocumentNameDictionary(pdfDoc.documentCatalog);
  embeddedFiles = pdfDict.embeddedFiles;
  names = embeddedFiles.names;
  keyIterator = names.keySet().iterator();
  while (keyIterator.hasNext()) {
    key = keyIterator.next();
    fileSpec = names.get(key);
    embeddedFile = fileSpec.embeddedFile;
    filename = fileSpec.filename;
    outputFilePath = outputDirPath + java.io.File.separator + filename;
    outputFile = new java.io.File(outputFilePath);
    fileOutputStream = new java.io.FileOutputStream(outputFile);
    fileOutputStream.write(embeddedFile.toByteArray());
    fileOutputStream.close();
  }
  pdfDoc.close();
}

function setMaskELOscripts() {
  sol.dev_internal.jc.SetMask.execute("ELOscripts");
}

function setMaskBasicEntry() {
  sol.dev_internal.jc.SetMask.execute("Basic Entry");
}

function moveAllDocumentsToELOSYS() {
  sol.dev_internal.jc.MoveToStoragePath.execute();
}

function resetRightsRecursive() {
  sol.dev_internal.jc.ResetRights.execute();
}

function installSordTypes() {
  var sordTypesRepoPath, sordTypesObjId, children, child, i, childRepoPath, configRepoPath,
      configContent, config, result, displayContent;

  sordTypesRepoPath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/dev_internal/Sord types";

  displayContent = ["<h3>Sord types installed:</h3><ul>"];

  sordTypesObjId = sol.common.RepoUtils.getObjId(sordTypesRepoPath);

  if (!sordTypesObjId) {
    workspace.showAlertBox("ELO", "<h3>Sord types folder not found</h3>" + sordTypesRepoPath);
    return;
  }

  children = sol.common.RepoUtils.findChildren(sordTypesObjId, { includeFolders: true, includeDocuments: false });

  for (i = 0; i < children.length; i++) {
    child = children[i];
    childRepoPath = sol.common.RepoUtils.getPath(child, true);
    configRepoPath = childRepoPath + "/config";
    configContent = sol.common.RepoUtils.downloadToString(configRepoPath);
    config = JSON.parse(configContent);

    if (!config.id) {
      workspace.showAlertBox("ELO", "<h3>Sord type ID must be set</h3>" + childRepoPath);
      return;
    }

    result = sol.common.SordTypeUtils.createSordType(config.id, config.name, config.kind,
      [
        sol.common.RepoUtils.downloadToFileData(childRepoPath + "/Icon/ico", null, { extension: "ico" }),
        sol.common.RepoUtils.downloadToFileData(childRepoPath + "/Icon/bmp", null, { extension: "bmp" }),
        sol.common.RepoUtils.downloadToFileData(childRepoPath + "/Icon/jpg", null, { extension: "jpg" }),
        sol.common.RepoUtils.downloadToFileData(childRepoPath + "/Icon/png", null, { extension: "png" })
      ],
      [
        sol.common.RepoUtils.downloadToFileData(childRepoPath + "/Disabled icon/ico", null, { extension: "ico" }),
        sol.common.RepoUtils.downloadToFileData(childRepoPath + "/Disabled icon/bmp", null, { extension: "bmp" }),
        sol.common.RepoUtils.downloadToFileData(childRepoPath + "/Disabled icon/jpg", null, { extension: "jpg" }),
        sol.common.RepoUtils.downloadToFileData(childRepoPath + "/Disabled icon/png", null, { extension: "png" })
      ],
      [
        sol.common.RepoUtils.downloadToFileData(childRepoPath + "/Link icon/ico", null, { extension: "ico" }),
        sol.common.RepoUtils.downloadToFileData(childRepoPath + "/Link icon/bmp", null, { extension: "bmp" }),
        sol.common.RepoUtils.downloadToFileData(childRepoPath + "/Link icon/jpg", null, { extension: "jpg" }),
        sol.common.RepoUtils.downloadToFileData(childRepoPath + "/Link icon/png", null, { extension: "png" })
      ],
      config.extensions, true);

    if (result) {
      displayContent.push("<li>" + config.name + " (ID " + config.id + ")</li>");
    }
  }

  displayContent.push("</ul>");
  workspace.showInfoBox("ELO", displayContent.join(""));
}

function changeOwnerToAdministrator() {
  var view, element;

  workspace.setWaitCursor();

  view = workspace.activeView;
  element = view.firstSelected;

  if (!element) {
    return;
  }

  sol.common.RepoUtils.changeOwnerRecursively(element.id);

  workspace.updateSordLists();
  workspace.setNormalCursor();
  workspace.setStatusMessage("");
  workspace.setFeedbackMessage("Owner set");
}

function getExtendWfRightsConfig() {
  var extendWfRightsValue,
      extendWfRightsConfig = {},
      extendWfRightsBitInteger, extendWfRightsFlags, right, flagPos, resultString;

  extendWfRightsFlags = {
    temporaryRead: 0,
    temporaryWrite: 1,
    temporaryDelete: 2,
    temporaryEdit: 3,
    temporaryList: 4,
    permanentRead: 8,
    permanentWrite: 9,
    permanentDelete: 10,
    permanentEdit: 11,
    permanentList: 12
  };

  extendWfRightsValue = workspace.showInputBox("ELO", "Extend workflow rights value", "", 1, 5, false, -1);

  extendWfRightsBitInteger = new java.math.BigInteger(extendWfRightsValue);

  extendWfRightsConfig.extendWfRightsValue = extendWfRightsBitInteger.intValue();

  for (right in extendWfRightsFlags) {
    flagPos = extendWfRightsFlags[right];
    if (containsFlag(extendWfRightsBitInteger, flagPos)) {
      extendWfRightsConfig[right] = 1;
    }
  }

  resultString = JSON.stringify(extendWfRightsConfig, null, 2);

  sol.common.jc.ClipboardUtils.setText(resultString);

  workspace.showInfoBox("Extend workflow rights configuration", resultString);
}

function containsFlag(value, flagPos) {
  var valueBigInteger, flagBigInteger, zeroBigInteger, result;

  valueBigInteger = new java.math.BigInteger(value);
  flagBigInteger = new java.math.BigInteger(2).pow(flagPos);
  zeroBigInteger = new java.math.BigInteger(0);

  result = !valueBigInteger.and(flagBigInteger).equals(zeroBigInteger);

  return result;
}

function downloadSordMapBlobs() {
  var objId, mapEntries, i, mapEntry, baseDirPath, baseDir, content, fileName;

  baseDirPath = "c:/temp/MapBlobs/";
  baseDir = new java.io.File(baseDirPath);

  Packages.org.apache.commons.io.FileUtils.forceMkdir(baseDir);
  sol.common.FileUtils.delete(baseDir, { quietly: true });

  objId = workspace.activeView.firstSelected.id;

  mapEntries = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, objId, null, LockC.NO).items;

  for (i = 0; i < mapEntries.length; i++) {
    mapEntry = mapEntries[i];
    content = sol.common.SordUtils.getBlobDataFromMapEntry(mapEntry);
    if (content && (content.length > 0)) {
      fileName = baseDirPath + mapEntry.key + ".json";
      sol.common.FileUtils.writeStringToFile(fileName, content);
    }
  }

  java.awt.Desktop.desktop.open(baseDir);
}

function resetBatchimportStatus() {
  var view, batchImportDataMapKey, batchImportStatusMapKey, sord, dataArr, i, row, statusObj;

  batchImportDataMapKey = "SOL_BATCHIMPORT_DATA";
  batchImportStatusMapKey = "SOL_BATCHIMPORT_STATUS";

  view = workspace.activeView;
  sord = view.firstSelected.sord;

  dataArr = sol.common.SordUtils.getObjectMapBlob({ mapId: sord.id, key: batchImportDataMapKey });

  for (i = 0; i < dataArr.length; i++) {
    row = dataArr[i];
    row.status = "NEW";
  }

  sol.common.SordUtils.setObjectMapBlob({ mapId: sord.id, key: batchImportDataMapKey, value: dataArr });

  statusObj = sol.common.SordUtils.getObjectMapBlob({ mapId: sord.id, key: batchImportStatusMapKey });
  statusObj.status = "IDLE";

  sol.common.SordUtils.setObjectMapBlob({ mapId: sord.id, key: batchImportStatusMapKey, value: statusObj });

  view.refresh();

  workspace.setFeedbackMessage("Batch import status resetted");
}

function convertToInternalDate() {
  var info, view, sordId, isoDate, internalDate, sql;

  view = workspace.activeView;
  sordId = view.firstSelected.id;

  isoDate = workspace.showInputBox("ELO", "ISO date", "", 8, 14, false, -1);

  internalDate = sol.common.SordUtils.getInternalDate(isoDate);

  sql = "UPDATE objekte SET objidate='" + internalDate + "' WHERE objid='" + sordId + "'";

  info = ["<h3>Internal date</h3>"];
  info.push("isoDate=" + isoDate);
  info.push("<br/>internalDate=" + internalDate);
  info.push("<br/>sql=" + sql);

  sol.common.jc.ClipboardUtils.setText(sql);

  info.push("<br/><br/>SQL copied to clipboard.");

  workspace.showInfoBox("ELO", info.join(""));
}

function handoffToServiceUser() {
  sol.dev_internal.jc.Tasks.handOffToServiceUser();
}

function showJavaInfo() {
  Packages.javafx.application.Platform.runLater({
    run: function () {
      var javaVersion, webview, info, userAgent, javaFxVersion,
          context;

      info = ["<h3>Java</h3>"];
      javaVersion = sol.common.ExecUtils.getJavaVersion();
      info.push("java.version=" + javaVersion);
      info.push("<br>java.home=" + java.lang.System.getProperty("java.home"));
      info.push("<br><br><h3>Webkit</h3>");
      webview = new Packages.javafx.scene.web.WebView();
      userAgent = webview.getEngine().getUserAgent();
      info.push("userAgent=" + userAgent);
      javaFxVersion = java.lang.System.getProperty("javafx.runtime.version");
      info.push("<br>javafx.version=" + javaFxVersion);
      info.push("<br><br><h3>Rhino</h3>");
      context = Packages.org.mozilla.javascript.Context.currentContext;
      info.push("version=" + context.implementationVersion);
      info.push("<br>optimizationLevel=" + context.optimizationLevel);
      info.push("<br>languageVersion=" + context.languageVersion);
      workspace.showInfoBox("ELO", info.join(""));
    }
  });
}

function showMaskInfo() {
  var sord, docMask, json, tempDir, jsonFilePath, jsonFile;

  sord = workspace.activeView.firstSelected.sord;

  docMask = ixConnect.ix().checkoutDocMask(sord.maskName, DocMaskC.mbAll, LockC.NO);

  json = sol.common.JsonUtils.serialize(docMask);

  tempDir = sol.common.FileUtils.createTempDir("Mask");

  jsonFilePath = tempDir.canonicalPath + File.separator + docMask.name + ".json";

  sol.common.FileUtils.writeStringToFile(jsonFilePath, json);

  jsonFile = new File(jsonFilePath);

  java.awt.Desktop.desktop.open(jsonFile);
}

function getTicket() {
  var info = [],
      userName, ticket;

  userName = ixConnect.loginResult.user.name;
  ticket = ixConnect.loginResult.clientInfo.ticket;

  info = ["<h3>Ticket</h3>"];
  info.push("user=" + userName);
  info.push("<br/>ticket=" + ticket);

  sol.common.jc.ClipboardUtils.setText(ticket);

  info.push("<br/><br/>Ticket copied to clipboard.");

  workspace.showInfoBox("ELO", info.join(""));
}

function showSessions() {
  var lines, sessionInfos, i, sessionInfo, csvFilePath;

  lines = ["UserId;UserName;Ticket;Computer;AppName"];

  sessionInfos = ixConnect.ix().getSessionInfos(new SessionInfoParams());

  for (i = 0; i < sessionInfos.length; i++) {
    sessionInfo = sessionInfos[i];
    lines.push(sessionInfo.userId + ";" + sessionInfo.userName + ";" + sessionInfo.ticket + ";" + sessionInfo.clientComputer + ";" + sessionInfo.appName);
  }

  csvFilePath = sol.common.FileUtils.getTempDirPath() + File.separator + "Sessions_" + sol.common.FileUtils.getTimeStampString() + ".csv";

  sol.common.FileUtils.writeStringToFile(csvFilePath, lines.join("\r\n"));

  java.awt.Desktop.desktop.open(new File(csvFilePath));
}

function taskInfo() {
  sol.dev_internal.jc.Tasks.showTaskInfo();
}

function getMD5() {
  var firstSelected, md5;

  firstSelected = workspace.activeView.firstSelected;
  if (firstSelected && firstSelected.sord && firstSelected.sord.docVersion) {
    md5 = firstSelected.sord.docVersion.md5;
    sol.common.jc.ClipboardUtils.setText(md5);

    workspace.showInfoBox("ELO", "<h3>MD5:</h3><br>" + md5);
  }
}

function eloInsertDocumentEnd(archiveDocument) {
  sol.dev_internal.jc.Git.copyFilesToGit(archiveDocument);
}

function eloInsertFolderEnd(structureDocument) {
  sol.dev_internal.jc.Git.copyFilesToGit(structureDocument);
}

function eloUpdateVersion(editInfo, file) {
  var objId, archiveDocument;
  objId = editInfo.sord.id;
  if (objId > -1) {
    archiveDocument = archive.getElement(editInfo.sord.id);
    sol.dev_internal.jc.Git.copyFilesToGit(archiveDocument, file);
  }
}

