/**
 * Renders a file report as PDF and saves it to the archive.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 * @requires sol.pubsec.Utils
 */
sol.define("sol.pubsec.as.actions.CreateFilesReport", {
  extend: "sol.common.as.ActionBase",

  requiredConfig: ["parentId", "targetId", "templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.pubsec.Utils.loadConfig();
    sol.common.TranslateTerms.require("sol.pubsec.as.actions.CreateFilesReport");
  },

  getName: function () {
    return "CreateFilesReport";
  },

  process: function () {
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.reporting.names.files }).apply({ date: new Date() }),
        generator, result;

    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_services_ChildrenDataCollector",
      renderer: "sol.common.as.renderer.Fop",
      collectorConfig: {
        parentId: me.parentId,
        endLevel: -1,
        totalCount: 50000,
        sordKeys: ["ownerName", "name", "maskName", "maskId", "id", "guid", "parentId", "XDateIso", "IDateIso"],
        filter: [{ key: "SOL_TYPE", val: "FILE" }],
        formatter: "sol.common.ObjectFormatter.TemplateSord"
      },
      rendererConfig: {
        targetId: me.targetId,
        templateId: me.templateId
      }
    });

    result = generator.process();

    if (result.objId) {
      me.addGotoIdEvent(result.objId);
    }
  }

});
