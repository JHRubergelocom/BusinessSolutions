
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_moment.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js


/**
 * Manages an enrollment
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.functions.ManageEnrollment", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _getEnrollmentConfig: { config: "learning", prop: "entities.enrollment.functions.manageenrollment.enrollment" },
    _getLPEnrollments: { config: "learning", prop: "entities.enrollment.functions.manageenrollment.learningpathenrollments" },
    _getLPEnrollmentsRefs: { config: "learning", prop: "entities.enrollment.functions.manageenrollment.learningpathenrollmentsrefs" },
    _getCoursesHavingRelated: { config: "learning", prop: "entities.enrollment.functions.manageenrollment.coursesrelated" },
    _getCoursesByReferencesConfig: { config: "learning", prop: "entities.enrollment.functions.manageenrollment.coursesbyreferences" },
    _getCompletedEnrollmentsOfCoursesConfig: { config: "learning", prop: "entities.enrollment.functions.manageenrollment.completedenrollmentsofcourses" }
  },

  statusField: "COURSE_ENROLLMENT_STATUS",

  internalStatusField: "COURSE_ENROLLMENT_INTERNAL_STATUS",

  _optimize: {},

  getEnrollmentObjIds: function (searchCriteria) {
    var me = this;
    me._getLPEnrollments.search = me._getLPEnrollments.search.concat(searchCriteria);
    return (sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getLPEnrollments, me._optimize, "learningPathEnrollments", ["output"]).sords) || [];
  },

  getEnrollmentsCourseRefs: function (searchCriteria) {
    var me = this;
    me._getLPEnrollmentsRefs.search = me._getLPEnrollmentsRefs.search.concat(searchCriteria);
    return (sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getLPEnrollmentsRefs, me._optimize, "learningPathEnrollmentsRefs", ["output"]).sords) || [];
  },

  setCriteria: function (criteria, objId) {
    sol.common.IxUtils.execute("RF_sol_function_Set", { objId: objId, entries: criteria });
  },

  getCoursesHavingRelatedCourse: function (course) {
    var me = this;
    me._getCoursesHavingRelated.search = me._getCoursesHavingRelated.search.concat({ key: "COURSE_RELATED_COURSE_REFS", value: [course] });
    return (sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getCoursesHavingRelated, me._optimize, "coursesHavingCourseAsRelated", ["output"]).sords) || [];
  },

  getLearningPathEnrollments: function (user, course, status, fn) {
    var me = this, enrollments, coursesHavingCourseAsRelatedCourse;
    coursesHavingCourseAsRelatedCourse = me.getCoursesHavingRelatedCourse(course)
      .map(function (c) {
        return c.courseRef;
      });
    if (!coursesHavingCourseAsRelatedCourse.length) {
      return [];
    }
    enrollments = me[fn]([
      { key: "COURSE_ENROLLMENT_USER", value: [user] },
      { key: "COURSE_REFERENCE", value: coursesHavingCourseAsRelatedCourse },
      { key: me.statusField, value: status }
    ]);
    return enrollments;
  },

  setLearningPathEnrollmentsStatus: function (user, course, status, targetStatus) {
    var me = this, enrollments;
    enrollments = me.getLearningPathEnrollments(user, course, status, "getEnrollmentObjIds");
    enrollments
      .forEach(me.setEnrollmentStatus.bind(me, targetStatus));
  },

  getEnrollment: function (user, course, session) {
    var me = this;
    me._getEnrollmentConfig.search = me._getEnrollmentConfig.search.concat({ key: "COURSE_ENROLLMENT_USER", value: [user] }, { key: (session ? "SESSION" : "COURSE") + "_REFERENCE", value: [session || course] });
    return sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getEnrollmentConfig, me._optimize, "enrollment", ["output"]).sords[0];
  },

  getEnrollmentByGuid: function (guid) {
    var me = this;
    me._getEnrollmentConfig.id = guid;
    me._getEnrollmentConfig.search = undefined;
    return sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getEnrollmentConfig, me._optimize, "enrollment", ["output"]).sords[0];
  },

  setEnrollmentStatus: function (status, enrollmentObjId, deactivateEnrollment) {
    var me = this,
        args = [
          { key: me.statusField, type: "GRP", value: status },
          { key: "STATUS_" + status + "_ACHIEVED_AT", type: "MAP", value: moment().format("YYYYMMDDHHmmss") }
        ];

    if (deactivateEnrollment) {
      args.push({ key: me.internalStatusField, type: "GRP", value: "INACTIVE" });
    }

    me.setCriteria(args, enrollmentObjId);
  },

  getCoursesByReferences: function (courseRefs) {
    var me = this, config = JSON.parse(sol.common.JsonUtils.stringifyQuick(me._getCoursesByReferencesConfig));
    config.search = config.search.concat({ key: "COURSE_REFERENCE", value: courseRefs });
    return sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", config, me._optimize, "coursesByReferences", ["output"]).sords;
  },

  getCompletedEnrollmentsOfCourses: function (user, courses) {
    var me = this, config = JSON.parse(sol.common.JsonUtils.stringifyQuick(me._getCompletedEnrollmentsOfCoursesConfig));

    config.search = config.search.concat(
      [{ key: "COURSE_ENROLLMENT_USER", value: [user] }, { key: "COURSE_REFERENCE", value: courses }]
    );
    return sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", config, me._optimize, "completedEnrollmentsOfCourses", ["output"]).sords;
  },

  /*
    this function determines all possible learning paths for a course enrollment.
    if an lp (learning path) is passed, it will only check the specified learning path for completedness.
  */
  learningPathGoalsReached: function (user, course, lp) {
    var me = this, courseRefs, learningPaths, lpEnrollments;
    if (!lp) {
      lpEnrollments = me.getLearningPathEnrollments(user, course, ["ENROLLED", "RUNNING"], "getEnrollmentsCourseRefs");
      courseRefs = lpEnrollments
        .filter(function (enrollment) {
          return enrollment.status !== "COMPLETED";
        })
        .map(function (enrollment) {
          return enrollment.courseRef;
        });
      if (!courseRefs.length) {
        return;
      }
    }

    learningPaths = me.getCoursesByReferences(courseRefs || [lp.courseRef]);
    learningPaths
      .forEach(function (learningPath) {
        var completedRelatedEnrollments, relatedCourses;
        relatedCourses = learningPath.related
          .filter(function (relatedCourse) {
            return relatedCourse;
          });
        if (!relatedCourses.length) {
          return;
        }
        completedRelatedEnrollments = me.getCompletedEnrollmentsOfCourses(user, relatedCourses);
        if (completedRelatedEnrollments.length === relatedCourses.length) {
          me.completedHandler(
            lp
              ? lp.objId
              : sol.common.ObjectUtils.getProp(lpEnrollments, learningPath.courseRef, "courseRef").objId
          );
        }
      });
  },

  completedHandler: function (enrollmentObjId) {
    var me = this;
    me.setEnrollmentStatus("COMPLETED", enrollmentObjId);
    sol.common.WfUtils.startWorkflow("sol.learning.enrollment.courseCompleted", "Course completed", enrollmentObjId);
  },

  cancelledHandler: function (enrollmentObjId) {
    var me = this;
    me.setEnrollmentStatus("CANCELLED", enrollmentObjId, true);
    sol.common.WfUtils.startWorkflow("sol.learning.enrollment.cancelHeadless", "Enrollment cancelled", enrollmentObjId);
  },

  process: function () {
    var me = this, user, course, session, action, enrollment;

    action = me.action;
    if (!me.guid) {
      user = me.user;
      course = me.course;
      session = me.session;

      if (!(user && (course || session) && action)) {
        throw "user, action and one of course or session must be defined";
      }

      enrollment = me.getEnrollment(user, course, session);

      if (!enrollment) {
        throw "User `" + user + "` is not enrolled in course `" + course + "`";
      }
    } else {
      enrollment = me.getEnrollmentByGuid(me.guid);
      if (!enrollment) {
        throw "An enrollment with guid `" + me.guid + "` does not exist";
      }
      user = enrollment.user;
      course = enrollment.course;
    }

    if (action === "started") {
      me.setEnrollmentStatus("RUNNING", enrollment.objId);
      me.setLearningPathEnrollmentsStatus(user, course, ["ENROLLED"], "RUNNING");
    } else if (action === "completed") {
      me.completedHandler(enrollment.objId);
      me.learningPathGoalsReached(user, course);
    } else if (action === "cancelled") {
      me.cancelledHandler(enrollment.objId);
    } else if (action === "enrolled") {
      me.setEnrollmentStatus("ENROLLED", enrollment.objId);
    } else {
      // check if enrollment is a learning path enrollment, if yes and all related courses completed, set to completed
      me.learningPathGoalsReached(user, course, { courseRef: course, objId: enrollment.objId });
    }
  }
});

/**
 * @member sol.learning.ix.functions.ManageEnrollment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.learning.ix.functions.ManageEnrollment", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.ManageEnrollment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.learning.ix.functions.ManageEnrollment", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.ManageEnrollment
 * @method RF_sol_learning_function_ManageEnrollment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_ManageEnrollment(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  if (!rfArgs.guid) {
    sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);
  }

  fun = sol.create("sol.learning.ix.functions.ManageEnrollment", rfArgs);

  return JSON.stringify(fun.process());
}