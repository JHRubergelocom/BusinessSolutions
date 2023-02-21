/**
 * Renders a cashflow report as XLSX and saves it to the archive.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.FunctionBase
 */
sol.define("sol.contract.as.functions.CreateCashflowReportBackground", {
  extend: "sol.common.as.FunctionBase",

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
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
    me.config = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;
    sol.common.TranslateTerms.require("sol.contract.action.createCashflowReport", "sol.contract.action.reports.folderName");
  },

  process: function () {
    var me = this,
        sord = sol.common.RepoUtils.getSord(me.parentId),
        templateSord = sol.common.SordUtils.getTemplateSord(sord).sord,
        name,
        targetId, path,
        generator, result;

    me.logger.debug("selected parent sord for report", templateSord);

    name = sol.create("sol.common.Template", { source: me.config.reporting.names.cashflow }).apply({ date: new Date(), sord: templateSord });
    me.logger.debug("generating report with name", { name: name });

    path = sol.create("sol.common.Template", { source: me.config.reporting.reportTargetId }).apply({ date: new Date(), sord: templateSord });
    targetId = sol.common.RepoUtils.preparePath(path);
    me.logger.debug("generating report in", { targetId: targetId, path: path });

    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_contract_service_PaymentPlanCollector",
      renderer: "sol.common.as.renderer.Excel",
      collectorConfig: {
        parentId: me.parentId
      },
      rendererConfig: {
        targetId: targetId,
        templateId: me.templateId
      }
    });

    result = generator.process();

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
