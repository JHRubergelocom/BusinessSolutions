
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.invoice.ix.services.ExecuteLib1" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_invoice_service_ExecuteLib1', {
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
sol.define("sol.unittest.invoice.ix.services.ExecuteLib1", {
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

    switch (me.className) {
      case "sol.connector_dx.ix.functions.CheckDxEnabled":
      case "sol.connector_dx.ix.services.DxImporter":
      case "sol.connector_dx.ix.normalizeGrpNumber":
      case "sol.connector_dx.ix.normalizeMapNumber":
      case "sol.connector_dx.ix.services.SetDxStatus":
      case "sol.invoice.ix.functions.ChangeUser":
      case "sol.invoice.ix.functions.CheckDxExportMode":
      case "sol.invoice.ix.functions.CreateApprovalNodes":
      case "sol.invoice.ix.functions.CreateApprovalNodes.WfNodeBuilder":
      case "sol.invoice.ix.functions.FixDelegationAssocs":
      case "sol.invoice.ix.functions.InvoiceUserStart":
      case "sol.invoice.ix.functions.MoveInvoice":
      case "sol.invoice.ix.functions.SetLineApproved":
      case "sol.invoice.ix.functions.SetNextLineApprover":
      case "sol.invoice.ix.functions.SkipFormalCheck":
        return result;
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

/**
 * @member sol.unittest.invoice.ix.services.ExecuteLib1
 * @method RF_sol_unittest_invoice_service_ExecuteLib1
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_invoice_service_ExecuteLib1(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_invoice_service_ExecuteLib1", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.invoice.ix.services.ExecuteLib1", params);
  result = service.process();
  logger.exit("RF_sol_unittest_invoice_service_ExecuteLib1", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
