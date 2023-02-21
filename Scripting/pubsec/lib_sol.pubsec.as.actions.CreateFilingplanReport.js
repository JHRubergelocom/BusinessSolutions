/**
 * Renders a filing plan report as PDF and saves it to the archive.
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
 * @requires sol.pubsec.Utils
 */
sol.define("sol.pubsec.as.actions.CreateFilingplanReport", {
  extend: "sol.common.as.ActionBase",
  
  requiredConfig: ["parentId", "targetId", "templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.pubsec.Utils.loadConfig();
    sol.common.TranslateTerms.require("sol.pubsec.as.actions.CreateFilingplanReport");
  },
  
  getName: function () {
    return "CreateFilingplanReport";
  },

  process: function () {
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.reporting.names.filingPlan }).apply({ date: new Date() }),
        generator, result;
    
    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_services_ChildrenDataCollector",
      renderer: "sol.common.as.renderer.Fop",
      collectorConfig: {
        parentId: me.parentId,
        endLevel: -1,
        objKeys: [],
        totalCount: 50000,
        sordKeys: ["ownerName", "name", "maskName", "maskId", "id", "guid", "parentId", "XDateIso", "IDateIso"],
        maskName: me.config.filingPlan.maskName,
        formatter: "sol.common.ObjectFormatter.TemplateSord"
      },
      rendererConfig: {
        targetId: me.targetId,
        templateId: me.templateId
      },
      compareFct: function (templateSord1, templateSord2) {
        var result;
        try {
          result = templateSord1.objKeys.FILING_PLAN_REFERENCE.localeCompare(templateSord2.objKeys.FILING_PLAN_REFERENCE);
        } catch (ex) {
          result = 0;
        }
        return result;
      }
    });
    
    result = generator.process();
    
    if (result.objId) {
      me.addGotoIdEvent(result.objId);
    }
  }
  
});
