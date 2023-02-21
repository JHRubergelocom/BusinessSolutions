importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js

/**
 * Retrieves parameters for a request which has been approved. These parameters can be fed into fillSordByApi.
 *
 * ### Result
 *
 *     objId: sord.id,
 *     name: sord.name,
 *     desc: sol.common.SordUtils.getObjKeyValue(sord, "desc")
 *     sourceFolder: sord.sourceFolder (varies depending on template source)
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.ObjectUtils
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 */
sol.define("sol.hr.ix.services.GetOnboardingConclusionParams", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],
  
  inject: {
    rqConfigs: { config: "hronboarding", prop: "requestConfigs", template: true }, // []
    originGUIDField: { config: "hr", prop: "entities.employeeentryrequest.services.employeeentryrequestconclusionparams.const.originGUIDField", template: true } // ""
    
  },

  /**
   * Retrieves the data as specified in the constructor configuration.
   * @returns {String[]} Array with types
   */
  process: function () {
    var me = this, requestConfig, requestBaseId, requestType;

    me.rqConfigs.some(function (cfg) {
      requestType = cfg.workflow === me.wfTemplateName && cfg.id;
      return requestType;
    });

    if (!requestType) {
      throw "no request definition found for workflow " + me.wfName;
    }

    requestBaseId = sol.common.ObjectUtils.getProp(sol.hr.shared.Utils.getSordData(me.wfObjId, me.flowId, true), me.originGUIDField);
    requestConfig = sol.common.ObjectUtils.getProp(me.rqConfigs, requestType);

    return {
      api: {
        mapping: requestConfig.api.mapping || "",
        references: requestConfig.api.references || "",
        dataSources: {
          sordReferenceForTemplating: {
            type: "objId", value: me.wfObjId
          }
        }
      },
      target: { type: "objId", value: requestBaseId },
      emptyNonRendered: true,
      reverseMapping: true,
      objId: requestBaseId // for register update
    };
  }
});

/**
 * @member sol.hr.ix.services.GetOnboardingConclusionParams
 * @method RF_sol_common_service_GetOnboardingConclusionParams
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_GetOnboardingConclusionParams(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  serviceProc = sol.create("sol.hr.ix.services.GetOnboardingConclusionParams", rfParams);
  result = rfUtils.stringify(serviceProc.process());
  return result;
}