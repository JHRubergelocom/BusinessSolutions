
/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_ExecuteAsAction', {
 *       action: "sol.unittest.invoice.as.services.ExecuteLib",
 *       config: {
 *         className: "ssol.invoice.as.actions.PrepareDocument",
 *         classConfig: {},
 *         method: "getName",
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
sol.define("sol.unittest.invoice.as.services.ExecuteLib", {
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

    switch (me.className) {
      case "sol.invoice_datev.as.export.HtmlLog":
        switch (me.method) {
          case "saveExportLog":
            cls.HTMLSTYLES = sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES;
            me.params[1] = new java.util.Date();
            break;
          default:
        }
        break;
      case "sol.invoice_datev.as.functions.Export":
        switch (me.method) {
          case "exportInvoices":
          case "getKeyIndex":
          case "readInvoices":
          case "writeDatevExport":
            cls.invoiceDatevConfig = sol.invoice_datev.as.Utils.getConfig();
            break;
          case "writeDataSet":
            cls.invoiceDatevConfig = sol.invoice_datev.as.Utils.getConfig();
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
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

    switch (me.className) {
      case "sol.invoice_datev.as.functions.Export":
        switch (me.method) {
          case "process":
            result = String(result);
            break;
          default:
        }
        break;
      default:
    }

    return result;
  }
});
