
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
   * @param {Object[]} config.coverSheets Assigments docmask to coversheet template
   * @param {String} config.coversheetBasePath Folder for coversheet templates
   * @return {String} templateId
   */
  getTemplateCoverSheetSord: function (sord, config) {
    var me = this, 
        templateId;

    me.logger.enter("getTemplateCoverSheetSord", { sord: sord.id, config: config });
    me.logger.info(["Start getTemplateCoverSheetSord with sord.id: '{0}', config: '{1}'", sord.id, sol.common.JsonUtils.stringifyAll(me.config, { tabStop: 2 })]);

    templateId = config.defaultTemplate;
    config.coverSheets.forEach(function (coverSheet) {
      if (coverSheet.mask == sord.maskName) {
        templateId = config.coversheetBasePath + coverSheet.template;
      }
    });
    me.logger.info(["Finish getTemplateCoverSheetSord with templateId: '{0}'", templateId]);
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
      me.logger.info("convertOutputStreamToInputStream 'Output stream is empty'");
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
    me.logger.info(["Start writePdfOutputStreamToFile with dstDirPath: '{0}', pdfName: '{1}'", dstDirPath, pdfName]);

    dstFile = new java.io.File(dstDirPath + java.io.File.separator + pdfName + ".pdf");
    fop = new FileOutputStream(dstFile);
    if (!dstFile.exists()) {
      dstFile.createNewFile();
    }
    contentInBytes = pdfOutputStream.toByteArray();
    fop.write(contentInBytes);
    fop.flush();
    fop.close();

    me.logger.info(["Finish writePdfOutputStreamToFile with dstFile: '{0}'", dstFile]);
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
    me.logger.info(["Start writePdfInputStreamToFile with dstDirPath: '{0}', pdfName: '{1}'", dstDirPath, pdfName]);

    dstFile = new java.io.File(dstDirPath + java.io.File.separator + pdfName + ".pdf");
    if (!dstFile.exists()) {
      dstFile.createNewFile();
    }

    Packages.org.apache.commons.io.FileUtils.copyInputStreamToFile(pdfInputStream, dstFile);

    me.logger.info(["Finish writePdfInputStreamToFile with dstFile: '{0}'", dstFile]);
    me.logger.exit("writePdfInputStreamToFile");

    return dstFile;
  },

  pushContent: function (sord, pdfContents, pdfInputStream, refPath, contentName, pdfPages, hint) {
    var me = this, 
        contentType, contentMask, dm;

    contentType = sol.create("sol.common.Template", { source: "{{translate 'sol.common_document.as.Utils.pdfExport.document' '" + me.language + "'}}" }).apply();
    if (sol.common.SordUtils.isFolder(sord)) {
      contentType = sol.create("sol.common.Template", { source: "{{translate 'sol.common_document.as.Utils.pdfExport.folder' '" + me.language + "'}}" }).apply();
    }
    dm = sol.common.SordUtils.getDocMask(sord.maskName, me.language);
    contentMask = dm.name;
    if (dm.nameTranslationKey) {
      if (String(dm.nameTranslationKey).trim() !== "") {
        contentMask = sol.create("sol.common.Template", { source: "{{translate '" + dm.nameTranslationKey + "' '" + me.language + "'}}" }).apply();
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
        dstFile, isCover, dm;

    me.logger.enter("createPdfFromSord"); 
    me.logger.info(["Start createPdfFromSord with sord: '{0}', templateId: '{1}', dstDirPath: '{2}', ext: '{3}', pdfName: '{4}', config: '{5}'", sord, templateId, dstDirPath, ext, pdfName, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);

    if (ext) {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord, ext: ext };
    } else {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord };
    }
    if (sol.common.SordUtils.isFolder(sord)) {
      data.folder = sol.create("sol.common.Template", { source: "{{translate 'sol.common_document.as.Utils.pdfExport.folder' '" + me.language + "'}}" }).apply();
    }

    data.maskName = sord.maskName;
    dm = sol.common.SordUtils.getDocMask(sord.maskName, me.language);
    if (dm.nameTranslationKey) {
      if (String(dm.nameTranslationKey).trim() !== "") {
        data.maskName = sol.create("sol.common.Template", { source: "{{translate '" + dm.nameTranslationKey + "' '" + me.language + "'}}" }).apply();
      }
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
      pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
      me.pushContent(sord, pdfContents, pdfInputStream, refPath, pdfName, pdfPages, "");

    } else {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
      result = fopRenderer.render(pdfName, data);
      dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);
    }

    if (config.pdfA === true) {
      me.convertPDFtoPDFA(dstFile);
    }
    me.logger.info(["Finish createPdfFromSord"]);
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
    me.logger.info(["Start createCoverSheetSord with sord: '{0}', dstDirPath: '{1}', pdfName: '{2}', config: '{3}'", sord, dstDirPath, pdfName, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);

    templateId = me.getTemplateCoverSheetSord(sord, config);
    me.createPdfFromSord(sord, templateId, dstDirPath, "pdf", pdfName, config, pdfContents);

    me.logger.info(["Finish createCoverSheetSord"]);
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
    me.logger.info(["Start createErrorConversionPdf with sord: '{0}', ext: '{1}', dstDirPath: '{2}', config: '{3}'", sord, ext, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    
    
    templateId = me.getTemplateErrorConversionPdf(config);
    if (ext) {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord, ext: ext };
    } else {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord };
    }
    data.msg = sol.create("sol.common.Template", { source: "{{translate 'sol.common_document.as.Utils.pdfExport.error.msg' '" + me.language + "'}}" }).apply();
    data.hint = sol.create("sol.common.Template", { source: "{{translate 'sol.common_document.as.Utils.pdfExport.conversionFailed' '" + me.language + "'}}" }).apply();
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
      pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);

      hint = sol.create("sol.common.Template", { source: "{{translate 'sol.common_document.as.Utils.pdfExport.conversionFailed' '" + me.language + "'}}" }).apply();
      me.pushContent(sord, pdfContents, pdfInputStream, refPath, contentName, pdfPages, hint);

      sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });

    } else {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
      result = fopRenderer.render(pdfName, data);
      dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);
    }
    me.logger.info(["Finish createErrorConversionPdf"]);
    me.logger.exit("createErrorConversionPdf");
  },

  /**
   * Converts a document to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertToPdf: function (sord, dstDirPath) {
    var me = this,
        inputStream = null,
        ext, converter;

    me.logger.enter("convertToPdf");
    me.logger.info(["Start convertToPdf with sord: '{0}'", sord]);

    try {
      ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
      if (ext) {
        ext = String(ext);
        switch (ext) {
          case "pdf":
            me.logger.debug("skip converting, document is already an PDF");
            inputStream = sol.common.RepoUtils.downloadToStream(sord.id);    
            break;
          case "msg":
            me.logger.debug("convert Msg to PDF");
            inputStream = me.convertMsgWithAttchmentToPdf(sord, dstDirPath);
            break;    
          default:
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
              me.logger.warn(["format '{0}' is not supported", ext]);
            }    
            break;
        }  
      }
    } catch (ex) {
      me.logger.info(["error converting document (objId={0}, name={1})", sord.id, sord.name], ex);
    }
    me.logger.info(["Finish convertToPdf with inputStream: '{0}'", inputStream]);
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
    me.logger.info(["Start createPdfDocument with sord: '{0}'dstDirPath: '{1}', config: '{2}'", sord, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);

    pdfInputStream = me.convertToPdf(sord, dstDirPath);
    ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;  

    if (pdfInputStream != null) {
      pdfName = me.getPdfName(sord, ext);
      dstFile = me.writePdfInputStreamToFile(pdfInputStream, dstDirPath, pdfName);

      if (config.pdfA === true) {
        me.convertPDFtoPDFA(dstFile);
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
    me.logger.info(["Finish createPdfDocument"]);
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
    me.logger.debug(["Start adjustContent with contents: '{0}'", sol.common.JsonUtils.stringifyAll(contents, { tabStop: 2 })]);

    newContents = [];
    oldContents = [];
    contents.forEach(function (content) {
      if (content.name.indexOf(".cover") > -1) {
        newName = content.name.split(".cover").join("");
        newName = newName + "  ------  (" + content.type + ", " + content.mask + ")";
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

    me.logger.debug(["Finish adjustContent with newContents: '{0}'", sol.common.JsonUtils.stringifyAll(newContents, { tabStop: 2 })]);
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
    me.logger.info(["Start getOffsetSumPages with folderName: '{0}', dstDirPath: '{1}', config: '{2}'", folderName, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    
    pdfPages = 0;
    templateId = me.getTemplateContents(config);
    data = {};
    data.header = { name: folderName };
    data.overview = sol.create("sol.common.Template", { source: "{{translate 'sol.common_document.as.Utils.pdfExport.contents.overview' '" + me.language + "'}}" }).apply();
    data.content = sol.create("sol.common.Template", { source: "{{translate 'sol.common_document.as.Utils.pdfExport.contents.content' '" + me.language + "'}}" }).apply();
    data.noContentFound = sol.create("sol.common.Template", { source: "{{translate 'sol.common_document.as.Utils.pdfExport.contents.noContentFound' '" + me.language + "'}}" }).apply();
    data.contents = [];

    pdfContents.forEach(function (pdfContent) {
      data.contents.push({ name: pdfContent.contentName, pageno: pdfContent.pdfPages, type: pdfContent.contentType, mask: pdfContent.contentMask, hint: pdfContent.contentHint });
    });

    data.contents = me.adjustContent(data.contents);
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render("Content", data);
    dstFile = new java.io.File(dstDirPath + java.io.File.separator + "Content.pdf");
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

    me.logger.info(["Finish getOffsetSumPages with pdfPages: '{0}'", pdfPages]);
    me.logger.exit("getOffsetSumPages");
    
    return pdfPages;
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
        templateId, fopRenderer, result, data, pdfInputStream, sumPages;

    me.logger.enter("createContent");
    me.logger.info(["Start createContent with folderName: '{0}', dstDirPath: '{1}', config: '{2}'", folderName, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);

    templateId = me.getTemplateContents(config);
    data = {};
    data.header = { name: folderName };
    data.overview = sol.create("sol.common.Template", { source: "{{translate 'sol.common_document.as.Utils.pdfExport.contents.overview' '" + me.language + "'}}" }).apply();
    data.content = sol.create("sol.common.Template", { source: "{{translate 'sol.common_document.as.Utils.pdfExport.contents.content' '" + me.language + "'}}" }).apply();
    data.noContentFound = sol.create("sol.common.Template", { source: "{{translate 'sol.common_document.as.Utils.pdfExport.contents.noContentFound' '" + me.language + "'}}" }).apply();
    data.contents = [];

    sumPages = me.getOffsetSumPages(folderName, dstDirPath, config, pdfContents);

    pdfContents.forEach(function (pdfContent) {
      sumPages += pdfContent.pdfPages;
      data.contents.push({ name: pdfContent.contentName, pageno: sumPages, type: pdfContent.contentType, mask: pdfContent.contentMask, hint: pdfContent.contentHint });
    });

    data.contents = me.adjustContent(data.contents);
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render("Content", data);
    pdfInputStream = me.convertOutputStreamToInputStream(result.outputStream);

    me.logger.info(["Finish createContent with pdfInputStream: '{0}'", pdfInputStream]);
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
    me.logger.info(["Start convertPDFtoPDFA with dstPdfFile: '{0}'", dstPdfFile]);

    dstPdfPath = dstPdfFile.getPath();
    dstPdfAPath = dstPdfPath + "_";
    doc = new Packages.com.aspose.pdf.Document(dstPdfPath);
    doc.convert("file.log", Packages.com.aspose.pdf.PdfFormat.PDF_A_1B, Packages.com.aspose.pdf.ConvertErrorAction.Delete);
    doc.save(dstPdfAPath);
    dstPdfAFile = new File(dstPdfAPath);
    dstPdfFile.delete();
    dstPdfAFile.renameTo(dstPdfFile);

    me.logger.info(["Finish convertPDFtoPDFA"]);
    me.logger.exit("convertPDFtoPDFA");    
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
    me.logger.info(["Start setPagination with dstPdfFile: '{0}'", dstPdfFile]);

    pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstPdfFile);
    for (i = 0; i < pdfPages; i++) {
      page = i + 1;
      page = String(page) + "";       
      Packages.de.elo.mover.main.pdf.PdfFileHelper.insertTextInPdf(page, dstPdfFile, page, 500, 10, 10, 0, 0, 0, 1.0, 0);
    }

    me.logger.info(["Finish setPagination"]);
    me.logger.exit("setPagination");    
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
    me.logger.info(["Start writePdfInputStreamToFile with dstDirPath: '{0}', fileName: '{1}', fileFormat: '{2}'", dstDirPath, fileName, fileFormat]);

    dstFile = new java.io.File(dstDirPath + java.io.File.separator + fileName + "." + fileFormat);
    if (!dstFile.exists()) {
      dstFile.createNewFile();
    }

    Packages.org.apache.commons.io.FileUtils.copyInputStreamToFile(inputStream, dstFile);

    me.logger.info(["Finish writePdfInputStreamToFile with dstFile: '{0}'", dstFile]);
    me.logger.exit("writePdfInputStreamToFile");

    return dstFile;
  },

  /**
   * Converts a file to a PDF.
   * @private
   * @param {String} filePath
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertFileToPdf: function (filePath) {
    var me = this,
        inputStream = null,
        ext, converter;

    me.logger.enter("convertFileToPdf");
    me.logger.info(["Start convertFileToPdf with sord: '{0}'", filePath]);

    try {
      ext = sol.common.FileUtils.getExtensionFromPath(filePath);
      if (ext) {
        ext = String(ext);
        switch (ext) {
          case "pdf":
            me.logger.debug("skip converting, document is already an PDF");
            inputStream = new FileInputStream(filePath);    
            break;
          default:
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
              me.logger.warn(["format '{0}' is not supported", ext]);
            }    
            break;
        }  
      }
    } catch (ex) {
      me.logger.info(["error converting file (filePath={0})", filePath], ex);
    }
    me.logger.info(["Finish convertFileToPdf with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertFileToPdf");
    return inputStream;
  },


  /**
   * Converts a Msg document (E-Mail) to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertMsgWithAttchmentToPdf: function (sord, dstDirPath) {
    var me = this,
        inputStream = null,
        msgFile, msgFilePath, message, attachments, i, attachment, attachmentInfo, attachmentObjectData,
        isAttachmentOutlookMessage, messageAttachment, fileAttchments, pdfInputStream, 
        pdfInputStreams, mergedOutputStream;

    me.logger.enter("convertMsgWithAttchmentToPdf");
    me.logger.info(["Start convertMsgWithAttchmentToPdf with sord: '{0}'", sord]);

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
    pdfInputStream = me.convertFileToPdf(msgFilePath);
    if (pdfInputStream) {
      pdfInputStreams.push(pdfInputStream);
    }

    fileAttchments.forEach(function (fileAttchment) {
      pdfInputStream = me.convertFileToPdf(fileAttchment);
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

    me.logger.info(["Finish convertMsgWithAttchmentToPdf with inputStream: '{0}'", inputStream]);
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
        pdfInputStreams, pdfInputStream, pdfContents, dstFile, fop, contentInBytes, bytes;

    me.logger.enter("pdfExport");
    me.logger.info(["Start pdfExport with folderId: '{0}', baseDstDirPath: '{1}', config: '{2}'", folderId, baseDstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);

    me.language = ixConnect.loginResult.clientInfo.language;
    if (config.language) {
      me.language = config.language;
    }

    pdfContents = [];

    if (!folderId) {
      me.logger.info("pdfExport 'Folder ID is empty'");
      throw "Folder ID is empty";
    }

    if (!baseDstDirPath) {
      me.logger.info("pdfExport 'Destination directory path is empty'");
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
        me.logger.info("error creating destination directory", e);
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
            me.logger.info("error creating destination directory", e);
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
          me.logger.info("error creating destination directory", e);
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
          me.logger.info("error downloadDocument ", e);
          me.logger.info(["error downloadDocument id = '{0}' name = '{1}'", sord.id, sord.name]);
        }
      }
    }

    if (config.pdfExport === true) {
      mergedOutputStream = new ByteArrayOutputStream();
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
      pdfInputStreams = [];
      pdfInputStream = me.createContent(folderName, dstDirPath, config, pdfContents);
      pdfInputStreams.push(pdfInputStream);

      pdfContents.forEach(function (pdfContent) {
        pdfInputStreams.push(pdfContent.pdfInputStream);
      });

      sol.common.as.PdfUtils.mergePdfStreams(pdfInputStreams, mergedOutputStream);
      parentId = me.getExportFolder(config);

      if (config.pdfA === true) {
        dstFile = new java.io.File(dstDirPath + java.io.File.separator + "All.pdf");
        fop = new FileOutputStream(dstFile);
        if (!dstFile.exists()) {
          dstFile.createNewFile();
        }
        contentInBytes = mergedOutputStream.toByteArray();
        fop.write(contentInBytes);
        fop.flush();
        fop.close();
    
        me.convertPDFtoPDFA(dstFile);

        bytes = Packages.org.apache.commons.io.FileUtils.readFileToByteArray(dstFile);
        mergedOutputStream = new ByteArrayOutputStream(bytes.length);
        mergedOutputStream.write(bytes, 0, bytes.length);

        sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
      }

      if (config.pagination === true) {
        dstFile = new java.io.File(dstDirPath + java.io.File.separator + "All.pdf");
        fop = new FileOutputStream(dstFile);
        if (!dstFile.exists()) {
          dstFile.createNewFile();
        }
        contentInBytes = mergedOutputStream.toByteArray();
        fop.write(contentInBytes);
        fop.flush();
        fop.close();
    
        me.setPagination(dstFile);

        bytes = Packages.org.apache.commons.io.FileUtils.readFileToByteArray(dstFile);
        mergedOutputStream = new ByteArrayOutputStream(bytes.length);
        mergedOutputStream.write(bytes, 0, bytes.length);

        sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
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

    me.logger.info(["Finish pdfExport with result: '{0}'", sol.common.JsonUtils.stringifyAll(result, { tabStop: 2 })]);
    me.logger.exit("pdfExport");

    return result;
  }

});
