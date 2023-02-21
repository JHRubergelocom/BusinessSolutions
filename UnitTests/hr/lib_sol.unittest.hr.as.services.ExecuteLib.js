
/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_ExecuteAsAction', {
 *       action: "sol.unittest.hr.as.services.ExecuteLib",
 *       config: {
 *         className: "ssol.hr.as.actions.PrepareDocument",
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
sol.define("sol.unittest.hr.as.services.ExecuteLib", {
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
        cls, func, findInfo, findByIndex, findChildren;

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.hr.as.functions.ProvidePersonnelFileAccess":
        switch (me.method) {
          case "copyTreeElements":
          case "getSearchId":
            findInfo = new FindInfo();
            findByIndex = new FindByIndex();
            findChildren = new FindChildren();
            findChildren.parentId = 1;
            findChildren.mainParent = false;
            findChildren.endLevel = 1;
            findInfo.findByIndex = findByIndex;
            findInfo.findChildren = findChildren;
            me.params[0] = findInfo;
            break;
          case "setByConfig":
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
            me.params[2] = ixConnect.ix().checkoutSord(me.params[2], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "excludeAllOptionHandler":
            return result;
          default:
        }
        break;
      case "sol.hr.as.functions.UpdatePersonnelFileWithOrgChartData":
        switch (me.method) {
          case "collectOrgChartElements":
          case "processOrgChartElement":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
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
      case "sol.hr.as.actions.CreatePDFByTemplate":
        switch (me.method) {
          case "genSordZ":
          case "getPdfGenerator":
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.hr.as.functions.ProvidePersonnelFileAccess":
        switch (me.method) {
          case "genSordZ":
          case "generateFindInfo":
          case "getSearchId":
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.hr.as.functions.UpdatePersonnelFileWithOrgChartData":
        switch (me.method) {
          case "collectOrgChartElements":
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.hr.as.PersonnelFileReminder":
        switch (me.method) {
          case "getMonitorConfig":
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
