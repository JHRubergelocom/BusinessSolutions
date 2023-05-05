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

var logger = sol.create("sol.Logger", { scope: "sol.common_document.as.functions.TestConvertZipToPdf" });

sol.define("sol.common_document.as.functions.TestConvertZipToPdf", {
  extend: "sol.common.as.FunctionBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
    me.config = sol.common_document.Utils.loadConfigExport();
    sol.common.TranslateTerms.require("sol.common_document.action.pdfExport");
  },

  process: function () {
    logger.enter("process_TestConvertZipToPdf");
    var exportDirPath, result;

    exportDirPath = "C:\\Temp\\Test\\Invoice";

    logger.info(["Start testConvertZipToPdf with exportDirPath: '{0}'", exportDirPath]);
    sol.common_document.as.Utils.logger = logger;
    result = sol.common_document.as.Utils.convertZipToPdf(exportDirPath);
    logger.info(["Finished testConvertZipToPdf with result: {0}", sol.common.JsonUtils.stringifyAll(result, { tabStop: 2 })]);

    logger.exit("process_TestConvertZipToPdf");
  }

});
