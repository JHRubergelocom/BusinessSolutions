
//@include lib_Class.js

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
    return sol.create("sol.common.Config", { compose: "/learning/Configuration/learning.config" }).config;
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
  }
});
