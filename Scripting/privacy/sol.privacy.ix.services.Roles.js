
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.privacy.ix.services.Roles" });

sol.define("sol.privacy.ix.services.Roles", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  process: function () {
    var me = this,
        result = {},
        fct;

    fct = me[me.fctName];

    if (sol.common.ObjectUtils.isFunction(fct)) {
      fct.call(me, result);
    }

    return result;
  },

  checkGdprRoles: function (result) {
    var me = this;
    result.dataProtectionOfficer = me.isDataProtectionOfficer();
    result.dataProtectionTeam = me.isMemberOfDataProtectionTeam();
    result.headOfDepartment = me.isHeadOfDepartment();
  },

  isHeadOfDepartment: function () {
    return sol.common.UserUtils.isInGroup("sol.privacy.HeadOfDepartment");
  },

  isDataProtectionOfficer: function () {
    return sol.common.UserUtils.isInGroup("sol.privacy.DataProtectionOfficer");
  },

  isMemberOfDataProtectionTeam: function () {
    return sol.common.UserUtils.isInGroup("sol.privacy.DataProtectionWorkGroup");
  }

});


/**
 * @member sol.privacy.ix.services.Roles
 * @method RF_sol_privacy_service_Roles_CheckGdprRoles
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_privacy_service_Roles_CheckGdprRoles(ec, args) {
  var params, service, result;

  logger.enter("RF_sol_privacy_service_Roles_CheckGdprRoles", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  params.fctName = "checkGdprRoles";

  service = sol.create("sol.privacy.ix.services.Roles", params);
  result = sol.common.ix.RfUtils.stringify(service.process());

  logger.exit("RF_sol_privacy_service_Roles_CheckGdprRoles", result);

  return result;
}
