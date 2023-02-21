
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.notify.ix.services.User" });

/**
 * Get users
 *
 * # Get users if current user is main admin
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloix
 * @requires sol.common.UserUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.notify.ix.services.User", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * @private
   * Get users if current user is main admin
   * @return {de.elo.ix.client.UserName[]}
   */
  getUsers: function () {
    var userNames, currentUser, result;

    userNames = [];
    currentUser = sol.common.UserUtils.getCurrentUserInfo();
    if (sol.common.UserUtils.isMainAdmin(currentUser)) {
      userNames = sol.common.UserUtils.getUserNames();
    }
    result = [];
    if (userNames.length > 0) {
      userNames.forEach(function (userName) {
        if (userName.type == UserInfoC.TYPE_USER) {
          result.push({ name: userName.name, id: userName.id, guid: userName.guid });
        }
      });
    }

    return { data: result };
  }

});

/**
 * @member sol.notify.ix.services.User
 * @method RF_sol_notify_service_GetUsers
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_notify_service_GetUsers(ec, args) {
  var params, service, result;

  logger.enter("RF_sol_notify_service_GetUsers", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  service = sol.create("sol.notify.ix.services.User", params);
  result = sol.common.ix.RfUtils.stringify(service.getUsers());

  logger.exit("RF_sol_notify_service_GetUsers", result);

  return result;
}
