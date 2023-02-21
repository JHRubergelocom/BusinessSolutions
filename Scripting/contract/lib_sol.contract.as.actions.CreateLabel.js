/**
 * Creates a PDF label from a template.
 *
 * @eloas
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 */
sol.define("sol.contract.as.actions.CreateLabel", {
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
    me.config = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;
    sol.common.TranslateTerms.require("sol.contract.action.createContractLabel");
  },

  getName: function () {
    return "CreateLabel";
  },

  process: function () {
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.contractLabel.defaultName }).applySord(me.targetId),
        generator, result;

    if (!me.isInContract()) {
      me.addErrorEvent("sol.contract.msg.noContractFound", null, null, ixConnect.loginResult.clientInfo.language);
      return;
    }

    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_service_ParentDataCollector",
      renderer: "sol.common.as.renderer.Fop",
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
  },

  /**
   * @private
   * Checks, if the selected element is inside (or is by itself) a contract.
   * @return {Boolean}
   */
  isInContract: function () {
    var me = this,
        contract = sol.common.RepoUtils.findInHierarchy(me.targetId, { sordTypeNames: ["sol.Contract"] });
    return sol.common.SordUtils.isSord(contract);
  }

});
