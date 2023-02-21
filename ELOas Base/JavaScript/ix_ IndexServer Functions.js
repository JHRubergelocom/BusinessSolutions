// start namespace ix
importPackage(Packages.de.elo.ix.client.feed);
  

var ix = new Object();
ix = {
  docTypeCache: {},
   
  /**
  * Fügt an das Verschlagwortungsobjekt eine neue
  * Dateianbindung (Attachment) hinzu.
  *
  * objId: ELO ObjektId des Zieldokuments
  * file: Datei mit dem neuen Attachment
  */
  addAttachment: function(objId, file) {
    var editInfo = ixConnect.ix().checkoutDoc(objId, null, EditInfoC.mbSordDocAtt, LockC.NO);
    var doc = editInfo.document;
    var ext = fu.getExt(file.name);
    
    var atts = new Array();
    atts.push(new DocVersion());
    
    doc.atts = atts
    doc.atts[0].ext = ext;
    doc = ixConnect.ix().checkinDocBegin(doc);
    
    var url = doc.atts[0].url;
    var uploadResult = ixConnect.upload(url, file);
    
    doc.atts[0].uploadResult = uploadResult;
    doc = ixConnect.ix().checkinDocEnd(null, null, doc, LockC.NO);
  },
  
  /**
  * Fügt an das übergebene Verschlagwortungsobjekt
  * eine neue Dateiversion an. Der Aufrufer muss
  * sicherstellen, dass es sich um ein ELO Dokument
  * und nicht um einen Ordner handelt.
  *
  * sord: Zieldokument
  * file: Datei mit der neuen Dokumentenversion
  */
  addDocument: function(sord, file) {
    var ext = fu.getExt(file.name);
    var actDoc = new DocVersion();
    actDoc.ext = ext;
    
    var docs = new Array();
    docs.push(actDoc);
    
    var document = new Document();
    if (sord.id) {
      document.objId = sord.id;
    }
    document.docs = docs;
    
    document = ixConnect.ix().checkinDocBegin(document);
    var result = ixConnect.upload(document.docs[0].url, file);
    document.docs[0].setUploadResult(result);
    
    document = ixConnect.ix().checkinDocEnd(sord, SordC.mbAll, document, LockC.YES);
  },
  
  /**
  * Verschiebt alle Dateien der Dokumenten-Untereinträge
  * eines ELO Ordners in einen anderen Speicherpfad.
  *
  * sordId: ELO ObjektId des Startordners
  * newPathId: ELO Pfadnummer für die verschobenen Dateien
  */
  moveToPath: function(sordId, newPathId) {
    var navInfo = new NavigationInfo();
    navInfo.startIDs = [sordId];
    
    var procInfo = new ProcessInfo();
    procInfo.procMoveDocumentsToStoragePath = new ProcessMoveDocumentsToStoragePath();
    procInfo.procMoveDocumentsToStoragePath.pathId = newPathId;
    
    this.backgroundJobLoop(navInfo, procInfo);
  },
  
  backgroundJobLoop: function(navInfo, procInfo) {
    var jobState = ixConnect.ix().processTrees(navInfo, procInfo);
    while (jobState && jobState.jobRunning) {
      Thread.currentThread().sleep(1000);
      jobState = ixConnect.ix().queryJobState(jobState.jobGuid, true, true, true);
    }
  },
  
  /**
  * Liest aus einem ELO Sord Objekt den Inhalt einer
  * Indexzeile mit dem angegebenen Namen
  *
  * sord: ELO Verschlagwortungsobjekt
  * name: Gruppenname der Indexzeile
  */
  getIndexValueByName: function(sord, name) {
    var objKeys = sord.objKeys;
    for (var i = 0; i < objKeys.length; i++) {
      var key = objKeys[i];
      if (key.name == name) {
        if (key.data.length > 0) {
          return String(key.data[0]);
        } else {
          return "";
        }
      }
    }

    return "";
  },

  /**
  * Liest aus einem ELO Sord Objekt das ObjKey Objekt einer
  * Indexzeile mit dem angegebenen Namen
  *
  * sord: ELO Verschlagwortungsobjekt
  * name: Gruppenname der Indexzeile
  */
  getKeyByName: function(sord, name) {
    var objKeys = sord.objKeys;
    log.debug("keys: " + objKeys.length + " : " + name);
    for (var i = 0; i < objKeys.length; i++) {
      var key = objKeys[i];
      log.debug("key " + key.id + " name : " + key.name);
      if (key.name == name) {
        log.debug("key found");
        return key;
      }
    }

    log.debug("no key found: " + name);
    return null;
  },

  /**
  * Sucht in einem Sord Objekt nach einer Indexzeile
  * mit dem angegebenen Namen und füllt das Data Feld
  * mit dem angegebenen Wert.
  *
  * sord: Verschlagwortungsobjekt - Indexserver Sord Objekt
  * name: Gruppenname der Indexzeile
  * value: Einzutragender Wert
  */
  setIndexValueByName: function(sord, name, value) {
    var objKeys = sord.objKeys;
    for (var i = 0; i < objKeys.length; i++) {
      var key = objKeys[i];
      if (key.name == name) {
        key.data = [value];
      }
    }
  },
  
  /**
  * Ermittelt den ELO DocType aus der Datei-Extension
  * aus der ELO Konfiguration.
  *
  * filename: Dateiname aus der die Extension gelesen wird.
  */
  lookupDocType: function(filename) {
    var now = new Date();
    if (!this.docTypeCache.createTime || (now.getTime() - this.docTypeCache.createTime.getTime()) > 100000) {
      log.debug("Reload docType Cache.");
      this.docTypeCache.sordTypes = ixConnect.ix().checkoutSordTypes(null, SordTypeC.mbNoIcons, LockC.NO);
      this.docTypeCache.createTime = now;
    }
    
    var extensionStart = filename.lastIndexOf(".");
    if ((extensionStart < 0) || (extensionStart == (filename.length - 1))) {
      throw "No file extension found";
    }
    
    var fileExt = filename.substring(extensionStart + 1);
    for (var i = 0; i < this.docTypeCache.sordTypes.length; i++) {
      var extensions = this.docTypeCache.sordTypes[i].extensions;
      
      if (extensions) {
        for (var ext = 0; ext < extensions.length; ext++) {
          if (extensions[ext].equalsIgnoreCase(fileExt)) {
            return this.docTypeCache.sordTypes[i].id;
          }
        }
      }
    }
    
    return -1;
  },
  
  /**
  * Lädt die maximal ersten 1000 Nachfolgereinträge
  * eines ELO Ordners.
  *
  * parentId: ELO ObjektId der Ordners
  * withRefs: Lädt nur Haupteinträge oder auch Referenzen
  */
  collectChildren: function(parentId, withRefs) {
    var findInfo = new FindInfo();
    var findChildren = new FindChildren();
    findChildren.parentId = parentId;
    findChildren.mainParent = !withRefs;
    findInfo.findChildren = findChildren;

    var findResult = ixConnect.ix().findFirstSords(findInfo, 1000, SordC.mbAll);
    ixConnect.ix().findClose(findResult.searchId);

    return findResult.sords;
  },

  /**
  * Löscht einen Eintrag oder eine Referenz
  *
  * parentId: Vorgängerknoten
  * objId: Zielknoten
  */
  deleteSord: function (parentId, objId) {
    log.info("Delete SORD: ParentId = " + parentId + ",  ObjectId = " + objId);
    return ixConnect.ix().deleteSord(parentId, objId, LockC.NO, null);
  },

  lookupIndex: function (archivePath) {
    log.info("Lookup Index: " + archivePath);
    var editInfo = ixConnect.ix().checkoutSord("ARCPATH:" + archivePath, EditInfoC.mbOnlyId, LockC.NO);
    if (editInfo) {
      return editInfo.getSord().getId();
    } else {
      return 0;
    }
  },

  /**
  * Ermittelt die ELO ObjektId zu einem gesuchten Eintrag aus Maskennummer
  * und Indexzeile
  *
  * maskId: gesuchte Maske
  * groupName: Name der Indexzeile
  * value: Inhalt der Indexzeile
  */
  lookupIndexByLine: function (maskId, groupName, value) {
    var findInfo = new FindInfo();
    var findByIndex = new FindByIndex();
    if (maskId != "") {
      findByIndex.maskId = maskId;
    }

    var objKey = new ObjKey();
    var keyData = new Array(1);
    keyData[0] = value;
    objKey.setName(groupName);
    objKey.setData(keyData);

    var objKeys = new Array(1);
    objKeys[0] = objKey;

    findByIndex.setObjKeys(objKeys);
    findInfo.setFindByIndex(findByIndex);

    var findResult = ixConnect.ix().findFirstSords(findInfo, 1, SordC.mbMin);
    ixConnect.ix().findClose(findResult.getSearchId());

    if (findResult.sords.length == 0) {
      return 0;
    }

    return findResult.sords[0].id;
  },


  /**
  * Ermittelt die ELO ObjektId zu einem gesuchten Eintrag aus Maskennummer
  * und zwei Indexzeilen
  *
  * maskId: gesuchte Maske
  * groupName1: Name der ersten Indexzeile
  * groupName2: Name der zweiten Indexzeile
  * value1: Inhalt der ersten Indexzeile
  * value2: Inhalt der zweiten Indexzeile
  */
  lookupIndexByLine2: function (maskId, groupName1, groupName2, value1, value2) {

    var findInfo = new FindInfo();
    var findByIndex = new FindByIndex();
    if (maskId != "") {
      findByIndex.maskId = maskId;
    }


    var objKey1 = new ObjKey();
    var keyData1 = new Array(1);
    keyData1[0] = value1;
    objKey1.setName(groupName1);
    objKey1.setData(keyData1);

    var objKey2 = new ObjKey();
    var keyData2 = new Array(1);
    keyData2[0] = value2;
    objKey2.setName(groupName2);
    objKey2.setData(keyData2);

    var objKeys = new Array(2);
    objKeys[0] = objKey1;
    objKeys[1] = objKey2;

    findByIndex.setObjKeys(objKeys);
    findInfo.setFindByIndex(findByIndex);

    var findResult = ixConnect.ix().findFirstSords(findInfo, 1, SordC.mbMin);
    ixConnect.ix().findClose(findResult.getSearchId());

    if (findResult.sords.length == 0) {
      return 0;
    }

    return findResult.sords[0].id;
  },

  /**
  * Sucht einen Eintrag mit der angegebenen Maskennummer
  * und Indexzeileninhalt.
  *
  * maskNo: gesuchte Maske
  * groupName: Name der zu durchsuchenden Indexzeile
  * value: Gesuchter Indexwert
  */
  findEntry: function (maskNo, groupName, value) {
    ruleset.setStatusMessage("Searching...");
    var findInfo = new FindInfo();
    var findByIndex = new FindByIndex();

    var objKey = new ObjKey();
    var keyData = new Array(1);
    keyData[0] = value;
    objKey.setName(groupName);
    objKey.setData(keyData);

    var objKeys = new Array(1);
    objKeys[0] = objKey;

    findByIndex.setObjKeys(objKeys);
    if (maskNo != "") {
      findByIndex.maskId = maskNo;
    }
    findInfo.setFindByIndex(findByIndex);

    var findResult = ixConnect.ix().findFirstSords(findInfo, 1, SordC.mbAll);
    var sords = findResult.getSords();
    ixConnect.ix().findClose(findResult.getSearchId());

    if (sords && sords.length > 0) {
      return sords[0];
    } else {
      return new Sord();
    }
  },

  /**
  * Erzeugt, beginnend mit einem Startordner, den angegebenen
  * Unterpfad mit der angegebenen Maske.
  *
  * startId: Startordner
  * destPath: Unterpfad, beginnend ab dem Startordner
  * folderMask: Maske für neu anzulegende Ordner
  */
  createSubPath: function (startId, destPath, folderMask) {
    log.debug("createPath: " + destPath);

    try {
      var editInfo = ixConnect.ix().checkoutSord("ARCPATH[" + startId + "]:" + destPath, EditInfoC.mbOnlyId, LockC.NO);
      log.debug("Path found, GUID: " + editInfo.getSord().getGuid() + "   ID: " + editInfo.getSord().getId());
      return editInfo.getSord().getId();;
    } catch (e) {
      log.debug("Path not found, create new: " + destPath + ", use foldermask: " + folderMask);
    }

    items = destPath.split("¶");
    var sordList = new Array(items.length - 1);
    for (var i = 1; i < items.length; i++) {
      log.debug("Split " + i + " : " + items[i]);
      var sord = new Sord();
      sord.setMask(folderMask);
      sord.setName(items[i]);

      sordList[i - 1] = sord;
    }

    log.debug("now checkinSordPath");
    var ids = ixConnect.ix().checkinSordPath(startId, sordList, new SordZ(SordC.mbName | SordC.mbMask));
    log.debug("checkin done: id: " + ids[ids.length - 1]);

    return ids[ids.length - 1];
  },

  /**
  * Gibt den Volltext eines ELO Dokuments in einem String zurück.
  *
  * objId: ELO Dokument zu dem der Volltext gelesen werden soll
  */
  getFulltext: function (objId) {
    var editInfo = ixConnect.ix().checkoutDoc(objId, null, EditInfoC.mbSordDoc, LockC.NO);
    var url = editInfo.document.docs[0].fulltextContent.url;
    var ext = "." + editInfo.document.docs[0].fulltextContent.ext;
    var name = fu.clearSpecialChars(editInfo.sord.name);

    var temp = File.createTempFile(name, ext);
    log.debug("Temp file: " + temp.getAbsolutePath());

    ixConnect.download(url, temp);
    var text = FileUtils.readFileToString(temp, "UTF-8");
    temp["delete"]();

    return text;

  },

  /**
  * Lädt die Arbeitsversion eines ELO Dokuments in eine lokale Datei
  *
  * pathAndFileName: vollständiger lokaler Pfad für die zu lesende Datei
  * sord: ELO Verschlagwortungsobjekt
  */
  downloadDocument: function (pathAndFileName, sord) {
    var url = sord.docVersion.url;
    var ext = "." + sord.docVersion.ext;
    var file = new File(pathAndFileName + ext);

    ixConnect.download(url, file);

    return file.path;
  },

  /**
  * Lädt die Arbeitsversion eines ELO Dokuments und gibt den Inhalt als String zurück
  *
  * sord: ELO Verschlagwortungsobjekt
  */
  downloadAsString: function (sord) {
    var url = sord.docVersion.url;
    var ext = "." + sord.docVersion.ext;

    var temp = File.createTempFile("ELOasDownloadAsString", ext);
    log.debug("Temp file: " + temp.getAbsolutePath());

    ixConnect.download(url, temp);
    var text = FileUtils.readFileToString(temp, "UTF-8");
    temp["delete"]();

    return text;

  },
  
  /**
  * Löscht alle Dokumente mit überschrittenen Verfallsdatum.
  */
  deleteOldDocs: function (deleteFinally) {
    var delOpts = new DeleteOptions();
    delOpts.setDeleteExpiredOnly(true);
    delOpts.setDeleteFinally(false);
    log.info("Start logically delete Objects");
    ixConnect.ix().cleanupStart(delOpts);

    if (deleteFinally) {
      log.debug("Wait for end of deletion process");
      for (;;) {
        var jobState = ixConnect.ix().cleanupState();
        if (!jobState.jobRunning) {
          break;
        }
        log.debug("still running");
        Thread.sleep(10000);
      }

      delOpts.setDeleteFinally(true);
      log.info("Start delete Objects (finally: " + deleteFinally + ")");
      ixConnect.ix().cleanupStart(delOpts);
    }
  },

  totalCount : 0,
  hourCount : 0,
  dayCount : 0,
  
  /**
  * Ermittelt die Anzahl der aktuell angemeldeten Anwender sowie
  * der in der letzten Stunde und des laufenden Tags maximal 
  * angemeldeten Anwender.
  *
  * Diese Funktion muss regelmäßig aufgerufen werden wenn die
  * Stunden und Tageswerte benötigt werden (z.B. alle 5 Minuten).
  */
  getLoginCount: function () {
    var values = ixConnect.ix().checkoutUsers( null, CheckoutUsersC.SESSION_USERS_RAW, LockC.NO );
    
    if (log.isDebugEnabled()) {
      for (var i = 0; i < values.length; i++) {
        log.debug("- " + i + " : " + values[i].id + " : " + values[i].name);
      }
    }
    
    var actCount = values.length;
    
    if (actCount > this.hourCount) {
      this.hourCount = actCount;
    }
    
    if (actCount > this.dayCount) {
      this.dayCount = actCount;
    }
    
    if (actCount > this.totalCount) {
      this.totalCount = actCount;
    }
    
    var result = { nowCount: actCount, hourCount : this.hourCount, dayCount : this.dayCount, totalCount : this.totalCount, hourChanged : false, dayChanged : false };
    
    var now = new Date();
    var day = now.getDate();
    if (day != this.day) {
      this.day = day;
      this.dayCount = 0;
      result.dayChanged = true;
    }
    
    var hour = now.getHours();
    if (hour != this.hour) {
      this.hour = hour;
      this.hourCount = 0;
      result.hourChanged = true;
    }
    
    return result;
  },
  
  /**
  * Fügt einen Skript-Kommentar im Feed eines Ordners oder Dokuments
  * hinzu.
  *
  * eloObjectGuid : ELO Objekt GUID (nicht die objid) des Eintrags
  * user: ELO Anwender - im Augenblick noch ohne Funktion, IX Einschränkung
  * comment: Text der in den Feed eingetragen werden soll, kein HTML Text
  */
  addFeedComment: function(eloObjectGuid, user, comment) {
    var feed = ixConnect.feedService;
    
    var action = feed.createAction(EActionType.AutoComment, eloObjectGuid);
    action.setText(comment);
    feed.checkinAction(action, ActionC.mbAll);
  }
  
};
// end of namespace ix