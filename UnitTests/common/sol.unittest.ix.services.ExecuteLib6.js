
importPackage(Packages.java.io);
importPackage(Packages.java.util);
importPackage(Packages.javax.mail);
importPackage(Packages.javax.mail.internet);
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.org.apache.commons.io);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Mail.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.ExecUtils.js
//@include lib_sol.common.ElementService.js
//@include lib_sol.common.ObjectSortUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.WfUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.ExecuteLib6" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib6', {
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
sol.define("sol.unittest.ix.services.ExecuteLib6", {
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

    me.classConfig.ec = me.ec;

    cls = sol.create(me.className, me.classConfig);

    switch (me.className) {
      case "sol.common.mixins.ElementService":
        cls.logger = logger;
        switch (me.method) {
          case "executeElementService":
            return result;
          default:
        }
        break;
      case "sol.common.mixins.ObjectSort":
        cls.logger = logger;
        break;
      case "sol.common.Mail":
        switch (me.method) {
          case "getPasswordAuthentication":
            return;
          default:
        }
        break;
      default:
    }

    func = cls[me.method];

    switch (me.className) {
      case "sol.common.Mail":
        switch (me.method) {
          case "addBody":
            me.params[0] = new MimeMultipart();
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
 * @member sol.unittest.ix.services.ExecuteLib6
 * @method RF_sol_unittest_service_ExecuteLib6
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_ExecuteLib6(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_ExecuteLib6", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.ix.services.ExecuteLib6", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_ExecuteLib6", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
