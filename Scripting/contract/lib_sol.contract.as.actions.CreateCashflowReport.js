/**
 * Renders a cashflow report as XLSX and saves it to the archive.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 */
sol.define("sol.contract.as.actions.CreateCashflowReport", {
  extend: "sol.common.as.ActionBase",

  requiredProperty: ["parentId", "templateId"],

  /**
   * @cfg {String} parentId (required) The folder containing the contracts for the report
   */

  /**
   * @cfg {String} templateId (required) The excel template
   */

  /**
   * @cfg {String} user (optional) User name or id. If this is set, only this user is granted access to the report
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    sol.common.TranslateTerms.require("sol.contract.action.createCashflowReport", "sol.contract.action.reports.folderName");
  },

  getName: function () {
    return "CreateCashflowReport";
  },

  process: function () {
    var me = this,
        language = ixConnect.loginResult.clientInfo.language,
        param2, param3;

    param2 = {
      parentId: me.parentId,
      templateId: me.templateId,
      user: me.user
    };

    param3 = {
      language: language
    };

    sol.common.AsUtils.callAs({
      ruleName: "sol.contract.as.functions.CreateCashflowReportBackground",
      cmd: "run",
      expectJsonResponse: false,
      addTicket: true,
      param2Obj: param2,
      param3Obj: param3
    });

    me.addInfoEvent("sol.contract.action.createCashflowReport.msg", language);
  }

});
