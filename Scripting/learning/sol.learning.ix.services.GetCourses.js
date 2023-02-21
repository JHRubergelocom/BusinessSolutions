
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_moment.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Retrieves available courses.
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
 * ### Convenience Service GetCoursesFilters
 *
 * To make debugging easier, you can call RF_sol_learning_service_GetCoursesFilters using the same criteria as RF_sol_learning_service_GetCourses.
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
sol.define("sol.learning.ix.services.GetCourses", {
  extend: "sol.common.ix.ServiceBase",

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _getCoursesConfig: { config: "learning", prop: "entities.course.services.getcourses.courses" }, // {}
    _getCoursesConfigMinReq: { config: "learning", prop: "entities.course.services.getcourses.coursesMinReq" }, // {}
    _getEnrollmentsConfig: { config: "learning", prop: "entities.course.services.getcourses.enrollments" }, // {}
    _getEnrollmentsConfigMin: { config: "learning", prop: "entities.course.services.getcourses.enrollmentsMin" }, // {}
    _getEnabledFeatures: { config: "learning", prop: "entities.webapp.services.config.enabledFeatures" } // {}
  },

  addSearchFilter: function (criteria, filter) {
    Object.keys(filter).forEach(function (field) {
      criteria.push({ key: field, value: filter[field] });
    });
  },

  getCourseCovers: function (coverGuids) {
    var me = this;
    return sol.common.IxUtils.execute("RF_sol_common_service_GetDocumentsPreviewURLs", {
      objIds: coverGuids,
      previewSize: me._activeConfig.coverImageSize,
      startPage: 1,
      endPage: 1,
      flatten: true
    });
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
        })
    );

    if ((coverCount = Object.keys(covers || {}).length)) {
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

  removeVisibilityFilter: function (config) {
    if (Array.isArray(config.search)) {
      config.search = config.search
        .filter(function (searchObj) {
          return searchObj && (searchObj.key !== "COURSE_VISIBILITY");
        });
    }
  },

  addCourseStatusFilter: function (config) {
    if (Array.isArray(config.search) && config.courseStatus.filter) {
      config.search.push(config.courseStatus.filter);
    }
  },

  getEnrollmentData: function (courseReferences, userName) {
    var me = this, sords, config;
    if (!courseReferences.length) {
      return [];
    }
    config = me.minimumDataForRequired ? me._getEnrollmentsConfigMin : me._getEnrollmentsConfig;
    config.search.push({ key: "COURSE_ENROLLMENT_USER", value: userName });
    config.search.push({ key: "COURSE_REFERENCE", value: courseReferences });
    (me.filterVisibility === false) && me.removeVisibilityFilter(config);
    me.logger.debug("Finding enrollments.", config.search);

    if (me.minimumDataForRequired) {
      sords = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getEnrollmentsConfigMin, me._optimize, "enrollmentsForUserMin", ["output"]).sords;
    } else {
      sords = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getEnrollmentsConfig, me._optimize, "enrollmentsForUser", ["output"]).sords;
    }

    return sords;
  },

  addEnrollmentData: function (courses, userName) {
    var me = this, wantsUserData = [], enrollments = {}, enrollmentCount;
    me.getEnrollmentData(
      courses
        .filter(function (sord, i) {
          return sord.COURSE_REFERENCE && wantsUserData.push(i);
        })
        .map(function (sord) {
          return sord.COURSE_REFERENCE;
        }),
      userName
    ).forEach(function (enrollment) {
      enrollments[enrollment.COURSE_REFERENCE] = enrollment || {};
    });

    if ((enrollmentCount = Object.keys(enrollments).length)) {
      me.logger.debug(["Processing {0} enrollments.", enrollmentCount]);
      wantsUserData.forEach(function (sordIndex) {
        var sord = courses[sordIndex];
        (sord.enrollment = enrollments[sord.COURSE_REFERENCE])
          && me.logger.debug(["found and added an enrollment for course {0}.", sord.COURSE_REFERENCE]);
      });
      me.logger.debug(["Processing done.", enrollmentCount]);
    } else {
      me.logger.debug("No enrollments.");
    }
  },

  parsePagingOptions: function () {
    var me = this;
    if (me.searchId || me.paging) {
      me.paging
        && (me._activeConfig.options.paging = me.paging);
      me.searchId
        && (me._activeConfig.options.searchId = me.searchId);
      me._activeConfig.options.pageSize = me.pageSize || me._activeConfig.options.pageSize;
      (me.startFrom !== undefined)
        && (me._activeConfig.options.startPagingFrom = me.startFrom);
      me.endPaging
        && (me._activeConfig.options.endPaging = me.endPaging);
    }
  },

  parseOptions: function () {
    var me = this;

    me.parsePagingOptions();

    me.findDirect
      && (me._activeConfig.options.findDirect = me.findDirect);

    me.query
      && (me._activeConfig.options.query = me.query);

    me.filter
      && me.addSearchFilter(me._activeConfig.search, me.filter);
  },

  process: function () {
    var me = this, result, groupResult;

    me._activeConfig = me.minimumDataForRequired
      ? sol.common.ObjectUtils.clone(me._getCoursesConfigMinReq)
      : sol.common.ObjectUtils.clone(me._getCoursesConfig);

    me.parseOptions();

    if (me.groupBy) {
      me.logger.debug("Reading context terms for fields.", me.groupBy);
      result = { groups: {} };
      (Array.isArray(me.groupBy) ? me.groupBy : [me.groupBy]).forEach(function (groupBy) {
        me._activeConfig.options.fuzzy = { groupBy: { type: "GRP", key: groupBy } };
        (me._getEnabledFeatures.courseStatus) && me.addCourseStatusFilter(me._activeConfig);
        (me.filterVisibility === false) && me.removeVisibilityFilter(me._activeConfig);
        groupResult = sol.common.IxUtils.optimizedExecute(
          "RF_sol_common_service_SordProvider",
          me._activeConfig,
          me._optimize,
          "coursesGroupBy",
          ["output", "filter"]
        );
        result.groups[groupBy] = groupResult.groups;
      });
    } else {
      me.logger.debug("Finding courses.", me._activeConfig.search);
      if (me.minimumDataForRequired) {
        (me._getEnabledFeatures.courseStatus) && me.addCourseStatusFilter(me._activeConfig);
        (me.filterVisibility === false) && me.removeVisibilityFilter(me._activeConfig);
        result = sol.common.IxUtils.optimizedExecute(
          "RF_sol_common_service_SordProvider",
          me._activeConfig,
          me._optimize,
          "coursesMinReq",
          ["output", "filter"]
        );
      } else {
        (me._getEnabledFeatures.courseStatus) && me.addCourseStatusFilter(me._activeConfig);
        (me.filterVisibility === false) && me.removeVisibilityFilter(me._activeConfig);

        result = sol.common.IxUtils.optimizedExecute(
          "RF_sol_common_service_SordProvider",
          me._activeConfig,
          me._optimize,
          "courses",
          ["output", "filter"]
        );
        me.logger.debug(["Processing cover image urls for courses. Image size: {0}.", me._activeConfig.coverImageSize]);
        me.addCourseCovers(result.sords || []);
      }

      me.enrollments
        && me.addEnrollmentData(result.sords || [], String(ixConnect.loginResult.user.name));
    }

    return result.searchId
      ? {
        searchId: result.searchId,
        moreResults: result.moreResults,
        sords: me.enhanceCourses(result.sords)
      }
      : (me.groupBy ? { groups: result.groups } : { sords: me.enhanceCourses(result.sords) });
  },

  enhanceCourses: function (courses) {
    var me = this;

    return courses.map(me.enhanceCourse.bind(me));
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
  }
});

/**
 * @member sol.learning.ix.services.GetCourses
 * @method RF_sol_learning_service_GetCourses
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_GetCourses(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfParams._optimize;

  serviceProc = sol.create("sol.learning.ix.services.GetCourses", rfParams);
  result = JSON.stringify(serviceProc.process());
  return result;
}

/**
 * @member sol.learning.ix.services.GetCourses
 * @method RF_sol_learning_service_GetCoursesFilters
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_GetCoursesFilters(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfParams._optimize;

  serviceProc = sol.create("sol.learning.ix.services.GetCourses", rfParams);
  result = JSON.stringify(serviceProc.process());
  return result;
}