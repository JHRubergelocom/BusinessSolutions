// start namespace tfim
var tfim = new Object();
tfim = {
  pendingFlowData: null,
  importAlways: false,
  pendingRefs: [],
  
  checkForImport: function(fileName) {
    var file = new File(fileName);
    if (file.exists()) {
      log.info("Transfer file found: " + fileName);
      var tempName = fileName + "-" + fu.fileNameDate(new Date()) + ".zip";
      fu.rename(fileName, tempName);
      log.info("Process temp file: " + tempName);
      
      try {
        log.info("Start check loop");
        this.doImport(tempName, false, true);
      } catch(e) {
        log.error("Check failed: " + e);
        fu.rename(fileName, fileName + "-ERRORCHECK.zip");
        throw e;
      }
      
      this.clear();
      
      log.info("Start import");
      try {
        this.doImport(tempName, false, false);
        log.info("Import done.");
      } catch(e) {
        log.warn("Abort import with error: " + e);
        fu.rename(fileName, fileName + "-ERROR.zip");
      }
    }
  },
  
  checkForImportDir: function(dirName) {
    var dir = new File(dirName);
    var items = dir.list();
    if (!items) {
      // nothing to do
      return;
    }
    
    for (var i = 0; i < items.length; i++) {
      var name = items[i];
      var tempName = dirName + "\\Processing" + name;
      try {
        if (name.startsWith("EX")) {
          fu.rename(dirName + "\\" + name, tempName);
          log.info("Process temp file: " + tempName);
          this.doImport(tempName, false, false);
          fu.deleteFile(new File(tempName));
          log.info("WF-Import done.");
        }
      } catch(e) {
        var errorName = dirName + "\\ERROR_" + name;
        fu.rename(tempName, errorName);
        log.warn("Abort import with error: " + errorName + " : " + e);
      }
    }
  },
  
  doImport: function(fileName, withDelete, onlyCheck) {
    var hasError = false;
    var errorMessage;
    
    var zipi = new ZipParts(fileName, ZipParts.ReadWrite.Read);
    this.pendingFlowData = null;
    this.pendingRefs = [];
    
    for (;;) {
      var txt = zipi.getUtf8Part();
      if (txt == null) {
        break;
      }
      
      try {
        this.processPart(zipi, txt, onlyCheck);
      } catch(e) {
        hasError = true;
        errorMessage = e;
        log.error("Error reading transfer file: " + e);
        break;
      }
    }
    
    zipi.close();
    
    if (this.pendingRefs.length > 0) {
      this.addPendingRefs(this.pendingRefs);
    }
    
    if (this.pendingFlowData) {
      var scriptName = this.pendingFlowData.scriptAfterReturn;
      if (scriptName && wftransport[scriptName]) {
        log.debug("callback started: " + scriptName);
        try {
          wftransport[scriptName](this.pendingFlowData);
          log.debug("callback done: " + scriptName);
        } catch(e) {
          log.warn("Error in callback function: " + scriptName);
          hasError = true;
        }
      }

      wf.createOrConfirmFlowFromZip(this.pendingFlowData, hasError, errorMessage);
      log.debug("Workflow started or confirmed.");
    }
    
    if (withDelete && !hasError) {
      var file = new File(fileName);
      fu.deleteFile(file);
    }
    
    if (hasError) {
      throw e;
    }
  },
  
  addPendingRefs: function(refs) {
    for (var i = 0; i < refs.length; i++) {
      var ref = refs[i];
      if (ref.deleted) {
        ixConnect.ix().deleteSord(ref.parentGuid, ref.objectGuid, LockC.NO, null);
      } else {
        ixConnect.ix().refSord(null, ref.parentGuid, ref.objectGuid, -1);
      }
    }
  },
  
  processPart: function(zipi, part, onlyCheck) {
    log.info(((onlyCheck) ? "checkPart" : "processPart: ") + part.substring(0,100));
  
    var jsonObj = JSON.parse(part);
    var jsonClass = jsonObj.jsonClass;
    
    if (EM_EventsI && (typeof EM_EventsI.tfimProcessPartFillup == "function")) {
      EM_EventsI.tfimProcessPartFillup(zipi, jsonClass, onlyCheck, newParentGuids); 
    }
  
    if (jsonClass == "TfColors") {
      this.processColors(jsonObj, onlyCheck);
    } else if (jsonClass == "TfSord") {
      this.processSord(zipi, jsonObj, onlyCheck);
    } else if (jsonClass == "TfMask") {
      this.processMask(jsonObj, onlyCheck);
    } else if (jsonClass == "TfWorkflow") {
      this.processWorkflow(jsonObj, onlyCheck);
    } else if (jsonClass == "TfUser") {
      this.processUser(jsonObj, onlyCheck);
    } else if (jsonClass == "TfKeywords") {
      this.processKeywords(jsonObj, onlyCheck);
    } else if (jsonClass == "TfFlowData") {
      this.processFlowData(jsonObj, onlyCheck);
    } else if (jsonClass == "TfMapData") {
      this.processMapData(jsonObj, onlyCheck);
    } else if (jsonClass == "TfReference") {
      this.pendingRefs.push(jsonObj);
    }
  },
  
  processMapData: function(jmapData, onlyCheck) {
    if (onlyCheck) {
      
    } else {
      jmapData.fillup = TfMapData.prototype.fillup;
      var mapData = new MapData();
      jmapData.fillup(mapData);
      if (!mapData.guid) {
        log.info("Map import canceled by callback function");
        return;
      }
      
      if (jmapData.objGuid == this.lastWrittenSordGuid) {
        ixConnect.ix().checkinMap(mapData.domainName, this.lastWrittenSordId, this.lastWrittenSordId, mapData.items, LockC.NO);
      } else {
        log.warn("Unrelated MapData ignored. Found: " + mapData.guid + ", expected: " + this.lastWrittenSordGuid);
      }
    }
  },
  
  processFlowData: function(flowData, onlyCheck) {
    if (onlyCheck) {
    } else {
      this.pendingFlowData = flowData;
    }
  },
  
  processSord: function(zipi, jsord, onlyCheck) {
    if (onlyCheck) {
      var flags = this.getFlags();
      if ((flags & AccessC.FLAG_EDITSTRUCTURE) == 0) {
        throw "Missing Edit Structure Access Right, cannot import folders or documents.";
      }
      
      if (!jsord.rootNode) {
        jsord.parentGuid = this.rootId;
      }
    }
    if (!this.translator) {
      this.translator = new TfUserIdTranslator();
    }
    
    var docFile;
    if (jsord.docExt) {
      docFile = File.createTempFile("docfile", "." + jsord.docExt);
      log.debug("Temp file: " + docFile.getAbsolutePath());

      zipi.getFilePart(docFile);
    }

    jsord.fillup = TfSord.prototype.fillup;
    var editInfo;
    try {
      editInfo = ixConnect.ix().checkoutDoc(jsord.guid, null, EditInfoC.mbAll, LockC.NO);
      log.debug("Read existing Sord: " + jsord.guid + " : " + editInfo.sord.name);
      if (onlyCheck && jsord.rootNode) {
        this.rootId = jsord.guid;
        log.info("Root sord loaded: " + jsord.name + " at " + jsord.guid);
      }
    } catch(e) {
      var dest = jsord.parentGuid;
      if (jsord.createPath && (jsord.createPath != "ARCPATH:")) {
        dest = jsord.createPath;
      }
      
      if (onlyCheck) {
        if (jsord.rootNode) {
          this.rootId = dest;
          log.info("Root sord loaded: " + jsord.name + " at " + dest);
        }
        return;
      }
      
      log.info("Create new Sord at " + dest);
      try {
        if (jsord.docExt) {
          editInfo = ixConnect.ix().createDoc(dest, jsord.maskName, null, EditInfoC.mbAll);
        } else {
          editInfo = ixConnect.ix().createSord(dest, jsord.maskName, EditInfoC.mbAll);
        }
      } catch(e) {
        log.info("Cannot create new entry at: " + dest + ", reason: " + e);
        if (this.pendingFlowData) {
          dest = this.pendingFlowData.eloObjGuid;
          if (jsord.docExt) {
            editInfo = ixConnect.ix().createDoc(dest, jsord.maskName, null, EditInfoC.mbAll);
          } else {
            editInfo = ixConnect.ix().createSord(dest, jsord.maskName, EditInfoC.mbAll);
          }
        } else {
          throw(e);
        }
      }
    }
    
    var localDeleted = editInfo.sord.deleted;
    jsord.fillup(editInfo.sord, this.translator);
    var remoteDeleted = editInfo.sord.deleted;
    
    if (!editInfo.sord.guid) {
      log.info("Sord import canceled by callback function");
      return;
    }
    
    if (onlyCheck) {
      if (((editInfo.sord.access & AccessC.LUR_WRITE) == 0) && (editInfo.sord.id != -1)) {
        throw ("Missing write access at object: " + editInfo.sord.name);
      }
      
      if (jsord.docExt) {
      }
    } else {
      if (localDeleted && !remoteDeleted) {
        this.restoreSord(editInfo.sord.guid);
      }
      
      var id = ixConnect.ix().checkinSord(editInfo.sord, SordC.mbAll, LockC.NO);
      log.debug("Sord written: " + id);
      
      this.lastWrittenSordId = id;
      this.lastWrittenSordGuid = editInfo.sord.guid;
      
      editInfo.sord.id = id;
      
      if (jsord.docExt) {
        if (this.checkForMd5Version(editInfo, docFile)) {
          log.info("DocVersion is available, not import needed.");
        } else {
          log.info("Update sord document file: " + jsord.docExt);
          var doc = new Packages.de.elo.ix.client.Document();
          var dv = new DocVersion();
          dv.pathId = editInfo.sord.path;
          dv.ext = jsord.docExt;
          dv.encryptionSet = editInfo.sord.details.encryptionSet;
          doc.docs = [dv];
          doc = ixConnect.ix().checkinDocBegin(doc);
          dv = doc.docs[0];
          var url = dv.url;
          log.debug("Upload file: " + url);
          var uploadResult = ixConnect.upload(url, docFile);
          dv.uploadResult = uploadResult;
          doc = ixConnect.ix().checkinDocEnd(editInfo.sord, SordC.mbAll, doc, LockC.NO);
        }
        
        log.debug("Delete temp file: " + docFile.name);
        fu.deleteFile(docFile);
        log.debug("Update done.");
      }
      
      if (remoteDeleted) {
        this.deleteSord(editInfo.sord.guid);
      }
    }
  },
  
  restoreSord: function(objid) {
    var options = new RestoreOptions();
    options.singleObject = false;
    ixConnect.ix().restoreSord(objid, options);
  },
  
  deleteSord: function(objid) {
    ixConnect.ix().deleteSord(null, objid, LockC.NO, null);
  },
  
  checkForMd5Version: function(editInfo, file) {
    if (this.importAlways) {
      log.debug("Import always, no md5 check");
      return false;
    }
    
    try {
      var md5 = ixConnect.getFileMd5(file);
      log.debug("Search for md5 version: " + md5);
      var docs = editInfo.document.docs;
      
      if (docs.length > 0) {
        var doc = docs[0];
        log.debug("Active version, MD: " + doc.md5);
        if (doc.md5 == md5) {
          log.debug("Md5 version found.");
          return true;
        }
      }
    } catch(e) {
      log.info("Error searching md5 Version: " + e);
    }
    
    log.debug("New document: " + editInfo.sord.id);
    return false;
  },
  
  processColors: function(jsonObj, onlyCheck) {
    if (onlyCheck) {
      var flags = this.getFlags();
      if ((flags & AccessC.FLAG_EDITCONFIG) == 0) {
        throw "Missing EditConfig Access Right, cannot import color marker.";
      }
      
      return;
    }
    
    var cols = new Array();
    jsonObj.fillup = TfColors.prototype.fillup;
    jsonObj.fillup(cols);
    
    ixConnect.ix().checkinColors(cols, LockC.NO);
  },
  
  processUser: function(juser, onlyCheck) {
    var checkOwner = true;
    if (onlyCheck) {
      var flags = this.getFlags();
      if ((flags & AccessC.FLAG_SUBADMIN) == 0) {
        throw "Missing Edit User Access Right, cannot import users or groups.";
      }
      if ((flags & AccessC.FLAG_ADMIN) != 0) {
        checkOwner = false;
      }
    }
    
    if (!this.translator) {
      this.translator = new TfUserIdTranslator();
    }
    
    var user;
    try {
      user = ixConnect.ix().checkoutUsers([juser.guid], CheckoutUsersC.BY_IDS_RAW, LockC.NO)[0];
    } catch(e) {
      user = new Packages.de.elo.ix.client.UserInfo();
      user.id = -1;
    }
    
    juser.fillup = TfUser.prototype.fillup;
    juser.fillup(user, this.translator);
    if (!user.guid) {
      log.info("User import canceled by callback function");
      return;
    }
  
    if (onlyCheck) {
      if (checkOwner) {
        if (user.parent != this.userId) {
          throw "Cannot edit user: " + user.name;
        }
      }
      this.translator.addItem(user.id, user.guid, user.name);
    } else {
      var ids = ixConnect.ix().checkinUsers([user], CheckinUsersC.WRITE, LockC.NO);
      
      var profile = new UserProfile();
      profile.excludeDefaultValues = true;
      profile.excludeGroupValues = true;
      profile.userId = ids[0];
      var items = new Array();
      var joptions = juser.options;
      joptions.fillup = TfUserOptions.prototype.fillup;
      joptions.fillup(items);
      profile.options = items;
      ixConnect.ix().checkinUserProfile(profile, LockC.NO);
      
      this.translator.addItem(ids[0], user.guid, user.name);
    }
  },
  
  processWorkflow: function(jworkflow, onlyCheck) {
    if (onlyCheck) {
      var flags = this.getFlags();
      if ((flags & AccessC.FLAG_EDITWF) == 0) {
        throw "Missing Edit Workflow Access Right, cannot import workflow templates.";
      }
    }

    if (!this.translator) {
      this.translator = new TfUserIdTranslator();
    }
  
    if (!this.wfTranslator) {
      this.wfTranslator = new TfWorkflowTranslator();
    }
    
    var workflow;
    try {
      workflow = ixConnect.ix().checkoutWorkflowTemplate(jworkflow.guid, null, WFDiagramC.mbAll, LockC.NO);
    } catch(e) {
      log.info(e);
      workflow = new WFDiagram();
      workflow.id = -1;
    }
    
    jworkflow.fillup = TfWorkflow.prototype.fillup;
    jworkflow.fillup(workflow, this.translator);
    if (!workflow.guid) {
      log.info("Import canceled by callback function");
      return;
    }
    
    if (onlyCheck) {
      this.wfTranslator.addItem(workflow.id, workflow.name);
    } else {
      ixConnect.ix().checkinWorkflowTemplate(workflow, WFDiagramC.mbAll, LockC.NO);
    }
  },
  
  processKeywords: function(jkeywords, onlyCheck) {
    if (onlyCheck) {
      return;
    }
    
    if (!this.keywordsProvider) {
      this.keywordsProvider = new TfKeywordsProvider();
    }
  
    
    var keywords = new KeywordList();
    jkeywords.fillup = TfKeywords.prototype.fillup;
    jkeywords.fillupChildren = TfKeywords.prototype.fillupChildren;
    jkeywords.fillup(keywords);
    if (keywords.id != "") {
      this.keywordsProvider.saveList(keywords);
    }
    
  },
  
  processMask: function(jmask, onlyCheck) {
    if (onlyCheck) {
      var flags = this.getFlags();
      if ((flags & AccessC.FLAG_EDITMASK) == 0) {
        throw "Missing Edit Mask Access Right, cannot import masks.";
      }
      
      return;
    }

    if (!this.wfTranslator) {
      this.wfTranslator = new TfWorkflowTranslator();
    }
    
    if (!this.keywordsProvider) {
      this.keywordsProvider = new TfKeywordsProvider();
    }
    
    var mask;
    var id = jmask.guid;
    try {
      log.debug("Try read mask: " + id);
      mask = ixConnect.ix().checkoutDocMask(id, DocMaskC.mbAll, LockC.NO);
      log.debug("Mask found");
    } catch(e) {
      log.info("Create new mask: " + id);
      mask = new DocMask();
      mask.id = -1;
    }
    
    jmask.fillup = TfMask.prototype.fillup;
    jmask.fillup(mask, this.wfTranslator, this.keywordsProvider);
    if (!mask.guid) {
      log.info("Mask import canceled by callback function");
      return;
    }
    
    ixConnect.ix().checkinDocMask(mask, DocMaskC.mbAll, LockC.NO);
    log.debug("Update mask: " + mask.name);
  },
  
  getFlags: function() {
    if (!this.flags) {
      this.flags = ixConnect.loginResult.user.flags;
    }
    
    return this.flags;
  },
  
  getUser: function() {
    if (!this.userId) {
      this.userId = ixConnect.loginResult.user.id;
    }
    
    return this.userId;
  },
  
  clear: function() {
    this.translator = null;
    this.wfTranslator = null;
    this.keywordsProvider = null;
  }
}


