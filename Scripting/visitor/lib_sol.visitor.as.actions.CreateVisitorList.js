/**
 * Renders a visitor list as PDF and saves it to the archive.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 */
sol.define("sol.visitor.as.actions.CreateVisitorList", {
  extend: "sol.common.as.ActionBase",

  requiredProperty: ["templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.create("sol.common.Config", { compose: "/visitor/Configuration/visitor.config" }).config;
    sol.common.TranslateTerms.require("sol.visitor.as.actions.CreateVisitorList");
  },

  getName: function () {
    return "CreateVisitorList";
  },

  process: function () {
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.reporting.names.visitor }).apply({ date: new Date() }),
        generator, result;

    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_services_ChildrenDataCollector",
      renderer: "sol.common.as.renderer.Fop",
      collectorConfig: {
        endLevel: -1,
        filter: [
          { key: "VISITOR_STATUS", val: "CI*" },
          { key: "SOL_TYPE", val: me.config.visitor.solTypeVisitor },
          { key: "VISITOR_ARRIVALDATE", val: "+0000-00-00" }
        ],
        totalCount: 50000,
        sordKeys: ["ownerName", "name", "maskName", "maskId", "id", "guid", "parentId", "XDateIso", "IDateIso"],
        allObjKeys: true,
        formatter: "sol.common.ObjectFormatter.TemplateSord"
      },
      rendererConfig: {
        targetId: me.config.reporting.visitorListsFolderId,
        templateId: me.templateId
      },
      compareFct: function (templateSord1, templateSord2) {
        return templateSord1.objKeys.VISITOR_LASTNAME.localeCompare(templateSord2.objKeys.VISITOR_LASTNAME);
      },
      restrictRightsToCurrentUser: true
    });

    result = generator.process();

    if (result.objId) {
      me.addGotoIdEvent(result.objId);
    }
  }
});
