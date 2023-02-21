
//@include lib_Class.js
//@include lib_sol.dev.BuildPackages.js

/**
 * Build packages
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @elojc
 */
sol.define("sol.dev.jc.BuildPackages", {

  defaultExportDirPath: "d:/eloinst",

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  execute: function () {
    var me = this,
        objIds = [],
        view, packageElements, packageElement, exportDirPath, builder;

    view = workspace.activeView;
    if (!(view instanceof ArchiveViewAdapter)) {
      return;
    }
    workspace.setWaitCursor();
    packageElements = view.allSelected;
    while (packageElements.hasMoreElements()) {
      packageElement = packageElements.nextElement();
      objIds.push(packageElement.id);

    }

    if (sol.common.FileUtils.exists(me.defaultExportDirPath)) {
      exportDirPath = me.defaultExportDirPath;
    } else {
      exportDirPath = sol.common.jc.CommonDialogs.showSaveDialog({ title: me.getText("dev.setupBuilder.saveDialog.title"), directoriesOnly: true });
    }
    if (!exportDirPath) {
      workspace.setNormalCursor();
      return;
    }
    builder = sol.create("sol.dev.BuildPackages", {
      objIds: objIds,
      transport: me.transport,
      exportDirPath: exportDirPath
    });
    builder.execute();

    workspace.setNormalCursor();
    workspace.setStatusMessage("");
    workspace.setFeedbackMessage(me.getText("sol.dev.SetupBuilder.msgCreated").replace("{0}", exportDirPath));
  },

  /**
   * @private
   * Helper function to get a localized text of a specific key.
   * @param {String} key Key for the text constant.
   * @return {String} Localized text constant.
   */
  getText: function (key) {
    return String(utils.getText("sol.dev.client", key));
  }
});
