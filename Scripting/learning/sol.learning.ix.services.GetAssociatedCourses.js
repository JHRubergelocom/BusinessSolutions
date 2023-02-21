importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Retrieves related courses for a course guid.
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.UserUtils
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.services.GetAssociatedCourses", {
  extend: "sol.common.ix.ServiceBase",

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _getCourseConfig: { config: "learning", prop: "entities.course.services.getassociatedcourses.course" } // {},
  },

  filterCourses: function (courseRefs) {
    var me = this;
    me.logger.enter("filterCourses", courseRefs);
    courseRefs = courseRefs
      .filter(function (name) { // filter empty strings
        return name.length;
      });
    me.logger.exit("filterCourses", courseRefs);
    return courseRefs;
  },

  sortCourses: function (courses, refs) {
    var courseMap = {};
    // Build Lookup-Map
    courses
      .forEach(function (course) {
        courseMap[course.COURSE_REFERENCE] || (courseMap[course.COURSE_REFERENCE] = course);
      });

    // Replace references by found courses, which implicitly sorts found courses by the original references' order.
    return refs
      .map(function (ref) {
        var course = courseMap[ref] || {};

        course.touched
          ? course = JSON.parse(JSON.stringify(course)) // duplicate course object
          : course.touched = true;

        return course;
      });
  },

  getCourses: function (refs, opt) {
    var me = this, result, sortedResult, config = { filter: { COURSE_REFERENCE: refs }, enrollments: true };
    me.logger.enter("getCourses", refs);
    if (Array.isArray(refs) && !refs.length) {
      me.logger.debug("no references specified. skipping getCourses call");
      me.logger.exit("getCourses", sortedResult);
      return { sords: [] };
    }

    ((opt || {}).min) && (config.minimumDataForRequired = true);
    config.filterVisibility = false;
    result = sol.common.IxUtils.execute("RF_sol_learning_service_GetCourses", config);

    me.logger.debug("found courses", result);
    me.logger.debug("sorting results");
    sortedResult = me.sortCourses(result.sords || [], refs);
    me.logger.exit("getCourses", sortedResult);
    return sortedResult;
  },

  getCoursesByReference: function (refs, min) {
    var me = this, courses;
    me.logger.enter("getCoursesByReference", refs);
    if (!refs || !refs.length) {
      me.logger.debug("No references to search for or sord was not a course!");
      return [];
    }
    courses = me.getCourses(me.filterCourses(refs), { min: min });
    me.logger.exit("getCoursesByReference", courses);
    return courses;
  },

  getRequiredCoursesByReferences: function (guids) {
    var me = this, courses, requiredCourses, sord, refs = [], spanAllRefsCounter = 0;
    me.logger.enter("getRequiredCoursesByReferences", guids);
    if (!guids) {
      me.logger.debug("No references to search for or sord was not a course!");
      return [];
    }
    if (Array.isArray(guids) && guids.length) {
      me._getCourseConfig.ids = guids;
      courses = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getCourseConfig, me._optimize, "course", ["output"]).sords || [];
      courses.forEach(function (course) {
        refs = refs.concat(course.requiredRefs);
      });
      requiredCourses = me.getCoursesByReference(refs || [], true);
      courses.forEach(function (course) {
        course.requiredRefs.forEach(function (_) {
          requiredCourses[spanAllRefsCounter].askedForBy = course.guid;
          spanAllRefsCounter++;
        });
      });
      courses = requiredCourses;
    } else {
      me._getCourseConfig.ids = guids;
      sord = (sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getCourseConfig, me._optimize, "course", ["output"]).sords[0] || {});
      courses = me.getCoursesByReference(sord.requiredRefs || []);
    }
    me.logger.exit("getRequiredCoursesByReferences", courses);
    return courses;
  },

  getRequiredCoursesForGuids: function (guids) {
    var me = this, courses;
    me.logger.enter("getRequiredCoursesForGuid", guids);
    if (!guids.length) {
      return [];
    }
    courses = me.getRequiredCoursesByReferences(guids) || [];
    me.logger.exit("getRequiredCoursesForGuid", courses);
    return courses;
  },

  countCompletedCourses: function (relatedPrerequisites) {
    var me = this, count;
    me.logger.enter("countCompletedCourses", relatedPrerequisites);
    count = relatedPrerequisites
      .filter(function (req) {
        return (req.enrollment || {}).COURSE_ENROLLMENT_STATUS === "COMPLETED";
      })
      .length;
    me.logger.exit("countCompletedCourses", count);
    return count === relatedPrerequisites.length;
  },

  getRequirementsResultOfCourse: function (allReqs, courseGuid) {
    var result;
    result = allReqs
      .filter(function (course) {
        return course.askedForBy === courseGuid;
      });
    return result;
  },

  getRelatedCourses: function (guid) {
    var me = this, courses, guids, requiredCoursesOfRelatedCourses, sord;
    me.logger.enter("getRelatedCourses");
    me._getCourseConfig.ids = guid;
    sord = (sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getCourseConfig, me._optimize, "course", ["output"]).sords[0] || {});

    courses = me.getCoursesByReference(sord.courseRefs || []);

    guids = courses
      .filter(function (course) {
        return course.guid;
      })
      .map(function (course) {
        return course.guid;
      });

    requiredCoursesOfRelatedCourses = me.getRequiredCoursesForGuids(guids);

    courses
      .forEach(function (course) {
        var countMatched;
        countMatched = me.countCompletedCourses(me.getRequirementsResultOfCourse(requiredCoursesOfRelatedCourses, course.guid));
        course.prerequisitesFulfilled = countMatched;
      });


    me.logger.exit("getRelatedCourses", courses);
    return courses;
  },

  process: function () {
    var me = this, courses;

    me.logger.debug("Retrieving course:" + me.guid);
    if (!me.guid && !me.guids) {
      throw "A guid or Array of guids must be passed!";
    }
    courses = (me.relatedCourses && me.getRelatedCourses(me.guid))
      || (me.requiredCourses && me.getRequiredCoursesByReferences(me.guids || me.guid || []));

    return { courses: courses };
  }
});

/**
 * @member sol.learning.ix.services.GetAssociatedCourses
 * @method RF_sol_learning_service_GetRelatedCourses
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_GetRelatedCourses(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfParams._optimize;
  rfParams.relatedCourses = true;
  serviceProc = sol.create("sol.learning.ix.services.GetAssociatedCourses", rfParams);
  result = JSON.stringify(serviceProc.process());
  return result;
}

/**
 * @member sol.learning.ix.services.GetRequiredCourses
 * @method RF_sol_learning_service_GetRelatedCourses
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_GetRequiredCourses(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfParams._optimize;
  rfParams.requiredCourses = true;
  serviceProc = sol.create("sol.learning.ix.services.GetAssociatedCourses", rfParams);
  result = JSON.stringify(serviceProc.process());
  return result;
}
