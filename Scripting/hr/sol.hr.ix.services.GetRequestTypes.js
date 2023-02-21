
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
//@include lib_sol.hr.Utils.js

/**
 * Retrieves the available request types defined in /hr/Configuration/hr.requests.config
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
 * @requires sol.hr.Utils
 */
sol.define("sol.hr.ix.services.GetRequestTypes", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],
  
  inject: {
    targetMaskField: { config: "hr", prop: "entities.request.services.requestcontainertypes.const.targetMaskField", template: true }, // ""
    requestConfigs: { config: "hrrequests", prop: "requestConfigs", template: true }, // []
    digitalizationRequest: { config: "hrrequests", prop: "digitalizationRequest", template: true } // {}    
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {String[]} Array with hr types
   */
  process: function () {
    var me = this, personnelFileId, requester, personnelFile, personnelFileGuid, customTargetMask;

    requester = String(sol.common.UserUtils.getCurrentUserInfo().name);
    personnelFileId = sol.hr.Utils.getPathOfUsersPersonnelFile(requester);
    
    if (personnelFileId) {
      personnelFile = sol.hr.shared.Utils.getSordData(personnelFileId, undefined, true);
      personnelFileGuid = personnelFile && personnelFile.guid || "";
      customTargetMask = sol.common.ObjectUtils.getProp(personnelFile, me.targetMaskField) || "";
    }

    return (  // get requests ...
      personnelFileId // if the user has a personnel file
      ? me.requestConfigs // [] list all possible requests
      : [me.digitalizationRequest]  // else provide digitalization request
    )
    .map(function (type) {  // ... enhance requests by container reference
      type.targetMaskName = customTargetMask || type.mask;  // MAP-Defined Mask > requestconfig-mask > hr.config of action
      type.requester = requester;
      type.inheritanceGuid = personnelFileGuid || "";
      return type;
    });
  }
});

/**
 * @member sol.hr.ix.services.GetRequestTypes
 * @method RF_sol_common_service_GetRequestTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_GetRequestTypes(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;
  
  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  serviceProc = sol.create("sol.hr.ix.services.GetRequestTypes", rfParams);
  result = rfUtils.stringify(serviceProc.process());
  return result;
}
