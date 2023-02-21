
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

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.services.SelfCheckOutPreparation" });

/**
 * Prepares self check out
 * Checks if current user
 * - has valid long term badges
 * - is checked in
 *
 * Returns list of selectable visitor or error message (e.g. "not yet checked in")
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
sol.define("sol.visitor.ix.services.SelfCheckOutPreparation", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: [],

  requiredConfigOnProcess: ["user"],

  utils: {
    translate: function (message, clientInfo) {
      return sol.common.TranslateTerms.getTerm(clientInfo, message);
    },
    flatArray: function (acc, visitors) {
      return (acc || []).concat(visitors);
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
        checkedInLongTermBadgeVisitors,
        selectableCheckedInLongTermBadgeVisitors;

    validLongTermBadges = me.getValidLongTermBadgesOfCurrentUser();

    if (validLongTermBadges.length == 0) {
      return {
        valid: false,
        msg: me.utils.translate("sol.visitor.client.visitor.selfCheckIn.dialog.error.noSelectableLongTermBadges", me.ci)
      };
    }

    checkedInLongTermBadgeVisitors = me.getCheckedInLongTermBadgeVisitors(validLongTermBadges);

    selectableCheckedInLongTermBadgeVisitors = me.getVisitorsAsSelectableChoices(checkedInLongTermBadgeVisitors);

    return (selectableCheckedInLongTermBadgeVisitors.length == 0)
      ? {
        valid: false,
        msg: me.utils.translate("sol.visitor.client.visitor.selfCheckOut.dialog.error.noCheckedInVisitors", me.ci)
      }
      : {
        valid: true,
        types: selectableCheckedInLongTermBadgeVisitors
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

  getCheckedInLongTermBadgeVisitors: function (longTermBadges) {
    var me = this;

    if (!longTermBadges || longTermBadges.length == 0) {
      return [];
    }

    return longTermBadges
      .map(me.getLongTermBadgeVisitors.bind(me))
      .reduce(me.utils.flatArray, [])
      .filter(me.isVisitorCheckedIn.bind(me));
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

  isVisitorCheckedIn: function (visitor) {
    return sol.common.ObjectUtils.getProp(visitor, "STATUS.isCheckedIn");
  },

  getVisitorsAsSelectableChoices: function (visitors) {
    var me = this;

    if (!visitors || visitors.length == 0) {
      return [];
    }

    return me.optimizedExecute(
      {
        provider: "RF_sol_visitor_service_visitor_GetSelectableChoices",
        params: {
          visitors: visitors
        },
        optimize: "getSelectableChoices"
      })
      || [];
  }
});

/**
 * @member sol.visitor.ix.services.SelfCheckOutPreparation
 * @method RF_sol_visitor_service_SelfCheckOutPreparation
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_visitor_service_SelfCheckOutPreparation(ec, args) {
  var config,
      service,
      result;

  logger.enter("RF_sol_visitor_service_SelfCheckOutPreparation", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  config.ci = ec.ci;
  config.user = ec.user;

  service = sol.create("sol.visitor.ix.services.SelfCheckOutPreparation", config);
  result = service.process();

  logger.exit("RF_sol_visitor_service_SelfCheckOutPreparation", result);
  return sol.common.ix.RfUtils.stringify(result);
}

