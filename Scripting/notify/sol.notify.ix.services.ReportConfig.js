
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.notify.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.notify.ix.services.ReportConfig" });

/**
 * Reads and writes the report configuration
 *
 * # Get and set user options notify mail
 *
 *     sol.common.IxUtils.execute("RF_sol_notify_service_ReportConfig_Write", {
 *       enableMail: true,
 *       sendAlways: true,
 *       withGroups: true,
 *       withDeputies: true,
 *       withWeekend: true,
 *       onlyOnce: true,
 *       newsMyElo: true
 *     });
 *
 *     var userNotifyCfg = sol.common.IxUtils.execute("RF_sol_notify_service_ReportConfig_Read", {});
 *
 * # Get and set user options notify mail for another user
 *
 * In addition the userId can be given if the current user has administrative rights.
 *
 *     sol.common.IxUtils.execute("RF_sol_notify_service_ReportConfig_Write", {
 *       userId: "3"
 *     });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloix
 * @requires moment.js
 * @requires sol.common.Config
 * @requires sol.common.IxUtils
 * @requires sol.common.UserUtils
 * @requires sol.common.UserProfile
 * @requires sol.common.ix.ServiceBase
 * @requires sol.notify.Utils
 */
sol.define("sol.notify.ix.services.ReportConfig", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {String} userId (optional)
   * If not set, the current user (from the connection) will be used.
   * A `userId` can only be provided by users with main administrator right.
   */

  initialize: function (config) {
    var me = this,
        currentUser;

    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    currentUser = sol.common.UserUtils.getCurrentUserInfo().id;

    if (me.userId && !sol.common.UserUtils.isMainAdmin(currentUser) && (me.userId != currentUser)) {
      throw "IllegalAccess: user unauthorized";
    }

    me.userId = me.userId || currentUser;
  },

  /**
   * @private
   * Reads the notify config
   * @return {Object}
   */
  read: function () {
    var me = this,
        reportConfig;

    reportConfig = sol.notify.Utils.readReportConfig(me.userId);

    return { reportConfig: reportConfig };
  },

  /**
   * @private
   * Writes the notify config
   */
  write: function () {
    var me = this;

    if (!me.reportConfig) {
      throw "IllegalState: 'reportConfiguration' reguired";
    }

    sol.notify.Utils.writeReportConfig(me.userId, me.reportConfig);
  }
});

/**
 * @member sol.notify.ix.services.ReportConfig
 * @method RF_sol_notify_service_ReportConfig_Read
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_notify_service_ReportConfig_Read(ec, args) {
  var params, service, result;

  logger.enter("RF_sol_notify_service_ReportConfig_Read", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  service = sol.create("sol.notify.ix.services.ReportConfig", params);
  result = sol.common.ix.RfUtils.stringify(service.read());

  logger.exit("RF_sol_notify_service_ReportConfig_Read", result);

  return result;
}
/**
 * @member sol.notify.ix.services.ReportConfig
 * @method RF_sol_notify_service_ReportConfig_Write
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_notify_service_ReportConfig_Write(ec, args) {
  var params, service, result;

  logger.enter("RF_sol_notify_service_ReportConfig_Write", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "reportConfig");

  service = sol.create("sol.notify.ix.services.ReportConfig", params);
  result = sol.common.ix.RfUtils.stringify(service.write());

  logger.exit("RF_sol_notify_service_ReportConfig_Write", result);

  return result;
}
