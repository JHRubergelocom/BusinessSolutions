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
sol.define("sol.common_document.as.actions.PdfExport", {
  extend: "sol.common.as.ActionBase",
  
  requiredConfig: ["folderId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    sol.common.TranslateTerms.require("sol.common_document.action.pdfExport");
  },
  
  getName: function () {
    return "PdfExport";
  },

  process: function () {
    var me = this,
        language = ixConnect.loginResult.clientInfo.language,
        param2, param3;

    param2 = {
      folderId: me.folderId,
      user: me.user
    };

    param3 = {
      language: language
    };

    sol.common.AsUtils.callAs({
      ruleName: "sol.common_document.as.functions.PdfExport",
      cmd: "run",
      expectJsonResponse: false,
      addTicket: true,
      param2Obj: param2,
      param3Obj: param3
    });

    me.addInfoEvent("sol.common_document.action.pdfExport.msg", language);
  }
  
});
