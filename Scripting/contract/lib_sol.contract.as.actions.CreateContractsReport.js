/**
 * Renders a contract report as PDF and saves it to the archive.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 */
sol.define("sol.contract.as.actions.CreateContractsReport", {
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
    me.config = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;
    sol.common.TranslateTerms.require("sol.contract.action.createContractsReport", "sol.contract.action.reports.folderName");
  },

  getName: function () {
    return "CreateContractsReport";
  },

  process: function () {
    var me = this,
        sord = sol.common.RepoUtils.getSord(me.parentId),
        templateSord = sol.common.SordUtils.getTemplateSord(sord).sord,
        name, path,
        targetId,
        generator, result;

    me.logger.debug("selected parent sord for report", templateSord);

    name = sol.create("sol.common.Template", { source: me.config.reporting.names.contracts }).apply({ date: new Date(), sord: templateSord });
    me.logger.debug("generating report with name", { name: name });

    path = sol.create("sol.common.Template", { source: me.config.reporting.reportTargetId }).apply({ date: new Date(), sord: templateSord });
    targetId = sol.common.RepoUtils.preparePath(path);
    me.logger.debug("generating report in", { targetId: targetId, path: path });

    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_services_ChildrenDataCollector",
      renderer: "sol.common.as.renderer.Excel",
      collectorConfig: {
        filter: [{ key: me.config.fields.objectType, val: me.config.objectTypes[0] }],
        parentId: me.parentId,
        endLevel: -1,
        formatter: "sol.common.ObjectFormatter.TemplateSord"
      },
      rendererConfig: {
        targetId: targetId,
        templateId: me.templateId
      }
    });

    result = generator.process();

    if (result.objId) {
      if (me.user) {
        sol.common.AclUtils.changeRightsInBackground(result.objId, {
          users: [me.user],
          rights: { r: true, w: true, d: true, e: true, l: true, p: true },
          mode: "SET"
        });
      }
      me.addGotoIdEvent(result.objId, true);
    }
  }

});
