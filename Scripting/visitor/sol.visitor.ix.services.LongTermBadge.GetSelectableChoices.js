
//@include lib_Class.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.services.LongTermBadge.GetSelectableChoices" });

/**
 * Converts long term badges into selectable choices
 *
 * @eloix
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @this sol.visitor.ix.services.LongTermBadge.GetSelectableChoices
 */
sol.define("sol.visitor.ix.services.LongTermBadge.GetSelectableChoices", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfigOnProcess: ["longTermBadges"],

  utils: {
    withDefault: function (arr, objectsOrOtherwise) {
      return (arr || [])
        .map(function (obj) {
          return obj || objectsOrOtherwise;
        });
    },
    filterFalsy: function (obj) {
      return !!obj;
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

  initialize: function (params) {
    var me = this;

    me.$super("sol.common.ix.ServiceBase", "initialize", [params]);
    me.params = params;
  },

  process: function (_params) {
    var me = this,
        params;

    me.initialize;

    params = me.utils.getParams(me, _params);
    me.utils.checkRequired(me, params);

    if (sol.common.ObjectUtils.type(params.longTermBadges, 'array')) {
      return (sol.common.ObjectUtils.type(params.longTermBadges, 'array'))
        ? params.longTermBadges
          .filter(me.utils.filterFalsy)
          .map(me.longTermBadgeToSelectionChoice)
          .filter(me.utils.filterFalsy)
        : [];
    }
  },

  longTermBadgeToSelectionChoice: function (badge) {
    logger.info("map longTermBadgeToSelectionChoice", badge);
    return {
      objId: badge.id,
      name: badge.name,
      desc: badge.VISITOR_LOCATION
    };
  }
});

/**
 * @member sol.visitor.ix.services.LongTermBadge.GetSelectableChoices
 * @method RF_sol_visitor_service_LongTermBadge_GetSelectableChoices
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_FunctionName
 */
function RF_sol_visitor_service_LongTermBadge_GetSelectableChoices(ec, configAny) {
  logger.enter("RF_sol_visitor_service_LongTermBadge_GetSelectableChoices", configAny);
  var config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny),
      service,
      result;

  config.ci = ec.ci;
  config.user = ec.user;

  service = sol.create("sol.visitor.ix.services.LongTermBadge.GetSelectableChoices", config);
  result = service.process();

  logger.exit("RF_sol_visitor_service_LongTermBadge.GetSelectableChoices", result);

  return sol.common.ix.RfUtils.stringify(result);
}