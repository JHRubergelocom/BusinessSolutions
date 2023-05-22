
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.hr.ix.services.ExecuteLib1" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_hr_service_ExecuteLib1', {
 *       className: 'sol.hr.Utils',
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
sol.define("sol.unittest.hr.ix.services.ExecuteLib1", {
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
      case "sol.hr.ix.actions.CreateChartElement":
      case "sol.hr.ix.actions.CreateEmployeeRequest":
      case "sol.hr.ix.actions.CreateFile":
      case "sol.hr.ix.actions.InquirePersonnelFileAccess":
      case "sol.hr.ix.actions.StartOffboarding":
      case "sol.hr.ix.actions.StartOnboarding":
      case "sol.hr.ix.dynkwl.AuthorityIterator":
      case "sol.hr.ix.dynkwl.CostCenter":
      case "sol.hr.ix.dynkwl.DeputyIterator":
      case "sol.hr.ix.dynkwl.MentorIterator":
      case "sol.hr.ix.dynkwl.OrganizationalStructuresIterator":
      case "sol.hr.ix.dynkwl.PersonnelFileIterator":
      case "sol.hr.ix.dynkwl.SuperiorIterator":
      case "sol.hr.ix.dynkwl.SuperiorNewIterator":
      case "sol.hr.ix.dynkwl.Tenant":
      case "sol.hr.ix.dynkwl.generators.ChartElementShortDesc":
      case "sol.hr.ix.dynkwl.generators.FileShortDesc":
      case "sol.hr.ix.dynkwl.generators.PersonnelNo":
      case "sol.hr.ix.localizedKwl.CalendarUnit":
      case "sol.hr.ix.localizedKwl.CivilStatus":
      case "sol.hr.ix.localizedKwl.Country":
      case "sol.hr.ix.localizedKwl.Currency":
      case "sol.hr.ix.localizedKwl.EmergencyContactType":
      case "sol.hr.ix.localizedKwl.FamilyMemberType":
      case "sol.hr.ix.localizedKwl.FirstLanguage":
      case "sol.hr.ix.localizedKwl.Gender":
      case "sol.hr.ix.localizedKwl.PersonnelStatus":
      case "sol.hr.ix.localizedKwl.ReligiousDenomination":
      case "sol.hr.ix.localizedKwl.SecurityClassification":
      case "sol.hr.ix.localizedKwl.TerminationPoint":
      case "sol.hr.ix.localizedKwl.WorkscheduleRegulation":
      case "sol.hr.ix.functions.ChangeSuperiorFile":
      case "sol.hr.ix.functions.CreatePersonnelFileHeadless":
      case "sol.hr.ix.functions.DeletePhoto":
      case "sol.hr.ix.functions.DoubleCheck":
      case "sol.hr.ix.functions.FeedCommentPersonnelFile":
      case "sol.hr.ix.functions.FillSordByApi":
      case "sol.hr.ix.functions.GetRenderedTemplate":
      case "sol.hr.ix.functions.MapToMap":
      case "sol.hr.ix.functions.ParamServiceFunctionPipe":
      case "sol.hr.ix.functions.UpdatePersonnelFileMetadata":
      case "sol.hr.ix.functions.UpdateReferences":
      case "sol.hr.ix.functions.generators.GenerateChartElementShortDesc":
      case "sol.hr.ix.functions.generators.GenerateFileShortDesc":
      case "sol.hr.ix.functions.generators.GeneratePersonnelNo":
      case "sol.hr.ix.services.GetChartElementTypes":
      case "sol.hr.ix.services.GetChartRootTypes":
      case "sol.hr.ix.services.GetConvertedMetadata":
      case "sol.hr.ix.services.GetEligiblePersonnelFiles":
      case "sol.hr.ix.services.GetEmployeeBadgeTypes":
      case "sol.hr.ix.services.GetFileProviderParams":
      case "sol.hr.ix.services.GetGenericSearchFolderContent":
      case "sol.hr.ix.services.GetOffboardingTypes":
      case "sol.hr.ix.services.GetOnboardingConclusionParams":
      case "sol.hr.ix.services.GetOnboardingTypes":
      case "sol.hr.ix.services.GetPersonnelFileTypes":
      case "sol.hr.ix.services.GetRequestConclusionParams":
      case "sol.hr.ix.services.GetRequestTypes":
      case "sol.hr.ix.services.GetUsersPersonnelFile":
      case "sol.hr.ix.services.OrganizationChart":
        return result;
      default:
    }

    me.classConfig.ec = me.ec;
    me.classConfig.ci = me.ec.ci;

    switch (me.className) {
      case "sol.hr.ix.actions.CreateChartElement":
      case "sol.hr.ix.actions.CreateEmployeeRequest":
      case "sol.hr.ix.actions.CreateFile":
      case "sol.hr.ix.actions.InquirePersonnelFileAccess":
      case "sol.hr.ix.actions.StartOffboarding":
      case "sol.hr.ix.actions.StartOnboarding":
      case "sol.hr.ix.dynkwl.PersonnelFileIterator":
        return result;
      case "sol.hr.ix.functions.MapToMap":
        switch (me.method) {
          case "mergeTable":
            me.params[1] = sol.create("sol.common.SordMap", { objId: me.classConfig.objId });
            me.params[1].read();
            break;
          default:
        }
        break;
      case "sol.hr.ix.services.OrganizationChart":
        switch (me.method) {
          case "getNodeInfo":
            me.params[0] = ixConnect.ix().checkoutSord(me.classConfig.objId, SordC.mbAllIndex, LockC.NO);
            break;
          default:
        }
        break;
      default:
    }
    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.hr.ix.functions.generators.GenerateChartElementShortDesc":
      case "sol.hr.ix.functions.generators.GenerateFileShortDesc":
      case "sol.hr.ix.functions.generators.GeneratePersonnelNo":
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
 * @member sol.unittest.hr.ix.services.ExecuteLib1
 * @method RF_sol_unittest_hr_service_ExecuteLib1
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_hr_service_ExecuteLib1(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_hr_service_ExecuteLib1", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.hr.ix.services.ExecuteLib1", params);
  result = service.process();
  logger.exit("RF_sol_unittest_hr_service_ExecuteLib1", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
