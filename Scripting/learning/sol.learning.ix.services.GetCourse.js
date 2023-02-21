importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_moment.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.Injection.js
//@include lib_sol.learning.mixins.Configuration.js


/**
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
sol.define("sol.learning.ix.services.GetCourse", {
  extend: "sol.common.ix.ServiceBase",

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _findEnrollmentConfig: { config: "learning", prop: "entities.course.services.getcourse.enrollment" }, // {}
    _getSessionsConfig: { config: "learning", prop: "entities.course.services.getcourse.sessions" }, // {}
    _getEnrollmentCountsConfig: { config: "learning", prop: "entities.course.services.getcourse.getEnrollmentCounts" } // {}
  },

  process: function () {
    var me = this, course, materialSections, enrollment,
        instructor, requiredCourses, courseHasWbt, video,
        availableSessions, session, labels, interactionElements;

    course = me.getCourse();

    materialSections = me.getCourseMaterialSections();

    enrollment = me.findEnrollment(course.objKeys.COURSE_REFERENCE, String(ixConnect.loginResult.user.name));

    instructor = me.filterPrivateData(me.getUserInfo(course.objKeys.COURSE_INSTRUCTOR));

    requiredCourses = me.getRequiredCourses(me.guid).courses;

    courseHasWbt = me.courseHasWbt(course.id);

    video = me.getVideo(course.id);

    availableSessions = me.getAvailableSessions(course.objKeys.COURSE_REFERENCE);
    Array.isArray(availableSessions) && availableSessions.length && me.addParticipantCount(availableSessions);

    (enrollment && enrollment.SESSION_REFERENCE)
      && (session = me.getActiveSession(enrollment.SESSION_REFERENCE, availableSessions));

    labels = me.getCourseLabels(course);

    interactionElements = me.getCourseInteractionElements(course);

    return {
      course: course,
      labels: labels,
      interactionElements: interactionElements,
      courseInstructor: instructor,
      relatedCourses: {
        count: me.getRelatedCourseCount(course.objKeys.COURSE_RELATED_COURSE_REFS)
      },
      requiredCourses: {
        courses: requiredCourses,
        completed: me.getCompletedFlag(requiredCourses)
      },
      enrollment: enrollment,
      session: session,
      availableSessions: availableSessions,
      hasWbt: courseHasWbt,
      video: video,
      materials: {
        sections: materialSections
      }
    };
  },

  getUserInfo: function (username) {
    if (username) {
      var findInfo = new FindInfo(), findByIndex = new FindByIndex(), result;

      findByIndex.name = username;
      findByIndex.maskId = "(E10E1000-E100-E100-E100-E10E10E10E35)";
      findInfo.findByIndex = findByIndex;

      if ((result = ixConnect.ix().findFirstSords(findInfo, 1, SordC.mbLean).sords) && result.length == 1) {
        return sol.common.ObjectFormatter.format({
          sord: {
            formatter: "sol.common.ObjectFormatter.TemplateSord",
            data: result[0],
            config: { sordKeys: ["name", "guid", "id", "maskName", "type", "desc"] }
          }
        }).sord;
      }
    }
  },

  filterPrivateData: function (instructor) {
    var ins = instructor || { objKeys: {} }, obj = ins.objKeys;
    return {
      guid: ins.guid,
      id: ins.id,
      name: ins.name,
      objKeys: {
        ELOCOMPANY: obj.ELOCOMPANY,
        ELODEPARTMENT: obj.ELODEPARTMENT,
        ELOFULLNAME: obj.ELOFULLNAME,
        ELOLOCATION: obj.ELOLOCATION,
        ELOOFFICE: obj.ELOOFFICE,
        ELOTITLE: obj.ELOTITLE,
        ELOUSERGUID: obj.ELOUSERGUID,
        ELOUSERID: obj.ELOUSERID,
        ELOUSERPOSITION: obj.ELOUSERPOSITION
      },
      type: ins.type
    };
  },

  courseHasWbt: function (courseId) {
    var findInfo = new FindInfo(), findByIndex = new FindByIndex(), findChildren = new FindChildren(), result;

    findByIndex.maskId = "Course WBT";
    findInfo.findByIndex = findByIndex;
    findChildren.parentId = courseId;
    findChildren.endLevel = 1;
    findInfo.findChildren = findChildren;

    result = ixConnect.ix().findFirstSords(findInfo, 1, SordC.mbOnlyGuid).ids;
    return !!(result && result.length > 0);
  },

  findEnrollment: function (course, user) {
    var me = this, enrollments;
    if (!course || !user) {
      throw "No course or user defined.";
    }
    me._findEnrollmentConfig.search.push({ key: "COURSE_ENROLLMENT_USER", value: user });
    me._findEnrollmentConfig.search.push({ key: "COURSE_REFERENCE", value: course });
    me.logger.debug("Finding enrollments.", me._findEnrollmentConfig.search);
    enrollments = sol.common.IxUtils.execute("RF_sol_common_service_SordProvider", me._findEnrollmentConfig).sords;
    return (enrollments && enrollments.length > 0) ? enrollments[0] : null;
  },

  getActiveSession: function (session, availableSessions) {
    var me = this,
        activeSession = sol.common.ObjectUtils.getProp(availableSessions, session, "no");

    if (activeSession.instructor) {
      activeSession.instructor = me.filterPrivateData(me.getUserInfo(activeSession.instructor));
    }

    return activeSession;
  },

  getAvailableSessions: function (course) {
    var me = this;
    me._getSessionsConfig.search.push({ key: "COURSE_REFERENCE", value: course });
    return sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._getSessionsConfig, me._optimize, "session", ["output"]).sords;
  },

  rfAsAdm: function (fct, params) {
    var any = new (typeof Any !== "undefined" ? Any : de.elo.ix.client.Any);
    any.type = ixConnect.CONST.ANY.TYPE_STRING;
    any.stringValue = sol.common.JsonUtils.stringifyAll(params);
    any = ((ixConnectAdmin === "undefined") ? ixConnect : ixConnectAdmin).ix().executeRegisteredFunction(fct, any);
    return JSON.parse((any && any.stringValue) ? String(any.stringValue) : "{}");
  },

  getEnrollmentCounts: function (sessions) {
    var me = this;
    me._getEnrollmentCountsConfig.search.push({ key: "SESSION_REFERENCE", value: sessions });
    return me.rfAsAdm("RF_sol_common_service_SordProvider", me._getEnrollmentCountsConfig).groups;
  },

  addParticipantCount: function (sessions) {
    var me = this,
        sessionRefs = sessions
          .map(function (session) {
            return session.no;
          }),
        enrollmentCounts = me.getEnrollmentCounts(sessionRefs) || {};

    sessions
      .forEach(function (session) {
        session.participants = enrollmentCounts[session.no] || 0;
      });
  },

  getCompletedFlag: function (courses) {
    if (!courses) {
      return 0;
    }
    return courses.length === courses
      .filter(function (course) {
        return (course.enrollment || {}).COURSE_ENROLLMENT_STATUS === "COMPLETED";
      })
      .length;
  },

  getRelatedCourseCount: function (courseRefs) {
    var me = this, count;
    me.logger.enter("getRelatedCourseCount", courseRefs);
    count = String(courseRefs || "")
      .split(String.fromCharCode(182)) // pilcrow
      .filter(function (ref) { // filter empty strings
        return ref.length;
      })
      .length;
    me.logger.exit("getRelatedCourseCount", count);
    return count;
  },

  getRequiredCourses: function (guid) {
    var me = this, requiredCourses;
    me.logger.enter("getRequiredCourses", guid);
    requiredCourses = sol.common.IxUtils.execute("RF_sol_learning_service_GetRequiredCourses", {
      guid: guid,
      filter: {}
    }) || {
      courses: []
    };
    me.logger.exit("getRequiredCourses", requiredCourses);
    return requiredCourses;
  },

  getCourse: function () {
    var me = this,
        courseSord, course;
    me.logger.enter("getCourse", me.guid);

    courseSord = sol.common.RepoUtils.getSord(me.guid);
    if (courseSord) {
      me.logger.debug("transforming course");
      course = sol.common.ObjectFormatter.format({
        sord: {
          formatter: "sol.common.ObjectFormatter.TemplateSord",
          data: courseSord,
          config: {
            sordKeys: ["name", "guid", "id", "maskName", "type", "desc"],
            formBlobs: ["COURSE_REQUIREMENTS", "COURSE_CUSTOM_QUERY_DESC"],
            mapKeys: [
              "COURSE_EST_TIME_UNIT",
              "COURSE_ITEM_ACTION_ENABLED",
              "COURSE_SECURITY_QUERY_ENABLED",
              "LOCALE_SECURITY_QUERY_DESCR",
              "COURSE_LABEL_ID",
              "COURSE_LABEL_ACTIVE",
              "COURSE_LABEL_DATE",
              "COURSE_INTERACTIONELEMENT_ID_*"
            ]
          }
        }
      }).sord;
      me.logger.debug("transformed course ", course);
      if (course.objKeys["SOL_TYPE"] !== "COURSE") {
        me.logger.exit("getCourse");
        throw "Current Object is not a course.";
      }
      me.logger.exit("getCourse", course);
      return course;
    } else {
      me.logger.exit("getCourse");
      return {};
    }
  },

  getCourseLabels: function (course) {

    return getAllLabels()
      .filter(onlyActive)
      .map(getLabelId);

    function getAllLabels() {
      return [
        {
          id: sol.common.ObjectUtils.getProp(course, "mapKeys.COURSE_LABEL_ID"),
          isActive: sol.common.ObjectUtils.getProp(course, "mapKeys.COURSE_LABEL_ACTIVE") == "1"
            && isEmptyOrBeforeCurrentDate()
        }
      ];
    }
    function onlyActive(label) {
      return label.isActive;
    }
    function getLabelId(label) {
      return label.id;
    }
    function isEmptyOrBeforeCurrentDate() {
      var untilDate = sol.common.ObjectUtils.getProp(course, "mapKeys.COURSE_LABEL_DATE");
      return !untilDate || moment().isBefore(untilDate);
    }
  },

  getCourseInteractionElements: function (course) {

    return Object.keys(course.mapKeys || {})
      .filter(function (mapKey) {
        return mapKey.indexOf("COURSE_INTERACTIONELEMENT_ID_") == 0;
      })
      .sort()
      .map(function (mapKey) {
        return course.mapKeys[mapKey];
      });
  },

  getCourseMaterialSections: function () {
    var me = this,
        sectionSords, sectionSord, sections = [],
        i;

    me.logger.enter("getCourseMaterialSections");

    sectionSords = sol.common.RepoUtils.findChildren(me.guid, {
      includeDocuments: false,
      includeFolders: true,
      includeReferences: true,
      maskId: "Course materials"
    });

    me.logger.debug("found course material sections", sectionSords);

    if (sectionSords && sectionSords.length > 0) {
      for (i = 0; i < sectionSords.length; i++) {
        sectionSord = sectionSords[i];
        sections.push(sol.common.ObjectFormatter.format({
          sord: {
            formatter: "sol.common.ObjectFormatter.TemplateSord",
            data: sectionSord,
            config: {
              sordKeys: ["name", "guid", "id", "maskName", "type", "childCount"]
            }
          }
        }).sord);
      }
    }

    me.logger.exit("getCourseMaterialSections", sections);
    return sections;
  },

  getVideo: function () {
    var me = this,
        videoFolder;

    videoFolder = me.getFormattedChildren(
      me.guid,
      {
        includeDocuments: false,
        includeFolders: true,
        includeReferences: true,
        maskId: "Course Video"
      },
      {
        sordKeys: ["name", "guid", "id", "maskName", "childCount"]
      },
      function (courseVideo) {
        if (courseVideo) {
          courseVideo = me.cleanFormattedObject(courseVideo);

          if (parseInt(courseVideo.childCount, 10) > 0) {
            delete courseVideo.childCount;
            courseVideo.hasSources = true;
            courseVideo.sources = me.getFormattedChildren(
              courseVideo.guid,
              {
                includeDocuments: true,
                includeFolders: true,
                includeReferences: true,
                maskId: "Course Video Source"
              },
              {
                sordKeys: ["name", "guid", "id", "maskName"],
                mapKeys: ["COURSE_VIDEO_SOURCE_MEDIA"]
              },
              function (courseVideoSource) {
                return me.cleanFormattedObject(courseVideoSource);
              });
          }
          return courseVideo;
        }
        return null;
      }
    );

    return videoFolder;
  },
  cleanFormattedObject: function (obj) {
    var cleanedObj = JSON.parse(JSON.stringify(obj));
    sol.common.ObjectUtils.isEmpty(cleanedObj.objKeys) && delete cleanedObj.objKeys;
    sol.common.ObjectUtils.isEmpty(cleanedObj.formBlobs) && delete cleanedObj.formBlobs;
    sol.common.ObjectUtils.isEmpty(cleanedObj.mapKeys) && delete cleanedObj.mapKeys;
    sol.common.ObjectUtils.isEmpty(cleanedObj.wfMapKeys) && delete cleanedObj.wfMapKeys;
    return cleanedObj;
  },
  getFormattedChildren: function (guid, options, config, eachChild) {
    var sords,
        i,
        arrLength,
        formattedSord,
        formattedSords = [];

    sords = sol.common.RepoUtils.findChildren(guid, options);

    if (sords && sords.length > 0) {
      arrLength = sords.length;

      for (i = 0; i < arrLength; i++) {
        formattedSord = eachChild(
          sol.common.ObjectFormatter.format({
            sord: {
              formatter: "sol.common.ObjectFormatter.TemplateSord",
              data: sords[i],
              config: config
            }
          }).sord
        );
        formattedSord && formattedSords.push(formattedSord);
      }
    }

    return formattedSords && formattedSords.length > 0 ? formattedSords : null;
  }
});

/**
 * @member sol.learning.ix.services.GetCourses
 * @method RF_sol_learning_service_GetCourses
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_GetCourse(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfParams._optimize;

  serviceProc = sol.create("sol.learning.ix.services.GetCourse", rfParams);
  result = JSON.stringify(serviceProc.process());
  return result;
}


/**
 *
 * @author NM, ELO Digital Office GmbH
 *
 * Returns all documents for a given material section. Sections can be defined by a folder in the course.
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
sol.define("sol.learning.ix.services.GetCourseMaterials", {
  extend: "sol.common.ix.ServiceBase",

  process: function () {
    var me = this,
        materials;

    materials = me.getCourseMaterials();

    return {
      materials: materials
    };
  },

  getCourseMaterials: function () {
    var me = this,
        materialSords, materialSord, materials = [],
        material, i;

    me.logger.enter("getCourseMaterials");

    materialSords = sol.common.RepoUtils.findChildren(me.guid, {
      includeDocuments: true,
      includeFolders: false,
      includeReferences: true,
      maskId: "Course materials"
    });

    if (materialSords && materialSords.length > 0) {
      for (i = 0; i < materialSords.length; i++) {
        materialSord = materialSords[i];

        material = sol.common.ObjectFormatter.format({
          sord: {
            formatter: "sol.common.ObjectFormatter.TemplateSord",
            data: materialSord,
            config: {
              sordKeys: ["name", "guid", "id", "maskName", "type"]
            }
          }
        }).sord;
        materials.push(material);
      }
    }

    me.logger.exit("getCourseMaterials", materials);

    return materials;
  }

});

/**
 * @member sol.learning.ix.services.GetCourseMaterials
 * @method RF_sol_learning_service_GetCourseMaterials
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_GetCourseMaterials(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfParams._optimize;

  serviceProc = sol.create("sol.learning.ix.services.GetCourseMaterials", rfParams);
  result = JSON.stringify(serviceProc.process());
  return result;
}