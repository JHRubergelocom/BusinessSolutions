
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
    var templateId;

    templateId = config.defaultTemplate;
    config.coverSheets.forEach(function (coverSheet) {
      if (coverSheet.mask == sord.maskName) {
        templateId = config.coversheetBasePath + coverSheet.template;
      }
    });
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
    if (!outputStream) {
      throw "Output stream is empty";
    }
    var inputStream = new ByteArrayInputStream(outputStream.toByteArray());
    outputStream.close();
    return inputStream;
  },

  /**
   * Get refpath
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} ext document extension
   * @return {String} refPath
   */
  getRefPath: function (sord, ext) {
    var pathIds = [],
        refPath;

    sord.refPaths[0].path.forEach(function (ldname) {
      pathIds.push(ldname.id);
    });
    refPath = pathIds.join(File.separator) + File.separator;
    if (sol.common.SordUtils.isFolder(sord)) {
      refPath = refPath + sord.id + File.separator + "1.";
    } else {      
      if (ext) {
        refPath = refPath + sord.id + File.separator + "2." + ext;
      } else {
        refPath = refPath + sord.id + File.separator + "2.";
      }
    }
    return refPath;
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
        targetId, data, fopRenderer, result, pdfInputStream, refPath, contentName, pdfPages, dstFile;

    targetId = me.getExportFolder(config);
    if (ext) {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord, ext: ext };
    } else {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord };
    }

    if (config.pdfExport === true) {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { targetId: targetId, templateId: templateId, toStream: true });
      result = fopRenderer.render(pdfName, data);
      pdfInputStream = me.convertOutputStreamToInputStream(result.outputStream);
      refPath = me.getRefPath(sord, ext);
      if (ext) {
        contentName = sord.name + "." + ext;
      } else {
        contentName = sord.name;
      } 
      if (result.objId) {
        dstFile = sol.common.FileUtils.downloadDocument(result.objId, dstDirPath);
        pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
      }
      pdfContents.push({ pdfInputStream: pdfInputStream, refPath: refPath, contentName: contentName, pdfPages: pdfPages });      
    } else {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { targetId: targetId, templateId: templateId, toStream: true });
      result = fopRenderer.render(pdfName, data);
    }
    if (result.objId) {
      if (config.pdfA == true) {
        result.objId = me.convertPDFtoPDFA(result.objId, dstDirPath);
      }
      sol.common.FileUtils.downloadDocument(result.objId, dstDirPath);
      sol.common.RepoUtils.deleteSord(result.objId);
    }
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

    templateId = me.getTemplateCoverSheetSord(sord, config);
    me.createPdfFromSord(sord, templateId, dstDirPath, null, pdfName, config, pdfContents);
  },

  /**
   * Create error conversion pdf
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @param {Object[]} pdfContents
   */
  createErrorConversionPdf: function (sord, dstDirPath, config, pdfContents) {
    var me = this,
        templateId, ext, pdfName;

    templateId = me.getTemplateErrorConversionPdf(config);
    ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
    if (ext) {
      pdfName = sord.name + "." + ext;
    } else {
      pdfName = sord.name;
    }
    me.createPdfFromSord(sord, templateId, dstDirPath, ext, pdfName, config, pdfContents);
  },

  /**
   * Converts a document to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @return {String} The objId of the converted document or '-1' if there was an error
   */
  convertToPdf: function (sord) {
    var me = this,
        objId = "-1",
        ext, converter, convertResult;
    me.logger.enter("convertToPdf");
    try {
      ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
      if (ext && (ext == "pdf")) {
        me.logger.debug("skip converting, document is already an PDF");
        objId = sord.id;
      } else {
        converter = sol.create("sol.common.as.functions.OfficeConverter", {
          openFromRepo: {
            objId: sord.id
          },
          saveToRepo: {
            format: "pdf",
            parentId: sord.parentId,
            name: sord.name + "." + ext
          }
        });
        if (converter.isSupported(ext)) {
          convertResult = converter.execute();
          if (convertResult && convertResult.objId) {
            objId = convertResult.objId;
          }
        } else {
          me.logger.warn(["format '{0}' is not supported", ext]);
        }
      }
    } catch (ex) {
      me.logger.error(["error converting document (objId={0}, name={1})", sord.id, sord.name], ex);
    }
    me.logger.exit("convertToPdf");
    return objId;
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
        objId, pdfInputStream, ext, refPath, contentName, pdfPages, dstFile;
        
    objId = me.convertToPdf(sord);
    if (objId !== "-1") {
      if (config.pdfA == true) {
        objId = me.convertPDFtoPDFA(objId, dstDirPath);
      }
      ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
      dstFile = sol.common.FileUtils.downloadDocument(objId, dstDirPath);
      if (config.pdfExport === true) {
        pdfInputStream = sol.common.RepoUtils.downloadToStream(objId);
        refPath = me.getRefPath(sord, ext);
        if (ext) {
          contentName = sord.name + "." + ext;
        } else {
          contentName = sord.name;
        }
        if (objId) {
          pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
        }
        pdfContents.push({ pdfInputStream: pdfInputStream, refPath: refPath, contentName: contentName, pdfPages: pdfPages });
      } 
      if (ext != "pdf") {
        sol.common.RepoUtils.deleteSord(objId);
      }
    } else {
      me.createErrorConversionPdf(sord, dstDirPath, config, pdfContents);
    }
  },

  /**
   * Get number of pages for content pdf.
   * @private
   * @param {String} folderName
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @param {Object} pdfContents
   * @return {Number} number of pages
   */
  getOffsetSumPages: function (folderName, dstDirPath, config, pdfContents) {
    var me = this,
        targetId, templateId, data, fopRenderer, result, dstFile, pdfPages;

    pdfPages = 0;
    targetId = me.getExportFolder(config);
    templateId = me.getTemplateContents(config);
    data = {};
    data.header = { name: folderName };
    data.contents = [];

    pdfContents.forEach(function (pdfContent) {
      data.contents.push({ name: pdfContent.contentName, pageno: pdfContent.pdfPages });
    });

    fopRenderer = sol.create("sol.common.as.renderer.Fop", { targetId: targetId, templateId: templateId });
    result = fopRenderer.render("Content", data);

    if (result.objId) {
      dstFile = sol.common.FileUtils.downloadDocument(result.objId, dstDirPath);
      pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
    }

    sol.common.RepoUtils.deleteSord(result.objId);
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

    templateId = me.getTemplateContents(config);
    data = {};
    data.header = { name: folderName };
    data.contents = [];

    sumPages = me.getOffsetSumPages(folderName, dstDirPath, config, pdfContents);
    pdfContents.forEach(function (pdfContent) {
      sumPages += pdfContent.pdfPages;
      data.contents.push({ name: pdfContent.contentName, pageno: sumPages });
    });

    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render("Content", data);
    pdfInputStream = me.convertOutputStreamToInputStream(result.outputStream);

    return pdfInputStream;

  },

  /**
   * Converts a PDF to the PDF/A standard.
   * @private
   * @param {String} objId
   * @param {String} dstDirPath
   * @return {String} objId of PDF/A
   */
  convertPDFtoPDFA: function (objId, dstDirPath) {
    var doc, dstPdfPath, dstPdfFile, dstPdfAPath, dstPdfAFile, sord, parentId;

    sord = ixConnect.ix().checkoutSord(objId, new SordZ(SordC.mbAll), LockC.NO);
    parentId = sord.parentId;

    dstPdfFile = sol.common.FileUtils.downloadDocument(objId, dstDirPath);
    dstPdfPath = dstPdfFile.getPath();
    dstPdfAPath = dstPdfPath + "_";
    doc = new Packages.com.aspose.pdf.Document(dstPdfPath);
    doc.convert("file.log", Packages.com.aspose.pdf.PdfFormat.PDF_A_1B, Packages.com.aspose.pdf.ConvertErrorAction.Delete);
    doc.save(dstPdfAPath);
    dstPdfAFile = new File(dstPdfAPath);
    dstPdfFile.delete();

    dstPdfAFile.renameTo(dstPdfFile);

    sol.common.RepoUtils.deleteSord(objId);
    objId = sol.common.RepoUtils.saveToRepo({ name: sord.name, file: dstPdfFile, parentId: parentId });
    return objId;
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
        pdfInputStreams, pdfInputStream, pdfContents;

    pdfContents = [];

    if (!folderId) {
      throw "Folder ID is empty";
    }

    if (!baseDstDirPath) {
      throw "Destination directory path is empty";
    }

    result = {};
    dstDir = new java.io.File(baseDstDirPath);
    sol.common.FileUtils.delete(baseDstDirPath, { quietly: true });
    sol.common.FileUtils.makeDirectories(dstDir);
    sol.common.FileUtils.deleteFiles({ dirPath: baseDstDirPath });


    folderSord = ixConnect.ix().checkoutSord(folderId, new SordZ(SordC.mbAll), LockC.NO);
    pdfName = folderSord.name + ".cover";
    me.createCoverSheetSord(folderSord, baseDstDirPath, pdfName, config, pdfContents);

    folderName = sol.common.FileUtils.sanitizeFilename(folderSord.name);
    dstDirPath = baseDstDirPath + java.io.File.separator + folderName;
    dstDirPathFile = new File(dstDirPath);
    if (!dstDirPathFile.exists()) {
      try {
        dstDirPathFile.mkdirs();
      } catch (e) {
        me.logger.error("error creating destination directory", e);
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
        if (partPath == folderSord.name) {
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
            me.logger.error("error creating destination directory", e);
          }
        }
        pdfName = sord.name + ".cover";
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
          me.logger.error("error creating destination directory", e);
        }
      }
      if (!sol.common.SordUtils.isFolder(sord)) {
        try {
          ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
          if (ext) {
            pdfName = sord.name + "." + ext + ".cover";
          } else {
            pdfName = sord.name + ".cover";
          }
          me.createCoverSheetSord(sord, subDirPath, pdfName, config, pdfContents);      
          me.createPdfDocument(sord, subDirPath, config, pdfContents);
        } catch (e) {
          me.logger.error("error downloadDocument ", e);
          me.logger.error(["error downloadDocument id = '{0}' name = '{1}'", sord.id, sord.name]);
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
      result.objId = sol.common.RepoUtils.saveToRepo({ parentId: parentId, name: folderName, outputStream: mergedOutputStream, extension: "pdf" });
      if (config.pdfA == true) {
        result.objId = me.convertPDFtoPDFA(result.objId, dstDirPath);
      }
    } else {
      zipFile = new File(baseDstDirPath + ".zip");
      zipDir = new File(baseDstDirPath);
      sol.common.ZipUtils.zipFolder(zipDir, zipFile);
      parentId = me.getExportFolder(config);
      result.objId = sol.common.RepoUtils.saveToRepo({ name: folderName, file: zipFile, parentId: parentId });
      sol.common.FileUtils.delete(zipFile, { quietly: true });  
    }

    return result;
  }

});
