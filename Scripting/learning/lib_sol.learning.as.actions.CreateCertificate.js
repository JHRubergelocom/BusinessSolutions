/**
 * Creates a PDF, Word or Excel document from a template.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 */
sol.define("sol.learning.as.actions.CreateCertificate", {
  extend: "sol.common.as.ActionBase",

  /**
   * @cfg {String} targetId The target for the resulting document
   */

  /**
   * @cfg {String} templateId The template to generate the document from
   */

  requiredProperty: ["targetId", "templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.create("sol.common.Config", { compose: "/learning/Configuration/learning.config" }).config;
    sol.common.TranslateTerms.require("sol.learning.action.createCertificate");
  },

  getName: function () {
    return "CreateCertificate";
  },

  process: function () {
    var me = this,
        name = "Zertifikat",
        generator, result, templateSord, extension, renderer;

    templateSord = sol.common.RepoUtils.getSord(me.templateId, { sordZ: SordC.mbAll });
    extension = String(templateSord.docVersion.ext).toLowerCase();
    if (extension.indexOf("doc") == 0) {
      renderer = "sol.common.as.renderer.Word";
    } else if (extension.indexOf("xls") == 0) {
      renderer = "sol.common.as.renderer.Excel";
    } else if (extension.indexOf("fo") == 0){
      renderer = "sol.common.as.renderer.Fop";
    } else {
      me.addErrorEvent("sol.learning.msg.wrongExtType", null, null, ixConnect.loginResult.clientInfo.language);
      return;
    }
    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_service_ParentDataCollector",
      renderer: renderer,
      collectorConfig: {
        objId: me.targetId,
        returnDataDefinition: true,
        allMapFields: true
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
