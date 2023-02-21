
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

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.services.Visitor.GetStatus" });

/**
 * get Status of visitor
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
sol.define("sol.visitor.ix.services.Visitor.GetStatus", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfigOnProcess: ["visitor"],

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

  _optimize: {},

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

  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [params]);
    sol.ns("sol.visitor");
    me.params = params || {};
    me.params.config = sol.visitor.ix.VisitorUtils.loadConfig();
  },

  process: function (_params) {
    var me = this,
        params,
        status;

    params = me.utils.getParams(me, params);
    me.utils.checkRequired(me, params);

    status = me.getStatusOfVisitor(params.visitor, params);

    return status;
  },

  getStatusOfVisitor: function (visitor, params) {
    var me = this;
    return {
      isCheckedIn: me.checkIfVisitorIsCheckedIn(visitor, params)
    };
  },

  checkIfVisitorIsCheckedIn: function (visitor, params) {
    var me = this;

    return me.hasStartOrArrivalDate(visitor)
      && me.checkIfVisitorDateIsToday(visitor)
      && me.checkIfVisitorIsAlreadyCheckedOut(visitor, params);
  },

  hasStartOrArrivalDate: function (visitor) {
    var me = this;
    return !!me.getStartOrArrivalDate(visitor);
  },

  getStartOrArrivalDate: function (visitor) {
    return visitor.VISITOR_STARTDATE || visitor.VISITOR_ARRIVALDATE;
  },

  checkIfVisitorDateIsToday: function (visitor) {
    var me = this,
        visitorDate,
        visitorDateISO;

    visitorDateISO = me.getStartOrArrivalDate(visitor);
    visitorDate = sol.common.DateUtils.isoToDate(visitorDateISO);
    return me.isToday(visitorDate);
  },

  isToday: function (date) {
    var me = this;

    return sol.common.DateUtils.diff(me.getToday(), date, "d", true) == 0;
  },

  getToday: function () {
    return new Date(new Date().setHours(0, 0, 0, 0));
  },

  checkIfVisitorIsAlreadyCheckedOut: function (visitor, params) {
    var status = visitor.VISITOR_STATUS,
        notAllowedStatus = sol.common.ObjectUtils.getProp(params, "config.visitor.checkinNotAllowedStatus") || "CO";

    return status && !status.startsWith(notAllowedStatus);
  }
});

/**
 * @member sol.visitor.ix.services.Visitor.GetStatus
 * @method RF_sol_visitor_service_Visitor_GetStatus
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_FunctionName
 */
function RF_sol_visitor_service_Visitor_GetStatus(ec, configAny) {
  logger.enter("RF_sol_visitor_service_Visitor_GetStatus", configAny);
  var config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny),
      service,
      result;

  config.ci = ec.ci;
  config.user = ec.user;

  service = sol.create("sol.visitor.ix.services.Visitor.GetStatus", config);
  result = service.process();

  logger.exit("RF_sol_visitor_service_Visitor_GetStatus", result);

  return sol.common.ix.RfUtils.stringify(result);
}

