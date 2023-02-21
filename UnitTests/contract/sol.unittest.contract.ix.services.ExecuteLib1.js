
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.contract.ix.services.ExecuteLib1" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_contract_service_ExecuteLib1', {
 *       className: 'sol.contract.DurationUtils',
 *       classConfig: {}
 *       method: 'getSmallestUnitString',
 *       params: [["unit1", "unit2"]]
 *     });
 *
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.contract.ix.services.ExecuteLib1", {
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
      case "sol.contract.ix.actions.ApproveContract":
      case "sol.contract.ix.actions.CancelNegotiation":
      case "sol.contract.ix.actions.ConcludeContract":
      case "sol.contract.ix.actions.CreateContract":
      case "sol.contract.ix.actions.NegotiateContract":
      case "sol.contract.ix.actions.TerminateContract":
      case "sol.contract.ix.dynkwl.Clauses":
      case "sol.contract.ix.dynkwl.ContractCategories":
      case "sol.contract.ix.dynkwl.ContractTypes":
      case "sol.contract.ix.dynkwl.generators.ClauseId":
      case "sol.contract.ix.localizedKwl.CalendarUnit":
      case "sol.contract.ix.localizedKwl.CashflowRecurring":
      case "sol.contract.ix.localizedKwl.Relation":
      case "sol.contract.ix.localizedKwl.RiskClassification":
      case "sol.contract.ix.localizedKwl.Status":
      case "sol.contract.ix.localizedKwl.TerminationPoint":
      case "sol.contract.ix.functions.CreateContractHeadless":
      case "sol.contract.ix.functions.CreatePartner":
      case "sol.contract.ix.functions.ExtendDuration":
      case "sol.contract.ix.functions.generators.GenerateClauseId":
      case "sol.contract.ix.functions.generators.GenerateContractNo":
      case "sol.contract.ix.functions.generators.GenerateContractShortDesc":
      case "sol.contract.ix.services.GetContractTypes":
      case "sol.contract.ix.services.GetDocumentUpdateTypes":
      case "sol.contract.ix.localizedKwl.PaymentDirection":
      case "sol.contract.ix.services.PaymentPlanCollector":
      case "sol.contract.ix.localizedKwl.PaymentType":
      case "sol.contract.ix.services.PrepareContractCoverSheet":
      case "sol.contract.ix.services.PrepareContractLabel":
      case "sol.contract.ix.services.ReportTemplates":
        return result;
      default:
    }

    me.classConfig.ec = me.ec;
    me.classConfig.ci = me.ec.ci;    
    me.classConfig.user = me.ec.user; 
    
    switch (me.className) {
      case "sol.contract.ix.functions.CreatePartner":
        switch (me.method) {
          case "buildData":
          case "checkCreateCompany":
          case "checkCreateContact":
          case "isEmpty":
          case "updateContactRef":
          case "updatePartnerNo":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.contract.ix.services.PaymentPlanCollector":
        switch (me.method) {
          case "createLineTemplateSord":
          case "processContract":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.contract.ix.services.PrepareContractCoverSheet":
        switch (me.method) {
          case "isValidDocument":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.contract.ix.services.PrepareContractLabel":
        switch (me.method) {
          case "isValidTarget":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.contract.ix.functions.ExtendDuration":
        cls.sord = ixConnect.ix().checkoutSord(me.classConfig.objId, SordC.mbAllIndex, LockC.NO);
        cls.sordMap = sol.create("sol.common.SordMap", { objId: cls.sord.id });
        cls.sordMap.read();
        break;
      case "sol.contract.ix.functions.generators.GenerateContractNo":
      case "sol.contract.ix.functions.generators.GenerateContractShortDesc":
        cls.sord = ixConnect.ix().checkoutSord(me.classConfig.objId, SordC.mbAllIndex, LockC.NO);
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
 * @member sol.unittest.contract.ix.services.ExecuteLib1
 * @method RF_sol_unittest_contract_service_ExecuteLib1
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_contract_service_ExecuteLib1(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_contract_service_ExecuteLib1", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.contract.ix.services.ExecuteLib1", params);
  result = service.process();
  logger.exit("RF_sol_unittest_contract_service_ExecuteLib1", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
