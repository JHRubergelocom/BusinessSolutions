
importPackage(Packages.java.io);
importPackage(Packages.java.util);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.common.ix.DataCollectorBase.js
//@include lib_sol.common.ix.DynAdHocFlowUtils.js
//@include lib_sol.common.ix.DynKwlDatabaseIterator.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.common.ix.DynKwlSearchIterator.js
//@include lib_sol.common.ix.DynKwlUserNameIterator.js
//@include lib_sol.common.ix.DynKwlUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.GenericDynKwl.js
//@include lib_sol.common.ix.LocalizedKwlIterator.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.ServiceRegistry.js
//@include lib_sol.common.ix.SqlConnection.js
//@include lib_sol.common.ix.SubscriptionUtils.js
//@include lib_sol.common.ix.SubscriptionUtils.js
//@include lib_sol.common_fx.ix.FxUtils.js
//@include lib_sol.common_monitoring.ix.MonitorUtils.js
//@include lib_sol.common_monitoring.ix.TimedEventUtils.js
//@include lib_sol.dev.ix.ActionUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.ExecuteLib2" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib2', {
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
sol.define("sol.unittest.ix.services.ExecuteLib2", {
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
        cls, func, serviceRegistry;

    me.classConfig.ec = me.ec;

    switch (me.className) {
      case "sol.common.ix.DynKwlBLPIterator":
        switch (me.method) {
          case "getQueryResults":
          case "open":
          case "openMap":
            return result;
          default:
        }
        break;
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.common.ix.DynKwlUtils":
        switch (me.method) {
          case "fillMap":
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "fillSord":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.common.ix.DynKwlBLPIterator":
        cls.resultSet = { results: { result: { rows: [] } } };
        cls.appToken = "HThYifwwAsdfYf400XSaiINismui3kTDOPqan8EoyfM=";
        cls.queryName = "psql.navcustomers";
        cls.queryModule = "OleDb";
        break;
      case "sol.common.ix.DynKwlFindChildrenIterator":
        switch (me.method) {
          case "filterDynamicFolderResultByName":
          case "getSearchResults":
            cls._findInfo = cls.getFindInfo([]);
            break;
          default:
        }
        break;
      case "sol.common.ix.GenericDynKwl":
        switch (me.method) {
          case "getRowData":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "CHILDREN":
          case "DB":
          case "SEARCH":
          case "BLP":
            func = cls.prepareFunctions[me.method];
            break;
          default:
        }
        break;
      case "sol.common.ix.LocalizedKwlIterator":
        cls.prepareCache();
        break;
      case "sol.common.ix.ServiceRegistry":
        switch (me.method) {
          case "get":
            serviceRegistry = cls.getServiceRegistry();
            serviceRegistry[me.params[0]] = null;
            cls.register(me.params[0], { type: "type1", name: "name1", ns: "ns1" });
            break;
          case "register":
            serviceRegistry = cls.getServiceRegistry();
            serviceRegistry[me.params[0]] = null;
            break;
          default:
        }
        break;
      case "sol.common.ix.SqlConnection":
        cls.open();
        break;
      case "sol.dev.ix.ActionUtils":
        cls.loadConfigDev();
        switch (me.method) {
          case "generateSordNameDesc":
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "importWorkflow":
          case "isJsonConfig":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "processComponent":
          case "startCreateActionWorkflow":
            return result;
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
      case "sol.dev.ix.ActionUtils":
        switch (me.method) {
          case "createWorkflowTemplate":
            ixConnect.ix().deleteWorkflowTemplate(me.params[0], 0, LockC.NO);
            break;
          case "importWorkflow":
            ixConnect.ix().deleteWorkflowTemplate(me.params[1], 0, LockC.NO);
            break;
          default:
        }
        break;
      default:
    }

    return result;
  }
});

/**
 * @member sol.unittest.ix.services.ExecuteLib2
 * @method RF_sol_unittest_service_ExecuteLib2
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_ExecuteLib2(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_ExecuteLib2", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.ix.services.ExecuteLib2", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_ExecuteLib2", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

sol.define("sol.unittest.ix.ActionBase", {
  extend: "sol.common.ix.ActionBase",

  getName: function () {
    return "ActionBase";
  },

  process: function () {
    return {};
  }

});

sol.define("sol.unittest.ix.FunctionBase", {
  extend: "sol.common.ix.FunctionBase",

  process: function () {
    return {};
  }

});

sol.define("sol.unittest.ix.ServiceBase", {
  extend: "sol.common.ix.ServiceBase",

  process: function () {
    return {};
  }

});

sol.define("sol.unittest.ix.DataCollectorBase", {
  extend: "sol.common.ix.DataCollectorBase",

  execute: function () {
    return {};
  }

});

sol.define("sol.unittest.ix.DynKwlSearchIterator", {
  extend: "sol.common.ix.DynKwlSearchIterator",

  getRowData: function (sord) {
    return [sord.name, sord.desc];
  },

  getFindInfo: function (filter) {
    return new FindInfo();
  }

});

