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
 * @member global.dev_internal.JavaClientEvents
 * Event handler that is called after the workspace is started.
 * This function enables the script buttons for the common processing.
 * The function generateScriptVersionList only available for folders
 */
function eloWorkspaceStarted() {
  workspace.setScriptButtonEnabled(662, true, true, false, true, false, false);
}

/**
 * @member global.dev_internal.JavaClientEvents
 */
function getExtraTabs() {
  return sol.dev_internal.extraTabNo + ",Development Internal";
}

/**
 * @member global.dev_internal.JavaClientEvents
 * Event handler that returns the custom bands data.
 */
function getExtraBands() {
  var bandNo = sol.dev_internal.bandBaseNo,
      bands = [];

  bands.push("Development Internal" + "," + (bandNo++) + "," + "Jira");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "Git");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "Docker");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "JavaDoc");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "Logs");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "Reload");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "Debug");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "Encryption");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "Edit");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "Delete");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "SQL");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "License");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "IX Plug-ins");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "DX");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "Tools");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "Info");
  bands.push("Development Internal" + "," + (bandNo++) + "," + "Action");

  bands.push("workflow,61,Development");

  return bands.join(";");
}

/**
 * @member global.dev_internal.JavaClientEvents
 * Event handler that returns the script button positions.
 */
function getScriptButtonPositions() {
  var positions = [];

  if (!workspace.userRights.hasAdminRight()) {
    return "";
  }

  positions.push("500," + "Development Internal" + "," + "Jira");
  positions.push("501," + "Development Internal" + "," + "Git");
  positions.push("502," + "Development Internal" + "," + "Git");
  positions.push("503," + "Development Internal" + "," + "Git");
  positions.push("504," + "Development Internal" + "," + "Docker");
  positions.push("505," + "Development Internal" + "," + "Docker");
  positions.push("506," + "Development Internal" + "," + "Docker");
  positions.push("507," + "Development Internal" + "," + "Docker");
  positions.push("508," + "Development Internal" + "," + "Docker");
  positions.push("509," + "Development Internal" + "," + "Docker");
  positions.push("510," + "Development Internal" + "," + "Docker");
  positions.push("511," + "Development Internal" + "," + "JavaDoc");
  positions.push("515," + "Development Internal" + "," + "Logs");
  positions.push("516," + "Development Internal" + "," + "Logs");
  positions.push("517," + "Development Internal" + "," + "Logs");
  positions.push("518," + "Development Internal" + "," + "Logs");
  positions.push("519," + "Development Internal" + "," + "Reload");
  positions.push("520," + "Development Internal" + "," + "Debug");
  positions.push("521," + "Development Internal" + "," + "Debug");
  positions.push("522," + "Development Internal" + "," + "Encryption");
  positions.push("523," + "Development Internal" + "," + "Encryption");
  positions.push("524," + "Development Internal" + "," + "Edit");
  positions.push("525," + "Development Internal" + "," + "Delete");
  positions.push("535," + "Development Internal" + "," + "SQL");
  positions.push("540," + "Development Internal" + "," + "License");
  positions.push("541," + "Development Internal" + "," + "License");
  positions.push("542," + "Development Internal" + "," + "IX Plug-ins");
  positions.push("543," + "Development Internal" + "," + "IX Plug-ins");
  positions.push("544," + "Development Internal" + "," + "DX");
  positions.push("546," + "Development Internal" + "," + "Tools");
  positions.push("547," + "Development Internal" + "," + "Tools");
  positions.push("549," + "Development Internal" + "," + "Tools");
  positions.push("550," + "Development Internal" + "," + "Tools");
  positions.push("551," + "Development Internal" + "," + "Tools");
  positions.push("552," + "Development Internal" + "," + "Tools");
  positions.push("553," + "Development Internal" + "," + "Tools");
  positions.push("554," + "Development Internal" + "," + "Tools");
  positions.push("555," + "Development Internal" + "," + "Tools");
  positions.push("556," + "Development Internal" + "," + "Tools");
  positions.push("557," + "Development Internal" + "," + "Tools");
  positions.push("558," + "Development Internal" + "," + "Tools");
  positions.push("559," + "Development Internal" + "," + "Tools");
  positions.push("560," + "Development Internal" + "," + "Info");
  positions.push("561," + "Development Internal" + "," + "Info");
  positions.push("562," + "Development Internal" + "," + "Info");
  positions.push("563," + "Development Internal" + "," + "Info");
  positions.push("570," + "Development Internal" + "," + "Create Json Configuration");

  positions.push("580,workflow,Development");
  positions.push("581,workflow,Development");

  return positions.join(";");
}


function getScriptButton500Name() {
  return "Jira";
}

function eloScriptButton500Start() {
  var jiraUrl;

  jiraUrl = "http://tickets.elo.local/secure/Dashboard.jspa";

  java.awt.Desktop.desktop.browse(new java.net.URI(jiraUrl));
}

function getScriptButton501Name() {
  return "SourceTree";
}

function eloScriptButton501Start() {
  var sourceTreeFilePath;

  sourceTreeFilePath = sol.common.ExecUtils.getUserProfileDir() + "\\AppData\\Local\\SourceTree\\SourceTree.exe";

  sol.common.ExecUtils.startProcess([sourceTreeFilePath], { wait: false });
}

/**
 * @member global.dev_internal.JavaClientEvents
 */
function getScriptButton502Name() {
  return "PowerShell";
}

function eloScriptButton502Start() {
  var gitDirPath = "c:\\Git\\solutions",
      name = "common",
      projectDirPath, firstSelected;

  firstSelected = workspace.activeView.firstSelected;
  if (firstSelected) {
    name = firstSelected.name;
  }

  projectDirPath = gitDirPath + "\\" + name + ".git";

  if (!sol.common.FileUtils.exists(projectDirPath)) {
    projectDirPath = gitDirPath + "\\common.git";
  }

  sol.common.ExecUtils.startProcess(["cmd", "/c", "start", "powershell.exe"], { dir: projectDirPath, wait: false });
}

/**
 * @member global.dev_internal.JavaClientEvents
 */
function getScriptButton503Name() {
  return "GitLab";
}

function eloScriptButton503Start() {
  var gitLabUrl;

  gitLabUrl = "http://git.elo.local";

  java.awt.Desktop.desktop.browse(new java.net.URI(gitLabUrl));
}

/**
 * @member global.dev_internal.JavaClientEvents
 */
function getScriptButton504Name() {
  return "Rancher";
}

function eloScriptButton504Start() {
  var rancherUrl;

  rancherUrl = "http://rancher.elo.local";

  java.awt.Desktop.desktop.browse(new java.net.URI(rancherUrl));
}

function getScriptButton505Name() {
  return "Stack";
}

function getStackHost() {

  var matches, ixUrl, stackHost;

  ixUrl = ixConnect.endpointUrl + "";
  matches = ixUrl.match(/(?:^http:\/\/)([^\/]*)/);
  stackHost = matches[1];

  return stackHost;
}

function eloScriptButton505Start() {
  var stackUrl;

  stackUrl = "http://" + getStackHost();

  java.awt.Desktop.desktop.browse(new java.net.URI(stackUrl));
}

function getScriptButton506Name() {
  return "Tomcat";
}

function eloScriptButton506Start() {
  var tomcatUrl;

  tomcatUrl = "http://admin:elo@" + getStackHost() + "/manager/html/";

  java.awt.Desktop.desktop.browse(new java.net.URI(tomcatUrl));
}

function getScriptButton507Name() {
  return "Admin Console";
}

function eloScriptButton507Start() {
  var adminConsoleUrl;

  adminConsoleUrl = "http://" + getStackHost() + "/AdminConsole/ui/menu/index.xhtml";

  java.awt.Desktop.desktop.browse(new java.net.URI(adminConsoleUrl));
}

function getScriptButton508Name() {
  return "App Manager";
}

function eloScriptButton508Start() {
  var appManagerUrl;

  appManagerUrl = "http://" + getStackHost() + "/wf-Solutions/apps/app/elo.webapps.AppManager/";

  java.awt.Desktop.desktop.browse(new java.net.URI(appManagerUrl));
}

function getScriptButton509Name() {
  return "Web Client";
}

function eloScriptButton509Start() {
  var chromePath, webClientUrl;

  webClientUrl = "http://" + getStackHost() + "/web-Solutions/";

  chromePath = sol.common.ExecUtils.getProgramFilesX86Dir() + File.separator + "Google" + File.separator + "Chrome" + File.separator + "Application" + File.separator + "Chrome.exe";

  sol.common.ExecUtils.startProcess([chromePath, "--start-maximized", webClientUrl], { wait: false });
}

function getScriptButton510Name() {
  return "pgAdmin";
}

function eloScriptButton510Start() {
  var dbUrl;

  dbUrl = "http://db." + getStackHost();

  java.awt.Desktop.desktop.browse(new java.net.URI(dbUrl));
}

function getScriptButton511Name() {
  return "IX API";
}

function eloScriptButton511Start() {
  var appManagerUrl;

  appManagerUrl = "http://" + getStackHost() + "/ix-Solutions/doc/EloixClient-javadoc.jar/index.html";

  java.awt.Desktop.desktop.browse(new java.net.URI(appManagerUrl));
}


function getScriptButton515Name() {
  return "ELO data";
}

function eloScriptButton515Start() {
  var eloDataUrl;

  eloDataUrl = "http://" + getStackHost() + "/elo-data/";

  java.awt.Desktop.desktop.browse(new java.net.URI(eloDataUrl));
}

function getScriptButton516Name() {
  return "IX log";
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


function eloScriptButton516Start() {

  openRemoteFile("/elo-data/logs/ELO-base/ix-Solutions.log");
}

function getScriptButton517Name() {
  return "AS log";
}

function eloScriptButton517Start() {

  openRemoteFile("/elo-data/logs/ELO-base/as-Solutions.log");
}

function getScriptButton518Name() {
  return "WF log";
}

function eloScriptButton518Start() {

  openRemoteFile("/elo-data/logs/ELO-base/wf-Solutions.log");
}

function getScriptButton519Name() {
  return "Reload IX";
}

function eloScriptButton519Start() {
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

function getScriptButton520Name() {
  return "Open in Chrome";
}

function eloScriptButton520Start() {
  var url, browserComponent, chromePath;

  browserComponent = workspace.workspace.view.formularPanel.browserComponent;

  if (!browserComponent) {
    return;
  }

  url = browserComponent.document.documentURI;

  if (!url || (url == "about:blank")) {
    return;
  }

  chromePath = sol.common.ExecUtils.getProgramFilesX86Dir() + File.separator + "Google" + File.separator + "Chrome" + File.separator + "Application" + File.separator + "Chrome.exe";

  sol.common.ExecUtils.startProcess([chromePath, "--start-maximized", "--auto-open-devtools-for-tabs", url], { wait: false });
}

function getScriptButton521Name() {
  return "ELOas Debugger";
}

function eloScriptButton521Start() {
  var asDebugPath;

  asDebugPath = sol.common.ExecUtils.getProgramFilesX86Dir() + File.separator + "ELOas Debugger" + File.separator + "EloAsDebug.exe";

  sol.common.ExecUtils.startProcess([asDebugPath], { wait: false });
}

function getScriptButton522Name() {
  return "Encrypt string";
}

function eloScriptButton522Start() {
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

function getScriptButton523Name() {
  return "Decrypt string";
}

function eloScriptButton523Start() {
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

function getScriptButton524Name() {

  return "Edit with VSCode";
}

function eloScriptButton524Start() {
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

/**
 * @member global.dev_internal.JavaClientEvents
 */
function getScriptButton525Name() {
  return "Delete";
}

function eloScriptButton525Start() {
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

/**
 * @member global.dev_internal.JavaClientEvents
 */
function getScriptButton535Name() {
  return "Build SQL scripts";
}

function eloScriptButton535Start() {
  sol.dev_internal.jc.BuildSqlScripts.execute();
}

/**
 * @member global.dev_internal.JavaClientEvents
 */
function getScriptButton540Name() {
  return "Check licenses";
}

function eloScriptButton540Start() {
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

function getScriptButton541Name() {
  return "Create Mini App License";
}

function eloScriptButton541Start() {
  sol.dev_internal.jc.CreateMiniAppLicense.execute();
}

function getScriptButton542Name() {
  return "Install IX Plug-in";
}

function eloScriptButton542Start() {
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

function getScriptButton543Name() {
  return "Show IX Plug-ins";
}

function eloScriptButton543Start() {
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

function getScriptButton544Name() {
  return "Apply DX XML";
}

function eloScriptButton544Start() {
  var view, xmlContent;
  view = workspace.activeView;
  xmlContent = org.apache.commons.io.FileUtils.readFileToString(new File("c:\\temp\\Export.xml"), "UTF-8");
  sol.common.IxUtils.execute("RF_sol_connector_dx_service_DxImporter", { subsystem: "Invoice", docClass: "Invoice/Default", objId: view.firstSelected.id, xmlContent: xmlContent });
  workspace.setFeedbackMessage("DX XML applied.");
}

function getScriptButton546Name() {
  return "Decode ACL String";
}

function eloScriptButton546Start() {
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

function getScriptButton547Name() {
  return "Set owner";
}

function eloScriptButton547Start() {
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

function getScriptButton548Name() {
  return "Extract Zugferd";
}

function eloScriptButton548Start() {
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

/**
 * @member global.dev_internal.JavaClientEvents
 */
function getScriptButton549Name() {
  return "Set mask 'ELOscripts'";
}

function eloScriptButton549Start() {
  sol.dev_internal.jc.SetMask.execute("ELOscripts");
}

/**
 * @member global.dev_internal.JavaClientEvents
 */
function getScriptButton550Name() {
  return "Set mask 'Basic Entry'";
}

function eloScriptButton550Start() {
  sol.dev_internal.jc.SetMask.execute("Basic Entry");
}

/**
 * @member global.dev_internal.JavaClientEvents
 */
function getScriptButton551Name() {
  return "Move all documents to ELOSYS";
}

function eloScriptButton551Start() {
  sol.dev_internal.jc.MoveToStoragePath.execute();
}

/**
 * @member global.dev_internal.JavaClientEvents
 */
function getScriptButton552Name() {
  return "Reset rights recursive";
}

function eloScriptButton552Start() {
  sol.dev_internal.jc.ResetRights.execute();
}

function getScriptButton553Name() {
  return "Install sord types";
}

function eloScriptButton553Start() {
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

function getScriptButton554Name() {
  return "Change owner recursively to 'Administrator'";
}

function eloScriptButton554Start() {
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

function getScriptButton555Name() {
  return "Empty sord type";
}

function eloScriptButton555Start() {
  var view, elements, element;

  view = workspace.activeView;
  if (!(view instanceof ArchiveViewAdapter)) {
    return;
  }
  workspace.setWaitCursor();
  elements = view.allSelected;
  while (elements.hasMoreElements()) {
    element = elements.nextElement();
    element.setObjKeyValue("SOL_TYPE", "");
    element.saveSord();
  }
  workspace.setNormalCursor();
  view.refreshArchive();
}

function getScriptButton556Name() {
  return "Create doc mask line templates";
}

function eloScriptButton556Start() {
  var i, checkInDocMaskLineTemplateOptions, docMaskLineTemplate, numberString;

  checkInDocMaskLineTemplateOptions = new CheckInDocMaskLineTemplateOptions();

  for (i = 1; i < 79; i++) {

    docMaskLineTemplate = new DocMaskLineTemplate();
    numberString = sol.common.StringUtils.padLeft(i, 2);
    docMaskLineTemplate.key = "FIELD" + numberString;
    docMaskLineTemplate.name = "Field " + numberString;

    ixConnect.ix().checkinDocMaskLineTemplate(docMaskLineTemplate, DocMaskLineTemplateC.mbAll, checkInDocMaskLineTemplateOptions, LockC.NO);
  }

  workspace.setFeedbackMessage("Doc mask line templates created.");
}

function getScriptButton557Name() {
  return "Download Sord map blobs";
}

function eloScriptButton557Start() {
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

function getScriptButton558Name() {
  return "Reset batchimport status";
}

function eloScriptButton558Start() {
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

function getScriptButton559Name() {
  return "Convert to internal date";
}

function eloScriptButton559Start() {
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

function getScriptButton560Name() {
  return "Show Java info";
}

function eloScriptButton560Start() {
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

function getScriptButton561Name() {
  return "Show mask info";
}

function eloScriptButton561Start() {
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

function getScriptButton562Name() {
  return "Get ticket";
}

function eloScriptButton562Start() {
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

function getScriptButton563Name() {
  return "Show sessions";
}

function eloScriptButton563Start() {
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

function getScriptButton580Name() {
  return "Task info";
}

function eloScriptButton580Start() {
  sol.dev_internal.jc.Tasks.showTaskInfo();
}

function getScriptButton581Name() {
  return "Hand-off to service user";
}

function eloScriptButton581Start() {
  sol.dev_internal.jc.Tasks.handOffToServiceUser();
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

