
//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectFormatter.js

/**
 * Learning utilities
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 0.01.000
 *
 * @eloix
 */
sol.define("sol.learning.ix.LearningUtils", {
  singleton: true,

  /**
   * Loads (and merges) the reputation configuration from the JSON file: `/Administration/Business Solutions/learning/Configuration/learning.config`
   * @return {Object}
   */
  loadLearningConfig: function () {
    return sol.create("sol.common.Config", { compose: "/learning/Configuration/learning.config", copy: true }).config;
  },

  /**
   * Returns the course of the learningpath
   * @param {String} objId Object ID
   * @return {de.elo.ix.client.Sord} Course
   *
   */
  findCourse: function (objId) {
    var me = this,
        learningpath, course, learningConfig;

    if (!objId) {
      throw "Object ID is empty";
    }

    learningConfig = me.loadLearningConfig();
    learningpath = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO);
    course = sol.common.RepoUtils.findObjectTypeInHierarchy(learningpath.id, [learningConfig.objectTypes.course], { sordZ: SordC.mbAllIndex });

    return course;
  },

  findEnrollment: function (courseReferences, userName) {
    var me = this,
        learningConfig, findEnrollmentConfig, enrollments;

    learningConfig = me.loadLearningConfig();
    findEnrollmentConfig = learningConfig.entities.course.services.getcourse.enrollment;

    findEnrollmentConfig.search.push({ key: "COURSE_ENROLLMENT_USER", value: userName });
    findEnrollmentConfig.search.push({ key: "COURSE_REFERENCE", value: courseReferences });
    me.logger.debug("Finding enrollments.", findEnrollmentConfig.search);

    enrollments = sol.common.IxUtils.execute("RF_sol_common_service_SordProvider", findEnrollmentConfig).sords;
    if (enrollments && enrollments.length > 0) {
      return enrollments[0];
    } else {
      return null;
    }
  },

  /**
   * Updates XDateIso in course and learningpath.
   * @param {String} objId Object ID
   * @param {Object} learningConfig
   */
  updateXdate: function (objId, learningConfig) {
    var sord, objectTypeValue, course, learningpath;

    if (!objId) {
      throw "Object ID is empty";
    }

    if (!learningConfig) {
      throw "learningConfig is empty";
    }

    sord = sol.common.RepoUtils.getSord(objId);
    objectTypeValue = sol.common.SordUtils.getObjKeyValue(sord, learningConfig.fields.objectType);
    if (objectTypeValue) {
      if (objectTypeValue == learningConfig.services.createLearningpath.objectType) {
        learningpath = ixConnectAdmin.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO);
        learningpath.XDateIso = sol.common.SordUtils.nowIsoForConnection();
        ixConnectAdmin.ix().checkinSord(learningpath, SordC.mbAllIndex, LockC.NO);
        course = ixConnectAdmin.ix().checkoutSord(sord.parentId, SordC.mbAllIndex, LockC.NO);
        course.XDateIso = sol.common.SordUtils.nowIsoForConnection(ixConnectAdmin);
        ixConnectAdmin.ix().checkinSord(course, SordC.mbAllIndex, LockC.NO);
      }
      if (objectTypeValue == learningConfig.services.createCourse.objectType) {
        course = ixConnectAdmin.ix().checkoutSord(sord.id, SordC.mbAllIndex, LockC.NO);
        course.XDateIso = sol.common.SordUtils.nowIsoForConnection();
        ixConnectAdmin.ix().checkinSord(course, SordC.mbAllIndex, LockC.NO);
      }
    }
  },

  getUserInfo: function (username) {
    var findInfo, findByIndex, result, userInfo;

    findInfo = new FindInfo();
    findByIndex = new FindByIndex();
    findByIndex.name = username;
    findByIndex.maskId = "(E10E1000-E100-E100-E100-E10E10E10E35)";
    findInfo.findByIndex = findByIndex;

    result = ixConnect.ix().findFirstSords(findInfo, 1, SordC.mbLean).sords;
    if (result && result.length == 1) {
      userInfo = sol.common.ObjectFormatter.format({
        sord: {
          formatter: "sol.common.ObjectFormatter.TemplateSord",
          data: result[0],
          config: {
            sordKeys: ["name", "guid", "id", "maskName", "type", "desc"]
          }
        }
      }).sord;
    }
    return {
      userInfo: userInfo
    };
  },


  courseHasWbt: function (courseId) {
    var findInfo, findByIndex, findChildren, result;

    findInfo = new FindInfo();
    findByIndex = new FindByIndex();
    findByIndex.maskId = "Course WBT";
    findInfo.findByIndex = findByIndex;
    findChildren = new FindChildren();
    findChildren.parentId = courseId;
    findChildren.endLevel = 1;
    findInfo.findChildren = findChildren;

    result = ixConnect.ix().findFirstSords(findInfo, 1, SordC.mbOnlyGuid).ids;
    if (result && result.length > 0) {
      return true;
    }
    return false;
  }
});
