
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.visitor.Utils.js
//@include lib_sol.visitor.ix.VisitorUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.services.SelfCheckInPreparation" });

/**
 * Prepares self check in
 * Checks if current user
 * - has valid long term badges
 * - is not already checked in
 *
 * Returns list of selectable long term badges or error message (e.g. "already checked in")
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.visitor.Utils
 * @requires sol.visitor.ix.VisitorUtils
 */
sol.define("sol.visitor.ix.services.SelfCheckInPreparation", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: [],

  requiredConfigOnProcess: ["user"],

  utils: {
    translate: function (message, clientInfo) {
      return sol.common.TranslateTerms.getTerm(clientInfo, message);
    }
  },

  _optimize: {},

  optimizedExecute: function (requestParameters) {
    var me = this;
    try {
      return sol.common.IxUtils.optimizedExecute(
        requestParameters.provider,
        requestParameters.params,
        (me._optimize = me._optimize || {}),
        requestParameters.optimize,
        requestParameters.output || ["output"]
      );
    } catch (error) {
      return null;
    }
  },

  process: function () {
    var me = this,
        validLongTermBadges,
        longTermBadgesWithVisitors,
        isOneLongTermBadgeCheckedIn,
        selectableLongTermBadges;

    validLongTermBadges = me.getValidLongTermBadgesOfCurrentUser();

    if (validLongTermBadges.length == 0) {
      return { valid: false, msg: me.utils.translate("sol.visitor.client.visitor.selfCheckOut.dialog.error.noSelectableLongTermBadges", me.ci) };
    }

    longTermBadgesWithVisitors = me.getLongTermBadgesWithVisitors(validLongTermBadges);
    isOneLongTermBadgeCheckedIn = me.checkIfOneLongTermBadgeIsCheckedIn(longTermBadgesWithVisitors);

    if (isOneLongTermBadgeCheckedIn) {
      return { valid: false, msg: me.utils.translate("sol.visitor.client.visitor.selfCheckIn.dialog.error.alreadyCheckedIn", me.ci) };
    }

    selectableLongTermBadges = me.getSelectableChoices(longTermBadgesWithVisitors);

    return {
      valid: true,
      types: selectableLongTermBadges
    };
  },

  getValidLongTermBadgesOfCurrentUser: function () {
    var me = this;

    return me.getLongTermBadgesOfCurrentUser()
      .map(me.setStatusOfLongTermBadge.bind(me))
      .filter(me.isLongTermBadgeValid.bind(me));
  },

  getLongTermBadgesOfCurrentUser: function () {
    var me = this;

    return me.optimizedExecute(
      {
        provider: "RF_sol_visitor_service_LongTermBadge_Get",
        params: {
          searchTemplate: "templates.currentuser"
        },
        optimize: "currentUsersLongTermBadges"
      })
      || [];
  },

  setStatusOfLongTermBadge: function (longTermBadge) {
    var me = this;

    longTermBadge.STATUS = me.getStatusOfLongTermBadge(longTermBadge);
    return longTermBadge;
  },

  getStatusOfLongTermBadge: function (longTermBadge) {
    var me = this;

    return me.optimizedExecute({
      provider: "RF_sol_visitor_service_LongTermBadge_GetStatus",
      params: {
        longTermBadge: longTermBadge
      },
      optimize: "longTermBadgeStatus"
    }) || {};
  },

  isLongTermBadgeValid: function (longTermBadge) {
    return longTermBadge.STATUS && longTermBadge.STATUS.isValid;
  },

  getLongTermBadgesWithVisitors: function (longTermBadges) {
    var me = this;

    return longTermBadges
      .map(me.setLongTermBadgeVisitors.bind(me));
  },

  setLongTermBadgeVisitors: function (longTermBadge) {
    var me = this;
    longTermBadge.VISITORS = me.getLongTermBadgeVisitors(longTermBadge);
    logger.info("longTermBadge.VISITORS", longTermBadge.VISITORS);
    return longTermBadge;
  },

  getLongTermBadgeVisitors: function (longTermBadge) {
    var me = this;

    if (!longTermBadge) {
      return [];
    }

    return me.optimizedExecute({
      provider: "RF_sol_visitor_service_LongTermBadge_GetVisitor",
      params: {
        searchTemplate: "templates.visitorfromlongtermbadge",
        longTermBadge: longTermBadge,
        setStatus: true
      },
      optimize: "longTermBadgeVisitors"
    }) || [];
  },

  checkIfOneLongTermBadgeIsCheckedIn: function (longTermBadges) {
    var me = this;

    return longTermBadges
      .map(me.checkAndSetIfAnyVisitorIsCheckedIn.bind(me))
      .reduce(function (isCheckedIn, longTermBadge) {
        return isCheckedIn || longTermBadge.isOneVisitorCheckedIn;
      }, false);
  },

  checkAndSetIfAnyVisitorIsCheckedIn: function (longTermBadge) {
    var me = this;

    longTermBadge.isOneVisitorCheckedIn = me.isAnyVisitorCheckedIn(longTermBadge.VISITORS);

    return longTermBadge;
  },

  isAnyVisitorCheckedIn: function (visitors) {
    var me = this;
    return (visitors || [])
      .reduce(me.isOneVisitorCheckedIn, false);
  },

  isOneVisitorCheckedIn: function (isCheckedIn, visitor) {
    return isCheckedIn || sol.common.ObjectUtils.getProp(visitor, "STATUS.isCheckedIn");
  },

  getSelectableChoices: function (longTermBadges) {
    var me = this;

    if (!longTermBadges || longTermBadges.length == 0) {
      return [];
    }

    return me.optimizedExecute(
      {
        provider: "RF_sol_visitor_service_LongTermBadge_GetSelectableChoices",
        params: {
          longTermBadges: longTermBadges
        },
        optimize: "getSelectableChoices"
      })
      || [];
  }
});

/**
 * @member sol.visitor.ix.services.SelfCheckInPreparation
 * @method RF_sol_visitor_service_SelfCheckInPreparation
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_visitor_service_SelfCheckInPreparation(ec, args) {
  var config,
      service,
      result;

  logger.enter("RF_sol_visitor_service_SelfCheckInPreparation", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  config.ci = ec.ci;
  config.user = ec.user;

  service = sol.create("sol.visitor.ix.services.SelfCheckInPreparation", config);
  result = service.process();

  logger.exit("RF_sol_visitor_service_SelfCheckInPreparation", result);
  return sol.common.ix.RfUtils.stringify(result);
}

