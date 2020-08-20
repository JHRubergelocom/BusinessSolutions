
/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_ExecuteAsAction', {
 *       action: "sol.unittest.datev.accounting.as.services.ExecuteLib",
 *       config: {
 *         className: "sol.datev.accounting.as.StartInvoiceWorkflow",
 *         classConfig: {},
 *         method: "run",
 *         params: []
 *       }
 *     });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 * @requires  sol.common.as.FunctionBase
 */
sol.define("sol.unittest.datev.accounting.as.services.ExecuteLib", {
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

    switch (me.className) {
      case "sol.datev.accounting.as.StartInvoiceWorkflow":
        switch (me.method) {
          case "getWorkflowName":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;  
      default:
    }        
            
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
