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
 */
sol.define("sol.common_document.as.actions.ExportFolder", {
  extend: "sol.common.as.ActionBase",
  
  requiredConfig: ["folderId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.common_document.Utils.loadConfigExport();
    sol.common.TranslateTerms.require("sol.common_document.action.ExportFolder");
  },
  
  getName: function () {
    return "ExportFolder";
  },

  process: function () {
    var me = this, 
        exportDirPath;

    exportDirPath = "C:\\Temp\\Export";
    sol.common_document.Utils.exportFolder(me.folderId, exportDirPath);

    /*
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.reporting.names.filingPlan }).apply({ date: new Date() }),
        generator, result;
    
    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_services_ChildrenDataCollector",
      renderer: "sol.common.as.renderer.Fop",
      collectorConfig: {
        folderId: me.folderId,
        endLevel: -1,
        objKeys: [],
        totalCount: 50000,
        sordKeys: ["ownerName", "name", "maskName", "maskId", "id", "guid", "folderId", "XDateIso", "IDateIso"],
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
*/
  }
  
});
