
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js
//@include lib_sol.hr.Utils.js

/**
 * Retrieves the available personnel files for the logged on user.
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.ObjectUtils
 * @requires sol.common.UserUtils
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 * @requires sol.hr.Utils
 */
sol.define("sol.hr.ix.services.GetEligiblePersonnelFiles", {
  extend: "sol.common.ix.ServiceBase",
  
  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],
  
  inject: {
    solutionType: { config: "hr", prop: "entities.file.services.elligiblepersonnelfiles.const.solutiontype", template: true }, // ""
    targetMaskField: { config: "hr", prop: "entities.file.services.elligiblepersonnelfiles.const.targetMaskField", template: true }, // ""
    digitalizationRequest: { config: "hrrequests", prop: "digitalizationRequest", template: true }, // {}
    employeeConfig: { config: "hrsecurityroles", prop: "requestConfigs.hr_securityrole_employee", template: true, log: false }, // {}
    superiorConfig: { config: "hrsecurityroles", prop: "requestConfigs.hr_securityrole_superior", template: true, log: false }, // {}
    superiorFieldNames: { config: "hrsecurityroles", prop: "general.superiorFieldNames", template: true } // []
  },

  /**
   * @private returns an array of users who have a personnel file stating "superiorUserId" as superior
   */
  getUsersBySuperior: function (superiorUserGuid, superiorFieldNames) {
    var me = this, findInfo, findByIndex, objKeys, key1, key2, findResult, ids = [], usersOfSuperior = [];

    superiorFieldNames.forEach(function (superiorFieldName) {
      findInfo = new FindInfo();
      findByIndex = new FindByIndex();

      findInfo.findByIndex = findByIndex;
      key1 = new ObjKey();
      key1.name = superiorFieldName;
      key1.data = [superiorUserGuid];
      key2 = new ObjKey();
      key2.name = "SOL_TYPE";
      key2.data = [me.solutionType];
      objKeys = [
        key1, key2
      ];

      findByIndex.objKeys = objKeys;
      findByIndex.maskId = "";  // ignore mask

      findResult = ixConnectAdmin.ix().findFirstSords(findInfo, 10000, SordC.mbOnlyId);
      ids = findResult && findResult.ids && ids.concat(Array.prototype.slice.call(findResult.ids))
            || ids;
    });

    ids.forEach(function (objId) {
      var sord = sol.hr.shared.Utils.getSordData(objId, undefined, true), userName, targetMaskName;
      targetMaskName = sol.common.ObjectUtils.getProp(sord, me.targetMaskField) || "";
      userName = String(sord.name).trim();
      userName && usersOfSuperior.push({ /* id: userName,*/ name: userName, inheritanceGuid: sord.guid, targetMaskName: targetMaskName || sord.maskName });
    });

    usersOfSuperior.sort(function (a, b) {
      return (a.name).localeCompare(b.name);
    });

    return usersOfSuperior;
  },

  userIsSuperiorOf: function (superiorUserGuid) {
    var me = this;
    return me.getUsersBySuperior(String(superiorUserGuid), me.superiorFieldNames);
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {String[]} Array with hr types
   */
  process: function () {
    var me = this, personnelFileId, personnelFileSord, requester, eligibleFiles = [], superiorConfig = JSON.stringify(me.superiorConfig), customTargetMask;

    requester = ((me.userId && sol.common.UserUtils.getUserInfo(me.userId)) || sol.common.UserUtils.getCurrentUserInfo() || {}).name;

    // Viewing your own personnel-file is always possible
    personnelFileId = sol.hr.Utils.getPathOfUsersPersonnelFile(requester);
    if (personnelFileId) {
      me.employeeConfig.userId = requester;
      personnelFileSord = sol.hr.shared.Utils.getSordData(personnelFileId, undefined, true);
      customTargetMask = sol.common.ObjectUtils.getProp(personnelFileSord, me.targetMaskField) || "";
      me.employeeConfig.name = personnelFileSord.name || requester;
      me.employeeConfig.targetMaskName = customTargetMask || personnelFileSord.maskName;
      me.employeeConfig.inheritanceGuid = personnelFileSord.guid;
      eligibleFiles.push(me.employeeConfig);
    } else {  // ... if you don't have a personnel file
      me.digitalizationRequest.userId = requester;
      eligibleFiles.push(me.digitalizationRequest);
    }

    // A superior will also be able to select his employees' files
    personnelFileId && me.userIsSuperiorOf(personnelFileSord.guid).forEach(function (user) {
      var config = JSON.parse(superiorConfig);  // parse stringified config to get unique objects
      config.name = user.name;
      //config.userId = user.id;  // does not have userid, because it is not needed later
      config.inheritanceGuid = user.inheritanceGuid;
      config.targetMaskName = user.targetMaskName;
      eligibleFiles.push(config);
    });

    return eligibleFiles // [] list all possible inquiries
      .map(function (type) {  // ... enhance inqueries by container reference
        type.requester = requester;
        return type;
      });
  }
});

/**
 * @member sol.hr.ix.services.GetEligiblePersonnelFiles
 * @method RF_sol_common_service_GetEligiblePersonnelFiles
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_GetEligiblePersonnelFiles(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;
  
  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  serviceProc = sol.create("sol.hr.ix.services.GetEligiblePersonnelFiles", rfParams);
  result = rfUtils.stringify(serviceProc.process());
  return result;
}
