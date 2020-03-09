
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
        generator, templateId, result, targetId;

    templateId = me.getTemplateCoverSheetSord(sord);
    targetId = me.getExportFolder();
    
    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: sord.name,
      dataCollector: "RF_sol_common_service_ParentDataCollector",
      renderer: "sol.common.as.renderer.Fop",
      collectorConfig: {
        objId: sord.id,
        returnDataDefinition: true
      },
      rendererConfig: {
        targetId: targetId,
        templateId: templateId
      },
      returnData: true
    });

    result = generator.process();

    if (result.objId) {
      // me.addGotoIdEvent(result.objId);
      sol.common.FileUtils.downloadDocument(result.objId, dstDirPath);

      // TODO Delete object in Chaosablage
      sol.common.RepoUtils.deleteSord(result.objId);
    }

  },

  // TODO ErrorTemplate
  createErrorConversionPdf: function (sord, dstDirPath) {
    var me = this, 
        generator, templateId, result, targetId, ext, fopRenderer, data, name;

    templateId = me.getTemplateErrorConversionPdf(sord);
    targetId = me.getExportFolder();
    ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
    
/*    
    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: sord.name + "." + ext,
      dataCollector: "RF_sol_common_service_ParentDataCollector",
      renderer: "sol.common.as.renderer.Fop",
      collectorConfig: {
        objId: sord.id,
        returnDataDefinition: true
      },
      rendererConfig: {
        targetId: targetId,
        templateId: templateId
      },
      returnData: true
    });

    result = generator.process();
*/
    data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord, ext: ext };
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { targetId: targetId, templateId: templateId });
    name = sord.name + "." + ext;  
    result = fopRenderer.render(name, data);

    if (result.objId) {
      // me.addGotoIdEvent(result.objId);
      sol.common.FileUtils.downloadDocument(result.objId, dstDirPath);

      // TODO Delete object in Chaosablage
      sol.common.RepoUtils.deleteSord(result.objId);
    }

  },

  // TODO


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
      // me.addGotoIdEvent(result.objId);
      sol.common.FileUtils.downloadDocument(objId, dstDirPath);

      // TODO Delete object in Chaosablage
      sol.common.RepoUtils.deleteSord(objId);

    } else {
      // TODO ErrorTemplate
      me.createErrorConversionPdf(sord, dstDirPath);
      // TODO

    }

  },

  exportFolder: function (folderId, dstDirPath) {
    var me = this,
        dstDir, sord, sordName, subFolderPath, subFolderPathFile;
     
    if (!folderId) {
      throw "Folder ID is empty";
    }

    if (!dstDirPath) {
      throw "Destination directory path is empty";
    }

    dstDir = new java.io.File(dstDirPath);
    sol.common.FileUtils.delete(dstDirPath, { quietly: true });
    sol.common.FileUtils.makeDirectories(dstDir);
    sol.common.FileUtils.deleteFiles({ dirPath: dstDirPath });

    try {
      sord = ixConnect.ix().checkoutSord(folderId, SordC.mbOnlyGuid, LockC.NO);
      // TODO CreateCoverSheetSord
      me.createCoverSheetSord(sord, dstDirPath);
      // TODO
      if (sol.common.SordUtils.isFolder(sord)) {
        sordName = sol.common.FileUtils.sanitizeFilename(sord.name);
        subFolderPath = dstDirPath + java.io.File.separator + sordName;
        subFolderPathFile = new File(subFolderPath);
        if (!subFolderPathFile.exists()) {
          try {
            subFolderPathFile.mkdirs();
          } catch (e) {
            me.logger.error("error creating destination directory", e);
          }
        }
        me.exportChildren(sord.id, subFolderPath);
      } else {
        try {
          // TODO CreatePdfDocument
          me.createPdfDocument(sord, dstDirPath);
          sol.common.FileUtils.downloadDocument(sord.id, dstDirPath);
          // TODO
        } catch (e) {
          me.logger.error("error downloadDocument ", e);
          me.logger.error(["error downloadDocument id = '{0}' name = '{1}'", sord.id, sord.name]);
        }
      }

    } catch (e) {
      me.logger.error("error checkoutSord exportFolder ", e);
      me.logger.error(["error checkoutSord exportFolder id = '{0}' name = '{1}'", sord.id, sord.name]);
    }
  },

  exportChildren: function (folderId, dstDirPath) {
    var me = this,
        findResult, findInfo, findChildren, idx, i, sord, sordName, subFolderPath, sordZ, subFolderPathFile;

    findInfo = new FindInfo();
    findChildren = new FindChildren();

    findChildren.parentId = folderId + "";
    findChildren.mainParent = true;
    findChildren.endLevel = 1;
    findInfo.findChildren = findChildren;

    sordZ = SordC.mbAll;
    try {
      idx = 0;
      findResult = ixConnect.ix().findFirstSords(findInfo, 1000, sordZ);
      while (true) {
        for (i = 0; i < findResult.sords.length; i++) {
          sord = findResult.sords[i];
          // TODO CreateCoverSheetSord
          me.createCoverSheetSord(sord, dstDirPath);
          // TODO
          if (sol.common.SordUtils.isFolder(sord)) {
            sordName = sol.common.FileUtils.sanitizeFilename(sord.name);
            subFolderPath = dstDirPath + java.io.File.separator + sordName;
            subFolderPathFile = new File(subFolderPath);
            if (!subFolderPathFile.exists()) {
              try {
                subFolderPathFile.mkdirs();
              } catch (e) {
                me.logger.error("error creating destination directory", e);
              }
            }
            me.exportChildren(sord.id, subFolderPath);
          } else {
            try {
              // TODO CreatePdfDocument
              me.createPdfDocument(sord, dstDirPath);
              sol.common.FileUtils.downloadDocument(sord.id, dstDirPath);    
              // TODO
            } catch (e) {
              me.logger.error("error downloadDocument ", e);
              me.logger.error(["error downloadDocument id = '{0}' name = '{1}'", sord.id, sord.name]);
            }
          }
        }
        if (!findResult.moreResults) {
          break;
        }
        idx += findResult.sords.length;
        findResult = ixConnect.ix().findNextSords(findResult.searchId, idx, 1000, sordZ);
      }
    } finally {
      if (findResult) {
        ixConnect.ix().findClose(findResult.searchId);
      }
    }
  }
});
