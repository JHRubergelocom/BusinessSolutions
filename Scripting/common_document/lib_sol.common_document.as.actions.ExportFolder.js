/**
 * Exports a folder structure as PDF and saves it to the archive.
 *
 * @eloas
 * @requires handlebars
 * @requires sol.common.Config
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.ActionBase
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 * @requires sol.common.as.renderer.Fop
 * @requires sol.common_document.Utils
 * @requires sol.common_document.as.Utils
 */
sol.define("sol.common_document.as.actions.ExportFolder", {
  extend: "sol.common.as.ActionBase",
  
  requiredConfig: ["folderId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.common_document.Utils.loadConfigExport();
    sol.common.TranslateTerms.require("sol.common_document.action.ExportFolder");
  },
  
  getName: function () {
    return "ExportFolder";
  },

  process: function () {
    var me = this, 
        exportDirPath, result;

    exportDirPath = "C:\\Temp\\Export";
    result = sol.common_document.as.Utils.exportFolder(me.folderId, exportDirPath);
    sol.common.FileUtils.delete(exportDirPath, { quietly: true });

    if (result.objId) {
      me.addGotoIdEvent(result.objId);
    }

  }
  
});
