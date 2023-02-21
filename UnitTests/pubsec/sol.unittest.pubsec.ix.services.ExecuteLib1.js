
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.pubsec.ix.services.ExecuteLib1" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_pubsec_service_ExecuteLib1', {
 *       className: 'sol.pubsec.Utils',
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
sol.define("sol.unittest.pubsec.ix.services.ExecuteLib1", {
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
      case "sol.pubsec.ix.actions.ChangeRequest":
      case "sol.pubsec.ix.actions.Close":
      case "sol.pubsec.ix.actions.CreateCirculationFolder":
      case "sol.pubsec.ix.actions.CreateFile":
      case "sol.pubsec.ix.actions.CreateMultipartDocument":
      case "sol.pubsec.ix.actions.CreateProcess":
      case "sol.pubsec.ix.actions.Delete":
      case "sol.pubsec.ix.actions.Open":
      case "sol.pubsec.ix.actions.ReclassifyFile":
      case "sol.pubsec.ix.actions.RestrictionNote":
      case "sol.pubsec.ix.actions.StartDirective":
      case "sol.pubsec.ix.actions.StartSigning":
      case "sol.pubsec.ix.dynkwl.RoutinePatterns":
      case "sol.pubsec.ix.localizedKwl.CalendarUnit":
      case "sol.pubsec.ix.functions.AddFilingplanConfiguredRights":
      case "sol.pubsec.ix.functions.CheckWfPermission":
      case "sol.pubsec.ix.functions.DeleteChildElements":
      case "sol.pubsec.ix.functions.OpenChildElements":
      case "sol.pubsec.ix.functions.RestrictionNote":
      case "sol.pubsec.ix.functions.generators.GenerateDocumentReference":
      case "sol.pubsec.ix.functions.generators.GenerateFileGroupReference":
      case "sol.pubsec.ix.functions.generators.GenerateFileReference":
      case "sol.pubsec.ix.functions.generators.GenerateProcessName":
      case "sol.pubsec.ix.functions.generators.GenerateProcessReference":
      case "sol.pubsec.ix.functions.generators.GenerateShortDescription":
      case "sol.pubsec.ix.functions.process.CopyRoutinePattern":
      case "sol.pubsec.ix.functions.routine.CheckForward":
      case "sol.pubsec.ix.functions.routine.UserNodeStart":
      case "sol.pubsec.ix.functions.signing.UpdateProcess":
      case "sol.pubsec.ix.services.CheckClosePreconditions":
      case "sol.pubsec.ix.services.CheckDeletePreconditions":
      case "sol.pubsec.ix.services.CheckDirectivePreconditions":
      case "sol.pubsec.ix.services.CheckFileCoverSheetPreconditions":
      case "sol.pubsec.ix.services.CheckFileFunctionsPreconditions":
      case "sol.pubsec.ix.services.CheckFileGroupPreconditions":
      case "sol.pubsec.ix.services.CheckLabelPreconditions":
      case "sol.pubsec.ix.services.CheckOpenPreconditions":
      case "sol.pubsec.ix.services.CheckSigningPreconditions":
      case "sol.pubsec.ix.services.ContentClosedCheck":
      case "sol.pubsec.ix.services.FilingPlanAcl":
      case "sol.pubsec.ix.services.FilingPlanAclChecks":
      case "sol.pubsec.ix.services.ForwardRoutine":
      case "sol.pubsec.ix.services.GetDirectiveTypes":
      case "sol.pubsec.ix.services.GetFileCoverSheetTypes":
      case "sol.pubsec.ix.services.GetFileTypes":
      case "sol.pubsec.ix.services.GetLabelTypes":
      case "sol.pubsec.ix.services.GetProcessTypes":
      case "sol.pubsec.ix.services.GetSigningTypes":
      case "sol.pubsec.ix.services.PrepareCreateFile":
      case "sol.pubsec.ix.services.PrepareProcess":
      case "sol.pubsec.ix.services.ReportTemplates":
      case "sol.pubsec.ix.services.Routines":
      case "sol.pubsec.ix.services.StartRoutine":
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
 * @member sol.unittest.pubsec.ix.services.ExecuteLib1
 * @method RF_sol_unittest_pubsec_service_ExecuteLib1
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_pubsec_service_ExecuteLib1(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_pubsec_service_ExecuteLib1", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.pubsec.ix.services.ExecuteLib1", params);
  result = service.process();
  logger.exit("RF_sol_unittest_pubsec_service_ExecuteLib1", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
