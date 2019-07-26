
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.SolCommonTemplate" });

/**
 * Unittests of Methods in 'sol.common.Template'.
 *
 * As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_SolCommonTemplate', {
 *       source: 'Hello {{name}}.'
 *       method: 'apply',
 *       params: { name: 'Marcus'}
 *     });
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.ix.ServiceBase
 * @requires  sol.common.ix.RepoUtils
 * @requires  sol.common.ix.Template
 */
sol.define("sol.unittest.ix.services.SolCommonTemplate", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["source", "method", "params"],

  /**
   * @cfg {String} source Template source as a string | objId ELO Document with template string.
   */

  /**
   * @cfg {String} method Method name.
   */

  /**
   * @cfg {Object} params Method parameters.
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
        result, tpl;

    switch (me.method) {
      case "apply":
        tpl = sol.create("sol.common.Template", {
          source: me.source
        });
        result = tpl.apply(me.params);
        break;
      case "applySord":
        tpl = sol.create("sol.common.Template", {
          source: me.source
        });
        result = tpl.applySord(me.params);
        break;
      case "load":
        tpl = sol.create('sol.common.Template', {});
        tpl.load(me.source);
        result = tpl.apply(me.params);
        break;
      case "setSource":
        tpl = sol.create("sol.common.Template", {
          source: me.source
        });
        tpl.setSource(me.source, me.params);
        result = tpl.apply();
        break;
      case "registerCustomHelper":
        tpl = sol.create("sol.common.Template", {});
        tpl.registerCustomHelper("hello", function (config) {
          return "hello " + arguments[0];
        });
        tpl.setSource(me.source);
        result = tpl.apply(me.params);
        break;
      default:
        throw "IllegalMethodException: Method " + me.method + " not supported";
    }
    return result;
  }
});

/**
 * @member sol.unittest.ix.services.SolCommonTemplate
 * @method RF_sol_unittest_service_SolCommonTemplate
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_SolCommonTemplate(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_SolCommonTemplate", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "source", "method", "params");
  service = sol.create("sol.unittest.ix.services.SolCommonTemplate", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_SolCommonTemplate", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

