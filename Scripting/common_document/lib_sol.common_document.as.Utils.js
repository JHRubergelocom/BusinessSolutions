
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 * *
 * @eloas
 * @requires sol.common.Config
 */
sol.define("sol.common_document.as.Utils", {
  singleton: true,

  /**
   * Get coversheet template
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} config Pdf export configuration
   * @param {String} config.defaultTemplate Default cover template
   * @param {String} config.coversheetBasePath Folder for coversheet templates
   * @return {String} templateId
   */
  getTemplateCoverSheetSord: function (sord, config) {
    var me = this, 
        templateId;

    me.logger.enter("getTemplateCoverSheetSord", { sord: sord.id, config: config });
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start getTemplateCoverSheetSord with sord.id: '{0}', config: '{1}'", sord.id, sol.common.JsonUtils.stringifyAll(me.config, { tabStop: 2 })]);
    }

    templateId = config.defaultTemplate;
    if (sol.common.RepoUtils.exists(config.coversheetBasePath + "/" + sord.maskName)) {
      templateId = config.coversheetBasePath + "/" + sord.maskName;
    }

    me.logger.debug(["Finish getTemplateCoverSheetSord with templateId: '{0}'", templateId]);
    me.logger.exit("getTemplateCoverSheetSord");
    return templateId;
  },

  /**
   * Get error conversion template
   * @private
   * @param {Object} config Pdf export configuration
   * @return {String} Conversion error template
   */
  getTemplateErrorConversionPdf: function (config) {
    return config.errorTemplate;
  },

  /**
   * Get content template
   * @private
   * @param {Object} config Pdf export configuration
   * @return {String} Content template
   */
  getTemplateContents: function (config) {
    return config.contentsTemplate;
  },

  /**
   * Get graphic template
   * @private
   * @param {Object} config Pdf export configuration
   * @return {String} Graphic template
   */
  getTemplateGraphic: function (config) {
    return config.graphicTemplate;
  },

  /**
   * Get text template
   * @private
   * @param {Object} config Pdf export configuration
   * @return {String} Text template
   */
  getTemplateText: function (config) {
    return config.textTemplate;
  },

  /**
   * Get feedInfo template
   * @private
   * @param {Object} config Pdf export configuration
   * @return {String} FeedInfo template
   */
  getTemplateFeedInfo: function (config) {
    return config.feedInfoTemplate;
  },

  /**
   * Get export folder in archive
   * @private
   * @param {Object} config Pdf export configuration
   * @return {String} Folder for PDF Exports
   */
  getExportFolder: function (config) {
    return config.exportFolder;
  },

  /**
   * Converts an output stream to an input stream
   * @private
   * @param {java.io.OutputStream} outputStream
   * @return {java.io.InputStream} inputStream
   */
  convertOutputStreamToInputStream: function (outputStream) {
    var me = this,
        inputStream;

    me.logger.enter("convertOutputStreamToInputStream");
    me.logger.debug(["Start convertOutputStreamToInputStream with outputStream: '{0}'", outputStream]);

    if (!outputStream) {
      me.logger.debug("convertOutputStreamToInputStream 'Output stream is empty'");
      throw "Output stream is empty";
    }
    inputStream = new ByteArrayInputStream(outputStream.toByteArray());
    outputStream.close();

    me.logger.debug(["Finish convertOutputStreamToInputStream with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertOutputStreamToInputStream");
    return inputStream;
  },

  /**
   * Get refpath
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} isCover flag if is coversheet
   * @return {String} refPath
   */
  getRefPath: function (sord, isCover) {
    var pathIds = [],
        refPath;

    sord.refPaths[0].path.forEach(function (ldname) {
      pathIds.push(ldname.id);
    });
    refPath = pathIds.join(File.separator) + File.separator;
    if (sol.common.StringUtils.startsWith(refPath, File.separator)) {
      refPath = "";
    }
    if (sol.common.SordUtils.isFolder(sord)) {
      refPath = refPath + sord.id + File.separator + "1.";
    } else {      
      if (isCover) {
        refPath = refPath + sol.common.FileUtils.sanitizeFilename(sord.name) + File.separator + "2.";
      } else {
        refPath = refPath + sol.common.FileUtils.sanitizeFilename(sord.name) + File.separator + "3.";
      }
    }
    return refPath;
  },

  /**
   * Get pdfName
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} ext document extension
   * @return {String} pdfName;
   */
  getPdfName: function (sord, ext) {
    var sordName, pdfName;

    sordName = sol.common.FileUtils.sanitizeFilename(sord.name);
    if (ext) {
      pdfName = sordName + "." + ext;
    } else {
      pdfName = sordName;
    }
    return pdfName;
  },

  /**
   * Write file to outputstream
   * @private
   * @param {java.io.File} dstFile
   * @return {java.io.OutputStream} pdfOutputStream
   */
  writeFileToPdfOutputStream: function (dstFile) {
    var me = this,
        bytes, pdfOutputStream;

    me.logger.enter("writeFileToPdfOutputStream");
    me.logger.debug(["Start writeFileToPdfOutputStream with dstFile: '{0}'", dstFile]);

    try {
      bytes = Packages.org.apache.commons.io.FileUtils.readFileToByteArray(dstFile);
      pdfOutputStream = new ByteArrayOutputStream(bytes.length);
      pdfOutputStream.write(bytes, 0, bytes.length);
    } catch (ex) {
      pdfOutputStream = null;
      me.logger.error(["error writeFileToPdfOutputStream with dstFile: '{0}'", dstFile], ex);
    }

    me.logger.debug(["Finish writeFileToPdfOutputStream with pdfOutputStream: '{0}'", pdfOutputStream]);
    me.logger.exit("writeFileToPdfOutputStream");

    return pdfOutputStream;
  },

  /**
   * Write outputstream to file
   * @private
   * @param {java.io.OutputStream} pdfOutputStream
   * @param {String} dstDirPath
   * @param {String} pdfName;
   * @return {java.io.File} dstFile
   */
  writePdfOutputStreamToFile: function (pdfOutputStream, dstDirPath, pdfName) {
    var me = this,
        dstFile, fop, contentInBytes;

    me.logger.enter("writePdfOutputStreamToFile");
    me.logger.debug(["Start writePdfOutputStreamToFile with dstDirPath: '{0}', pdfName: '{1}'", dstDirPath, pdfName]);

    dstFile = new java.io.File(dstDirPath + java.io.File.separator + pdfName + ".pdf");

    try {
      fop = new FileOutputStream(dstFile);
      if (!dstFile.exists()) {
        dstFile.createNewFile();
      }

      contentInBytes = pdfOutputStream.toByteArray();
      fop.write(contentInBytes);
      fop.flush();
      fop.close();
    } catch (ex) {
      me.logger.error(["error writePdfOutputStreamToFile with dstDirPath: '{0}', pdfName: '{1}'", dstDirPath, pdfName], ex);
    }

    me.logger.debug(["Finish writePdfOutputStreamToFile with dstFile: '{0}'", dstFile]);
    me.logger.exit("writePdfOutputStreamToFile");

    return dstFile;
  },

  /**
   * Write inputstream to file
   * @private
   * @param {java.io.InputStream} pdfInputStream
   * @param {String} dstDirPath
   * @param {String} pdfName;
   * @return {java.io.File} dstFile
   */
  writePdfInputStreamToFile: function (pdfInputStream, dstDirPath, pdfName) {
    var me = this, 
        dstFile;

    me.logger.enter("writePdfInputStreamToFile");
    me.logger.debug(["Start writePdfInputStreamToFile with dstDirPath: '{0}', pdfName: '{1}'", dstDirPath, pdfName]);

    dstFile = new java.io.File(dstDirPath + java.io.File.separator + pdfName + ".pdf");
    if (!dstFile.exists()) {
      dstFile.createNewFile();
    }

    Packages.org.apache.commons.io.FileUtils.copyInputStreamToFile(pdfInputStream, dstFile);

    me.logger.debug(["Finish writePdfInputStreamToFile with dstFile: '{0}'", dstFile]);
    me.logger.exit("writePdfInputStreamToFile");

    return dstFile;
  },

  pushContent: function (sord, pdfContents, pdfInputStream, refPath, contentName, pdfPages, hint) {
    var me = this, 
        contentType, contentMask, dm;

    contentType = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.document");
    if (sol.common.SordUtils.isFolder(sord)) {
      contentType = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.folder");
    }
    dm = sol.common.SordUtils.getDocMask(sord.maskName, me.language);
    contentMask = dm.name;
    if (dm.nameTranslationKey) {
      if (String(dm.nameTranslationKey).trim() !== "") {
        contentMask = sol.common.TranslateTerms.getTerm(me.language, dm.nameTranslationKey);
      }
    }

    pdfContents.push({ 
      pdfInputStream: pdfInputStream, 
      refPath: refPath, 
      contentName: contentName, 
      pdfPages: pdfPages, 
      contentType: contentType, 
      contentMask: contentMask,
      contentHint: hint
    });    
  },

  /**
   * Converts a Json Object to Json Key/Value array.
   * @private
   * @param {Object} jsonObject Json Object
   * @return {Object[]} Json Key/Value array
   */
  convertJsonToJsonKeyValuePairs: function (jsonObject) {
    var me = this, 
        jsonKeyValuePairs = [],
        prop;

    me.logger.enter("convertJsonToJsonKeyValuePairs"); 
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start convertJsonToJsonKeyValuePairs with jsonObject: '{0}'", sol.common.JsonUtils.stringifyAll(jsonObject, { tabStop: 2 })]);
    }
    
    for (prop in jsonObject) {
      me.logger.debug(["{key: '{0}', value: '{1}'}", prop, jsonObject[prop]]);
      jsonKeyValuePairs.push({ key: prop, value: jsonObject[prop] });
    }

    if (me.logger.debugEnabled) {
      me.logger.debug(["Finish convertJsonToJsonKeyValuePairs with jsonKeyValuePairs: '{0}'", sol.common.JsonUtils.stringifyAll(jsonKeyValuePairs, { tabStop: 2 })]);
    }
    me.logger.exit("convertJsonToJsonKeyValuePairs");

    return jsonKeyValuePairs;
  },

  /**
   * Translate the key of the Key/Value array.
   * @private
   * @param {Object[]} jsonKeyValuePairs Json Key/Value array
   * @param {String} maskName Name of the mask
   */
  translateIndexfields: function (jsonKeyValuePairs, maskName) {
    var me = this,
        i, jsonKeyValuePair, dmLine, key;

    me.logger.enter("translateIndexfields"); 
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start translateIndexfields with jsonKeyValuePairs: '{0}'", sol.common.JsonUtils.stringifyAll(jsonKeyValuePairs, { tabStop: 2 })]);
    }

    for (i = 0; i < jsonKeyValuePairs.length; i++) {
      jsonKeyValuePair = jsonKeyValuePairs[i];
      key = jsonKeyValuePair.key;
      dmLine = sol.common.SordUtils.getDocMaskLine(maskName, jsonKeyValuePair.key);
      if (dmLine) {
        if (dmLine.nameTranslationKey) {
          if (String(dmLine.nameTranslationKey).trim() !== "") {
            key = sol.common.TranslateTerms.getTerm(me.language, dmLine.nameTranslationKey);
          } else if (dmLine.name) {
            if (String(dmLine.name).trim() !== "") {
              key = dmLine.name;
            }
          }  
        } else if (dmLine.name) {
          if (String(dmLine.name).trim() !== "") {
            key = dmLine.name;
          }
        }  
      }
      jsonKeyValuePair.key = key;
    }

    if (me.logger.debugEnabled) {
      me.logger.debug(["Finish translateIndexfields with jsonKeyValuePairs: '{0}'", sol.common.JsonUtils.stringifyAll(jsonKeyValuePairs, { tabStop: 2 })]);
    }
    me.logger.exit("translateIndexfields");

  },

  /**
   * Get Margin Notes from sord.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} config Pdf export configuration
   * @return {Object} Margin notes
   */
  getMarginNotes: function (sord, config) {
    var me = this,
        marginNotes = {},
        notes, date, timeZone, utcOffset;

    me.logger.enter("getMarginNotes"); 
    me.logger.debug(["Start getMarginNotes with sord: '{0}'", sord]);
    
    marginNotes.typeNormal = [];
    marginNotes.typePersonal = [];
    marginNotes.typeStamp = [];
    marginNotes.size = 0;

    timeZone = config.timeZone;
    utcOffset = sol.common.SordUtils.getTimeZoneOffset(timeZone);

    notes = ixConnect.ix().checkoutNotes(sord.id, null, NoteC.mbAll, LockC.NO);
    notes.forEach(function (note) {
      switch (note.type) {
        case NoteC.TYPE_NORMAL:
          date = sol.common.DateUtils.transformIsoDate(note.createDateIso, { asUtc: true, utcOffset: utcOffset });
          date = sol.common.DateUtils.isoToDate(date);
          date = sol.common.DateUtils.format(date, "YYYY.MM.DD HH:mm");
          marginNotes.typeNormal.push({ date: date, desc: note.desc }); 
          marginNotes.size++;
          break;
        case NoteC.TYPE_PERSONAL:
          date = sol.common.DateUtils.transformIsoDate(note.createDateIso, { asUtc: true, utcOffset: utcOffset });
          date = sol.common.DateUtils.isoToDate(date);
          date = sol.common.DateUtils.format(date, "YYYY.MM.DD HH:mm");
          marginNotes.typePersonal.push({ date: date, desc: note.desc }); 	
          marginNotes.size++;
          break;
        case NoteC.TYPE_STAMP:
          date = sol.common.DateUtils.transformIsoDate(note.createDateIso, { asUtc: true, utcOffset: utcOffset });
          date = sol.common.DateUtils.isoToDate(date);
          date = sol.common.DateUtils.format(date, "YYYY.MM.DD HH:mm");
          marginNotes.typeStamp.push({ date: date, desc: note.desc }); 	
          marginNotes.size++;
          break;
        default:
      }
    });

    if (me.logger.debugEnabled) {
      me.logger.debug(["Finish getMarginNotes with marginNotes: '{0}'", sol.common.JsonUtils.stringifyAll(marginNotes, { tabStop: 2 })]);
    }
    me.logger.exit("getMarginNotes");

    return marginNotes;
  },

  /**
   * Get feed url from sord.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} config Pdf export configuration
   * @return {String} feed url
   */
  getFeedUrl: function (sord, config) {
    var me = this, 
        baseUrl, feedUrl, guid, timeZone,
        urlParams = [];

    me.logger.enter("getFeedUrl"); 
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start getFeedUrl with sord: '{0}', config: '{1}'", sord, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }
    
    guid = sord.guid;
    timeZone = config.timeZone;

    urlParams.push("ticket=" + ixConnect.loginResult.clientInfo.ticket);
    urlParams.push("userid=" + ixConnect.loginResult.user.id);
    urlParams.push("lang=" + ixConnect.loginResult.clientInfo.language);
    urlParams.push("timezone=" + timeZone);

    baseUrl = sol.common.WfUtils.getWfBaseUrl();
    feedUrl = baseUrl + "/social/feed/?guid=" + guid + "&" + urlParams.join("&");

    me.logger.debug(["Finish getFeedUrl with feedUrl: '{0}'", feedUrl]);
    me.logger.exit("getFeedUrl");

    return feedUrl;
  },

  /**
   * Append feed info of sord to a PDF.
   * @private
   * @param {String} feedUrl feed url
   * @param {String} dstFeedPdfPath Path PDF Feed File
   * @param {Object} config Pdf export configuration
   */
  convertFeedToPdf: function (feedUrl, dstFeedPdfPath) {
    var me = this;

    me.logger.enter("convertFeedToPdf");
    me.logger.debug(["Start convertFeedToPdf with feedUrl: '{0}', dstFeedPdfPath: '{1}'", feedUrl, dstFeedPdfPath]);

    try {
      sol.common.ExecUtils.startProcess([me.getWkhtmltopdfPath(), "-O", "Portrait", feedUrl, dstFeedPdfPath], { wait: true });
    } catch (ex) {
      me.logger.error(["error convertFeedToPdf with feedUrl: '{0}', dstFeedPdfPath: '{1}'", feedUrl, dstFeedPdfPath], ex);
    }

    me.logger.debug(["Finish convertFeedToPdf"]);
    me.logger.exit("convertFeedToPdf");    
  },

  /**
   * Get actions of document feeds.
   * @private
   * @param {String} objId Object ID
   * @param {Object} config Pdf export configuration
   * @return {de.elo.ix.client.feed.Action[]} actions
   */
  getActions: function (objId, config) {
    var me = this, 
        findInfo, findResult, idx, actions, i, action, date, timeZone, utcOffset, commentText;

    timeZone = config.timeZone;
    utcOffset = sol.common.SordUtils.getTimeZoneOffset(timeZone);

    findInfo = new FindActionsInfo();
    findInfo.objId = objId;

    idx = 0;
    findResult = ixConnect.getFeedService().findFirstActions(findInfo, 200, ActionC.mbAll);

    actions = [];

    while (true) {
      for (i = 0; i < findResult.actions.length; i++) {
        action = findResult.actions[i];
        date = sol.common.DateUtils.transformIsoDate(action.createDateIso, { asUtc: true, utcOffset: utcOffset });
        date = sol.common.DateUtils.isoToDate(date);
        date = sol.common.DateUtils.format(date, "YYYY.MM.DD HH:mm");

        commentText = "";
        switch (action.type) {
          case EActionType.UserComment:
            commentText = action.text;
            break;

          case EActionType.AutoComment:
            commentText = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.autoComment");
            break;
  
          case EActionType.Released:
            commentText = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.released");
            break;

          case EActionType.SordCreated:
            commentText = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.sordCreated");
            break;

          case EActionType.Survey:
            commentText = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.survey");
            break;

          case EActionType.VersionCreated:
            commentText = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.versionCreated");
            break;

          case EActionType.WorkVersionCreated:
            commentText = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.workVersionCreated");
            break;

          case EActionType.WorkVersionSwitched:
            commentText = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.workVersionSwitched");
            break;
                                                                      
          default:
        }
        actions.push({ createDateIso: date, commentText: commentText, userName: action.userName });
      }
      if (!findResult.moreResults) {
        break;
      }
      idx += findResult.actions.length;
      findResult = ixConnect.getFeedService().findNextActions(findResult.searchId, idx, 200, ActionC.mbAll);
    }
    return actions;
  },


  /**
   * Converts a feedInfo to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertFeedInfoToPdf: function (sord, dstDirPath, config) {
    var me = this,
        inputStream = null,
        fopRenderer, templateId, result, data, pdfName;

    me.logger.enter("convertFeedInfoToPdf");
    me.logger.debug(["Start convertFeedInfoToPdf with sord: '{0}'", sord]);

    templateId = me.getTemplateFeedInfo(config);
    data = { actions: me.getActions(sord.id, config) };
    data.userFeeds = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.userFeeds");
    data.noUserFeeds = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.noUserFeeds");
    pdfName = "_feed.pdf";
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render(pdfName, data);
    inputStream = me.convertOutputStreamToInputStream(result.outputStream);
    me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);

    me.logger.debug(["Finish convertFeedInfoToPdf with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertFeedInfoToPdf");

    return inputStream;
  },

  /**
   * Append feed info of sord to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @param {String} pdfName
   * @param {Object} config Pdf export configuration
   * @return {java.io.File} dstPdfFile
   */
  appendFeedInfo: function (sord, dstDirPath, pdfName, config) {
    var me = this,
        dstPdfFile,
        dstPdfPath,
        mergedOutputStream, pdfInputStreams, pdfInputStream;

    me.logger.enter("appendFeedInfo");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start appendFeedInfo with sord: '{0}', dstDirPath: '{1}', pdfName: '{2}', config: '{3}'", sord, dstDirPath, pdfName, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    dstPdfFile = new java.io.File(dstDirPath + java.io.File.separator + pdfName + ".pdf");
    dstPdfPath = dstPdfFile.getPath();

    mergedOutputStream = new ByteArrayOutputStream();
    pdfInputStreams = [];
    pdfInputStream = new FileInputStream(dstPdfPath);
    if (pdfInputStream) {
      pdfInputStreams.push(pdfInputStream);
    }
    pdfInputStream = me.convertFeedInfoToPdf(sord, dstDirPath, config);

    if (pdfInputStream) {
      pdfInputStreams.push(pdfInputStream);
    }
    sol.common.as.PdfUtils.mergePdfStreams(pdfInputStreams, mergedOutputStream);
    dstPdfFile = me.writePdfOutputStreamToFile(mergedOutputStream, dstDirPath, pdfName);

    me.logger.debug(["Finish appendFeedInfo with dstPdfFile: '{0}'", dstPdfFile]);
    me.logger.exit("appendFeedInfo");    

    return dstPdfFile;
  },

  /**
   * Create PDF from sord
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} templateId
   * @param {String} dstDirPath
   * @param {String} ext
   * @param {String} pdfName
   * @param {Object} config Pdf export configuration
   * @param {Boolean} config.pdfExport Flag to export folder structure in one pdf document or in zip file
   * @param {Boolean} config.pdfA Flag to convert pdf document to pdf/a standard
   * @param {Object[]} pdfContents
   */
  createPdfFromSord: function (sord, templateId, dstDirPath, ext, pdfName, config, pdfContents) {
    var me = this,
        data, fopRenderer, result, pdfInputStream, refPath, pdfPages, 
        dstFile, isCover, dm, timeZone, utcOffset, date;

    me.logger.enter("createPdfFromSord"); 
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start createPdfFromSord with sord: '{0}', templateId: '{1}', dstDirPath: '{2}', ext: '{3}', pdfName: '{4}', config: '{5}'", sord, templateId, dstDirPath, ext, pdfName, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    timeZone = config.timeZone;
    utcOffset = sol.common.SordUtils.getTimeZoneOffset(timeZone);

    if (ext) {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord, ext: ext };
    } else {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord };
    }
    if (sol.common.SordUtils.isFolder(sord)) {
      data.folder = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.folder");
    }

    data.maskName = sord.maskName;
    dm = sol.common.SordUtils.getDocMask(sord.maskName, me.language);
    if (dm.nameTranslationKey) {
      if (String(dm.nameTranslationKey).trim() !== "") {
        data.maskName = sol.common.TranslateTerms.getTerm(me.language, dm.nameTranslationKey);
      }
    }

    if (String(data.maskName) === "E-mail") {
      data.from = data.sord.objKeys.ELOOUTL1;
      data.to = data.sord.objKeys.ELOOUTL2;
      data.cc = data.sord.objKeys.ELOOUTL4;
    }

    if (config.metadata) {
      if (config.metadata.sordKeys === true) {
        data.sordKeysLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.sordKeysLabel");
        data.maskNameLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.maskNameLabel");
        data.nameLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.nameLabel");
        data.descLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.descLabel");
        data.IDateIsoLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.IDateIsoLabel");
        if (data.sord.IDateIso) {
          if (String(data.sord.IDateIso).trim() !== "") {
            date = sol.common.DateUtils.transformIsoDate(data.sord.IDateIso, { asUtc: true, utcOffset: utcOffset });
            date = sol.common.DateUtils.isoToDate(date);
            date = sol.common.DateUtils.format(date, "YYYY.MM.DD HH:mm");
            data.sord.IDateIso = date;    
          }
        }
        data.XDateIsoLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.XDateIsoLabel");
        if (data.sord.XDateIso) {
          if (String(data.sord.XDateIso).trim() !== "") {
            date = sol.common.DateUtils.transformIsoDate(data.sord.XDateIso, { asUtc: true, utcOffset: utcOffset });
            date = sol.common.DateUtils.isoToDate(date);
            date = sol.common.DateUtils.format(date, "YYYY.MM.DD HH:mm");
            data.sord.XDateIso = date;    
          }
        }
        data.ownerNameLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.ownerNameLabel");
        data.sordKeys = true;
      }
      if (config.metadata.objKeys === true) {
        data.objKeysLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.objKeysLabel");
        if (data.sord.objKeys) {
          data.sord.objKeysArray = me.convertJsonToJsonKeyValuePairs(data.sord.objKeys);
          me.translateIndexfields(data.sord.objKeysArray, sord.maskName);
          data.objKeys = true;
        }
      }
      if (config.metadata.mapKeys === true) {
        data.mapKeysLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.mapKeysLabel");
        if (data.sord.mapKeys) {
          data.sord.mapKeysArray = me.convertJsonToJsonKeyValuePairs(data.sord.mapKeys);
          data.mapKeys = true;
        }
      }  
    }

    if (config.marginNotes === true) {
      data.marginNotes = me.getMarginNotes(sord, config);
      data.showMarginNotes = true;
      data.headerMarginNotes = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.headerMarginNotes");
      data.headerGeneralMarginNote = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.headerGeneralMarginNote");
      data.headerPersonalMarginNote = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.headerPersonalMarginNote");
      data.headerPermanentMarginNote = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.headerPermanentMarginNote");
    }
 
    if (config.pdfExport === true) {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
      result = fopRenderer.render(pdfName, data);
      pdfInputStream = me.convertOutputStreamToInputStream(result.outputStream);
      isCover = null;
      if (pdfName.indexOf(".cover") > -1) {
        isCover = true;
      }
      refPath = me.getRefPath(sord, isCover);
      dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);

      if (config.feedInfo === true) {
        dstFile = me.appendFeedInfo(sord, dstDirPath, pdfName, config);
        pdfInputStream = new FileInputStream(dstFile);    
      }

      try {
        pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
      } catch (ex) {
        pdfPages = 0;
        me.logger.error(["error createPdfFromSord with sord: '{0}', templateId: '{1}', dstDirPath: '{2}', ext: '{3}', pdfName: '{4}', config: '{5}'", sord, templateId, dstDirPath, ext, pdfName, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })], ex);
      }
      me.pushContent(sord, pdfContents, pdfInputStream, refPath, pdfName, pdfPages, "");
    } else {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
      result = fopRenderer.render(pdfName, data);
      dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);

      if (config.feedInfo === true) {
        dstFile = me.appendFeedInfo(sord, dstDirPath, pdfName, config);
      }
    }

    if (config.pdfA === true) {
      me.convertPDFtoPDFA(dstFile);
    }
    me.logger.debug(["Finish createPdfFromSord"]);
    me.logger.exit("createPdfFromSord");
  },

  /**
   * Create coversheet from sord
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @param {String} pdfName
   * @param {Object} config Pdf export configuration
   * @param {Object[]} pdfContents
   */
  createCoverSheetSord: function (sord, dstDirPath, pdfName, config, pdfContents) {
    var me = this,
        templateId;

    me.logger.enter("createCoverSheetSord");   
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start createCoverSheetSord with sord: '{0}', dstDirPath: '{1}', pdfName: '{2}', config: '{3}'", sord, dstDirPath, pdfName, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    templateId = me.getTemplateCoverSheetSord(sord, config);
    me.createPdfFromSord(sord, templateId, dstDirPath, "pdf", pdfName, config, pdfContents);

    me.logger.debug(["Finish createCoverSheetSord"]);
    me.logger.exit("createCoverSheetSord");
  },

  /**
   * Create error conversion pdf
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} ext
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @param {Object[]} pdfContents
   */
  createErrorConversionPdf: function (sord, ext, dstDirPath, config, pdfContents) {
    var me = this,
        templateId, pdfName, data, fopRenderer, result, pdfInputStream,
        refPath, contentName, dstFile, pdfPages, hint;

    me.logger.enter("createErrorConversionPdf");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start createErrorConversionPdf with sord: '{0}', ext: '{1}', dstDirPath: '{2}', config: '{3}'", sord, ext, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }    
    
    templateId = me.getTemplateErrorConversionPdf(config);
    if (ext) {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord, ext: ext };
    } else {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord };
    }
    data.msg = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.error.msg");
    data.hint = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.conversionFailed");
    pdfName = me.getPdfName(sord, ext);

    if (config.pdfExport === true) {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
      result = fopRenderer.render(pdfName, data);
      pdfInputStream = me.convertOutputStreamToInputStream(result.outputStream);
      refPath = me.getRefPath(sord);

      if (ext) {
        contentName = sord.name + "." + ext;
      } else {
        contentName = sord.name;
      } 
      dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);
      try {
        pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
      } catch (ex) {
        pdfPages = 0;
        me.logger.error(["error createErrorConversionPdf with sord: '{0}', ext: '{1}', dstDirPath: '{2}', config: '{3}'", sord, ext, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })], ex);
      }
      hint = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.conversionFailed");
      me.pushContent(sord, pdfContents, pdfInputStream, refPath, contentName, pdfPages, hint);

      sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });

    } else {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
      result = fopRenderer.render(pdfName, data);
      dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);
    }
    me.logger.debug(["Finish createErrorConversionPdf"]);
    me.logger.exit("createErrorConversionPdf");
  },

  /**
   * Converts a graphic to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} ext
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertGraphicToPdf: function (sord, ext, dstDirPath, config) {
    var me = this,
        inputStream = null,
        fopRenderer, templateId, result, data, pdfName;

    me.logger.enter("convertGraphicToPdf");
    me.logger.debug(["Start convertGraphicToPdf with sord: '{0}'", sord]);

    templateId = me.getTemplateGraphic(config);  
    if (ext) {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord, ext: ext };
    } else {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord };
    }

    pdfName = me.getPdfName(sord, ext);
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render(pdfName, data);
    inputStream = me.convertOutputStreamToInputStream(result.outputStream);
    me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);

    me.logger.debug(["Finish convertToPdf with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertGraphicToPdf");

    return inputStream;
  },

  /**
   * Converts a text to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} ext
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertTextToPdf: function (sord, ext, dstDirPath, config) {
    var me = this,
        inputStream = null,
        templateId, text, lines, data, pdfName, fopRenderer, result;

    me.logger.enter("convertTextToPdf");
    me.logger.debug(["Start convertTextToPdf with sord: '{0}'", sord]);

    templateId = me.getTemplateText(config);  
    text = sol.common.RepoUtils.downloadToString(sord.id);
    lines = sol.common.StringUtils.splitLines(text);
    data = {};
    data.lines = [];
    lines.forEach(function (line) {
      line = String(line);
      data.lines.push({ line: line });
    });

    pdfName = me.getPdfName(sord, ext);
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render(pdfName, data);
    inputStream = me.convertOutputStreamToInputStream(result.outputStream);
    me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);

    me.logger.debug(["Finish convertTextToPdf with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertTextToPdf");

    return inputStream;
  },

  /**
   * Converts a tiff document to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} ext
   * @param {String} dstDirPath
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertTiffToPdf: function (sord, ext, dstDirPath) {
    var me = this,
        inputStream = null,
        pdfInputStream = null,
        sourceFile, targetFile, fileName;

    me.logger.enter("convertTiffToPdf");
    me.logger.debug(["Start convertTiffToPdf with sord: '{0}'", sord]);

    try {
      inputStream = sol.common.RepoUtils.downloadToStream(sord.id);
      fileName = sol.common.FileUtils.sanitizeFilename(sord.name);

      sourceFile = me.writeInputStreamToFile(inputStream, dstDirPath, fileName, ext);
      targetFile = new File(dstDirPath + java.io.File.separator + fileName + ".pdf");

      Packages.de.elo.mover.utils.ELOAsTiffUtils.saveTiffAsPdf(sourceFile, targetFile);
      pdfInputStream = new ByteArrayInputStream(Packages.org.apache.commons.io.FileUtils.readFileToByteArray(targetFile));
      sol.common.FileUtils.delete(sourceFile, { quietly: true });
      
    } catch (ex) {
      me.logger.error(["error convertTiffToPdf with sourceFile:'{0}', targetFile:'{1}'", sourceFile, targetFile], ex);
    }

    me.logger.debug(["Finish convertTiffToPdf with inputStream: '{0}'", pdfInputStream]);
    me.logger.exit("convertTiffToPdf");
    return pdfInputStream;
  },

  /**
   * Converts a tiff file to a PDF.
   * @private
   * @param {String} filePath   
   * @param {String} dstDirPath
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertTiffFileToPdf: function (filePath, dstDirPath) {
    var me = this,
        pdfInputStream = null,
        sourceFile, targetFile, fileName;

    me.logger.enter("convertTiffFileToPdf");
    me.logger.debug(["Start convertTiffFileToPdf with filePath: '{0}', dstDirPath:'{1}'", filePath, dstDirPath]);

    try {
      sourceFile = new File(filePath);
      fileName = sol.common.FileUtils.getName(sourceFile);
      targetFile = new File(dstDirPath + java.io.File.separator + fileName + ".pdf");

      Packages.de.elo.mover.utils.ELOAsTiffUtils.saveTiffAsPdf(sourceFile, targetFile);
      pdfInputStream = new ByteArrayInputStream(Packages.org.apache.commons.io.FileUtils.readFileToByteArray(targetFile));
      sol.common.FileUtils.delete(sourceFile, { quietly: true });

    } catch (ex) {
      me.logger.error(["error convertTiffFileToPdf with sourceFile:'{0}', targetFile:'{1}'", sourceFile, targetFile], ex);
    }


    me.logger.debug(["Finish convertTiffFileToPdf with inputStream: '{0}'", pdfInputStream]);
    me.logger.exit("convertTiffFileToPdf");
    return pdfInputStream;
  },

  getWkhtmltopdfPath: function () {
    var me = this,
        wkhtmltopdfPath, wkhtmltopdfRelativePath;

    me.logger.enter("getWkhtmltopdfPath");
    me.logger.debug(["Start getWkhtmltopdfPath"]);

    wkhtmltopdfRelativePath = "\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";
    wkhtmltopdfPath = sol.common.ExecUtils.getProgramFilesDir() + wkhtmltopdfRelativePath;

    me.logger.debug(["Finish getWkhtmltopdfPath with wkhtmltopdfPath: '{0}'", wkhtmltopdfPath]);
    me.logger.exit("getWkhtmltopdfPath");

    return wkhtmltopdfPath;
  },

  /**
   * Converts a html document to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} ext
   * @param {String} dstDirPath
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertHtmlToPdf: function (sord, ext, dstDirPath) {
    var me = this,
        inputStream = null,
        pdfInputStream = null,
        sourceFile, targetFile, fileName;

    me.logger.enter("convertHtmlToPdf");
    me.logger.debug(["Start convertHtmlToPdf with sord: '{0}'", sord]);

    try {
      inputStream = sol.common.RepoUtils.downloadToStream(sord.id);
      fileName = sol.common.FileUtils.sanitizeFilename(sord.name);

      sourceFile = me.writeInputStreamToFile(inputStream, dstDirPath, fileName, ext);
      targetFile = new File(dstDirPath + java.io.File.separator + fileName + ".pdf");

      sol.common.ExecUtils.startProcess([me.getWkhtmltopdfPath(), "-O", "Portrait", sourceFile.getPath(), targetFile.getPath()], { wait: true });

      pdfInputStream = new ByteArrayInputStream(Packages.org.apache.commons.io.FileUtils.readFileToByteArray(targetFile));
      sol.common.FileUtils.delete(sourceFile, { quietly: true });
      
    } catch (ex) {
      me.logger.error(["error convertHtmlToPdf with sourceFile:'{0}', targetFile:'{1}'", sourceFile, targetFile], ex);
    }

    me.logger.debug(["Finish convertHtmlToPdf with inputStream: '{0}'", pdfInputStream]);
    me.logger.exit("convertHtmlToPdf");
    return pdfInputStream;
  },

  /**
   * Converts a html file to a PDF.
   * @private
   * @param {String} filePath   
   * @param {String} dstDirPath
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertHtmlFileToPdf: function (filePath, dstDirPath) {
    var me = this,
        pdfInputStream = null,
        sourceFile, targetFile, fileName;

    me.logger.enter("convertHtmlFileToPdf");
    me.logger.debug(["Start convertHtmlFileToPdf with filePath: '{0}', dstDirPath:'{1}'", filePath, dstDirPath]);

    try {
      sourceFile = new File(filePath);
      fileName = sol.common.FileUtils.getName(sourceFile);
      targetFile = new File(dstDirPath + java.io.File.separator + fileName + ".pdf");

      sol.common.ExecUtils.startProcess([me.getWkhtmltopdfPath(), "-O", "Portrait", sourceFile.getPath(), targetFile.getPath()], { wait: true });

      pdfInputStream = new ByteArrayInputStream(Packages.org.apache.commons.io.FileUtils.readFileToByteArray(targetFile));
      sol.common.FileUtils.delete(sourceFile, { quietly: true });

    } catch (ex) {
      me.logger.error(["error convertHtmlFileToPdf with sourceFile:'{0}', targetFile:'{1}'", sourceFile, targetFile], ex);
    }

    me.logger.debug(["Finish convertHtmlFileToPdf with inputStream: '{0}'", pdfInputStream]);
    me.logger.exit("convertHtmlFileToPdf");
    return pdfInputStream;
  },

  /**
   * Converts a document to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertToPdf: function (sord, dstDirPath, config) {
    var me = this,
        inputStream = null,
        ext, converter, os, currentIxVersion;

    me.logger.enter("convertToPdf");
    me.logger.debug(["Start convertToPdf with sord: '{0}'", sord]);

    try {
      ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
      if (ext) {
        ext = String(ext);
        ext = ext.toLowerCase();
        switch (ext) {
          case "pdf":
            me.logger.debug("skip converting, document is already an PDF");
            inputStream = sol.common.RepoUtils.downloadToStream(sord.id);    
            break;
          case "msg":
            os = String(java.lang.System.getProperty("os.name").toLowerCase());
            if (!sol.common.StringUtils.contains(os, "win")) {
              currentIxVersion = ixConnect.version;
              if (!sol.common.RepoUtils.checkVersion(currentIxVersion, "20.00.000")) {
                me.logger.debug(["format '{0}' is not supported in os '{1}' and ixversion '{2}'", ext, os, currentIxVersion]);
                return inputStream;  
              }
            }
            me.logger.debug("convert Msg to PDF");
            inputStream = me.convertMsgWithAttchmentToPdf(sord, dstDirPath, config);
            break;  
          case "jpg":
          case "jpeg":
          case "bmp":
          case "png":
          case "gif":
          case "ico":
            me.logger.debug("convert Graphic to PDF");
            inputStream = me.convertGraphicToPdf(sord, ext, dstDirPath, config);            
            break;
          case "tif":
          case "tiff":
            me.logger.debug("convert Tiff to PDF");
            inputStream = me.convertTiffToPdf(sord, ext, dstDirPath);            
            break;
          case "ppt":
          case "pot":
          case "pps":
          case "pptx":
          case "potx":
          case "pptm":
          case "ppt":
            os = String(java.lang.System.getProperty("os.name").toLowerCase());
            if (!sol.common.StringUtils.contains(os, "win")) {
              me.logger.debug(["format '{0}' is not supported in os '{1}'", ext, os]);
              return inputStream;
            }
          default:
            if (sol.common.StringUtils.contains(config.whiteListTextFile, ext)) {
              me.logger.debug("convert Text to PDF");
              inputStream = me.convertTextToPdf(sord, ext, dstDirPath, config);              
              return inputStream;
            }
            converter = sol.create("sol.common.as.functions.OfficeConverter", {
              openFromRepo: {
                objId: sord.id
              },
              saveToStream: {
                format: "pdf"
              }
            });
            if (converter.isSupported(ext)) {
              inputStream = converter.execute();
            } else {
              if (inputStream == null) {
                me.logger.warn(["format '{0}' is not supported", ext]);
              }
            }    
            break;
        }  
      }
    } catch (ex) {
      me.logger.debug(["error converting document (objId={0}, name={1})", sord.id, sord.name], ex);
    }
    me.logger.debug(["Finish convertToPdf with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertToPdf");
    return inputStream;
  },

  /**
   * Converts a document to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @param {Boolean} config.pdfExport Flag to export folder structure in one pdf document or in zip file
   * @param {Boolean} config.pdfA Flag to convert pdf document to pdf/a standard
   * @param {Object[]} pdfContents
   */
  createPdfDocument: function (sord, dstDirPath, config, pdfContents) {
    var me = this,
        pdfInputStream, ext, refPath, contentName, pdfPages, dstFile, pdfName;

    me.logger.enter("createPdfDocument");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start createPdfDocument with sord: '{0}'dstDirPath: '{1}', config: '{2}'", sord, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    pdfInputStream = me.convertToPdf(sord, dstDirPath, config);
    ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;  

    if (pdfInputStream != null) {
      pdfName = me.getPdfName(sord, ext);
      dstFile = me.writePdfInputStreamToFile(pdfInputStream, dstDirPath, pdfName);

      if (config.pdfA === true) {
        me.convertPDFtoPDFA(dstFile);
      }

      if (config.annotationNotes === true) {
        me.setAnnotationNotes(dstFile, sord);
      }

      pdfInputStream = new ByteArrayInputStream(Packages.org.apache.commons.io.FileUtils.readFileToByteArray(dstFile));

      if (config.pdfExport === true) {
        refPath = me.getRefPath(sord);
        if (ext) {
          contentName = sord.name + "." + ext;
        } else {
          contentName = sord.name;
        }
        pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
        me.pushContent(sord, pdfContents, pdfInputStream, refPath, contentName, pdfPages, "");
        sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
      }
    } else {
      me.createErrorConversionPdf(sord, ext, dstDirPath, config, pdfContents);
    }
    me.logger.debug(["Finish createPdfDocument"]);
    me.logger.exit("createPdfDocument");
  },

  /**
   * Adjust contents.
   * @private
   * @param {Object[]} contents
   * @return {Object[]} new contents
   */
  adjustContent: function (contents) {
    var me = this, 
        newContents, newName, oldContents, i, j, newContent, oldContent;

    me.logger.enter("adjustContent");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start adjustContent with contents: '{0}'", sol.common.JsonUtils.stringifyAll(contents, { tabStop: 2 })]);
    }

    newContents = [];
    oldContents = [];
    contents.forEach(function (content) {
      if (content.name.indexOf(".cover") > -1) {
        newName = content.name.split(".cover").join("");
        newName = newName + "  ------  (" + content.type + ", " + content.mask + ")";
        if (newName.length > 78) {
          newName = newName.substr(0, 78);
        }
        newContents.push({ name: newName, pageno: content.pageno });
      } else {
        oldContents.push({ name: content.name, hint: content.hint });
      }
    });
    for (i = 0; i < newContents.length; i++) {
      newContent = newContents[i];
      for (j = 0; j < oldContents.length; j++) {
        oldContent = oldContents[j];
        if (newContent.name.indexOf(oldContent.name) > -1) {
          if (oldContent.hint != "") {
            newContent.name = newContent.name + " [" + oldContent.hint + "]";
            break;
          }
        }
      }
    }

    if (me.logger.debugEnabled) {
      me.logger.debug(["Finish adjustContent with newContents: '{0}'", sol.common.JsonUtils.stringifyAll(newContents, { tabStop: 2 })]);
    }
    me.logger.exit("adjustContent");
    
    return newContents;
  },

  /**
   * Get number of pages for content pdf.
   * @private
   * @param {String} folderName
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @param {Object[]} pdfContents
   * @return {Number} number of pages
   */
  getOffsetSumPages: function (folderName, dstDirPath, config, pdfContents) {
    var me = this,
        templateId, data, fopRenderer, result, dstFile, pdfPages, fop, contentInBytes;

    me.logger.enter("getOffsetSumPages");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start getOffsetSumPages with folderName: '{0}', dstDirPath: '{1}', config: '{2}'", folderName, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }
    
    pdfPages = 0;
    templateId = me.getTemplateContents(config);
    data = {};
    data.header = { name: folderName };
    data.overview = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.overview");
    data.content = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.content");
    data.noContentFound = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.noContentFound");
    data.contents = [];

    pdfContents.forEach(function (pdfContent) {
      data.contents.push({ name: pdfContent.contentName, pageno: pdfContent.pdfPages, type: pdfContent.contentType, mask: pdfContent.contentMask, hint: pdfContent.contentHint });
    });

    data.contents = me.adjustContent(data.contents);
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render("Content", data);
    dstFile = new java.io.File(dstDirPath + java.io.File.separator + "All.pdf");

    try {
      fop = new FileOutputStream(dstFile);
      if (!dstFile.exists()) {
        dstFile.createNewFile();
      }
      contentInBytes = result.outputStream.toByteArray();
      fop.write(contentInBytes);
      fop.flush();
      fop.close();

      pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
      sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
    } catch (ex) {
      pdfPages = 0;
      me.logger.error(["error getOffsetSumPages with folderName: '{0}', dstDirPath: '{1}', config: '{2}'", folderName, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })], ex);
    }

    me.logger.debug(["Finish getOffsetSumPages with pdfPages: '{0}'", pdfPages]);
    me.logger.exit("getOffsetSumPages");
    
    return pdfPages;
  },

  /**
   * Set hyperlinks in content File.
   * @private
   * @param {java.io.File} dstPdfFile PDF Content File
   * @param {Object[]} contents contents text and pages
   */
  setHyperlinks: function (dstPdfFile, contents) {
    var me = this,
        pdfDocument, i, pdfPage, page, pdfPages, x, y, content, link, changePage, ip, border;

    me.logger.enter("setHyperlinks");
    me.logger.debug(["Start setHyperlinks with dstPdfFile: '{0}', contents: '{1}'", dstPdfFile, contents]);

    try {
      pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstPdfFile);
      pdfDocument = new Packages.com.aspose.pdf.Document(dstPdfFile.getPath());
      i = 0;
      ip = 0;
      pdfPage = 1;
      y = 628;
      x = 57;
      while (pdfPage <= pdfPages && i < contents.length) {
        page = pdfDocument.getPages().get_Item(pdfPage);        
        if (contents.length > 0) {          
          content = contents[i];
          link = new Packages.com.aspose.pdf.LinkAnnotation(page, new Packages.com.aspose.pdf.Rectangle(x, y, x + 490, y + 11));
          border = new Packages.com.aspose.pdf.Border(link);
          border.setWidth(0);
          link.setBorder(border);      
          link.setAction(new Packages.com.aspose.pdf.GoToAction(content.pageno));
          page.getAnnotations().add(link);
          i++;
          ip++;
          y -= 17.1;
          changePage = false;
          if (pdfPage == 1) {
            if ((ip % 32) == 0) {
              changePage = true;
            }  
          } else {
            if ((ip % 39) == 0) {
              changePage = true;
            }
          }
          if ((ip % 15) == 0) {
            y += 2;
          }
          if (changePage == true) {
            y = 742;
            pdfPage++;
            ip = 0;
          }
        }
      }
      pdfDocument.save(dstPdfFile.getPath());
    } catch (ex) {
      me.logger.error(["error setHyperlinks with dstPdfFile:'{0}', data:'{1}'", dstPdfFile, contents], ex);
    }

    me.logger.debug(["Finish setHyperlinks"]);
    me.logger.exit("setHyperlinks");    

  },

  /**
   * Get inputstream of content pdf.
   * @private
   * @param {String} folderName
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @param {Object[]} pdfContents
   * @return {java.io.InputStream} Inputstream of content pdf
   */
  createContent: function (folderName, dstDirPath, config, pdfContents) {
    var me = this,
        templateId, fopRenderer, result, data, pdfInputStream, sumPages, dstFile, pdfOutputStream;

    me.logger.enter("createContent");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start createContent with folderName: '{0}', dstDirPath: '{1}', config: '{2}'", folderName, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    templateId = me.getTemplateContents(config);
    data = {};
    data.header = { name: folderName };
    data.overview = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.overview");
    data.content = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.content");
    data.noContentFound = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.noContentFound");
    data.contents = [];

    sumPages = me.getOffsetSumPages(folderName, dstDirPath, config, pdfContents);
    if (config.feedInfo === true) {
      if (sumPages > 0) {
        sumPages--;
      }
    }

    pdfContents.forEach(function (pdfContent) {
      sumPages += pdfContent.pdfPages;
      data.contents.push({ name: pdfContent.contentName, pageno: sumPages, type: pdfContent.contentType, mask: pdfContent.contentMask, hint: pdfContent.contentHint });
    });

    data.contents = me.adjustContent(data.contents);
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render("Content", data);

    dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, "All.pdf");
    me.setHyperlinks(dstFile, data.contents);
    pdfOutputStream = me.writeFileToPdfOutputStream(dstFile);
    sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });

    if (pdfOutputStream) {
      pdfInputStream = me.convertOutputStreamToInputStream(pdfOutputStream);
    } else {
      pdfInputStream = null;
    }

    me.logger.debug(["Finish createContent with pdfInputStream: '{0}'", pdfInputStream]);
    me.logger.exit("createContent");
    
    return pdfInputStream;
  },

  /**
   * Converts a PDF to the PDF/A standard.
   * @private
   * @param {java.io.File} dstPdfFile PDF File
   */
  convertPDFtoPDFA: function (dstPdfFile) {
    var me = this, 
        doc, dstPdfPath, dstPdfAPath, dstPdfAFile;

    me.logger.enter("convertPDFtoPDFA");
    me.logger.debug(["Start convertPDFtoPDFA with dstPdfFile: '{0}'", dstPdfFile]);

    dstPdfPath = dstPdfFile.getPath();
    dstPdfAPath = dstPdfPath + "_";
    doc = new Packages.com.aspose.pdf.Document(dstPdfPath);
    doc.convert("file.log", Packages.com.aspose.pdf.PdfFormat.PDF_A_1B, Packages.com.aspose.pdf.ConvertErrorAction.Delete);
    doc.save(dstPdfAPath);
    dstPdfAFile = new File(dstPdfAPath);
    dstPdfFile.delete();
    dstPdfAFile.renameTo(dstPdfFile);

    me.logger.debug(["Finish convertPDFtoPDFA"]);
    me.logger.exit("convertPDFtoPDFA");    
  },

  /**
   * Get graph.
   * @private
   * @param {com.aspose.pdf.Page} page page
   * @param {Double} pWidth pWidth
   * @param {Double} pHeight pHeight
   * @return {com.aspose.pdf.drawing.Graph} graph
   */
  getGraph: function (page, pWidth, pHeight) {
    var me = this, 
        graph, rect;

    me.logger.enter("getGraph");
    me.logger.debug(["Start getGraph with page: '{0}', pWidth: '{1}', pHeight: '{2}'", page, pWidth, pHeight]);

    if (page.getParagraphs().getCount() == 0) {
      page.getPageInfo().getMargin().setLeft(0);
      page.getPageInfo().getMargin().setTop(0);
      graph = new Packages.com.aspose.pdf.drawing.Graph(pWidth, pHeight);
      rect = new Packages.com.aspose.pdf.drawing.Rectangle(0, 0, pWidth, pHeight);
      graph.getShapes().add(rect);
      page.getParagraphs().add(graph);
    }
    graph = page.getParagraphs().get_Item(0);

    me.logger.debug(["Finish getGraph with graph: '{0}'", graph]);
    me.logger.exit("getGraph");

    return graph;
  },

  /**
   * Get graph.
   * @private
   * @param {Integer} noteRGB noteRGB
   * @param {Boolean} setAlpha setAlpha
   * @return {com.aspose.pdf.Color} color
   */
  getColor: function (noteRGB, setAlpha) {
    var me = this,
        color, red, green, blue, alpha;

    me.logger.enter("getColor");
    me.logger.debug(["Start getColor with noteRGB: '{0}'", noteRGB]);

    color = new Packages.java.awt.Color(noteRGB);
    blue = color.getRed();
    green = color.getGreen();
    red = color.getBlue();
    alpha = 127;
    if (setAlpha) {
      alpha = color.getAlpha();
    }
    color = Packages.com.aspose.pdf.Color.fromArgb(alpha, red, green, blue);

    me.logger.debug(["Finish getColor with graph: '{0}'", color]);
    me.logger.exit("getColor");

    return color;
  },

  /**
   * Set annotation stamp in a PDF.
   * @private
   * @param {com.aspose.pdf.Document} pdfDocument PDF File
   * @param {de.elo.ix.client.Note} note note
   */
  setAnnotationStamp: function (pdfDocument, note) {
    var me = this, 
        page, pHeight, pWidth, graph, rect, text, fontHeight, fontRGB,
        lineWidth, height, width, XPos, YPos, scale, color,
        textStamp, textState;

    me.logger.enter("setAnnotationStamp");
    me.logger.debug(["Start setAnnotationStamp with pdfDocument: '{0}', note: '{1}'", pdfDocument, note]);

    text = note.noteText.text;
    fontHeight = note.noteText.fontInfo.height;
    fontRGB = note.noteText.fontInfo.RGB;
    lineWidth = 5;
    height = note.height;
    width = note.width;
    XPos = note.XPos;
    YPos = note.YPos;
    scale = 0.24;
    height *= scale;
    width *= scale;
    XPos *= scale;
    YPos *= scale;
    fontHeight *= scale;

    page = pdfDocument.getPages().get_Item(note.pageNo);

    pHeight = page.getPageInfo().getHeight();
    pWidth = page.getPageInfo().getWidth();

    graph = me.getGraph(page, pWidth, pHeight);

    rect = new Packages.com.aspose.pdf.drawing.Rectangle(XPos, pHeight - YPos - height, width, height);
    rect.setRoundedCornerRadius(lineWidth);

    color = me.getColor(fontRGB);
    rect.getGraphInfo().setColor(color);
    rect.getGraphInfo().setLineWidth(lineWidth);

    textStamp = new Packages.com.aspose.pdf.TextStamp(text);
    textStamp.setOpacity(0.5);
    textStamp.setXIndent(XPos + 15.0);
    textStamp.setYIndent(pHeight - YPos - height + 15.0);
    textStamp.setWidth(width - 30.0);
    textStamp.setHeight(height - 30.0);

    textState = textStamp.getTextState();
    textState.setFontStyle(Packages.com.aspose.pdf.FontStyles.Bold);
    textState.setFontSize(fontHeight);
    textState.setForegroundColor(color);
    page.addStamp(textStamp);

    graph.getShapes().add(rect);

    me.logger.debug(["Finish setAnnotationStamp"]);
    me.logger.exit("setAnnotationStamp");    

  },

  /**
   * Set stiky note in a PDF.
   * @private
   * @param {com.aspose.pdf.Document} pdfDocument PDF File
   * @param {de.elo.ix.client.Note} note note
   */
  setStickyNote: function (pdfDocument, note) {
    var me = this,
        page, pHeight, pWidth, graph, rect, text, fontHeight, noteRGB,
        height, width, XPos, YPos, scale, color, fontRGB,
        textFrag, textState;

    me.logger.enter("setStickyNote");
    me.logger.debug(["Start setStickyNote with pdfDocument: '{0}', note: '{1}'", pdfDocument, note]);

    text = note.noteText.text;
    fontHeight = note.noteText.fontInfo.height;
    fontRGB = note.noteText.fontInfo.RGB;
    noteRGB = note.color;
    height = note.height;
    width = note.width;
    XPos = note.XPos;
    YPos = note.YPos;
    scale = 0.24;
    height *= scale;
    width *= scale;
    XPos *= scale;
    YPos *= scale;

    page = pdfDocument.getPages().get_Item(note.pageNo);

    pHeight = page.getPageInfo().getHeight();
    pWidth = page.getPageInfo().getWidth();

    graph = me.getGraph(page, pWidth, pHeight);
    rect = new Packages.com.aspose.pdf.drawing.Rectangle(XPos, pHeight - YPos - height, width, height);

    color = me.getColor(noteRGB);
    if (note.type != NoteC.TYPE_ANNOTATION_TEXT) {
      rect.getGraphInfo().setColor(color);
      rect.getGraphInfo().setFillColor(color);    
    } else {
      rect.getGraphInfo().setColor(Packages.com.aspose.pdf.Color.fromArgb(0, 255, 255, 255));
    }


    color = me.getColor(fontRGB, true);
    textFrag = new Packages.com.aspose.pdf.TextFragment(text);
    textState = textFrag.getTextState();
    textState.setFontSize(fontHeight);
    textState.setForegroundColor(color);

    if (note.noteText.fontInfo.bold == true) {
      textState.setFontStyle(Packages.com.aspose.pdf.FontStyles.Bold);
    }
    if (note.noteText.fontInfo.italic == true) {
      textState.setFontStyle(Packages.com.aspose.pdf.FontStyles.Italic);
    }
    if (note.noteText.fontInfo.strikeOut == true) {
      textState.setStrikeOut(true);
    }
    if (note.noteText.fontInfo.underline == true) {
      textState.setUnderline(true);
    }
    rect.setText(textFrag);

    graph.getShapes().add(rect);

    me.logger.debug(["Finish setStickyNote"]);
    me.logger.exit("setStickyNote");    

  },

  /**
   * Set rectangle marker in a PDF.
   * @private
   * @param {com.aspose.pdf.Document} pdfDocument PDF File
   * @param {de.elo.ix.client.Note} note note
   */
  setRectangleMarker: function (pdfDocument, note) {
    var me = this,
        page, pHeight, pWidth, graph, rect, noteRGB,
        height, width, XPos, YPos, scale, color;

    me.logger.enter("setRectangleMarker");
    me.logger.debug(["Start setRectangleMarker with pdfDocument: '{0}', note: '{1}'", pdfDocument, note]);

    noteRGB = note.color;
    height = note.height;
    width = note.width;
    XPos = note.XPos;
    YPos = note.YPos;
    scale = 0.24;
    height *= scale;
    width *= scale;
    XPos *= scale;
    YPos *= scale;

    page = pdfDocument.getPages().get_Item(note.pageNo);

    pHeight = page.getPageInfo().getHeight();
    pWidth = page.getPageInfo().getWidth();

    graph = me.getGraph(page, pWidth, pHeight);
    rect = new Packages.com.aspose.pdf.drawing.Rectangle(XPos, pHeight - YPos - height, width, height);

    color = me.getColor(noteRGB);
    rect.getGraphInfo().setColor(color);
    rect.getGraphInfo().setFillColor(color);  

    graph.getShapes().add(rect);

    me.logger.debug(["Finish setRectangleMarker"]);
    me.logger.exit("setRectangleMarker");    

  },

  /**
   * Set rectangle marker in a PDF.
   * @private
   * @param {com.aspose.pdf.Document} pdfDocument PDF File
   * @param {de.elo.ix.client.Note} note note
   */
  setLineMarker: function (pdfDocument, note) {
    var me = this,
        page, pHeight, pWidth, graph, line, noteRGB,
        lineWidth, scale, color, positionArray;

    me.logger.enter("setLineMarker");
    me.logger.debug(["Start setLineMarker with pdfDocument: '{0}', note: '{1}'", pdfDocument, note]);

    noteRGB = note.color;
    scale = 0.24;

    page = pdfDocument.getPages().get_Item(note.pageNo);

    pHeight = page.getPageInfo().getHeight();
    pWidth = page.getPageInfo().getWidth();

    graph = me.getGraph(page, pWidth, pHeight);

    positionArray = [];
    if (note.noteFreehand != null) {
      lineWidth = note.noteFreehand.width * scale;
      if (note.noteFreehand.points != null) {
        note.noteFreehand.points.forEach(function (point) {
          positionArray.push(point.x * scale);
          positionArray.push(pHeight - (point.y * scale));
        });
      }
    } 

    line = new Packages.com.aspose.pdf.drawing.Line(positionArray);

    color = me.getColor(noteRGB);
    line.getGraphInfo().setColor(color);
    line.getGraphInfo().setLineWidth(lineWidth);  
    graph.getShapes().add(line);

    if (note.type == NoteC.TYPE_ANNOTATION_STRIKEOUT) {
      line = new Packages.com.aspose.pdf.drawing.Line(positionArray);
      line.getGraphInfo().setLineWidth(lineWidth * 0.5);  
      graph.getShapes().add(line);  
    }

    me.logger.debug(["Finish setLineMarker"]);
    me.logger.exit("setLineMarker");    

  },


  /**
   * Set annotation notes in a PDF.
   * @private
   * @param {java.io.File} dstPdfFile PDF File
   * @param {de.elo.ix.client.Sord} sord
   */
  setAnnotationNotes: function (dstPdfFile, sord) {
    var me = this,
        notes, pdfDocument, os;

    me.logger.enter("setAnnotationNotes");
    me.logger.debug(["Start setAnnotationNotes with dstPdfFile: '{0}', sord: '{1}'", dstPdfFile, sord]);

    try {
      os = String(java.lang.System.getProperty("os.name").toLowerCase());
      notes = ixConnect.ix().checkoutNotes(sord.id, null, NoteC.mbAll, LockC.NO);
      notes.forEach(function (note) {
        switch (note.type) {
          case NoteC.TYPE_ANNOTATION_STAMP_NEW:
            if (sol.common.StringUtils.contains(os, "win")) {
              if (!pdfDocument) {
                pdfDocument = new Packages.com.aspose.pdf.Document(dstPdfFile.getPath());
              }
              me.setAnnotationStamp(pdfDocument, note);
            }
            break;
          case NoteC.TYPE_ANNOTATION_NOTE_WITHFONT:
          case NoteC.TYPE_ANNOTATION_TEXT:
            if (sol.common.StringUtils.contains(os, "win")) {
              if (!pdfDocument) {
                pdfDocument = new Packages.com.aspose.pdf.Document(dstPdfFile.getPath());
              }
              me.setStickyNote(pdfDocument, note);
            }
            break;
          case NoteC.TYPE_ANNOTATION_MARKER:
            if (sol.common.StringUtils.contains(os, "win")) {
              if (!pdfDocument) {
                pdfDocument = new Packages.com.aspose.pdf.Document(dstPdfFile.getPath());
              }
              me.setRectangleMarker(pdfDocument, note);
            }
            break;  
          case NoteC.TYPE_ANNOTATION_HORIZONTAL_LINE:
          case NoteC.TYPE_ANNOTATION_FREEHAND:
          case NoteC.TYPE_ANNOTATION_STRIKEOUT:
            if (sol.common.StringUtils.contains(os, "win")) {
              if (!pdfDocument) {
                pdfDocument = new Packages.com.aspose.pdf.Document(dstPdfFile.getPath());
              }
              me.setLineMarker(pdfDocument, note);
            }
            break;  
  
          default:
        }
      });
      if (pdfDocument) {
        pdfDocument.save(dstPdfFile.getPath());
      }

    } catch (ex) {
      me.logger.error(["error setAnnotationNotes with dstPdfFile:'{0}', sord:'{1}'", dstPdfFile, sord], ex);
    }

    me.logger.debug(["Finish setAnnotationNotes"]);
    me.logger.exit("setAnnotationNotes");    

  },

  /**
   * Set pagination in a PDF.
   * @private
   * @param {java.io.File} dstPdfFile PDF File
   */
  setPagination: function (dstPdfFile) {
    var me = this, 
        pdfPages, i, page;

    me.logger.enter("setPagination");
    me.logger.debug(["Start setPagination with dstPdfFile: '{0}'", dstPdfFile]);

    pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstPdfFile);
    for (i = 0; i < pdfPages; i++) {
      page = i + 1;
      page = String(page) + "";       
      Packages.de.elo.mover.main.pdf.PdfFileHelper.insertTextInPdf(page, dstPdfFile, page, 500, 10, 10, 0, 0, 0, 1.0, 0);
    }

    me.logger.debug(["Finish setPagination"]);
    me.logger.exit("setPagination");    
  },

  /**
   * Set watermark image in a PDF.
   * @private
   * @param {java.io.File} dstPdfFile PDF File
   * @param {String} dstDirPath
   * @param {String} repoPath Repository path to watermark image
   */
  setWatermarkImage: function (dstPdfFile, dstDirPath, repoPath) {
    var me = this,
        sord, ext, inputStream, fileName, watermarkImageFile,
        pdfDocument, imageStamp, pages, page, i;

    me.logger.enter("setWatermarkImage");
    me.logger.debug(["Start setWatermarkImage with dstPdfFile: '{0}', dstDirPath: '{1}', repoPath: '{2}'", dstPdfFile, dstDirPath, repoPath]);

    try {
      sord = sol.common.RepoUtils.getSord(repoPath);
      ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
      inputStream = sol.common.RepoUtils.downloadToStream(sord.id);
      fileName = sol.common.FileUtils.sanitizeFilename(sord.name);
      watermarkImageFile = me.writeInputStreamToFile(inputStream, dstDirPath, fileName, ext);

      pdfDocument = new Packages.com.aspose.pdf.Document(dstPdfFile.getPath());
      imageStamp = new Packages.com.aspose.pdf.ImageStamp(watermarkImageFile.getPath());
      imageStamp.setBackground(true);
      imageStamp.setOpacity(0.5);

      imageStamp.setHorizontalAlignment(Packages.com.aspose.pdf.HorizontalAlignment.Center);
      imageStamp.setVerticalAlignment(Packages.com.aspose.pdf.VerticalAlignment.Center);

      pages = pdfDocument.getPages();
      for (i = 1; i <= pages.size(); i++) {
        page = pages.get_Item(i);
        page.addStamp(imageStamp);
      }
      pdfDocument.save(dstPdfFile.getPath());

      sol.common.FileUtils.delete(watermarkImageFile, { quietly: true });
    } catch (ex) {
      me.logger.error(["error setWatermarkImage with dstPdfFile:'{0}', watermarkImageFile:'{1}'", dstPdfFile, watermarkImageFile], ex);
    }

    me.logger.debug(["Finish setWatermarkImage"]);
    me.logger.exit("setWatermarkImage");    
  },

  /**
   * Set watermark text in a PDF.
   * @private
   * @param {java.io.File} dstPdfFile PDF File
   * @param {String} textWatermark Watermark text
   */
  setWatermarkText: function (dstPdfFile, textWatermark) {
    var me = this,
        pdfDocument, textStamp, pages, page, i;

    me.logger.enter("setWatermarkText");
    me.logger.debug(["Start setWatermarkText with dstPdfFile: '{0}', textWatermark: '{1}'", dstPdfFile, textWatermark]);

    try {
      pdfDocument = new Packages.com.aspose.pdf.Document(dstPdfFile.getPath());
      textStamp = new Packages.com.aspose.pdf.TextStamp(textWatermark);
      textStamp.setBackground(true);
      textStamp.setOpacity(0.5);

      textStamp.setHorizontalAlignment(Packages.com.aspose.pdf.HorizontalAlignment.Center);
      textStamp.setVerticalAlignment(Packages.com.aspose.pdf.VerticalAlignment.Center);

      textStamp.setRotateAngle(45.0);

      textStamp.getTextState().setFontSize(60.0);
      textStamp.getTextState().setFontStyle(Packages.com.aspose.pdf.FontStyles.Bold);
      textStamp.getTextState().setFontStyle(Packages.com.aspose.pdf.FontStyles.Italic);
      textStamp.getTextState().setForegroundColor(Packages.com.aspose.pdf.Color.getGreen());

      pages = pdfDocument.getPages();
      for (i = 1; i <= pages.size(); i++) {
        page = pages.get_Item(i);
        page.addStamp(textStamp);
      }
      pdfDocument.save(dstPdfFile.getPath());    
    } catch (ex) {
      me.logger.error(["error setWatermarkText with dstPdfFile:'{0}', textWatermark:'{1}'", dstPdfFile, textWatermark], ex);
    }

    me.logger.debug(["Finish setWatermarkText"]);
    me.logger.exit("setWatermarkText");    
  },

  /**
   * Write inputstream to file
   * @private
   * @param {java.io.InputStream} inputStream
   * @param {String} dstDirPath
   * @param {String} fileName
   * @param {String} fileFormat
   * @return {java.io.File} dstFile
   */
  writeInputStreamToFile: function (inputStream, dstDirPath, fileName, fileFormat) {
    var me = this, 
        dstFile;

    me.logger.enter("writePdfInputStreamToFile");
    me.logger.debug(["Start writePdfInputStreamToFile with dstDirPath: '{0}', fileName: '{1}', fileFormat: '{2}'", dstDirPath, fileName, fileFormat]);

    dstFile = new java.io.File(dstDirPath + java.io.File.separator + fileName + "." + fileFormat);
    if (!dstFile.exists()) {
      dstFile.createNewFile();
    }

    Packages.org.apache.commons.io.FileUtils.copyInputStreamToFile(inputStream, dstFile);

    me.logger.debug(["Finish writePdfInputStreamToFile with dstFile: '{0}'", dstFile]);
    me.logger.exit("writePdfInputStreamToFile");

    return dstFile;
  },

  /**
   * Converts a graphic file to a PDF.
   * @private
   * @param {String} filePath
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertGraphicFileToPdf: function (filePath, dstDirPath, config) {
    var me = this,
        inputStream = null,
        fopRenderer, templateId, result, data, pdfName;

    me.logger.enter("convertGraphicFileToPdf");
    me.logger.debug(["Start convertGraphicFileToPdf with filePath: '{0}'", filePath]);

    templateId = me.getTemplateGraphic(config);  
    filePath = sol.common.FileUtils.getUrlFromFilePath(filePath);
    data = { filePath: filePath };

    pdfName = String(new File(filePath).getName());
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render(pdfName, data);
    inputStream = me.convertOutputStreamToInputStream(result.outputStream);
    me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);

    me.logger.debug(["Finish convertToPdf with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertGraphicFileToPdf");

    return inputStream;
  },

  /**
   * Converts a text file to a PDF.
   * @private
   * @param {String} filePath
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertTextFileToPdf: function (filePath, dstDirPath, config) {
    var me = this,
        inputStream = null,
        fopRenderer, templateId, result, data, pdfName, text, lines;

    me.logger.enter("convertTextFileToPdf");
    me.logger.debug(["Start convertTextFileToPdf with filePath: '{0}'", filePath]);

    templateId = me.getTemplateText(config); 
    text = sol.common.FileUtils.readFileToString(filePath);
    lines = sol.common.StringUtils.splitLines(text);
    data = {};
    data.lines = [];
    lines.forEach(function (line) {
      line = String(line);
      data.lines.push({ line: line });
    });

    pdfName = String(new File(filePath).getName());
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render(pdfName, data);
    inputStream = me.convertOutputStreamToInputStream(result.outputStream);
    me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);

    me.logger.debug(["Finish convertTextFileToPdf with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertTextFileToPdf");

    return inputStream;
  },

  /**
   * Converts a file to a PDF.
   * @private
   * @param {String} filePath
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertFileToPdf: function (filePath, dstDirPath, config) {
    var me = this,
        inputStream = null,
        ext, converter, os;

    me.logger.enter("convertFileToPdf");
    me.logger.debug(["Start convertFileToPdf with sord: '{0}'", filePath]);

    try {
      ext = sol.common.FileUtils.getExtensionFromPath(filePath);
      if (ext) {
        ext = String(ext);
        ext = ext.toLowerCase();
        switch (ext) {
          case "pdf":
            me.logger.debug("skip converting, document is already an PDF");
            inputStream = new FileInputStream(filePath);    
            break;
          case "jpg":
          case "jpeg":
          case "bmp":
          case "png":
          case "gif":
          case "ico":
            me.logger.debug("convert Graphic to PDF");
            inputStream = me.convertGraphicFileToPdf(filePath, dstDirPath, config);            
            break;
          case "tif":
          case "tiff":
            me.logger.debug("convert Tiff to PDF");
            inputStream = me.convertTiffFileToPdf(filePath, dstDirPath);            
            break;
          case "ppt":
          case "pot":
          case "pps":
          case "pptx":
          case "potx":
          case "pptm":
          case "ppt":
            os = String(java.lang.System.getProperty("os.name").toLowerCase());
            if (!sol.common.StringUtils.contains(os, "win")) {
              me.logger.debug(["format '{0}' is not supported in os '{1}'", ext, os]);
              return inputStream;
            }
          default:
            if (sol.common.StringUtils.contains(config.whiteListTextFile, ext)) {
              me.logger.debug("convert Text to PDF");
              inputStream = me.convertTextFileToPdf(filePath, dstDirPath, config);              
              return inputStream;
            }
            converter = sol.create("sol.common.as.functions.OfficeConverter", {
              openFile: {
                filePath: filePath
              },
              saveToStream: {
                format: "pdf"
              }
            });
            if (converter.isSupported(ext)) {
              inputStream = converter.execute();
            } else {
              if (inputStream == null) {
                me.logger.warn(["format '{0}' is not supported", ext]);
              }
            }    
            break;
        }  
      }
    } catch (ex) {
      me.logger.debug(["error converting file (filePath={0})", filePath], ex);
    }
    me.logger.debug(["Finish convertFileToPdf with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertFileToPdf");
    return inputStream;
  },


  /**
   * Converts a Msg document (E-Mail) to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @param {Object} config
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertMsgWithAttchmentToPdf: function (sord, dstDirPath, config) {
    var me = this,
        inputStream = null,
        msgFile, msgFilePath, message, attachments, i, attachment, attachmentInfo, attachmentObjectData,
        isAttachmentOutlookMessage, messageAttachment, fileAttchments, pdfInputStream, 
        pdfInputStreams, mergedOutputStream;

    me.logger.enter("convertMsgWithAttchmentToPdf");
    me.logger.debug(["Start convertMsgWithAttchmentToPdf with sord: '{0}'", sord]);

    inputStream = sol.common.RepoUtils.downloadToStream(sord.id);
    me.writeInputStreamToFile(inputStream, dstDirPath, sord.name, "msg");
    msgFilePath = dstDirPath + java.io.File.separator + sord.name + ".msg";
    msgFile = new java.io.File(msgFilePath);
    message = Packages.com.aspose.email.MapiMessage.fromFile(msgFile);
    attachments = message.getAttachments();

    fileAttchments = [];
    for (i = 0; i < attachments.size(); i++) {
      attachment = attachments.get_Item(i);

      attachmentInfo = {};
      attachmentInfo.fileName = attachment.getLongFileName();
      attachmentInfo.fileExtension = attachment.getExtension();

      attachmentObjectData = attachment.getObjectData();

      // Check if attachment is an outlook message
      if (attachmentObjectData) {
        if (attachmentObjectData.isOutlookMessage()) {
          isAttachmentOutlookMessage = true;
        } else {
          isAttachmentOutlookMessage = null;
        }
      } else {
        isAttachmentOutlookMessage = null;
      }

      if (isAttachmentOutlookMessage) {
        messageAttachment = attachment.getObjectData().toMapiMessage();
        attachmentInfo.filePath = dstDirPath;
        attachmentInfo.filePathAndFileName = dstDirPath + java.io.File.separator + attachmentInfo.fileName;
        messageAttachment.save(attachmentInfo.filePathAndFileName);

      } else {
        attachmentInfo.filePath = dstDirPath;
        attachmentInfo.filePathAndFileName = dstDirPath + java.io.File.separator + attachmentInfo.fileName;
        attachment.save(attachmentInfo.filePathAndFileName);
      }
      fileAttchments.push(attachmentInfo.filePathAndFileName);
      
    }

    pdfInputStreams = [];
    pdfInputStream = me.convertFileToPdf(msgFilePath, dstDirPath, config);
    if (pdfInputStream) {
      pdfInputStreams.push(pdfInputStream);
    }

    fileAttchments.forEach(function (fileAttchment) {
      pdfInputStream = me.convertFileToPdf(fileAttchment, dstDirPath, config);
      if (pdfInputStream) {
        pdfInputStreams.push(pdfInputStream);
      }
    });

    mergedOutputStream = new ByteArrayOutputStream();
    sol.common.as.PdfUtils.mergePdfStreams(pdfInputStreams, mergedOutputStream);
    inputStream = me.convertOutputStreamToInputStream(mergedOutputStream);   

    sol.common.FileUtils.delete(msgFilePath, { quietly: true }); 
    fileAttchments.forEach(function (fileAttchment) {
      sol.common.FileUtils.delete(fileAttchment, { quietly: true }); 
    });

    me.logger.debug(["Finish convertMsgWithAttchmentToPdf with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertMsgWithAttchmentToPdf");

    return inputStream;
  },

  /**
   * Export folder as pdf or zip filde.
   * @param {String} folderId
   * @param {String} baseDstDirPath
   * @param {Object} config
   * @return {Object} result of folder export
   */
  pdfExport: function (folderId, baseDstDirPath, config) {
    var me = this,
        result, i, j, sord, dstDir, pathParts, dstDirPath, sords, dstDirPathFile, folderSord, addPathPart, partPath,
        subDirPath, subDirPathFile, zipFile, zipDir, parentId, folderName, mergedOutputStream, pdfName, ext, 
        pdfInputStreams, pdfInputStream, pdfContents, dstFile, os;

    me.logger.enter("pdfExport");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start pdfExport with folderId: '{0}', baseDstDirPath: '{1}', config: '{2}'", folderId, baseDstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    me.language = ixConnect.loginResult.clientInfo.language;
    if (config.language) {
      me.language = config.language;
    }

    pdfContents = [];

    if (!folderId) {
      me.logger.debug("pdfExport 'Folder ID is empty'");
      throw "Folder ID is empty";
    }

    if (!baseDstDirPath) {
      me.logger.debug("pdfExport 'Destination directory path is empty'");
      throw "Destination directory path is empty";
    }

    result = {};
    dstDir = new java.io.File(baseDstDirPath);
    sol.common.FileUtils.delete(baseDstDirPath, { quietly: true });
    sol.common.FileUtils.makeDirectories(dstDir);
    sol.common.FileUtils.deleteFiles({ dirPath: baseDstDirPath });


    folderSord = ixConnect.ix().checkoutSord(folderId, new SordZ(SordC.mbAll), LockC.NO);
    pdfName = sol.common.FileUtils.sanitizeFilename(folderSord.name) + ".cover";
    me.createCoverSheetSord(folderSord, baseDstDirPath, pdfName, config, pdfContents);

    folderName = sol.common.FileUtils.sanitizeFilename(folderSord.name);
    dstDirPath = baseDstDirPath + java.io.File.separator + folderName;
    dstDirPathFile = new File(dstDirPath);
    if (!dstDirPathFile.exists()) {
      try {
        dstDirPathFile.mkdirs();
      } catch (e) {
        me.logger.debug("error creating destination directory", e);
      }
    }

    sords = sol.common.RepoUtils.findChildren(folderId, { recursive: true, level: -1, includeDocuments: true, includeFolders: true, includeReferences: true });

    for (i = 0; i < sords.length; i++) {
      sord = sords[i];
      pathParts = [dstDirPathFile];
      addPathPart = false;
      
      for (j = 0; j < sord.refPaths[0].path.length; j++) {
        partPath = sol.common.FileUtils.sanitizeFilename(sord.refPaths[0].path[j].name);
        if (addPathPart == true) {
          pathParts.push(partPath);
        } 
        if (partPath == sol.common.FileUtils.sanitizeFilename(folderSord.name)) {
          addPathPart = true;
        }
      }
      if (sol.common.SordUtils.isFolder(sord)) {     
        
        subDirPath = pathParts.join(File.separator);
        subDirPathFile = new File(subDirPath);
        if (!subDirPathFile.exists()) {
          try {
            subDirPathFile.mkdirs();
          } catch (e) {
            me.logger.debug("error creating destination directory", e);
          }
        }
        pdfName = sol.common.FileUtils.sanitizeFilename(sord.name) + ".cover";
        me.createCoverSheetSord(sord, subDirPath, pdfName, config, pdfContents);                
        partPath = sol.common.FileUtils.sanitizeFilename(sord.name);
        if (addPathPart == true) {
          pathParts.push(partPath);
        }   
      }
      subDirPath = pathParts.join(File.separator);
      subDirPathFile = new File(subDirPath);
      if (!subDirPathFile.exists()) {
        try {
          subDirPathFile.mkdirs();
        } catch (e) {
          me.logger.debug("error creating destination directory", e);
        }
      }
      if (!sol.common.SordUtils.isFolder(sord)) {
        try {
          ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
          if (ext) {
            pdfName = sol.common.FileUtils.sanitizeFilename(sord.name) + ".cover." + ext;
          } else {
            pdfName = sol.common.FileUtils.sanitizeFilename(sord.name) + ".cover";
          }
          me.createCoverSheetSord(sord, subDirPath, pdfName, config, pdfContents);      
          me.createPdfDocument(sord, subDirPath, config, pdfContents);
        } catch (e) {
          me.logger.debug("error downloadDocument ", e);
          me.logger.debug(["error downloadDocument id = '{0}' name = '{1}'", sord.id, sord.name]);
        }
      }
    }

    if (config.pdfExport === true) {
      mergedOutputStream = new ByteArrayOutputStream();

      me.logger.debug("pdfContents before sort");
      pdfContents.forEach(function (pdfContent) {        
        me.logger.debug(["refpath = '{0}', contentName = '{1}', pdfPages = '{2}', contentType = '{3}', contentMask = '{4}', contentHint = '{5}'", pdfContent.refPath, pdfContent.contentName, pdfContent.pdfPages, pdfContent.contentType, pdfContent.contentMask, pdfContent.contentHint]);
      });
      me.logger.debug("pdfContents before sort");

      pdfContents.sort(function (a, b) {
        var refPathA = a.refPath.toUpperCase(),
            refPathB = b.refPath.toUpperCase();

        if (refPathA < refPathB) {
          return -1;
        }
        if (refPathA > refPathB) {
          return 1;
        }      
        return 0;
      });

      me.logger.debug("pdfContents after sort");
      pdfContents.forEach(function (pdfContent) {        
        me.logger.debug(["refpath = '{0}', contentName = '{1}', pdfPages = '{2}', contentType = '{3}', contentMask = '{4}', contentHint = '{5}'", pdfContent.refPath, pdfContent.contentName, pdfContent.pdfPages, pdfContent.contentType, pdfContent.contentMask, pdfContent.contentHint]);
      });
      me.logger.debug("pdfContents after sort");

      pdfInputStreams = [];
      pdfInputStream = me.createContent(folderName, dstDirPath, config, pdfContents);
      if (pdfInputStream) {
        pdfInputStreams.push(pdfInputStream);
      }
      pdfContents.forEach(function (pdfContent) {
        if (pdfContent.pdfInputStream) {
          pdfInputStreams.push(pdfContent.pdfInputStream);
        }
      });
      sol.common.as.PdfUtils.mergePdfStreams(pdfInputStreams, mergedOutputStream);
      parentId = me.getExportFolder(config);

      try {
        if (config.pdfA === true) {
          dstFile = me.writePdfOutputStreamToFile(mergedOutputStream, dstDirPath, "All.pdf");
          me.convertPDFtoPDFA(dstFile);
          mergedOutputStream = me.writeFileToPdfOutputStream(dstFile);
          sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
        }
  
        if (config.pagination === true) {
          dstFile = me.writePdfOutputStreamToFile(mergedOutputStream, dstDirPath, "All.pdf");
          me.setPagination(dstFile);
          mergedOutputStream = me.writeFileToPdfOutputStream(dstFile);
          sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
        }
  
        if (config.watermark.image.show === true) {
          dstFile = me.writePdfOutputStreamToFile(mergedOutputStream, dstDirPath, "All.pdf");
          me.setWatermarkImage(dstFile, dstDirPath, config.watermark.image.path);
          mergedOutputStream = me.writeFileToPdfOutputStream(dstFile);
          sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
        }
  
        os = String(java.lang.System.getProperty("os.name").toLowerCase());
  
        if (sol.common.StringUtils.contains(os, "win")) {
          if (config.watermark.text.show === true) {
            dstFile = me.writePdfOutputStreamToFile(mergedOutputStream, dstDirPath, "All.pdf");
            me.setWatermarkText(dstFile, config.watermark.text.content);
            mergedOutputStream = me.writeFileToPdfOutputStream(dstFile);
            sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
          }  
        }  
      } catch (ex) {
        me.logger.error(["error pdfExport with folderId: '{0}', baseDstDirPath: '{1}', config: '{2}'", folderId, baseDstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })], ex);
      }

      result.objId = sol.common.RepoUtils.saveToRepo({ parentId: parentId, name: folderName, outputStream: mergedOutputStream, extension: "pdf" });
    } else {
      zipFile = new File(baseDstDirPath + ".zip");
      zipDir = new File(baseDstDirPath);
      sol.common.ZipUtils.zipFolder(zipDir, zipFile);
      parentId = me.getExportFolder(config);
      result.objId = sol.common.RepoUtils.saveToRepo({ name: folderName, file: zipFile, parentId: parentId });
      sol.common.FileUtils.delete(zipFile, { quietly: true });  
    }

    if (me.logger.debugEnabled) {
      me.logger.debug(["Finish pdfExport with result: '{0}'", sol.common.JsonUtils.stringifyAll(result, { tabStop: 2 })]);
    }
    me.logger.exit("pdfExport");

    return result;
  }

});
