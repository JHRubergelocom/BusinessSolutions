
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js

/**
 * Retrieves the available onboarding entry types defined in /hr/Configuration/hr.onboarding.config
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.UserUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 */
sol.define("sol.hr.ix.services.GetOnboardingTypes", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    targetMaskField: { config: "hr", prop: "entities.employeeentryrequest.services.requestcontainertypes.const.targetMaskField", template: true }, // ""
    employeeEnteredStatus: { config: "hr", prop: "entities.employeeentryrequest.services.requestcontainertypes.const.employeeEnteredStatus", template: true }, // ""
    requestConfigs: { config: "hronboarding", prop: "requestConfigs", template: true, log: false }, // []
    //templating data
    PERSONNELFILE: { prop: "personnelfile", log: false }
  },

  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [params]);
    me.personnelfile = sol.hr.shared.Utils.getSordData(params.targetId, undefined, true);  // can't use direct sordid-inject because admin access is required
  },

  isStatusAllowed: function (status, forbidden) {
    return (Array.isArray(forbidden) ? forbidden : [forbidden]) // backwards compatible to single string
      .every(function (val) {
        return status.indexOf(val.trim()) !== 0;
      });
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {String[]} Array with hr types
   */
  process: function () {
    var me = this, requester, personnelFileId = me.objId, customTargetMask, result = {};

    requester = sol.common.UserUtils.getCurrentUserInfo().name;
    if (personnelFileId) {
      customTargetMask = sol.common.ObjectUtils.getProp(sol.hr.shared.Utils.getSordData(personnelFileId, undefined, true), me.targetMaskField);
    }

    result.valid = me.isStatusAllowed(
      sol.common.ObjectUtils.getProp(me.personnelfile, me.employeeEnteredStatus.key),
      me.employeeEnteredStatus.value
    );

    if (!result.valid) {
      result.msg = sol.hr.shared.Utils.translate("sol.hr.personnel.client.employeeentry.dialog.status.error.title");
    } else {
      result.types = me.requestConfigs
      .map(function (type) {  // ... enhance requests by container reference
        type.targetMaskName = customTargetMask || type.mask;  // MAP-Defined Mask > requestconfig-mask > hr.config of action
        type.requester = requester;
        return type;
      });
    }

    return result;
  }
});

/**
 * @member sol.hr.ix.services.GetOnboardingTypes
 * @method RF_sol_common_service_GetOnboardingTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_GetOnboardingTypes(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  serviceProc = sol.create("sol.hr.ix.services.GetOnboardingTypes", rfParams);
  result = rfUtils.stringify(serviceProc.process());
  return result;
}
