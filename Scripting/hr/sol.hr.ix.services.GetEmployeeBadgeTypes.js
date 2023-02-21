
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js

/**
 * Retrieves available employee badge types.
 *
 * ### Result
 * 
 *     objId: sord.id,
 *     name: sord.name,
 *     desc: sol.common.SordUtils.getObjKeyValue(sord, "desc")
 *     sourceFolder: sord.sourceFolder (varies depending on template source)
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 */
sol.define("sol.hr.ix.services.GetEmployeeBadgeTypes", {
  extend: "sol.common.ix.ServiceBase",
  
  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],
  
  inject: {
    templateFolders: { config: "hr", prop: "entities.file.services.employeebadgetypes.const.templateFolders", template: true } // []
  },
 
  /**
   * Retrieves the data as specified in the constructor configuration.
   * @returns {String[]} Array with types
   */
  process: function () {
    var me = this;
    return sol.hr.shared.Utils.templateFoldersToTypes(me.templateFolders);
  }
});

/**
 * @member sol.hr.ix.services.GetEmployeeBadgeTypes
 * @method RF_sol_common_service_GetEmployeeBadgeTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_GetEmployeeBadgeTypes(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;
  
  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  serviceProc = sol.create("sol.hr.ix.services.GetEmployeeBadgeTypes", rfParams);
  result = rfUtils.stringify(serviceProc.process());
  return result;
}