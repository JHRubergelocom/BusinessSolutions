/**
 * Exports a folder structure as PDF and saves it to the archive.
 *
 * @eloas
 * @requires handlebars
 * @requires sol.common.AclUtils
 * @requires sol.common.Config
 * @requires sol.common.ExecUtils
 * @requires sol.common.FileUtils
 * @requires sol.common.sol.common.JsonUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.UserProfile
 * @requires sol.common.WfUtils
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.FunctionBase
 * @requires sol.common.as.renderer.Fop
 * @requires sol.common_document.Utils
 * @requires sol.common_document.as.Utils
 */

var logger = sol.create("sol.Logger", { scope: "sol.common_document.as.functions.PdfExport" });

sol.define("sol.common_document.as.functions.PdfExport", {
  extend: "sol.common.as.FunctionBase",
  
  requiredConfig: ["folderId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
    me.config = sol.common_document.Utils.loadConfigExport();
    sol.common.TranslateTerms.require("sol.common_document.action.pdfExport");
  },
  
  process: function () {
    logger.enter("process_PdfExport");
    var me = this, 
        exportDirPath, result, tempDirBasePath, timestamp;

    tempDirBasePath = sol.common.FileUtils.getTempDirPath(); 
    timestamp = sol.common.FileUtils.getTimeStampString();   
    exportDirPath = tempDirBasePath + File.separator + "temp" + "_" + timestamp;

    logger.info(["Start pdfExport with folderId: '{0}', exportDirPath: '{1}', config: '{2}'", me.folderId, exportDirPath, sol.common.JsonUtils.stringifyAll(me.config, { tabStop: 2 })]);
    sol.common_document.as.Utils.logger = logger;
    result = sol.common_document.as.Utils.pdfExport(me.folderId, exportDirPath, me.config);
    logger.info(["Finished pdfExport with result: {0}", sol.common.JsonUtils.stringifyAll(result, { tabStop: 2 })]);

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

    logger.exit("process_PdfExport");
  }
  
});
