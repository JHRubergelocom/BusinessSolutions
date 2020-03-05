
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 *
 * @eloall
 * @requires sol.common.Config
 */
sol.define("sol.common_document.Utils", {
  singleton: true,

  /**
   * Loads the export configuration from the JSON file: `/Administration/Business Solutions/common_document/Configuration/Export.config`
   * @return {Object}
   */
  loadConfigExport: function () {
    return sol.create("sol.common.Config", { compose: "/common_document/Configuration/Export.config" }).config;
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
          sol.common.FileUtils.downloadDocument(sord.id, dstDirPath);
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
              sol.common.FileUtils.downloadDocument(sord.id, dstDirPath);
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
