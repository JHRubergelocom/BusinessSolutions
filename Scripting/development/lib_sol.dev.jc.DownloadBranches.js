
//@include lib_Class.js

importPackage(Packages.de.elo.ix.client);

/**
 * Tool to download complete branches to disk.
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @elojc
 */
sol.define("sol.dev.jc.DownloadBranches", {
  singleton: true,

  execute: function () {
    var me = this,
        baseDstDirPath, downloadElements, downloadElement, view;
    view = workspace.activeView;
    if (!(view instanceof ArchiveViewAdapter)) {
      return;
    }
    baseDstDirPath = workspace.directories.tempDir + File.separator + "RepoTree_" + java.lang.System.nanoTime();
    workspace.setWaitCursor();
    downloadElements = view.allSelected;
    while (downloadElements.hasMoreElements()) {
      downloadElement = downloadElements.nextElement();
      try {
        me.downloadDocuments(downloadElement.id, baseDstDirPath);
      } catch (ex) {
        // ignore
      }
    }
    workspace.setNormalCursor();
    sol.common.ExecUtils.open(baseDstDirPath);
  },

  /**
   * @private
   * Download documents
   * @param {String} objId Start object ID
   * @param {String} baseDstDirPath Base destination directory path
   */
  downloadDocuments: function (objId, baseDstDirPath) {
    var sords, i, j, sord, pathParts, dstDirPath, filePath;
      
    sords = sol.common.RepoUtils.findChildren(objId, { recursive: true, level: 10, includeDocuments: true, includeFolders: false, includeReferences: true });
            
    for (i = 0; i < sords.length; i++) {
      sord = sords[i];
      pathParts = [baseDstDirPath];
      for (j = 0; j < sord.refPaths[0].path.length; j++) {
        pathParts.push(sol.common.FileUtils.sanitizeFilename(sord.refPaths[0].path[j].name));
      }
      dstDirPath = pathParts.join(File.separator);
      filePath = sol.common.RepoUtils.downloadToFile(sord.id, { dstDirPath: dstDirPath, createDirs: true, createUniqueFileName: true });
      workspace.setStatusMessage("Download " + filePath);
    }
  },

  /**
   * @private
   * @param {String} key
   * @return {String}
   */
  getText: function (key) {
    return utils.getText("sol.dev.client", key);
  }
});
