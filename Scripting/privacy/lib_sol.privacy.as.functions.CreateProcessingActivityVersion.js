/**
 * Creates a PDF document from a template.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.FunctionBase
 */
sol.define("sol.privacy.as.functions.CreateProcessingActivityVersion", {
  extend: "sol.common.as.FunctionBase",

  /**
   * @cfg {String} objId
   */

  requiredConfig: ["objId"],

  nameTemplate: "Version {{formatDate 'YYYYMMDDHHmmss'}} - {{sord.name}}",
  templateBasePath: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/privacy/Configuration/Printout templates",
  templateName: "/Processing activity printout",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
    sol.common.TranslateTerms.require("sol.privacy.function.createProcessingActivityVersion");
  },

  process: function () {
    var me = this,
        result = {},
        name, templateId, generator, renderResult, officeConverter, convertResult, docObjId;

    name = sol.create("sol.common.Template", { source: me.nameTemplate }).applySord(me.objId);

    templateId = sol.common.RepoUtils.getObjIdFromRelativePath(me.templateBasePath, me.templateName);

    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_privacy_service_ExtendedParentDataCollector",
      renderer: "sol.common.as.renderer.Word",
      collectorConfig: {
        objId: me.objId
      },
      rendererConfig: {
        targetId: me.objId,
        templateId: templateId
      }
    });

    renderResult = generator.process();

    if (renderResult && renderResult.objId) {

      officeConverter = sol.create("sol.common.as.functions.OfficeConverter", {
        openFromRepo: {
          objId: renderResult.objId
        },
        saveToRepo: {
          objId: renderResult.objId,
          format: "pdf"
        }
      });
      convertResult = officeConverter.process();

      docObjId = (convertResult && convertResult.objId) ? convertResult.objId : renderResult.objId;

      /*sol.common.IxUtils.execute("RF_sol_function_Set", {
        objId: docObjId,
        entries: [
          { type: "MASK", value: "Processing activity" },
          { type: "GRP", key: "SOL_TYPE", value: "PROCESSING_ACTIVITY_VERSION" }
        ]
      });*/

      sol.common.IxUtils.execute("RF_sol_function_ChangeColor", {
        objId: docObjId,
        color: "sol.privacy.gdpr.version"
      });

      sol.common.IxUtils.execute("RF_sol_function_ChangeRights", {
        objId: docObjId,
        users: ["sol.privacy.DataProtectionOfficer", "sol.privacy.OverallResponsible"],
        rights: { r: true },
        mode: "SET"
      });

      result.passOn = true;
    }

    return JSON.stringify(result || "No result");
  }

});
