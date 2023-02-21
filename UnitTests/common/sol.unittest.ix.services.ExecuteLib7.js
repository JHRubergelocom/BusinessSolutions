
importPackage(Packages.java.io);
importPackage(Packages.java.util);
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.org.apache.commons.io);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.ExecuteLib7" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib7', {
 *       className: 'sol.unittest.ix.ActionBase',
 *       classConfig: {}
 *       method: 'getName',
 *       params: []
 *     });
 *
 * *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.ix.services.ExecuteLib7", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["className", "classConfig", "method", "params"],

  /**
   * @cfg {String} className Class name.
   */

  /**
   * @cfg {Object} classConfig configuration for class initialization.
   */

  /**
   * @cfg {String} method Method name.
   */

  /**
   * @cfg {Object[]} params Method parameters array.
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
        result = {},
        cls, func;

    switch (me.className) {
      case "sol.common.ix.actions.Standard":
      case "sol.common.ix.dynkwl.UserNames":
      case "sol.common_monitoring.ix.dynkwl.ConfigKwl":
      case "sol.dev.ix.actions.CreatePackage":
      case "sol.dev.ix.actions.Deploy":
      case "sol.dev.ix.dynkwl.FindUnitTestIterator":
      case "sol.dev.launchpad.actions.Test":
      case "sol.dev_internal.ix.actions.ActionTest":
      case "sol.dev.ix.localizedKwl.Countries":
        return result;
      default:
    }

    me.classConfig.ec = me.ec;

    cls = sol.create(me.className, me.classConfig);

    switch (me.className) {
      case "sol.dev.ix.actions.CreatePackage":
        switch (me.method) {
          case "initialize":
            return result;
          default:
        }
        break;
      default:
    }

    func = cls[me.method];

    switch (me.className) {
      case "sol.common_monitoring.ix.dynkwl.ConfigKwl":
        switch (me.method) {
          case "STARTS_WITH":
          case "ENDS_WITH":
          case "CONTAINS":
          case "default":
            func = cls.compare(me.method);
            break;
          default:
        }
        break;
      default:
    }

    if (sol.common.ObjectUtils.isFunction(func)) {
      result = func.apply(cls, me.params);
    } else {
      throw "IllegalMethodException: Method '" + me.method + "' not supported in Class '" + me.className + "'";
    }

    return result;
  }
});

/**
 * @member sol.unittest.ix.services.ExecuteLib7
 * @method RF_sol_unittest_service_ExecuteLib7
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_ExecuteLib7(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_ExecuteLib7", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.ix.services.ExecuteLib7", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_ExecuteLib7", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
