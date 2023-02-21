
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.recruiting.ix.services.ExecuteLib1" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_recruiting_service_ExecuteLib1', {
 *       className: 'sol.recruiting.Utils',
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
sol.define("sol.unittest.recruiting.ix.services.ExecuteLib1", {
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
      case "sol.recruiting.ix.dynkwl.OrganizationalStructuresIterator":
      case "sol.recruiting.ix.dynkwl.PoolIterator":
      case "sol.recruiting.ix.dynkwl.PostingIterator":
      case "sol.recruiting.ix.dynkwl.RequisitionIterator":
      case "sol.recruiting.ix.dynkwl.generators.CandidateNo":
      case "sol.recruiting.ix.dynkwl.generators.CandidateShortDescGen":
      case "sol.recruiting.ix.dynkwl.generators.CommShortDesc":
      case "sol.recruiting.ix.dynkwl.generators.JobPortalUserShortDesc":
      case "sol.recruiting.ix.dynkwl.generators.PostingNo":
      case "sol.recruiting.ix.dynkwl.generators.PostingShortDesc":
      case "sol.recruiting.ix.dynkwl.generators.RequisitionNo":
      case "sol.recruiting.ix.dynkwl.generators.RequisitionShortDesc":
      case "sol.recruiting.ix.localizedKwl.CandidatePhase":
      case "sol.recruiting.ix.localizedKwl.CandidateStatus":
      case "sol.recruiting.ix.localizedKwl.CandidateStatusExt":
      case "sol.recruiting.ix.localizedKwl.Country":
      case "sol.recruiting.ix.localizedKwl.Degree":
      case "sol.recruiting.ix.localizedKwl.Gender":
      case "sol.recruiting.ix.localizedKwl.Language":
      case "sol.recruiting.ix.localizedKwl.Location":
      case "sol.recruiting.ix.localizedKwl.PostingStatus":
      case "sol.recruiting.ix.localizedKwl.RequisitionCategory":
      case "sol.recruiting.ix.localizedKwl.RequisitionStatus":
      case "sol.recruiting.ix.localizedKwl.RequisitionType":
      case "sol.recruiting.ix.localizedKwl.Seniority":
      case "sol.recruiting.ix.localizedKwl.Workschedule":
      case "sol.recruiting.ix.functions.ArchiveCandidateAnonymized":
      case "sol.recruiting.ix.functions.ChangeUserStatus":
      case "sol.recruiting.ix.functions.ConcludeQuestionnaireWorkflow":
      case "sol.recruiting.ix.functions.CreateCandidateHeadless":
      case "sol.recruiting.ix.functions.CreateCommunicationHeadless":
      case "sol.recruiting.ix.functions.CreatePostingHeadless":
      case "sol.recruiting.ix.functions.CreateRequisitionHeadless":
      case "sol.recruiting.ix.functions.GetRedirectRequest":
      case "sol.recruiting.ix.functions.InitiateBulkMailing":
      case "sol.recruiting.ix.functions.MoveCandidateToRequisition":
      case "sol.recruiting.ix.functions.MovePostingToRequisition":
      case "sol.recruiting.ix.functions.PrepareBulkMailing":
      case "sol.recruiting.ix.functions.PreparePostings":
      case "sol.recruiting.ix.functions.PrepareRating":
      case "sol.recruiting.ix.functions.PrepareRatingNodes":
      case "sol.recruiting.ix.functions.PrepareRatingSubworkflow":
      case "sol.recruiting.ix.functions.PublishPosting":
      case "sol.recruiting.ix.functions.RenderAndSetValues":
      case "sol.recruiting.ix.functions.SendUserMail":
      case "sol.recruiting.ix.functions.SetCandidatePhoto":
      case "sol.recruiting.ix.functions.SetMetadataFromFile":
      case "sol.recruiting.ix.functions.SetMetadataInCandidate":
      case "sol.recruiting.ix.functions.SetMetadataInRequisition":
      case "sol.recruiting.ix.functions.SetPostingFields":
      case "sol.recruiting.ix.functions.TransitionCandidateIntoFile":
      case "sol.recruiting.ix.functions.generators.GenCandidateShortDesc":
      case "sol.recruiting.ix.functions.generators.GenCommShortDesc":
      case "sol.recruiting.ix.functions.generators.GenJobPUserShortDesc":
      case "sol.recruiting.ix.functions.generators.GenPostingShortDesc":
      case "sol.recruiting.ix.functions.generators.GenRequisitionShortDesc":
      case "sol.recruiting.ix.functions.generators.GenerateCandidateNo":
      case "sol.recruiting.ix.functions.generators.GeneratePostingNo":
      case "sol.recruiting.ix.functions.generators.GenerateRequisitionNo":
      case "sol.recruiting.ix.functions.CreateUserHeadless":
      case "sol.recruiting.ix.functions.RegisterUser":
      case "sol.recruiting.ix.services.DeleteUser":
      case "sol.recruiting.ix.services.GetCommunicationRedactorTemplates":
      case "sol.recruiting.ix.services.GetKeywordlists":
      case "sol.recruiting.ix.services.GetPosting":
      case "sol.recruiting.ix.services.GetPostings":
      case "sol.recruiting.ix.services.GetRequisition":
      case "sol.recruiting.ix.services.GetRequisitionStatistics":
      case "sol.recruiting.ix.services.GetUserApplications":
      case "sol.recruiting.ix.services.GetUserProfile":
      case "sol.recruiting.ix.services.ManageUserPassword":
      case "sol.recruiting.ix.services.Rating":
      case "sol.recruiting.ix.services.UpdateCandidate":
      case "sol.recruiting.ix.services.UpdateRequisition":
      case "sol.recruiting.ix.services.UpdateUser":
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
 * @member sol.unittest.recruiting.ix.services.ExecuteLib1
 * @method RF_sol_unittest_recruiting_service_ExecuteLib1
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_recruiting_service_ExecuteLib1(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_recruiting_service_ExecuteLib1", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.recruiting.ix.services.ExecuteLib1", params);
  result = service.process();
  logger.exit("RF_sol_unittest_recruiting_service_ExecuteLib1", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
