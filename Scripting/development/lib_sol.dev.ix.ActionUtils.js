
//@include lib_Class.js

/**
 * Utility functions for action handling.
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.Map
 * @requires sol.common.RepoUtils
 */
sol.define("sol.dev.ix.ActionUtils", {
  singleton: true,

  /**
   * Starts the workflow defined in the configuration: `dev.requestWorkflows.createAction.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @return {String} The flowId of the new workflow
   */
  startCreateActionWorkflow: function (objId, wfName) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.dev.requestWorkflows.createAction.workflowTemplateName, wfName, objId);
  },

  /**
   * Loads the configuration from the JSON dev: `/Administration/Business Solutions/development_internal/Configuration/dev.config`
   * @return {Object}
   */
  loadConfigDev: function () {
    var me = this;
    me.config = sol.create("sol.common.Config", { compose: "/development/Configuration/dev.config" }).config;
    return me.config;
  },

  /**
   * Loads the configuration from the JSON dev: `/Administration/Business Solutions/development_internal/Configuration/dev.config`
   * @return {Object}
   */
  loadConfigDevInternal: function () {
    var me = this;
    me.config = sol.create("sol.common.Config", { compose: "/development_internal/Configuration/dev_internal.config" }).config;
    return me.config;
  },

  /**
   * Sets the logger object from using class
   * @param {Object} classLogger
   */
  setLogger: function (classLogger) {
    var me = this;

    me.logger = classLogger;
  },

  /**
   * Sets the logger object from using class
   * @param {String} classObjId
   */
  setObjId: function (classObjId) {
    var me = this;

    me.objId = classObjId;
  },

  /**
   * Checks, if an de.elo.ix.client.Sord is from type JSON-Configuration
   * @param {de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  isJsonConfig: function (sord) {
    var myconfig;

    try {
      myconfig = sol.create("sol.common.Config", { load: sord.id }).config;
    } catch (ex) {
    }
    if (myconfig) {
      return true;
    }
    return false;
  },

  /**
   * Recursively merge properties of two objects
   * @param {Object} obj1 JSON-Configuration
   * @param {Object} obj2 JSON-Configuration
   * @return {Object} Merged JSON-Configuration
   */
  mergeRecursive: function (obj1, obj2) {
    var me = this,
        p;

    for (p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor == Object) {
          obj1[p] = me.mergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch (e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  },

  /**
   * @private
   * @param {String} objId
   * @return {Object}
   */
  getcomponentSord: function (objId) {
    var folderSord, packSord;

    folderSord = ixConnect.ix().checkoutSord(objId, EditInfoC.mbAll, LockC.NO).sord;
    packSord = ixConnect.ix().checkoutSord(folderSord.parentId, EditInfoC.mbAll, LockC.NO).sord;
    return packSord;
  },

  /**
   * @private
   * @param {Object} objSord
   * @return {Object}
   */
  getSolutionSord: function (objSord) {
    var me = this,
        solId, solSord;

    if (me.config.solPath) {
      solId = sol.common.RepoUtils.preparePath(me.config.solPath, { data: objSord });
      solSord = ixConnect.ix().checkoutSord(solId, EditInfoC.mbAll, LockC.NO).sord;
    }
    return solSord;
  },

  /**
   * @private
   * @param {Object} objSord
   */
  processComponent: function () {
    var me = this,
        objSord, tempSord, tempconf, map, i, j,
        folder, mode, type, wftemplate, references,
        sordfs, sordf, sordps, sordp, solId, targetId;

    objSord = ixConnect.ix().checkoutSord(me.objId, EditInfoC.mbAll, LockC.NO).sord;
    tempSord = sol.common.SordUtils.getTemplateSord(objSord);

    targetId = sol.common.RepoUtils.preparePath(me.config.newComponentPath, { data: objSord });
    me.moveSord(me.objId, targetId);

    tempconf = me.loadTemplateConfig(me.objId);

    if (tempconf.mapfields) {
      map = sol.create("sol.common.Map", {
        objId: me.objId
      });
      map.read();
      for (i = 0; i < tempconf.mapfields.length; i++) {
        map.setValue(tempconf.mapfields[i].key, tempconf.mapfields[i].value);
      }
      map.write();
    }
    objSord = ixConnect.ix().checkoutSord(me.objId, EditInfoC.mbAll, LockC.NO).sord;
    tempSord = sol.common.SordUtils.getTemplateSord(objSord);

    if (tempconf.jobs) {
      for (i = 0; i < tempconf.jobs.length; i++) {
        folder = tempconf.jobs[i].folder;
        mode = tempconf.jobs[i].mode;
        type = tempconf.jobs[i].type;
        wftemplate = tempconf.jobs[i].wftemplate;
        references = tempconf.jobs[i].references;
        if (folder) {
          me.generateEntry(me.objId, tempSord, folder, mode, type, references);
          me.logger.info(["generate component folder {0} sord (objId={1}): ", folder, me.objId]);
        }
        if (wftemplate) {
          me.generateWfTemplate(tempSord, wftemplate, type);
          me.logger.info(["generate wftemplate {0}): ", wftemplate]);
        }
      }
    }

    sordfs = sol.common.RepoUtils.findChildren(me.objId, { recursive: false, level: 1, includeDocuments: false, includeFolders: true, includeReferences: false });
    for (i = 0; i < sordfs.length; i++) {
      sordf = sordfs[i];

      // Move Business Solutions
      if (sordf.name == "Business Solutions") {
        sordps = sol.common.RepoUtils.findChildren(sordf.id, { recursive: false, level: 1, includeDocuments: false, includeFolders: true, includeReferences: false });
        for (j = 0; j < sordps.length; j++) {
          sordp = sordps[j];
          solId = sol.common.RepoUtils.preparePath(me.config.solutionFolderPath);
          me.moveSord(sordp.id, solId);
        }
      }
      // Move Business Solutions Custom
      if (sordf.name == "Business Solutions Custom") {
        sordps = sol.common.RepoUtils.findChildren(sordf.id, { recursive: false, level: 1, includeDocuments: false, includeFolders: true, includeReferences: false });
        for (j = 0; j < sordps.length; j++) {
          sordp = sordps[j];
          solId = sol.common.RepoUtils.preparePath(me.config.customSolutionFolderPath);
          me.moveSord(sordp.id, solId);
        }
      }
    }
  },

  /**
   * @private
   * @return {Object}
   */
  loadTemplateConfig: function () {
    var me = this,
        sord, sords, i, tempconf;

    sords = sol.common.RepoUtils.findChildren(me.objId, { recursive: true, level: 2, includeDocuments: true, includeFolders: false, includeReferences: false });
    for (i = 0; i < sords.length; i++) {
      sord = sords[i];
      if (sord.name == "template.config") {
        tempconf = sol.create("sol.common.Config", { load: sord.id }).config;
      }
    }
    return tempconf;
  },

  /**
   * @private
   * @param {Object} objSord
   * @param {Object[]} references
   */
  generateReferences: function (objSord, references) {
    var me = this,
        searchConfig = {},
        packSord, i, j, reference,
        folderFromId, folderToId,
        sordfs, sordf;

    packSord = me.getSolutionSord(objSord);

    for (i = 0; i < references.length; i++) {
      reference = references[i];
      if (reference.from) {
        folderFromId = me.getSubFolderId(packSord.id, reference.from);
        if (reference.to) {
          folderToId = sol.common.RepoUtils.preparePath(reference.to);
          searchConfig = {};
          if (reference.document) {
            searchConfig.includeDocuments = true;
          }
          if (reference.folder) {
            searchConfig.includeFolders = true;
          }
          searchConfig.recursive = true;
          searchConfig.level = -1;
          searchConfig.includeReferences = false;

          sordfs = sol.common.RepoUtils.findChildren(folderFromId, searchConfig);
          for (j = 0; j < sordfs.length; j++) {
            sordf = sordfs[j];
            ixConnect.ix().refSord("", folderToId, sordf.id, -1);
          }
        }
      }
    }
  },

  /**
   * @private
   * @param {Object} tempSord
   * @param {Object} wftemplate
   * @param {String} type
   */
  generateWfTemplate: function (tempSord, wftemplate, type) {
    var me = this,
        tpl, wfName;

    if (type == "CREATEWFTEMPLATE") {
      tpl = sol.create("sol.common.Template", { source: wftemplate });
      wfName = tpl.apply(tempSord);
      me.createWorkflowTemplate(wfName);
    }
  },

  /**
   * @private
   * @param {String} objId
   * @param {Object} tempSord
   * @param {Object} folder
   * @param {String} mode
   * @param {String} type
   * @param {Object[]} references
   */
  generateEntry: function (objId, tempSord, folder, mode, type, references) {
    var me = this,
        folderId, sordf, sordfs, i,
        packSord, targetId, objSord,
        oldDocuments, oldFolderId;

    oldDocuments = me.getOldDocuments(objId, folder, type);
    folderId = me.getSubFolderId(objId, folder);
    sordfs = sol.common.RepoUtils.findChildren(folderId, { recursive: true, level: -1, includeDocuments: true, includeFolders: true, includeReferences: false });
    if (mode == "SINGLE") {
      // delete all Subfolder
      for (i = 0; i < sordfs.length; i++) {
        sordf = sordfs[i];
        if (sol.common.SordUtils.isFolder(sordf)) {
          sol.common.RepoUtils.deleteSord(sordf.id);
        }
      }
      sordfs = sol.common.RepoUtils.findChildren(folderId, { recursive: true, level: -1, includeDocuments: true, includeFolders: true, includeReferences: false });
    }
    for (i = 0; i < sordfs.length; i++) {
      sordf = sordfs[i];
      sordf = me.generateSordNameDesc(tempSord, sordf);
      oldDocuments = me.generateDocumentContent(tempSord, sordf, type, oldDocuments);
    }
    me.processOldDocuments(oldDocuments, folderId);
    objSord = ixConnect.ix().checkoutSord(me.objId, EditInfoC.mbAll, LockC.NO).sord;
    packSord = me.getSolutionSord(objSord);
    if (packSord) {
      targetId = packSord.id;
      if (type != "IMPORTWORKFLOW") {
        oldFolderId = me.getSubFolderId(targetId, folder);
        me.moveSord(folderId, targetId);
        if (oldFolderId) {
          sol.common.RepoUtils.deleteSord(oldFolderId);
        }
        if (references) {
          me.generateReferences(objSord, references);
          me.logger.info(["generate references {0}): ", references]);
        }
      }
    }
  },

  /**
   * @private
   * @param {Object} sordf
   * @param {String} wfName
   */
  importWorkflow: function (sordf, wfName) {
    var me = this,
        wfData, workflowImportOptions;

    wfName = me.createWorkflowName(wfName);
    workflowImportOptions = new WorkflowImportOptions();
    wfData = sol.common.RepoUtils.downloadToByteArray(sordf.id, null);
    ixConnect.ix().importWorkFlow2(wfName, wfData, workflowImportOptions);

  },

  /**
   * @private
   * @param {String} wfName
   * @return {Boolean}
   */
  existWorkflowTemplate: function (wfName) {
    var info, wfs;

    info = new FindWorkflowInfo();
    info.type = WFTypeC.TEMPLATE;
    info.name = wfName;

    wfs = sol.common.WfUtils.findWorkflows(info);
    if (wfs) {
      if (wfs.length > 0) {
        return true;
      }
    }
    return false;
  },

  /**
   * @private
   * @param {String} wfName
   * @return {String}
   */
  createWorkflowName: function (wfName) {
    var me = this,
        wfVersion, wfNameNew;

    // Check, if template already exists
    wfVersion = 1;
    if (me.existWorkflowTemplate(wfName)) {
      wfNameNew = wfName + "(" + wfVersion + ")";
      while (me.existWorkflowTemplate(wfNameNew)) {
        wfVersion++;
        wfNameNew = wfName + "(" + wfVersion + ")";
      }
      wfName = wfNameNew;
    }
    return wfName;
  },

  /**
   * @private
   * @param {String} wfName
   */
  createWorkflowTemplate: function (wfName) {
    var me = this,
        wf, wfNode, wfNodeAssoc, wfNodes, wfMatrixAssocs;

    wfName = me.createWorkflowName(wfName);

    // Initialize workflow object.
    wf = ixConnect.ix().createWorkFlow(wfName, WFTypeC.TEMPLATE);

    // ---- Create the workflow nodes -------

    // Create an array to store the workflow nodes
    wfNodes = [];

    // Create the start node
    wfNode = ixConnect.ix().createWFNode(0, WFNodeC.TYPE_BEGINNODE);
    wfNode.name = "Start node";
    wfNodes.push(wfNode);

    // Create the end node
    wfNode = ixConnect.ix().createWFNode(1, WFNodeC.TYPE_ENDNODE);
    wfNode.name = "Finish";
    wfNodes.push(wfNode);

    wf.nodes = wfNodes;

    // ---- Create the workflow node associations -------

    // Create matrix and array to hold the associations
    wf.matrix = new WFNodeMatrix();
    wfMatrixAssocs = [];

    // Connect start node to end node
    wfNodeAssoc = new WFNodeAssoc();
    wfNodeAssoc.nodeFrom = 0; // == wf.nodes[0].id;
    wfNodeAssoc.nodeTo = 1; // == wf.nodes[1].id;
    wfMatrixAssocs.push(wfNodeAssoc);

    wf.matrix.assocs = wfMatrixAssocs;


    // ---- Store the new workflow ---------------------
    wf.id = ixConnect.ix().checkinWorkFlow(wf, WFDiagramC.mbAll, LockC.NO);

  },

  /**
   * @private
   * @param {Object[]} oldDocuments
   * @param {String} folderId
   */
  processOldDocuments: function (oldDocuments, folderId) {
    var me = this,
        i, arcPath, actdefId, sordad,
        bytes, baos;

    if (oldDocuments) {
      for (i = 0; i < oldDocuments.length; i++) {
        if (!oldDocuments[i].processed) {
          if (oldDocuments[i].extension == "Action definitions") {
            arcPath = sol.common.RepoUtils.getPathFromObjId(folderId) + oldDocuments[i].relpath;
            actdefId = sol.common.RepoUtils.createPath(arcPath, { mask: "Action definition" });
            if (actdefId) {
              sordad = ixConnect.ix().checkoutSord(actdefId, EditInfoC.mbAll, LockC.NO).sord;
              sol.common.SordUtils.updateSord(sordad, [{ key: "name", type: "SORD", value: oldDocuments[i].name }]);
              sol.common.SordUtils.updateSord(sordad, [{ key: "desc", type: "SORD", value: oldDocuments[i].content }]);
              ixConnect.ix().checkinSord(sordad, SordC.mbAll, LockC.NO);
            }
          } else if (oldDocuments[i].extension == "Folder") {
            arcPath = sol.common.RepoUtils.getPathFromObjId(folderId) + oldDocuments[i].relpath;
            actdefId = sol.common.RepoUtils.createPath(arcPath, { mask: "Folder" });
            if (actdefId) {
              sordad = ixConnect.ix().checkoutSord(actdefId, EditInfoC.mbAll, LockC.NO).sord;
              sol.common.SordUtils.updateSord(sordad, [{ key: "name", type: "SORD", value: oldDocuments[i].name }]);
              sol.common.SordUtils.updateSord(sordad, [{ key: "desc", type: "SORD", value: oldDocuments[i].content }]);
              ixConnect.ix().checkinSord(sordad, SordC.mbAll, LockC.NO);
            }
          } else {
            arcPath = sol.common.RepoUtils.getPathFromObjId(folderId) + oldDocuments[i].relpath;
            if (me.isOfficeDocument(oldDocuments[i].extension)) {
              bytes = oldDocuments[i].content;
              baos = new java.io.ByteArrayOutputStream(bytes.length);
              baos.write(bytes, 0, bytes.length);
              sol.common.RepoUtils.saveToRepo({ repoPath: arcPath, outputStream: baos, extension: oldDocuments[i].extension, maskId: oldDocuments[i].mask, tryUpdate: true });
            } else {
              sol.common.RepoUtils.saveToRepo({ repoPath: arcPath, contentString: oldDocuments[i].content, extension: oldDocuments[i].extension, maskId: oldDocuments[i].mask, tryUpdate: true });
            }
          }
        }
      }
    }
  },

  /**
   * @private
   * @param {String} ext
   * @return {Boolean}
   */
  isOfficeDocument: function (ext) {
    var me = this,
        offDocs = me.config.officeDocuments, i;

    if (offDocs) {
      for (i = 0; i < offDocs.length; i++) {
        if (offDocs[i] == ext) {
          return true;
        }
      }
    }
    return false;
  },

  /**
   * @private
   * @param {String} objId
   * @param {Object} folder
   * @param {String} type
   * @return {Object}
   */
  getOldDocuments: function (objId, folder, type) {
    var me = this,
        oldDocuments = [],
        objSord, packSord, oldFolderId,
        sordfs, sordf, i, jsText, relPath;

    objSord = ixConnect.ix().checkoutSord(me.objId, EditInfoC.mbAll, LockC.NO).sord;
    packSord = me.getSolutionSord(objSord);
    if (packSord) {
      oldFolderId = me.getSubFolderId(packSord.id, folder);
    }
    if (oldFolderId) {
      sordfs = sol.common.RepoUtils.findChildren(oldFolderId, { recursive: true, level: -1, includeDocuments: true, includeFolders: true, includeReferences: false });
      for (i = 0; i < sordfs.length; i++) {
        sordf = sordfs[i];
        if (((type == "APPEND") && (sol.common.SordUtils.isDocument(sordf))) ||
             ((type == "INTEGRATE") && ((me.isJsonConfig(sordf)) || (sol.common.SordUtils.isDocument(sordf)))) ||
             ((type == "COPY") && (sol.common.SordUtils.isDocument(sordf)))) {
          if (me.isOfficeDocument(sordf.docVersion.ext)) {
            jsText = sol.common.RepoUtils.downloadToByteArray(sordf.id, null);
          } else {
            jsText = sol.common.RepoUtils.downloadToString(sordf.id, null);
          }
          relPath = me.getRelPath(oldFolderId, sordf.id);
          oldDocuments.push({ name: sordf.name, content: jsText, extension: sordf.docVersion.ext, relpath: relPath, mask: sordf.mask });
        } else if (folder == "Action definitions") {
          relPath = me.getRelPath(oldFolderId, sordf.id);
          oldDocuments.push({ name: sordf.name, content: sordf.desc, extension: "Action definitions", relpath: relPath, mask: sordf.mask });
        } else if (sol.common.SordUtils.isFolder(sordf)) {
          relPath = me.getRelPath(oldFolderId, sordf.id);
          oldDocuments.push({ name: sordf.name, content: sordf.desc, extension: "Folder", relpath: relPath, mask: sordf.mask });
        }
      }
    }
    return oldDocuments;
  },

  /**
   * @private
   * @param {String} parentId
   * @param {String} folderId
   * @return {String}
   */
  getRelPath: function (parentId, folderId) {
    var parentPath, folderPath, plen, relPath;

    parentPath = sol.common.RepoUtils.getPathFromObjId(parentId);
    folderPath = sol.common.RepoUtils.getPathFromObjId(folderId);

    plen = parentPath.length;
    relPath = folderPath.slice(plen);

    return relPath;
  },

  /**
   * @private
   * @param {Object} tempSord
   * @param {Object} sordf
   * @return {Object}
   */
  generateSordNameDesc: function (tempSord, sordf) {
    var tpl, jsText;

    sordf = ixConnect.ix().checkoutSord(sordf.id, EditInfoC.mbAll, LockC.NO).sord;
    tpl = sol.create("sol.common.Template", { source: sordf.name });
    jsText = tpl.apply(tempSord);
    if (jsText != "") {
      sol.common.SordUtils.updateSord(sordf, [{ key: "name", type: "SORD", value: jsText }]);
    }
    if (sordf.desc) {
      if (sordf.desc != "") {
        tpl = sol.create("sol.common.Template", { source: sordf.desc });
        jsText = tpl.apply(tempSord);
        if (jsText != "") {
          sol.common.SordUtils.updateSord(sordf, [{ key: "desc", type: "SORD", value: jsText }]);
        }
        ixConnect.ix().checkinSord(sordf, SordC.mbAll, LockC.YES);
      }
    }
    ixConnect.ix().checkinSord(sordf, SordC.mbAll, LockC.NO);
    return sordf;
  },

  /**
   * @private
   * @param {Object} tempSord
   * @param {Object} sordf
   * @param {String} type
   * @param {Object[]} oldDocuments
   * @return {Object[]}
   */
  generateDocumentContent: function (tempSord, sordf, type, oldDocuments) {
    var me = this,
        oldContent, i, tpl, jsText,
        bytes, baos, wfName;

    if (sol.common.SordUtils.isDocument(sordf)) {
      if ((type == "APPEND") || (type == "INTEGRATE")) {
        oldContent = "";
        if (oldDocuments) {
          for (i = 0; i < oldDocuments.length; i++) {
            if (oldDocuments[i].name == sordf.name) {
              oldContent = oldDocuments[i].content;
              oldDocuments[i].processed = true;
            }
          }
        }
      }

      if (me.isOfficeDocument(sordf.docVersion.ext) || (type == "IMPORTWORKFLOW")) {
        jsText = sol.common.RepoUtils.downloadToByteArray(sordf.id, null);
      } else {
        jsText = sol.common.RepoUtils.downloadToString(sordf.id, null);
        tpl = sol.create("sol.common.Template", { source: jsText });
        jsText = tpl.apply(tempSord);
      }

      if (type == "APPEND") {
        jsText = oldContent + jsText;
      }
      if ((type == "INTEGRATE") && (me.isJsonConfig(sordf))) {
        try {
          oldContent = JSON.parse(oldContent);
        } catch (ex1) {
          oldContent = {};
        }
        try {
          jsText = JSON.parse(jsText);
        } catch (ex2) {
          jsText = {};
        }
        jsText = me.mergeRecursive(oldContent, jsText);
        jsText = new java.lang.String(JSON.stringify(jsText, null, 2));
      }
      wfName = sordf.name;
      if (me.isOfficeDocument(sordf.docVersion.ext) || (type == "IMPORTWORKFLOW")) {
        bytes = jsText;
      } else {
        bytes = new java.lang.String(jsText).getBytes("UTF-8");  // Workaround to save without BOM
      }
      baos = new java.io.ByteArrayOutputStream(bytes.length);
      baos.write(bytes, 0, bytes.length);
      sol.common.RepoUtils.saveToRepo({ objId: sordf.id, outputStream: baos, extension: sordf.docVersion.ext, tryUpdate: true });
      if (type == "IMPORTWORKFLOW") {
        me.importWorkflow(sordf, wfName);
      }
    }
    return oldDocuments;
  },

  /**
   * @private
   * @param {String} parentId
   * @param {String} folder
   * @return {String}
   */
  getSubFolderId: function (parentId, folder) {
    var folderPath, folderId, sordfs, sordf, i;

    folderPath = sol.common.RepoUtils.getPathFromObjId(parentId) + "/" + folder;
    if (folderPath) {
      folderId = sol.common.RepoUtils.getObjId(folderPath);
      if (!folderId) {
        sordfs = sol.common.RepoUtils.findChildren(parentId, { recursive: false, level: 1, includeDocuments: false, includeFolders: true, includeReferences: false });
        for (i = 0; i < sordfs.length; i++) {
          sordf = sordfs[i];
          // Get folderId
          if (sordf.name == folder) {
            folderId = sordf.id;
          }
        }
      }
    }
    return folderId;
  },

  /**
   * @private
   * @param {String} objId
   * @param {String} targetId
   */
  moveSord: function (objId, targetId) {
    var me = this,
        sord = ixConnect.ix().checkoutSord(objId, EditInfoC.mbSord, LockC.NO).sord,
        oldParentId = sord.parentId,
        newParentId;

    if (targetId == "0") {
      newParentId = "0";
    } else {
      newParentId = ixConnect.ix().checkoutSord(targetId, EditInfoC.mbOnlyId, LockC.NO).sord.id; // make sure, newParentId is a number (targetId might be an arcpath)
    }

    me.logger.info(["move sord (objId={0}, name={1}): {2} -> {3}", objId, sord.name, oldParentId, newParentId]);
    ixConnect.ix().refSord(oldParentId, newParentId, objId, -1);
  },
  /**
   * @private
   * @param {String} templateId
   * @return {Object}
   */
  existPathFullNameSpace: function (templateId) {
    var me = this,
        map, fullNameSpace, path1, path2, obj1Id, obj2Id;

    map = sol.create("sol.common.SordMap", {
      objId: templateId
    });
    map.read();
    fullNameSpace = map.getValue("FULLNAMESPACE");
    if ((!fullNameSpace) || (fullNameSpace == "")) {
      fullNameSpace = map.getValue("NAMESPACE") + "." + map.getValue("PACKAGE");
    }

    path1 = me.config.solutionFolderPath + "/" + fullNameSpace;
    path2 = me.config.customSolutionFolderPath + "/" + fullNameSpace;

    obj1Id = sol.common.RepoUtils.getObjId(path1);
    obj2Id = sol.common.RepoUtils.getObjId(path2);

    return (obj1Id && obj2Id);

  }

});
