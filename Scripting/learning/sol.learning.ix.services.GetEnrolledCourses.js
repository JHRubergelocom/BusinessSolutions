
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
 * Retrieves enrolled courses.
 *
 * ### Starting a paged search
 *
 * If `{ paging: true }` is passed, the search will use pagination. A `searchId` property e.g. "(12k-1212f-1f12-12f)" and a `sords: [{}]` property will be returned.
 *
 * ### Continuing a paged search
 *
 * If `{ searchId: "(12k-1212f-1f12-12f)" }` is passed, the paged search will be continued. A `searchId` property and a `sords` property will be returned.
 * If a paged search does not return a `searchId` or a `moreResults` property, there are no more results.
 *
 * #### Getting results from a specific start index
 *
 * Define `{ searchId: "(12k-1212f-1f12-12f)", startFrom: 200, pageSize: 30 }`
 *
 * ### Manually ending a paged search
 *
 * If `{ searchId: "(12k-1212f-1f12-12f)", endPaging: true }` is passed, the paged search will be closed.
 *
 * ### Defining a page size
 *
 * For each step, you can pass e.g. `{ searchId: "(12k-1212f-1f12-12f)", pageSize: 10 }` to return 10 sords per search.
 *
 * ### Additional search criteria
 *
 * You can pass additional search criteria using
 *
 *     {
 *       filter: {
 *         "COURSE_TYPE": "E-Learn*",
 *         "COURSE_DIFFICULTY": ["Novice", "Intermediate"]
 *       }
 *     }
 *
 * ### Using DIRECT search mode
 *
 * Instead of findByIndex, you can switch the search mode to findDirect by passing `{ findDirect: true }`
 *
 *     { findDirect: true }
 *
 * If you also need to add your own query string, instead of passing `findDirect: true` simply pass
 *
 *     { query: "my term" }
 *
 * which will also use findDirect.
 *
 * ### Grouping (contextTerms)
 *
 * To group by a field (using a contextTerms search), define `{ groupBy: "MY_FIELD" }`.
 *
 *     { groupBy: "MY_FIELD" }
 *
 * The result would be
 *
 *     {
 *       groups: {
 *         MY_FIELD: { a: 1, b: 5, c: 8 }
 *       }
 *     }
 *
 * Instead of a single string, you can also define an array of strings to retrieve multiple contextTerms at once. `{ groupBy: ["MY_FIELD1", "MY_FIELD2"] }`
 *
 * The result would be
 *
 *     {
 *       groups: {
 *         MY_FIELD1: { a: 1, b: 5, c: 8 },
 *         MY_FIELD2: { yy: 3, vv: 77 }
 *       }
 *     }
 *
 * ### Additionally getting data for enrollments
 *
 * Pass `enrollments: true` to additionally retrieve the enrollment information of the connection user.
 *
 * @author NM, ELO Digital Office GmbH
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
sol.define("sol.learning.ix.services.GetEnrolledCourses", {
  extend: "sol.common.ix.ServiceBase",

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _getCoursesConfig: { config: "learning", prop: "entities.course.services.getenrolledcourses.courses" }, // {}
    _getEnrollmentsConfig: { config: "learning", prop: "entities.course.services.getenrolledcourses.enrollments" } // {}
  },

  utils: {
    groupBy: function (array, key) {
      return (array || [])
        .filter(function (element) {
          return !!element;
        })
        .reduce(function (out, element) {
          out[element[key]] = element;
          return out;
        }, {});
    },
    createSearchEntry: function (key, value) {
      return { key: key, value: value };
    },
    addEntry: function (arr, entry) {
      return arr.concat(Array.isArray(entry) ? entry : [entry]);
    }
  },

  getEnrolledCourses: function (enrollments) {
    var me = this,
        enrollmentsWithCourseReferences,
        courseReferences,
        referencedCourses,
        enrolledCourses;

    enrollmentsWithCourseReferences = me.getEnrollmentsWithCourseReferences(enrollments);

    courseReferences = me.getCourseReferencesFromEnrollments(enrollmentsWithCourseReferences);
    if (!courseReferences || courseReferences.length == 0) {
      me.logger.debug("No course references defined. Course search skipped...");
      return [];
    }

    referencedCourses = me.getCoursesByCourseReference(courseReferences);
    if (!referencedCourses || referencedCourses.length == 0) {
      me.logger.debug("No referenced courses found. Next steps skipped...");
      return [];
    }

    enrolledCourses = me.addEnrollmentsToCourses(referencedCourses, enrollmentsWithCourseReferences);
    if (!enrolledCourses || enrolledCourses.length == 0) {
      me.logger.debug("No enrolled courses found. Course transformation skipped...");
      return [];
    }

    return me.transformCourses(enrolledCourses);
  },

  getEnrollmentsWithCourseReferences: function (enrollments) {
    return (enrollments || [])
      .filter(function (enrollment) {
        return enrollment.COURSE_REFERENCE;
      });
  },

  getCourseReferencesFromEnrollments: function (enrollments) {
    return (enrollments || [])
      .map(function (enrollment) {
        return enrollment.COURSE_REFERENCE;
      });
  },

  getCoursesByCourseReference: function (courseReferences) {
    var me = this,
        courseReferencesSearch;

    courseReferencesSearch = me.getDefaultSearchWithCourseReferencesSearchEntry(courseReferences);

    return me.getCourses(courseReferencesSearch);
  },

  getDefaultSearchWithCourseReferencesSearchEntry: function (courseReferences) {
    var me = this,
        courseReferenceSearchEntry;

    courseReferenceSearchEntry = me.utils.createSearchEntry("COURSE_REFERENCE", courseReferences);
    return me.utils.addEntry(me.getDefaultSearch(), courseReferenceSearchEntry);
  },

  getDefaultSearch: function () {
    var me = this;

    return me._getCoursesConfig.search || [];
  },

  getCourses: function (search) {
    var me = this,
        config;

    config = me._getCoursesConfig;
    config.search = search;

    return sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", config, me._optimize, "my-courses", ["output"]).sords;
  },

  addEnrollmentsToCourses: function (courses, enrollments) {
    var me = this,
        groupedCourses = {};

    groupedCourses = me.utils.groupBy(courses, "COURSE_REFERENCE");

    return (enrollments || [])
      .map(function (enrollment) {
        return me.getCorrespondingCourseAndAddEnrollmentToCourse(enrollment, groupedCourses);
      })
      .filter(function (course) {
        return !!course;
      });
  },

  getCorrespondingCourseAndAddEnrollmentToCourse: function (enrollment, groupedCourses) {
    var me = this,
        course;

    try {
      course = me.getCorrespondingCourse(enrollment, groupedCourses);
      return me.addEnrollmentToCourse(enrollment, course);
    } catch (error) {
      me.logger.debug(error.message);
      return null;
    }
  },

  getCorrespondingCourse: function (enrollment, courses) {
    if (!courses[enrollment.COURSE_REFERENCE]) {
      // Explizit: there may be enrollments with no correpsonding course (maybe due to missing permissions)
      throw new Error("Could not get corresponding course of enrollment " + (enrollment || {}).id);
    }
    return courses[enrollment.COURSE_REFERENCE];
  },

  addEnrollmentToCourse: function (enrollment, course) {
    course.enrollment = enrollment;
    return course;
  },

  transformCourses: function (courses) {
    var me = this;

    me.addCourseCovers(courses);

    return courses.map(me.enhanceCourse.bind(me));
  },

  addCourseCovers: function (sords) {
    var me = this, wantsCover = [], covers, coverCount;
    covers = me.getCourseCovers(
      sords
        .filter(function (sord, i) {
          return sord.COURSE_COVER_IMAGE && wantsCover.push(i);
        })
        .map(function (sord) {
          return sord.COURSE_COVER_IMAGE;
        }));

    if ((coverCount = Object.keys(covers).length)) {
      me.logger.debug(["Processing {0} cover images.", coverCount]);
      wantsCover.forEach(function (sordIndex) {
        var sord = sords[sordIndex];
        (sord.cover = covers[sord.COURSE_COVER_IMAGE])
          && me.logger.debug(["found and added cover image {0} for course {1}.", sord.COURSE_COVER_IMAGE, sord.guid]);
      });
      me.logger.debug(["Processing done.", coverCount]);
    } else {
      me.logger.debug("No cover images found.");
    }
  },

  getCourseCovers: function (coverGuids) {
    var me = this;
    return sol.common.IxUtils.execute("RF_sol_common_service_GetDocumentsPreviewURLs", {
      objIds: coverGuids,
      previewSize: me._getCoursesConfig.coverImageSize,
      startPage: 1,
      endPage: 1,
      flatten: true
    });
  },

  enhanceCourse: function (course) {
    var me = this;

    course.labels = me.getCourseLabels(course);
    return course;
  },

  getCourseLabels: function (course) {

    return getAllLabels()
      .filter(onlyActive)
      .map(getLabelId);

    function getAllLabels() {
      return [
        {
          id: sol.common.ObjectUtils.getProp(course, "COURSE_LABEL_ID"),
          isActive: sol.common.ObjectUtils.getProp(course, "COURSE_LABEL_ACTIVE") &&
            moment().isBefore(sol.common.ObjectUtils.getProp(course, "COURSE_LABEL_DATE"))
        }
      ];
    }
    function onlyActive(label) {
      return label.isActive;
    }
    function getLabelId(label) {
      return label.id;
    }
  },

  parseOptions: function () {
    var me = this;

    me.parsePagingOptions();

    me.findDirect
      && (me._getEnrollmentsConfig.options.findDirect = me.findDirect);

    me.query && (typeof me.query == "string")
      && (me._getEnrollmentsConfig.options.query = me.query);

    me.filter
      && me.addSearchFilter(me._getEnrollmentsConfig.search, me.filter);

    // only return results for current user
    me._getEnrollmentsConfig.search.push({ key: "COURSE_ENROLLMENT_USER", value: String(ixConnect.loginResult.user.name) });
  },

  parsePagingOptions: function () {
    var me = this;
    if (me.searchId || me.paging) {
      me.paging
        && (me._getEnrollmentsConfig.options.paging = me.paging);
      me.searchId
        && (me._getEnrollmentsConfig.options.searchId = me.searchId);
      me._getEnrollmentsConfig.options.pageSize = me.pageSize || me._getEnrollmentsConfig.options.pageSize;
      (me.startFrom !== undefined)
        && (me._getEnrollmentsConfig.options.startPagingFrom = me.startFrom);
      me.endPaging
        && (me._getEnrollmentsConfig.options.endPaging = me.endPaging);
    }
  },

  addSearchFilter: function (criteria, filter) {
    Object.keys(filter).forEach(function (field) {
      criteria.push({ key: field, value: filter[field] });
    });
  },

  process: function () {
    var me = this, result, enrolledCourses, groupResult;

    me.parseOptions();

    if (me.groupBy) {
      me.logger.debug("Reading context terms for fields.", me.groupBy);
      result = {
        groups: {}
      };
      (Array.isArray(me.groupBy) ? me.groupBy : [me.groupBy]).forEach(function (groupBy) {
        me._getEnrollmentsConfig.options.fuzzy = {
          groupBy: {
            type: "GRP",
            key: groupBy
          }
        };
        groupResult = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getEnrollmentsConfig, me._optimize, "enrollmentsGroupBy", ["output"]);
        result.groups[groupBy] = groupResult.groups;
      });
    } else {
      me.logger.debug("Finding courses | _getEnrollmentsConfig:", me._getEnrollmentsConfig);

      result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getEnrollmentsConfig, me._optimize, "courses", ["output"]);
      me.logger.debug(["Processing cover image urls for courses. Image size: {0}.", me._getEnrollmentsConfig.coverImageSize]);
      enrolledCourses = me.getEnrolledCourses(result.sords);
    }

    return result.searchId
      ? { searchId: result.searchId, moreResults: result.moreResults, sords: enrolledCourses }
      : (me.groupBy ? { groups: result.groups } : { sords: enrolledCourses });
  }
});

/**
 * @member sol.learning.ix.services.GetEnrolledCourses
 * @method RF_sol_learning_service_GetEnrolledCourses
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_GetEnrolledCourses(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfParams._optimize;

  serviceProc = sol.create("sol.learning.ix.services.GetEnrolledCourses", rfParams);
  result = JSON.stringify(serviceProc.process());
  return result;
}

/**
 * @member sol.learning.ix.services.GetEnrolledCourses
 * @method RF_sol_learning_service_GetEnrolledCoursesFilters
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_GetEnrolledCoursesFilters(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfParams._optimize;

  serviceProc = sol.create("sol.learning.ix.services.GetEnrolledCourses", rfParams);
  result = JSON.stringify(serviceProc.process());
  return result;
}