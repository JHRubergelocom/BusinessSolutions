
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.visitor.Utils.js
//@include lib_sol.visitor.ix.VisitorUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.visitor.ix.services.ExecuteLib" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_visitor_service_ExecuteLib', {
 *       className: 'sol.visitor.Utils',
 *       classConfig: {}
 *       method: 'loadConfig',
 *       params: []
 *     });
 *
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.visitor.ix.services.ExecuteLib", {
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

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.visitor.Utils":
        switch (me.method) {
          case "isVisitor":
          case "isLongtermBadge":
          case "isLongtermBadgeActive":
          case "isLongtermBadgeInValidTimerange":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], SordC.mbAllIndex, LockC.NO);
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
 * @member sol.unittest.visitor.ix.services.ExecuteLib
 * @method RF_sol_unittest_visitor_service_ExecuteLib
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_visitor_service_ExecuteLib(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_visitor_service_ExecuteLib", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.visitor.ix.services.ExecuteLib", params);
  result = service.process();
  logger.exit("RF_sol_unittest_visitor_service_ExecuteLib", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
