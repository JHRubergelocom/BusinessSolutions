/**
 * Creates a file cover sheet from a template.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 * @requires sol.pubsec.Utils
 */
sol.define("sol.pubsec.as.actions.CreateFileCoverSheet", {
  extend: "sol.common.as.ActionBase",

  requiredConfig: ["parentId", "targetId", "templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.pubsec.Utils.loadConfig();

    sol.common.TranslateTerms.require("sol.pubsec.as.actions.CreateFileCoverSheet");
  },

  getName: function () {
    return "CreateFileCoverSheet";
  },

  process: function () {
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.fileCoverSheet.fileCoverSheetDefaultName }).apply(),
        generator, result;

    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_service_ParentDataCollector",
      renderer: "sol.common.as.renderer.Fop",
      collectorConfig: {
        objId: me.parentId,
        returnDataDefinition: true
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
