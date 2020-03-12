/**
 * Exports a folder structure as PDF and saves it to the archive.
 *
 * @eloas
 * @requires handlebars
 * @requires sol.common.AclUtils
 * @requires sol.common.Config
 * @requires sol.common.FileUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.WfUtils
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.FunctionBase
 * @requires sol.common.as.renderer.Fop
 * @requires sol.common_document.Utils
 * @requires sol.common_document.as.Utils
 */
sol.define("sol.common_document.as.functions.ExportFolder", {
  extend: "sol.common.as.FunctionBase",
  
  requiredConfig: ["folderId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
    me.config = sol.common_document.Utils.loadConfigExport();
    sol.common.TranslateTerms.require("sol.common_document.action.ExportFolder");
  },
  
  process: function () {
    var me = this, 
        exportDirPath, result;

    exportDirPath = "C:\\Temp\\Export";
    result = sol.common_document.as.Utils.exportFolder(me.folderId, exportDirPath);
    sol.common.FileUtils.delete(exportDirPath, { quietly: true });

    if (result.objId) {
      if (typeof me.user !== "undefined") {
        sol.common.AclUtils.changeRightsInBackground(result.objId, {
          users: [me.user],
          rights: { r: true, w: true, d: true, e: true, l: true, p: true },
          mode: "SET"
        });
      }
      sol.common.WfUtils.createReminder(result.objId);
    }
  }
  
});
