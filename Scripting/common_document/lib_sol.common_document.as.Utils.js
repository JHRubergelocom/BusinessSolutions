
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
    var config, templateId;

    config = sol.common_document.Utils.loadConfigExport();
    templateId = config.defaultTemplate;
    config.coverSheets.forEach(function (coverSheet) {
      if (coverSheet.mask == sord.maskName) {
        templateId = coverSheet.template;
      }
    });
    return templateId;
  },

  getTemplateErrorConversionPdf: function () {
    var config;

    config = sol.common_document.Utils.loadConfigExport();
    return config.errorTemplate;
  },


  getExportFolder: function () {
    var config;

    config = sol.common_document.Utils.loadConfigExport();
    return config.exportFolder;
  },

  createCoverSheetSord: function (sord, dstDirPath) {
    var me = this, 
        templateId, result, targetId, fopRenderer, data, name;

    templateId = me.getTemplateCoverSheetSord(sord);
    targetId = me.getExportFolder();
    data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord };
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { targetId: targetId, templateId: templateId });
    name = sord.name;  
    result = fopRenderer.render(name, data);

    if (result.objId) {
      sol.common.FileUtils.downloadDocument(result.objId, dstDirPath);
      sol.common.RepoUtils.deleteSord(result.objId);
    }
  },

  createErrorConversionPdf: function (sord, dstDirPath) {
    var me = this, 
        templateId, result, targetId, ext, fopRenderer, data, name;

    templateId = me.getTemplateErrorConversionPdf(sord);
    targetId = me.getExportFolder();
    ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;    
    data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord, ext: ext };
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { targetId: targetId, templateId: templateId });
    name = sord.name + "." + ext;  
    result = fopRenderer.render(name, data);

    if (result.objId) {
      sol.common.FileUtils.downloadDocument(result.objId, dstDirPath);
      sol.common.RepoUtils.deleteSord(result.objId);
    }
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
        objId;
    objId = me.convertToPdf(sord);
    if (objId !== "-1") {
      sol.common.FileUtils.downloadDocument(objId, dstDirPath);
      sol.common.RepoUtils.deleteSord(objId);
    } else {
      me.createErrorConversionPdf(sord, dstDirPath);
    }
  },

  exportFolder: function (folderId, baseDstDirPath) {
    var me = this,
        result, i, j, sord, dstDir, pathParts, dstDirPath, sords, dstDirPathFile, folderSord, addPathPart, partPath,
        subDirPath, subDirPathFile, zipFile, zipDir, parentId, folderName;

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
    me.createCoverSheetSord(folderSord, baseDstDirPath);

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
        me.createCoverSheetSord(sord, subDirPath);                
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
          me.createCoverSheetSord(sord, subDirPath);      
          me.createPdfDocument(sord, subDirPath);
          sol.common.FileUtils.downloadDocument(sord.id, subDirPath);
        } catch (e) {
          me.logger.error("error downloadDocument ", e);
          me.logger.error(["error downloadDocument id = '{0}' name = '{1}'", sord.id, sord.name]);
        }
      }

    }
    zipFile = new File(baseDstDirPath + ".zip");
    zipDir = new File(baseDstDirPath);
    sol.common.ZipUtils.zipFolder(zipDir, zipFile);
    parentId = me.getExportFolder();
    result.objId = sol.common.RepoUtils.saveToRepo({ name: folderName, file: zipFile, parentId: parentId });
    sol.common.FileUtils.delete(zipFile, { quietly: true });

    return result;
  }

});
