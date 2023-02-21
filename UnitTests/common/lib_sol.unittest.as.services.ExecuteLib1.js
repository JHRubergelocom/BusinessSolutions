
/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_ExecuteAsAction', {
 *       action: "sol.unittest.as.services.ExecuteLib1",
 *       config: {
 *         className: "sol.common_document.as.functions.ReadExcelTable",
 *         classConfig: { objId: 4713 },
 *         method: "initialize",
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
var logger = sol.create("sol.Logger", { scope: "sol.unittest.as.services.ExecuteLib1" });

sol.define("sol.unittest.as.services.ExecuteLib1", {
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
      case "sol.common_monitoring.as.Monitor":
        me.classConfig.collector = sol.create("sol.common_monitoring.as.collectors.NextRunCollector", {});
        me.classConfig.analyzer = sol.create("sol.common_monitoring.as.analyzers.RetentionAnalyzer", { retention: { value: 2, unit: "M" }, action: { type: "WORKFLOW", templateId: "UnittestStandardWF", user: "Administrator" } });
        me.classConfig.executor = sol.create("sol.common_monitoring.as.executors.SimpleExecutor", { user: "Administrator" });
        break;
      case "sol.common_monitoring.as.MonitorTimedEvent":
        switch (me.method) {
          case "filterEmptyAtributes":
          case "getSource":
          case "getTemplateSord":
            return result;
          default:
        }
        break;  
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.common_monitoring.as.analyzers.RetentionAnalyzer":
        switch (me.method) {
          case "analyze":
          case "retrieveChangedDate":
          case "retrieveOldestChildrenChangedDate":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "calculateNextCheck":
          case "isObsolete":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            me.params[1] = sol.common.DateUtils.isoToDate(me.params[1]);
            break;
          default:
        }
        break;
      case "sol.common_monitoring.as.analyzers.RuleAnalyzer":
        switch (me.method) {
          case "analyze":
          case "analyzeRule":
          case "checkExecution":
          case "shiftIso":
          case "updateExecution":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.common_monitoring.as.analyzers.ValueAnalyzer":
        switch (me.method) {
          case "analyze":
          case "checkReferenceValues":
          case "exists":
          case "getValue":
          case "isEmpty":
          case "notEmpty":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.common_monitoring.as.collectors.ChildrenCollector":
        switch (me.method) {
          case "deleteReference":
          case "postProcess":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.common_monitoring.as.collectors.NextRunCollector":
        switch (me.method) {
          case "postProcess":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "findInfo":
            me.params[0] = { logger: logger };
            func = cls.utils.log.findInfo;
            break;
          default:
        }
        break;
      case "sol.common_monitoring.as.Monitor":
        switch (me.method) {
          case "checkInterface":
            me.params[0] = cls.collector;
            me.params[1] = "collector";
            me.params[2] = ["hasMoreResults", "getResults", "postProcess"];
            break;
          case "disposeComponent":
            me.params[0] = cls.collector;
            break;
          default:
        }
        break;
      case "sol.common_monitoring.as.MonitorUtils":
        switch (me.method) {
          case "evalDateUnitConfig":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.common_sig.as.functions.CreateDocumentToSign":
        switch (me.method) {
          case "convertToPdf":
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
      case "sol.common_document.as.actions.PrepareBatchImport":
        switch (me.method) {
          case "prepareContent":
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.common_document.as.actions.RuleAnalyzer":
        switch (me.method) {
          case "checkExecution":
            result = "";
            break;
          case "updateExecution":
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.common_monitoring.as.collectors.NextRunCollector":
        switch (me.method) {
          case "createFindInfo":
          case "getResults":
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

sol.define("sol.unittest.as.executors.SimpleExecutor", {
  process: function () {
    return {};
  }
});


