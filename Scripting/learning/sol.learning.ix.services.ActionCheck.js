
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Checks for Action Definitions
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.UserUtils
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.services.ActionCheck", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    rules: { config: "learning", prop: "entities.course.services.actioncheck", template: true },
    sord: { sordIdFromProp: "targetId" }
  },

  addsessions: function (rule) {
    var me = this;
    return !!~rule.allowed.indexOf(me.sord.objKeys.COURSE_TYPE)
      ? { valid: true }
      : { msg: rule.msg };
  },

  addparticipants: function (rule) {
    var me = this;
    return (me.sord.objKeys.SOL_TYPE === "SESSION") || !~rule.forbidden.indexOf(me.sord.objKeys.COURSE_TYPE)
      ? { valid: true }
      : { msg: rule.msg };
  },

  check: function (action) {
    var me = this;
    return me[action](me.rules[action]);
  },

  process: function () {
    var me = this;
    return me.check(me.action);
  }
});

/**
 * @member sol.learning.ix.services.ActionCheck
 * @method RF_sol_learning_service_CheckAddSessions
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_CheckAddSessions(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  rfParams.action = "addsessions";
  return JSON.stringify((sol.create("sol.learning.ix.services.ActionCheck", rfParams)).process());
}

/**
 * @member sol.learning.ix.services.ActionCheck
 * @method RF_sol_learning_service_CheckAddParticipants
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_CheckAddParticipants(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  rfParams.action = "addparticipants";
  return JSON.stringify((sol.create("sol.learning.ix.services.ActionCheck", rfParams)).process());
}