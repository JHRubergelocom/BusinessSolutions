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
sol.define("sol.pubsec.as.actions.CreateFileReport", {
  extend: "sol.common.as.ActionBase",
  
  requiredConfig: ["fileId", "targetId", "templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.pubsec.Utils.loadConfig();
    sol.common.TranslateTerms.require("sol.pubsec.as.actions.CreateFileReport");
  },
  
  getName: function () {
    return "CreateFileReport";
  },

  process: function () {
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.reporting.names.file }).apply({ date: new Date() }),
        generator, result;
    
    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_services_ChildrenDataCollector",
      renderer: "sol.common.as.renderer.Fop",
      collectorConfig: {
        parentId: me.fileId,
        endLevel: -1,
        formatter: "sol.common.ObjectFormatter.TemplateSord"
      },
      rendererConfig: {
        targetId: me.targetId,
        templateId: me.templateId
      },
      compareFct: function (templateSord1, templateSord2) {
        var result, ref1, ref2;
        try {
          ref1 = templateSord1.objKeys.FILE_REFERENCE + templateSord1.objKeys.PROCESS_REFERENCE + templateSord1.objKeys.DOCUMENT_REFERENCE;
          ref2 = templateSord2.objKeys.FILE_REFERENCE + templateSord2.objKeys.PROCESS_REFERENCE + templateSord2.objKeys.DOCUMENT_REFERENCE;
          result = ref1.localeCompare(ref2);
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
