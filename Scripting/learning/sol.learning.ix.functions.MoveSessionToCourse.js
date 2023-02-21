
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.learning.ix.functions.MoveSessionToCourse", {
  extend: "sol.common.ix.FunctionBase",

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _config: { config: "learning", prop: "entities.session.functions.movesessiontocourse" } // {}
  },

  getSession: function (objId) {
    var me = this;
    me._config.find.session.id = String(objId);
    return me.getSords("session")[0];
  },

  getCourse: function (courseRef) {
    var me = this, course;
    if (!courseRef) {
      throw "Session did not have a course reference. Moving not possible.";
    }

    me._config.find.course.search.push({ key: me._config.find.courseReferenceField, value: courseRef });
    course = me.getSords("course")[0] || {};

    if (!course.guid) {
      throw "Could not find course `" + courseRef + "`. Moving not possible.";
    }

    return course;
  },

  isLocale: function (str) {
    return (str.indexOf(".") > 0) && (str.indexOf(" ") === -1);
  },

  rfAsAdm: function (fct, params) {
    var any = new (typeof Any !== "undefined" ? Any : de.elo.ix.client.Any);
    any.type = ixConnect.CONST.ANY.TYPE_STRING;
    any.stringValue = sol.common.JsonUtils.stringifyAll(params);
    any = ((ixConnectAdmin === "undefined") ? ixConnect : ixConnectAdmin).ix().executeRegisteredFunction(fct, any);
    return JSON.parse((any && any.stringValue) ? String(any.stringValue) : "{}");
  },

  getSessionFolderName: function (courseSessionFolderName, courseLanguage) {
    var me = this, translationTerm, translationLanguage, translated;

    if (!courseSessionFolderName) {
      translationTerm = me._config.sessionFolder.fallbacks.name;
    } else {
      courseSessionFolderName = courseSessionFolderName.trim();
      if (me.isLocale(courseSessionFolderName)) {
        translationTerm = courseSessionFolderName;
      } else {
        translated = courseSessionFolderName;
      }
    }

    if (translationTerm) {
      translationLanguage = (courseLanguage || me._config.sessionFolder.fallbacks.language).toLowerCase();
      translated = String(sol.common.TranslateTerms.getTerm(translationLanguage, translationTerm));
      (translationTerm === translated) && (translated = "");  // translation failed
    }

    return translated || me._config.sessionFolder.fallbacks.fixed; // absolute fallback if MAP was empty or translation failed
  },


  saveFolderNameInCourse: function (courseObjId, folderName) {
    var me = this, fieldConfig = me._config.sessionFolder.nameStorageField;
    fieldConfig.value = folderName;
    me.rfAsAdm("RF_sol_function_Set", {
      objId: courseObjId,
      entries: [fieldConfig]
    });
  },

  assembleTargetPath: function (courseGuid, folderName, sessionTime) {
    return "ARCPATH[" + courseGuid + "]:/" + folderName + "/" + sessionTime.substr(0, 4) + "/" + sessionTime.substr(4, 2);
  },

  moveSessionToCourse: function (sessionObjId, targetPath, targetMask) {
    var me = this;
    me.rfAsAdm("RF_sol_function_Move", {
      objId: sessionObjId,
      path: targetPath,
      mask: targetMask,
      adjustRights: true
    });
  },

  getSords: function (entity) {
    var me = this;
    return sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._config.find[entity], me._optimize, entity, ["output"]).sords;
  },

  determineFolderMask: function () {
    var me = this;
    return me._config.sessionFolder.fallbacks.mask;
  },

  process: function () {
    var me = this, session, course, sessionFolderName;

    session = me.getSession(me.objId);
    course = me.getCourse(session.course);
    sessionFolderName = me.getSessionFolderName(course.sessionfolder, course.language);
    me.saveFolderNameInCourse(course.objId, sessionFolderName);
    me.moveSessionToCourse(me.objId, me.assembleTargetPath(course.guid, sessionFolderName, session.startTime), me.determineFolderMask());
  }
});

/**
 * @member sol.learning.ix.functions.MoveSessionToCourse
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  fun = sol.create("sol.learning.ix.functions.MoveSessionToCourse", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.MoveSessionToCourse
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  fun = sol.create("sol.learning.ix.functions.MoveSessionToCourse", params);

  fun.process();
}