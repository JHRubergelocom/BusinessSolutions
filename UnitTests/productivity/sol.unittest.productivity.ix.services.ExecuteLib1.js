
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.productivity.ix.services.ExecuteLib1" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_productivity_service_ExecuteLib1', {
 *       className: 'sol.productivity.Utils',
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
sol.define("sol.unittest.productivity.ix.services.ExecuteLib1", {
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
      case "sol.productivity.ix.dynkwl.generators.PostReference":
      case "sol.checklist.ix.actions.CreateChecklist":
      case "sol.contact.ix.actions.CreateCompany":
      case "sol.contact.ix.actions.CreateContact":
      case "sol.contact.ix.actions.CreateContactList":
      case "sol.notify.ix.actions.ConfigureNotifications":
      case "sol.contact.ix.dynkwl.FindCompanyIterator":
      case "sol.contact.ix.dynkwl.FindContactIterator":
      case "sol.contact.ix.dynkwl.FindContactlistIterator":
      case "sol.contact.ix.dynkwl.FormOfAddressTemplate":
      case "sol.contact.ix.dynkwl.generators.FilingStructCompanyContact":
      case "sol.contact.ix.dynkwl.generators.FilingStructContactListCompany":
      case "sol.contact.ix.dynkwl.generators.FilingStructContactListContact":
      case "sol.contact.ix.dynkwl.generators.NameCompany":
      case "sol.contact.ix.dynkwl.generators.NameContact":
      case "sol.contact.ix.dynkwl.generators.NameContactList":
      case "sol.contact.ix.dynkwl.generators.ReferenceCompany":
      case "sol.contact.ix.dynkwl.generators.ReferenceContact":
      case "sol.contact.ix.dynkwl.generators.ReferenceContactList":
      case "sol.contact.ix.localizedKwl.Countries":
      case "sol.accounts.ix.functions.CreateUser":
      case "sol.contact.ix.functions.GenerateFilingStruct":
      case "sol.contact.ix.functions.MoveContact":
      case "sol.contact.ix.functions.generators.GenerateCompanyFilingStruct":
      case "sol.contact.ix.functions.generators.GenerateCompanyName":
      case "sol.contact.ix.functions.generators.GenerateCompanyReference":
      case "sol.contact.ix.functions.generators.GenerateContactFilingStruct":
      case "sol.contact.ix.functions.generators.GenerateContactListName":
      case "sol.contact.ix.functions.generators.GenerateContactListReference":
      case "sol.contact.ix.functions.generators.GenerateContactName":
      case "sol.contact.ix.functions.generators.GenerateContactReference":
      case "sol.privacy.ix.functions.FilterApprovalUsers":
      case "sol.privacy.ix.functions.SetApprovalData":
      case "sol.checklist.ix.services.Checklist":
      case "sol.checklist.ix.services.GetChecklistTypes":
      case "sol.contact.ix.services.CheckContactListPreconditions":
      case "sol.contact.ix.services.CheckLabelPreconditions":
      case "sol.contact.ix.services.CreateCompany":
      case "sol.contact.ix.services.CreateContact":
      case "sol.contact.ix.services.GetCompanyTypes":
      case "sol.contact.ix.services.GetContactListTypes":
      case "sol.contact.ix.services.GetContactTypes":
      case "sol.contact.ix.services.GetLabelTypes":
      case "sol.contact.ix.services.ReportTemplates":
      case "sol.notify.ix.services.ReportConfig":
      case "sol.notify.ix.services.User":
      case "sol.privacy.ix.services.ExtendedParentDataCollector":
      case "sol.privacy.ix.services.ProcessingActivityPreconditions":
      case "sol.privacy.ix.services.Roles":
        return result;
      default:
    }

    me.classConfig.ec = me.ec;

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
 * @member sol.unittest.productivity.ix.services.ExecuteLib1
 * @method RF_sol_unittest_productivity_service_ExecuteLib1
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_productivity_service_ExecuteLib1(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_productivity_service_ExecuteLib1", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.productivity.ix.services.ExecuteLib1", params);
  result = service.process();
  logger.exit("RF_sol_unittest_productivity_service_ExecuteLib1", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
