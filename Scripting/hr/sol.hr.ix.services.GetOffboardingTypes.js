
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
sol.define("sol.hr.ix.services.GetOffboardingTypes", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    employeeTerminatedStatus: { config: "hr", prop: "entities.noticeofterminationrequest.services.requestcontainertypes.const.employeeTerminatedStatus", template: true } // ""
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
    var me = this, result = { types: [{}] };

    result.valid = me.isStatusAllowed(
      sol.common.ObjectUtils.getProp(sol.hr.shared.Utils.getSordData(me.targetId), me.employeeTerminatedStatus.key),
      me.employeeTerminatedStatus.value
    );
    if (!result.valid) {
      result.msg = sol.hr.shared.Utils.translate("sol.hr.personnel.client.noticeoftermination.create.dialog.error.msg");
    }

    return result;
  }
});

/**
 * @member sol.hr.ix.services.GetOffboardingTypes
 * @method RF_sol_common_service_GetOffboardingTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_GetOffboardingTypes(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  serviceProc = sol.create("sol.hr.ix.services.GetOffboardingTypes", rfParams);
  result = rfUtils.stringify(serviceProc.process());
  return result;
}
