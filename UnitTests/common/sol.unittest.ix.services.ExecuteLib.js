
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ActionBase.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.Template.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.ExecuteLib" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib', {
 *       className: 'sol.common.AclUtils',
 *       classConfig: {}
 *       method: 'retrieveElements',
 *       params: ["4027", true, true]
 *     });
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib', {
 *       className: 'sol.common.Template',
 *       classConfig: {source: "{{padLeft 1234 '0000000000'}}"}
 *       method: 'apply',
 *       params: []
 *     });
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib', {
 *       className: 'sol.common.TemplateUtils',
 *       classConfig: {}
 *       method: 'render',
 *       params: ["{{formatDate 'DD.MM.YYYY HH:mm:ss' 20001015120030}}", {" name": "Hans" }, { "emptyNonRendered": true, "stringifyResults": true }]
 *     });
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.ActionBase
 * @requires  sol.common.UserProfile
 * @requires  sol.common.ix.ServiceBase
 * @requires  sol.common.ix.ObjectUtils
 * @requires  sol.common.ix.SordUtils
 * @requires  sol.common.ix.RepoUtils
 * @requires  sol.common.ix.AclUtils
 * @requires  sol.common.ix.Template
 */
sol.define("sol.unittest.ix.services.ExecuteLib", {
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
        cls = sol.create(me.className, me.classConfig),
        func = cls[me.method];

    if ((me.method == "registerCustomHelper") && (me.className == "sol.common.Template")) {
      cls = sol.create("sol.common.Template", {});
      cls.registerCustomHelper("hello", function (config) {
        return "hello " + arguments[0];
      });
      return result;
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
 * @member sol.unittest.ix.services.ExecuteLib
 * @method RF_sol_unittest_service_ExecuteLib
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_ExecuteLib(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_ExecuteLib", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  service = sol.create("sol.unittest.ix.services.ExecuteLib", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_ExecuteLib", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

sol.define("sol.unittest.ActionBase", {
  extend: "sol.common.ActionBase",

  addActionEvent: function () {
  },

  createEvent: function () {
  },

  getName: function () {
  },

  process: function () {
  }

});

