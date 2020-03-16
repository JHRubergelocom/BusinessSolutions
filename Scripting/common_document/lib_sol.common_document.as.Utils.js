
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 *
 * @eloall
 * @requires sol.common.Config
 */
sol.define("sol.common_document.as.Utils", {
  singleton: true,

  getTemplateCoverSheetSord: function (sord) {
    var me = this, 
        templateId;

    templateId = me.config.defaultTemplate;
    me.config.coverSheets.forEach(function (coverSheet) {
      if (coverSheet.mask == sord.maskName) {
        templateId = coverSheet.template;
      }
    });
    return templateId;
  },

  getTemplateErrorConversionPdf: function () {
    var me = this;

    return me.config.errorTemplate;
  },
  // TODO
  getTemplateContents: function () {
    var me = this;

    return me.config.contentsTemplate;
  },
  // TODO
  getExportFolder: function () {
    var me = this;

    return me.config.exportFolder;
  },

  /**
   * @private
   * Converts an output stream to an input stream
   * @param {java.io.OutputStream} outputStream
   * @return {java.io.InputStream}
   */
  convertOutputStreamToInputStream: function (outputStream) {
    if (!outputStream) {
      throw "Output stream is empty";
    }
    var inputStream = new ByteArrayInputStream(outputStream.toByteArray());
    outputStream.close();
    return inputStream;
  },

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

  createPdfFromSord: function (sord, templateId, dstDirPath, ext, pdfName) {
    var me = this,
        targetId, data, fopRenderer, result, pdfInputStream, refPath, contentName, pdfPages, dstFile;

    targetId = me.getExportFolder();
    if (ext) {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord, ext: ext };
    } else {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord };
    }

    if (me.config.pdfExport === true) {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { targetId: targetId, templateId: templateId, toStream: true });
      result = fopRenderer.render(pdfName, data);
      pdfInputStream = me.convertOutputStreamToInputStream(result.outputStream);
      refPath = me.getRefPath(sord, ext);
      if (ext) {
        contentName = sord.name + "." + ext;
      } else {
        contentName = sord.name;
      } 
      // TODO GetPdfPages
      if (result.objId) {
        dstFile = sol.common.FileUtils.downloadDocument(result.objId, dstDirPath);
        pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
      }
      // TODO
      me.pdfContents.push({ pdfInputStream: pdfInputStream, refPath: refPath, contentName: contentName, pdfPages: pdfPages });      
    } else {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { targetId: targetId, templateId: templateId, toStream: true });
      result = fopRenderer.render(pdfName, data);
    }
    if (result.objId) {
      sol.common.FileUtils.downloadDocument(result.objId, dstDirPath);
      sol.common.RepoUtils.deleteSord(result.objId);
    }
  },

  createCoverSheetSord: function (sord, dstDirPath, pdfName) {
    var me = this,
        templateId;

    templateId = me.getTemplateCoverSheetSord(sord);
    me.createPdfFromSord(sord, templateId, dstDirPath, null, pdfName);
  },

  createErrorConversionPdf: function (sord, dstDirPath) {
    var me = this,
        templateId, ext, pdfName;

    templateId = me.getTemplateErrorConversionPdf(sord);
    ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
    if (ext) {
      pdfName = sord.name + "." + ext;
    } else {
      pdfName = sord.name;
    }
    me.createPdfFromSord(sord, templateId, dstDirPath, ext, pdfName);
  },

  /**
   * @private
   * Converts a document to a PDF.
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

  createPdfDocument: function (sord, dstDirPath) {
    var me = this,
        objId, pdfInputStream, ext, refPath, contentName, pdfPages, dstFile;
        
    objId = me.convertToPdf(sord);
    if (objId !== "-1") {
      ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
      dstFile = sol.common.FileUtils.downloadDocument(objId, dstDirPath);
      if (me.config.pdfExport === true) {
        pdfInputStream = sol.common.RepoUtils.downloadToStream(objId);
        refPath = me.getRefPath(sord, ext);
        if (ext) {
          contentName = sord.name + "." + ext;
        } else {
          contentName = sord.name;
        }
        // TODO GetPdfPages
        if (objId) {
          pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
        }
        // TODO
        me.pdfContents.push({ pdfInputStream: pdfInputStream, refPath: refPath, contentName: contentName, pdfPages: pdfPages });
      } 
      if (ext != "pdf") {
        sol.common.RepoUtils.deleteSord(objId);
      }
    } else {
      me.createErrorConversionPdf(sord, dstDirPath);
    }
  },

  exportFolder: function (folderId, baseDstDirPath, config) {
    var me = this,
        result, i, j, sord, dstDir, pathParts, dstDirPath, sords, dstDirPathFile, folderSord, addPathPart, partPath,
        subDirPath, subDirPathFile, zipFile, zipDir, parentId, folderName, mergedOutputStream, pdfName, ext, pdfInputStreams;

    me.config = config;
    me.pdfContents = [];

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
    me.createCoverSheetSord(folderSord, baseDstDirPath, pdfName);

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
        me.createCoverSheetSord(sord, subDirPath, pdfName);                
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
          me.createCoverSheetSord(sord, subDirPath, pdfName);      
          me.createPdfDocument(sord, subDirPath);
        } catch (e) {
          me.logger.error("error downloadDocument ", e);
          me.logger.error(["error downloadDocument id = '{0}' name = '{1}'", sord.id, sord.name]);
        }
      }
    }

    if (me.config.pdfExport === true) {
      mergedOutputStream = new ByteArrayOutputStream();
      me.pdfContents.sort(function (a, b) {
        var refPathA = a.refPath.toUpperCase(),
            refPathB = b.refPath.toUpperCase(); // Groß-/Kleinschreibung ignorieren

        if (refPathA < refPathB) {
          return -1;
        }
        if (refPathA > refPathB) {
          return 1;
        }      
        // Namen müssen gleich sein
        return 0;
      });
      pdfInputStreams = [];
      me.pdfContents.forEach(function (pdfContent) {
        pdfInputStreams.push(pdfContent.pdfInputStream);
      });

      sol.common.as.PdfUtils.mergePdfStreams(pdfInputStreams, mergedOutputStream);
      parentId = me.getExportFolder();
      result.objId = sol.common.RepoUtils.saveToRepo({ parentId: parentId, name: folderName, outputStream: mergedOutputStream, extension: "pdf" });
    } else {
      zipFile = new File(baseDstDirPath + ".zip");
      zipDir = new File(baseDstDirPath);
      sol.common.ZipUtils.zipFolder(zipDir, zipFile);
      parentId = me.getExportFolder();
      result.objId = sol.common.RepoUtils.saveToRepo({ name: folderName, file: zipFile, parentId: parentId });
      sol.common.FileUtils.delete(zipFile, { quietly: true });  
    }

    return result;
  }

});
