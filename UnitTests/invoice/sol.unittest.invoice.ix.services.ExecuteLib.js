
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.DynKwlUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.invoice.Converter.js
//@include lib_sol.invoice.ix.Invoice.js
//@include lib_sol.invoice.ix.LineApprovalMixin.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.invoice.ix.services.ExecuteLib" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_invoice_service_ExecuteLib', {
 *       className: 'sol.invoice.Utils',
 *       classConfig: {}
 *       method: 'getPathOfUsersPersonnelFile',
 *       params: [["Administrator", {}]]
 *     });
 *
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.invoice.ix.services.ExecuteLib", {
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
        cls, func, sordMap;

    switch (me.className) {
      case "sol.invoice.ix.Invoice":
        me.classConfig.sord = ixConnect.ix().checkoutSord(me.classConfig.sord, new SordZ(SordC.mbAll), LockC.NO);
        break;
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.invoice.Converter":
        switch (me.method) {
          case "currency":
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.invoice.ix.LineApprovalMixin":
        cls.logger = sol.create("sol.Logger", { scope: "sol.invoice.ix.LineApprovalMixin" });
        cls.approvalConfig = cls.loadConfig();
        sordMap = sol.create("sol.common.SordMap", { objId: me.classConfig.objId });
        cls.sordMapTable = sol.create("sol.common.MapTable", { map: sordMap, columnNames: cls.approvalConfig.sordMapTableColumnNames });
        cls.sord = ixConnect.ix().checkoutSord(me.classConfig.objId, new SordZ(SordC.mbAll), LockC.NO);
        cls.wfMap = sol.create("sol.common.WfMap", { flowId: 9999, objId: me.classConfig.objId });
        cls.wfMap.read();
        switch (me.method) {
          case "EQUALS":
          case "GT":
          case "GE":
          case "LT":
          case "LE":
          case "BETWEEN":
          case "EMPTY":
          case "NOT":
            func = cls.fct[me.method];
            break;
          case "findLineApproverNames":
          case "getApproverSet":
            return result;
          case "setLineApproved":
            me.params[0] = cls.wfMap;
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
 * @member sol.unittest.invoice.ix.services.ExecuteLib
 * @method RF_sol_unittest_invoice_service_ExecuteLib
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_invoice_service_ExecuteLib(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_invoice_service_ExecuteLib", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.invoice.ix.services.ExecuteLib", params);
  result = service.process();
  logger.exit("RF_sol_unittest_invoice_service_ExecuteLib", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
