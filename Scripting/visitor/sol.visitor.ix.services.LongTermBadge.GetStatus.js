
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.visitor.Utils.js
//@include lib_sol.visitor.ix.VisitorUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.services.LongTermBadge.GetStatu" });

/**
 * Get Status of provided long term badge
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
sol.define("sol.visitor.ix.services.LongTermBadge.GetStatus", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfigOnProcess: ["longTermBadge"],

  _optimize: {},

  utils: {
    withDefault: function (arr, objectsOrOtherwise) {
      return (arr || [])
        .map(function (obj) {
          return obj || objectsOrOtherwise;
        });
    },
    getParams: function (self, _params) {
      return sol.common.ObjectUtils.mergeObjects({}, self.utils.withDefault([self.params, _params], {})) || {};
    },
    checkRequired: function (self, params) {
      (self.requiredConfigOnProcess || []).forEach(function (requiredProperty) {
        if (params[requiredProperty] === null || params[requiredProperty] === undefined) {
          throw "[" + self.$className + "] Could not create object. Missing config property: " + requiredProperty + ". Please ensure all required properties are set: " + JSON.stringify(self.requiredConfigOnProcess);
        }
      });
    }
  },

  optimizedExecute: function (requestParameters) {
    var me = this;
    try {
      return sol.common.IxUtils.optimizedExecute(
        requestParameters.provider,
        requestParameters.params,
        (me._optimize = me._optimize || {}),
        requestParameters.optimize,
        requestParameters.output
      );
    } catch (error) {
      return null;
    }
  },

  initialize: function (config) {
    var me = this;

    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.params = config;
  },

  process: function (_params) {
    var me = this,
        params,
        longTermBadge,
        status;

    params = me.utils.getParams(me, _params);
    me.utils.checkRequired(me, params);

    longTermBadge = me.getSord(params.longTermBadge);

    status = {};
    status.isActive = sol.visitor.Utils.isLongtermBadgeActive(longTermBadge);
    status.isValid = status.isActive && sol.visitor.Utils.isLongtermBadgeInValidTimerange(longTermBadge);

    status.LONGTERM_BADGE_STATUS = sol.common.SordUtils.getObjKeyValue(longTermBadge, sol.visitor.Utils.LONG_TERM_BADGE.FIELDS.STATUS);
    status.LONGTERM_BADGE_VALID_FROM = sol.common.SordUtils.getObjKeyValue(longTermBadge, sol.visitor.Utils.LONG_TERM_BADGE.FIELDS.LONGTERM_BADGE_VALID_FROM);
    status.LONGTERM_BADGE_VALID_TO = sol.common.SordUtils.getObjKeyValue(longTermBadge, sol.visitor.Utils.LONG_TERM_BADGE.FIELDS.LONGTERM_BADGE_VALID_UNTIL);

    return status;
  },

  getSord: function (longTermBadge) {
    return sol.common.RepoUtils.getSord(longTermBadge.id);
  }
});

/**
 * @member sol.visitor.ix.services.LongTermBadge.GetStatus
 * @method RF_sol_visitor_service_LongTermBadge_GetStatus
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_FunctionName
 */
function RF_sol_visitor_service_LongTermBadge_GetStatus(ec, configAny) {
  logger.enter("Enter RF_sol_visitor_service_LongTermBadge_GetStatus", configAny);
  var config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny),
      service,
      result;

  config.ci = ec.ci;
  config.user = ec.user;

  service = sol.create("sol.visitor.ix.services.LongTermBadge.GetStatus", config);
  result = service.process();

  logger.exit("Exit RF_sol_visitor_service_LongTermBadge_GetStatus", result);

  return sol.common.ix.RfUtils.stringify(result);
}

