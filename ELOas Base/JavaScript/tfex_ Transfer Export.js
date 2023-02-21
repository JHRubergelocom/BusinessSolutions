// start namespace tfex
var tfex = new Object();
tfex = {
  restrictSordsToGroup: null,
  restrictSordsToMasks: new Object(),
  addSordMaps: Boolean,
  
  doExport: function(parts, fileName) {
    var tempName = fileName + ".$$$";
    log.info("Start export to " + tempName);
    var zip = new ZipParts(tempName, ZipParts.ReadWrite.Write);
    
    try {
      this.exportParts(parts, zip);
      log.info("Export completed.");
    } catch(e) {
      log.error("Error writing transfer file: " + e);
      fileName = fileName + "-ERROR-" + fu.fileNameDate(new Date()) + ".zip";
    } finally {
      try {
        zip.close();
      } catch(e) {
        log.error("Error closing export file: " + e);
      }
    }
    
    fu.rename(tempName, fileName, true);
    log.info("Export file available: " + fileName);
  },
  
  doWfExport: function(wfData, fileName, isReturn ) {
    var restrictToGroup = wfData.restrictGroup;
    var restrictToMasks = wfData.masks;
    
    var tempName = fileName + ".$$$";
    log.info("Start workflow export to " + tempName + ", restrict: " + restrictToGroup);
    
    if (restrictToGroup == "") {
      restrictToGroup = null;
    }
    this.restrictSordsToGroup = restrictToGroup;
    if (restrictToGroup) {
      log.info("Restrict Sord export to Group: " + restrictToGroup);
    }
    this.restrictSordsToMasks = restrictToMasks;
    this.exportMode = wfData.exportMode;
    
    var zip = new ZipParts(tempName, ZipParts.ReadWrite.Write);
    
    try {
      var scriptName = (isReturn) ? wfData.scriptBeforeReturn : wfData.scriptBeforeSend;
      if (scriptName && wftransport[scriptName]) {
        wftransport[scriptName](wfData);
      }
      
      part = JSON.stringify(wfData);
      zip.addUtf8Part(part);
      
      var parts = '[{"type": "sord", "guid": "' + wfData.eloObjGuid +
                  '", "createPath": "ARCPATH:' + wfData.destination + '"}]';
      this.exportParts(parts, zip);
      log.info("Export completed.");
    } catch(e) {
      log.error("Error writing transfer file: " + e);
      fileName = fileName + "-ERROR-" + fu.fileNameDate(new Date()) + ".zip";
    } finally {
      try {
        zip.close();
      } catch(e) {
        log.error("Error closing export file: " + e);
      }
    }
    
    this.restrictSordsToGroup = null;
    fu.rename(tempName, fileName, true);
    log.info("Wf-Export file available: " + fileName);
  },
  
  exportParts: function(parts, zipFile) {
    var userTranslator = new TfUserIdTranslator();
    var workflowTranslator = new TfWorkflowTranslator();
    var keywordsProvider = new TfKeywordsProvider();
    var guidProvider = new TfGuidProvider();
    
    var commands = JSON.parse(parts);
    
    for (var iCmd = 0; iCmd < commands.length; iCmd++) {
      var part;
      var cmd = commands[iCmd];
      var name = cmd.type;
      if (name == "marker") {
        log.info("Export marker, filter: " + cmd.filter);
        var colorInfo = ixConnect.ix().checkoutColors(LockC.NO);
        var jColorInfo = new TfColors(colorInfo);
        part = JSON.stringify(jColorInfo);
      } else if (name == "sord") {
        log.info("Export sord, guid: " + cmd.guid);
        if (!cmd.mode) {
          cmd.mode = 2;
        }
        if (!cmd.levels) {
          cmd.levels = 32;
        }
        cmd.rootNode = true;
        this.exportSords(cmd, zipFile, userTranslator, guidProvider);
        part = undefined;
      } else if (name == "user") {
        log.info("Export user, guid: " + cmd.guid);
        var userInfo = ixConnect.ix().checkoutUsers([cmd.guid], CheckoutUsersC.BY_IDS_RAW, LockC.NO);
        var profile = new UserProfile();
        profile.excludeDefaultValues = true;
        profile.excludeGroupValues = true;
        profile.userId = userInfo[0].id
        var userOptions = ixConnect.ix().checkoutUserProfile(profile, LockC.NO);
        
        var juser = new TfUser(userInfo[0], userTranslator);
        juser.options = new TfUserOptions(userOptions.options);
        
        part = JSON.stringify(juser);
      } else if (name == "mask") {
        log.info("Export mask, guid: " + cmd.guid);
        var mask = ixConnect.ix().checkoutDocMask(cmd.guid, DocMaskC.mbAll, LockC.NO);
        var jmask = new TfMask(mask, workflowTranslator, keywordsProvider);
        part = JSON.stringify(jmask);
      } else if (name == "wftemplate") {
        log.info("Export workflow, guid: " + cmd.guid);
        var flow = ixConnect.ix().checkoutWorkflowTemplate(cmd.guid, null, WFDiagramC.mbAll, LockC.NO);
        var jflow = new TfWorkflow(flow, userTranslator);
        part = JSON.stringify(jflow);
      } else if (name == "keywords") {
        log.info("Export keyword list, guid: " + cmd.guid);
        var jkeywords = new TfKeywords(cmd.guid, keywordsProvider);
        part = JSON.stringify(jkeywords);
      } else {
        log.error("Unknown command: " + name);
        continue;
      }

      if (part) {
        zipFile.addUtf8Part(part);
      }
    }
  },
  
  exportSords: function(cmd, zipFile, userTranslator, guidProvider) {
    if (cmd.levels < 1) {
      log.info("Too many nested levels. Recursion stopped.");
      return;
    }
    
    var pendingFile = null;
    var editInfo = ixConnect.ix().checkoutDoc(cmd.guid, null, EditInfoC.mbAll, LockC.NO);
    var sord = editInfo.sord;
    guidProvider.addGuid(String(sord.id), String(sord.guid));
    var found = true;
    var part;
    
    var isReference = cmd.parentObjId && (cmd.parentObjId != sord.parentId);
    log.debug("Process " + sord.id + " - Is Reference: " + isReference);
    
    // Sord Map Einträge mitnehmen?
    this.addSordMaps = (cmd.mode & 8) != 0;
    
    // Referenzen erhalten?
    this.keepRefs = (cmd.mode & 16) != 0;
    
    // Dokumente mit exportieren?
    this.exportMask = cmd.mode & 7;
    
    if (this.restrictSordsToGroup) {
      var aclItems = sord.aclItems;
      found = false;
      for (var i = 0; i < aclItems.length; i++) {
        var item = aclItems[i];
        if ((item.name == this.restrictSordsToGroup) && (!item.andGroups || (item.andGroups.length ==0))) {
          found = true;
          break;
        }
      }
      
      if (!found) {
        log.info("Sord skipped (group): " + sord.id + ": " + sord.name);
        if (this.exportMode != "partial") {
          cmd.createPath = null;
          return;
        }
      }
    }
    
    if (this.restrictSordsToMasks && (this.restrictSordsToMasks.length > 0)) {
      if (! this.restrictSordsToMasks[sord.maskName]) {
        log.info("Sord skipped (mask): " + sord.id + ": " + sord.name);
        found = false;
        if (this.exportMode != "partial") {
          cmd.createPath = null;
          return;
        }
      }
    }
    
    if (found) {
      if (isReference && this.keepRefs) {
        var deleted = true;
        for (var refs = 0; refs < sord.parentIds.length; refs++) {
          if (sord.parentIds[refs] == cmd.parentGuid) {
            deleted = false;
            break;
          }
        }
        
        var jReference = new TfReference(cmd.parentGuid, cmd.guid, deleted);
        part = JSON.stringify(jReference);
        zipFile.addUtf8Part(part);
        return;
      }  
        
      var jsord = new TfSord(sord, userTranslator, guidProvider);
      if (editInfo.document && editInfo.document.docs && (editInfo.document.docs.length > 0)) {
        if (this.exportMask < 2) {
          log.debug("Mode 1: Do not export documents.");
          return;
        }
        
        pendingFile = editInfo.document.docs[0];
        jsord.docExt = String(pendingFile.ext);
      }
      
      if (cmd.createPath) {
        jsord.createPath = cmd.createPath;
        cmd.createPath = null;
      }
      jsord.rootNode = cmd.rootNode;
      
      part = JSON.stringify(jsord)
      zipFile.addUtf8Part(part);
      
      if (pendingFile) {
        // Dokument - Datei rausschreiben
        var temp = File.createTempFile("docfile", "." + pendingFile.ext);
        log.debug("Temp file: " + temp.getAbsolutePath());

        ixConnect.download(pendingFile.url, temp);
        pendingFile = null;
        log.debug("Download done.");
        
        zipFile.addFilePart(temp);
        log.debug("File part added.");
        fu.deleteFile(temp);
      }
      
      if (this.addSordMaps) {
        var map = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD , sord.id, null, LockC.NO);
        var jmap = new TfMapData(map, sord.guid);
        part = JSON.stringify(jmap);
        zipFile.addUtf8Part(part);
      }
    }
    
    if ((sord.type < 254) && !sord.deleted){
      // Ordner - Untereinträge rausschreiben
      cmd.rootNode = false;
      
      var findInfo = new FindInfo();
      var findChildren = new FindChildren();
      var findOptions = new FindOptions();
      
      findOptions.inclDeleted = true;
      findChildren.parentId = sord.id;
      
      findInfo.findChildren = findChildren;
      findInfo.findOptions = findOptions;
      
      var findResult = ixConnect.ix().findFirstSords(findInfo, 1000, SordC.mbMin);
      ixConnect.ix().findClose(findResult.searchId);
      
      var sords = findResult.sords;
      cmd.levels--;
      for (var i = 0; i < sords.length; i++) {
        cmd.parentObjId = Number(sord.id);
        cmd.parentGuid = String(sord.guid);
        cmd.guid = String(sords[i].guid);
        log.info("Export sord child, guid: " + cmd.guid);
        this.exportSords(cmd, zipFile, userTranslator, guidProvider);
      }
      cmd.levels++;
    }
  }
}


