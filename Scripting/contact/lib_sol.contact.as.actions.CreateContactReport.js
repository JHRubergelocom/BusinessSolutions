/**
 * Renders a contact report as PDF and saves it to the archive.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 */
sol.define("sol.contact.as.actions.CreateContactReport", {
  extend: "sol.common.as.ActionBase",

  requiredProperty: ["parentId", "targetId", "templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.create("sol.common.Config", { compose: "/contact/Configuration/contact.config" }).config;
    sol.common.TranslateTerms.require("sol.contact.as.actions.CreateContactReport");
  },

  getName: function () {
    return "CreateContactReport";
  },

  process: function () {
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.reporting.names.contact }).apply({ date: new Date() }),
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
        maskName: me.config.contact.maskName,
        formatter: "sol.common.ObjectFormatter.TemplateSord"
      },
      rendererConfig: {
        targetId: me.targetId,
        templateId: me.templateId
      },
      compareFct: function (templateSord1, templateSord2) {
        if (!templateSord1.objKeys.CONTACT_REFERENCE && !templateSord2.objKeys.CONTACT_REFERENCE) {
          return 0;
        }
        if (!templateSord1.objKeys.CONTACT_REFERENCE) {
          return 1;
        }
        if (!templateSord2.objKeys.CONTACT_REFERENCE) {
          return -1;
        }
        return templateSord1.objKeys.CONTACT_REFERENCE.localeCompare(templateSord2.objKeys.CONTACT_REFERENCE);
      }
    });

    result = generator.process();

    if (result.objId) {
      me.addGotoIdEvent(result.objId);
    }
  }

});
