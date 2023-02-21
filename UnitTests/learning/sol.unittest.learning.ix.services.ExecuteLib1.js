
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.learning.ix.dynKwl.generators.Base.js
//@include lib_sol.learning.ix.dynkwl.courseIterator.Base.js
//@include lib_sol.learning.ix.dynkwl.notification.template.base.js
//@include lib_sol.learning.ix.localizedKwl.Base.js


var logger = sol.create("sol.Logger", { scope: "sol.unittest.learning.ix.services.ExecuteLib1" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_learning_service_ExecuteLib1', {
 *       className: 'sol.learning.Utils',
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
sol.define("sol.unittest.learning.ix.services.ExecuteLib1", {
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
      case "sol.learning.ix.dynkwl.generators.CertificateTemplate":
      case "sol.learning.ix.functions.AddEnrollments":
      case "sol.learning.ix.functions.AddSessions":
      case "sol.learning.ix.functions.CancelEnrollment":
      case "sol.learning.ix.functions.CreateEnrollmentHeadless":
      case "sol.learning.ix.functions.CreateRepetitionEnrollment":
      case "sol.learning.ix.functions.CreateSessionHeadless":
      case "sol.learning.ix.functions.ForEach":
      case "sol.learning.ix.functions.GetNotificationEnrollments":
      case "sol.learning.ix.functions.InitiateSessionConclusion":
      case "sol.learning.ix.functions.ManageEnrollment":
      case "sol.learning.ix.functions.ManageGotoWebinar":
      case "sol.learning.ix.functions.MoveEnrollmentToCourse":
      case "sol.learning.ix.functions.MoveSessionToCourse":
      case "sol.learning.ix.functions.OAuthorize":
      case "sol.learning.ix.functions.PrepareSessionConclusion":
      case "sol.learning.ix.functions.SendEnrollmentNotificationMail":
      case "sol.learning.ix.functions.SetCourseCoverImage":
      case "sol.learning.ix.functions.SetFeedCommentOn":
      case "sol.learning.ix.functions.SetRepetitionOnEnrollment":
      case "sol.learning.ix.functions.generators.GenCommShortDesc":
      case "sol.learning.ix.functions.generators.GenCourseShortDesc":
      case "sol.learning.ix.functions.generators.GenEnrollmentShortDesc":
      case "sol.learning.ix.functions.generators.GenSessionShortDesc":
      case "sol.learning.ix.functions.generators.GenerateCourseNo":
      case "sol.learning.ix.functions.generators.GenerateSessionNo":
      case "sol.learning.ix.services.ActionCheck":
      case "sol.learning.ix.services.GetAssociatedCourses":
      case "sol.learning.ix.services.GetCertificates":
      case "sol.learning.ix.services.GetConfig":
      case "sol.learning.ix.services.GetCourse":
      case "sol.learning.ix.services.GetCourseMaterials":
      case "sol.learning.ix.services.GetCourseTypes":
      case "sol.learning.ix.services.GetCourses":
      case "sol.learning.ix.services.GetEnrolledCourses":
      case "sol.learning.ix.services.GetKeywordlists":
      case "sol.learning.ix.services.GetNotificationEnrolllments":
      case "sol.learning.ix.services.GetUsers":
        return result;
      default:
    }

    switch (me.className) {
      case "sol.learning.ix.dynKwl.generators.Base":
      case "sol.learning.ix.dynkwl.KnowledgeSpace":
      case "sol.learning.ix.configKwl.Base":
      case "sol.learning.ix.dynkwl.notification.template.base":
      case "sol.learning.ix.localizedKwl.Base":
        return result;
      case "sol.learning.ix.functions.AddEnrollments":
        switch (me.method) {
          case "addKeyToTable":
          case "manageEnrollment":
          case "rowToEnrollment":
            return result;
          default:
        }
        break;
      case "sol.learning.ix.functions.AddSessions":
        switch (me.method) {
          case "addKeyToTable":
          case "rowToSession":
            return result;
          default:
        }
        break;
      case "sol.learning.ix.functions.CreateEnrollmentHeadless":
        switch (me.method) {
          case "persist":
          case "setObjKeys":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.learning.ix.functions.InitiateSessionConclusion":
        switch (me.method) {
          case "addKeyToTable":
          case "completeEnrollment":
            return result;
          default:
        }
        break;
      case "sol.learning.ix.functions.ManageEnrollment":
      case "sol.learning.ix.functions.ManageGotoWebinar":
      case "sol.learning.ix.functions.MoveEnrollmentToCourse":
      case "sol.learning.ix.functions.MoveSessionToCourse":
        return result;
      case "sol.learning.ix.functions.PrepareSessionConclusion":
        switch (me.method) {
          case "toEntries":
          case "completeEnrollment":
            return result;
          default:
        }
        break;
      case "sol.learning.ix.services.GetCourse":
        switch (me.method) {
          case "addParticipantCount":
          case "getActiveSession":
            return result;
          default:
        }
        break;
      case "sol.learning.ix.services.GetCourses":
        switch (me.method) {
          case "addCourseCovers":
          case "getCourseCovers":
            return result;
          default:
        }
        break;
      case "sol.learning.ix.services.GetEnrolledCourses":
        switch (me.method) {
          case "addCourseCovers":
          case "getCourseCovers":
          case "getCorrespondingCourse":
            return result;
          default:
        }
        break;
      case "sol.learning.ix.services.GetKeywordlists":
        switch (me.method) {
          case "addKwlToCache":
          case "isAllowedKwl":
            return result;
          default:
        }
        break;
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.learning.ix.services.GetEnrolledCourses":
        switch (me.method) {
          case "groupBy":
          case "createSearchEntry":
          case "addEntry":
            func = cls.utils[me.method];
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
 * @member sol.unittest.learning.ix.services.ExecuteLib1
 * @method RF_sol_unittest_learning_service_ExecuteLib1
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_learning_service_ExecuteLib1(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_learning_service_ExecuteLib1", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.learning.ix.services.ExecuteLib1", params);
  result = service.process();
  logger.exit("RF_sol_unittest_learning_service_ExecuteLib1", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

function RF_unittest(ec, args) {
  var result = {};
  logger.enter("RF_unittest", args);
  logger.exit("RF_unittest", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
