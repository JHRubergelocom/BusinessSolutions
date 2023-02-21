/**
 * Creates a label from a template.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 * @requires sol.common.as.renderer.Fop
 */
sol.define("sol.contact.as.actions.CreateLabel", {
  extend: "sol.common.as.ActionBase",

  requiredProperty: ["parentId", "targetId", "templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.create("sol.common.Config", { compose: "/contact/Configuration/contact.config" }).config;

    sol.common.TranslateTerms.require("sol.contact.as.actions.CreateLabel");
  },

  getName: function () {
    return "CreateLabel";
  },

  process: function () {
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.label.labelDefaultName }).apply(),
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
