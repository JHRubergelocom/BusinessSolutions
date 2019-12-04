
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
 * @eloas
 * @requires  sol.common.as.FunctionBase
 */
sol.define("sol.unittest.as.services.ExecuteLib", {
  extend: "sol.common.as.FunctionBase",

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
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
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

    if (sol.common.ObjectUtils.isFunction(func)) {
      result = func.apply(cls, me.params);
    } else {
      throw "IllegalMethodException: Method '" + me.method + "' not supported in Class '" + me.className + "'";
    }

    return result;
  }
});

