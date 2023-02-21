
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.visitor.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.services.LongTermBadge" });

/**
 * Checks the preconditions for long-term badge deactivation.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.05.000
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.visitor.Utils
 */
sol.define("sol.visitor.ix.services.DeactivateLongTermBadgePreconditions", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["userInfo"],

  /**
   * @cfg {de.elo.ix.client.UserInfo} userInfo (required)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    //me.config = sol.visitor.Utils.loadConfig();
  },

  process: function () {
    var me = this,
        result = { valid: false },
        longtermBadges;

    if (me.targetId) {
      longtermBadges = me.retrieveLongtermBadgeByObjId(me.targetId);
    }

    if (!longtermBadges || (longtermBadges.length <= 0)) {
      longtermBadges = me.retrieveLongtermBadgesByResponsible(me.userInfo);
    }

    result.types = (longtermBadges && (longtermBadges.length > 0)) ? longtermBadges.map(me.convertLongtermBadge) : [];
    result.valid = true;

    return result;
  },

  /**
   * @private
   * @param {String} objId
   * @return {de.elo.ix.client.Sord[]}
   */
  retrieveLongtermBadgeByObjId: function (objId) {
    var me = this,
        longtermBadges, longtermBadge;

    if (objId) {
      longtermBadge = ixConnect.ix().checkoutSord(objId, SordC.mbLean, LockC.NO);
      if (me.checkLongtermBadge(longtermBadge)) {
        longtermBadges = [longtermBadge];
      }
    }

    return longtermBadges;
  },

  /**
   * @private
   * @param {de.elo.ix.client.UserInfo} userInfo
   * @return {de.elo.ix.client.Sord[]}
   */
  retrieveLongtermBadgesByResponsible: function (userInfo) {
    var me = this,
        objKeysObj = {},
        longtermBadges;

    if (userInfo) {
      objKeysObj[sol.visitor.Utils.LONG_TERM_BADGE.FIELDS.SOL_TYPE] = sol.visitor.Utils.LONG_TERM_BADGE.SOL_TYPE;
      objKeysObj[sol.visitor.Utils.LONG_TERM_BADGE.FIELDS.STATUS] = sol.visitor.Utils.LONG_TERM_BADGE.STATUS.ACTIVE;
      objKeysObj[sol.visitor.Utils.LONG_TERM_BADGE.FIELDS.RESPONSIBLEEMPLOYEE] = userInfo.name;

      longtermBadges = sol.common.RepoUtils.findSords({
        objKeysObj: objKeysObj,
        sordZ: SordC.mbLean
      });

      if (longtermBadges && (longtermBadges.length > 0)) {
        longtermBadges = longtermBadges.filter(me.checkLongtermBadge, me);
      }
    }

    return longtermBadges;
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord} longtermBadge
   * @return {Object}
   */
  checkLongtermBadge: function (longtermBadge) {
    var isLongtermBadge, isActive, isInTimerange;

    isLongtermBadge = sol.visitor.Utils.isLongtermBadge(longtermBadge);
    isActive = sol.visitor.Utils.isLongtermBadgeActive(longtermBadge);

    if (isLongtermBadge && isActive) {
      return true;
    }

    return false;
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord} longtermBadge
   * @return {Object}
   */
  convertLongtermBadge: function (longtermBadge) {
    return (longtermBadge) ? {
      objId: longtermBadge.guid,
      name: longtermBadge.name,
      desc: ""
    } : null;
  }

});


/**
 * @member sol.visitor.ix.services.DeactivateLongTermBadgePreconditions
 * @method RF_sol_visitor_service_DeactivateLongTermBadgePreconditions
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_visitor_service_DeactivateLongTermBadgePreconditions(ec, args) {
  var params, service, result;

  logger.enter("RF_sol_visitor_service_DeactivateLongTermBadgePreconditions", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  params.userInfo = ec.user;

  service = sol.create("sol.visitor.ix.services.DeactivateLongTermBadgePreconditions", params);
  result = sol.common.ix.RfUtils.stringify(service.process());

  logger.exit("RF_sol_visitor_service_DeactivateLongTermBadgePreconditions", result);

  return result;
}
