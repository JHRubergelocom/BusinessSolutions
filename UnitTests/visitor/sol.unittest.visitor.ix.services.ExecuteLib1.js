
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.visitor.ix.services.ExecuteLib1" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_visitor_service_ExecuteLib1', {
 *       className: 'sol.visitor.Utils',
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
sol.define("sol.unittest.visitor.ix.services.ExecuteLib1", {
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
      case "sol.visitor.ix.actions.CancelVisitorRegistration":
      case "sol.visitor.ix.actions.CaptureVisitorPicture":
      case "sol.visitor.ix.actions.CheckInVisitor":
      case "sol.visitor.ix.actions.CheckOutVisitor":
      case "sol.visitor.ix.actions.EditVisitorRegistration":
      case "sol.visitor.ix.actions.PreRegisterGroup":
      case "sol.visitor.ix.actions.PreRegisterVisitor":
      case "sol.visitor.ix.actions.ReCheckInVisitor":
      case "sol.visitor.ix.actions.RegisterGroup":
      case "sol.visitor.ix.actions.RegisterVisitor":
      case "sol.visitor.ix.actions.RegisterVisitorBadge":
      case "sol.visitor.ix.actions.RequestSignature":
      case "sol.visitor.ix.actions.SelfCheckIn":
      case "sol.visitor.ix.actions.SelfCheckOut":
      case "sol.visitor.ix.localizedKwl.Category":
      case "sol.visitor.ix.localizedKwl.SecurityClearance":
      case "sol.visitor.ix.localizedKwl.Status":
      case "sol.visitor.ix.localizedKwl.StatusVisitorList":
      case "sol.visitor.ix.localizedKwl.TravelVehicle":
      case "sol.visitor.ix.localizedKwl.Type":
      case "sol.visitor.ix.functions.CheckoutSingleVisitor":
      case "sol.visitor.ix.functions.CreateCompanyVisitors":
      case "sol.visitor.ix.functions.CreateContact":
      case "sol.visitor.ix.functions.CreateDocumentToSign":
      case "sol.visitor.ix.functions.CreateVisitorBadge":
      case "sol.visitor.ix.functions.CreateVisitorList":
      case "sol.visitor.ix.functions.MoveVisitor":
      case "sol.visitor.ix.functions.ProcessGroupMembers":
      case "sol.visitor.ix.functions.SecurityClearanceEnabled":
      case "sol.visitor.ix.functions.SendInvitation":
      case "sol.visitor.ix.functions.SetGroupResponsible":
      case "sol.visitor.ix.functions.UpdateContactPhoto":
      case "sol.visitor.ix.functions.generators.GenerateLongTermBadgeName":
      case "sol.visitor.ix.functions.generators.GenerateLongTermBadgeReference":
      case "sol.visitor.ix.functions.generators.GenerateVisitorGroupName":
      case "sol.visitor.ix.functions.generators.GenerateVisitorGrpReference":
      case "sol.visitor.ix.functions.generators.GenerateVisitorName":
      case "sol.visitor.ix.functions.generators.GenerateVisitorReference":
      case "sol.visitor.ix.services.CancelVisitorRegistrationPrecondition":
      case "sol.visitor.ix.services.CheckVisitorBadgePreconditions":
      case "sol.visitor.ix.services.CheckVisitorPreconditions":
      case "sol.visitor.ix.services.CheckVisitorGroupPreconditions":
      case "sol.visitor.ix.services.DeactivateLongTermBadgePreconditions":
      case "sol.visitor.ix.services.GetVisitorBadgeTypes":
      case "sol.visitor.ix.services.GetVisitorTypes":
      case "sol.visitor.ix.services.GetVisitorGroupTypes":
      case "sol.visitor.ix.services.LongTermBadge.Get":
      case "sol.visitor.ix.services.LongTermBadge.GetSelectableChoices":
      case "sol.visitor.ix.services.LongTermBadge.GetStatus":
      case "sol.visitor.ix.services.LongTermBadge.GetVisitor":
      case "sol.visitor.ix.services.ParentDataCollectorGroup":
      case "sol.visitor.ix.services.ReadVisitorGroupMembers":
      case "sol.visitor.ix.services.ReadVisitorList":
      case "sol.visitor.ix.services.ReportTemplates":
      case "sol.visitor.ix.services.SelfCheckInPreparation":
      case "sol.visitor.ix.services.SelfCheckOutPreparation":
      case "sol.visitor.ix.services.Visitor.GetSelectableChoices":
      case "sol.visitor.ix.services.Visitor.GetStatus":
      case "sol.visitor.ix.services.WriteVisitorGroupMembers":
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
 * @member sol.unittest.visitor.ix.services.ExecuteLib1
 * @method RF_sol_unittest_visitor_service_ExecuteLib1
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_visitor_service_ExecuteLib1(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_visitor_service_ExecuteLib1", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.visitor.ix.services.ExecuteLib1", params);
  result = service.process();
  logger.exit("RF_sol_unittest_visitor_service_ExecuteLib1", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
