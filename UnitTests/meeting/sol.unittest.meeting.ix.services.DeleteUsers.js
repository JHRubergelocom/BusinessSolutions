
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.meeting.ix.services.DeleteUsers" });

/**
 * Delete users.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_meeting_service_DeleteUsers', {
 *       users: ["user1", user2, user3]
 *     });
 *
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.meeting.ix.services.DeleteUsers", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["users"],

  /**
   * @cfg {Array} users to delete.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this,
        result = {};

    ixConnect.ix().deleteUsers(me.users, LockC.NO);
    logger.debug["users: '{0}' deleted", me.user];

    return result;
  }
});

/**
 * @member sol.unittest.meeting.ix.services.DeleteUsers
 * @method RF_sol_unittest_meeting_service_DeleteUsers
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_meeting_service_DeleteUsers(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_meeting_service_DeleteUsers", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "users");
  params.ec = ec;
  service = sol.create("sol.unittest.meeting.ix.services.DeleteUsers", params);
  result = service.process();
  logger.exit("RF_sol_unittest_meeting_service_DeleteUsers", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
