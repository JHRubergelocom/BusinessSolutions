
//@include lib_Class.js

/**
 * @class sol.common.ix.RfUtils
 * @extends sol.Base
 * Helper functions to execute registered functions with JSON parameter
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 * @requires sol.common.JsonUtils
 * @requires sol.common.UserUtils
 */
sol.define("sol.common.ix.RfUtils", {

  singleton: true,

  /** @property {sol.Logger}
   * The logger for the module
   */

  initialize: function () {
    var me = this;
    me.logger = sol.create("sol.Logger", { scope: me.$className });
  },

  /**
  * Stringify the JavaScript object and handle Java objects.
  * @param {Object} obj The object to stringify.
  * @param {Object} config Configuration
  * @return {String}
  */
  stringify: function (obj, config) {
    return sol.common.JsonUtils.stringifyAll(obj || {}, config);
  },

  /**
  * Parse the given object properties and check the mandatory parameters
  * @param {de.elo.ix.client.IXServerEventsContext} ec Execution context
  * @param {String} funcName Function name.
  * @param {String} jsonStr Parameters as JSON string
  * @return {Object}
  */
  parseAndCheckParams: function (ec, funcName, jsonStr) {
    var me = this,
        paramObj, logStr, i;

    try {
      paramObj = JSON.parse(jsonStr);
    } catch (ex) {
      ec.throwException(IXExceptionC.INVALID_PARAM, "Can't parse JSON parameter string: " + jsonStr);
    }

    logStr = me.logger.format(["{0}: params={1}", funcName, jsonStr]);
    me.logger.debug(logStr);
    for (i = 3; i < arguments.length; i++) {
      if (paramObj[arguments[i]] === undefined) {
        ec.throwException(IXExceptionC.INVALID_PARAM, "<h3>Mandatory parameter is undefined: " + arguments[i] + "</h3><br>" + logStr);
      }
    }
    return paramObj;
  },

  /**
   * Check if the user has administrative rights
   * @param {de.elo.ix.client.UserInfo|String} user UserInfo, user name or ID
   * @param {Object} config Configuration
   * @param {String} config.adminTicket Ticket of the admin connection
   */
  checkMainAdminRights: function (user, config) {
    if (config && config.adminTicket) {
      if (config.adminTicket == ixConnectAdmin.loginResult.clientInfo.ticket) {
        return;
      }
    }
    if (!sol.common.UserUtils.isMainAdmin(user)) {
      throw "Access denied. User must have main administrator rights.";
    }
  }
});
