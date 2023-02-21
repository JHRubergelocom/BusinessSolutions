
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.IxUtils.js
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
sol.define("sol.learning.ix.functions.SetCourseCoverImage", {
  extend: "sol.common.ix.FunctionBase",

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _courseConfig: { config: "learning", prop: "entities.course.functions.setcoursecoverimage.course" }, // {}
    _setEntries: { config: "learning", prop: "entities.course.functions.setcoursecoverimage.setentries" }, // []
    _props: { config: "learning", prop: "entities.course.functions.setcoursecoverimage.const.props" }, //  {}
    photoName: { config: "learning", prop: "entities.course.functions.setcoursecoverimage.const.photoName", template: true } //  ""
  },

  getObjIdFromGuid: function (guid) {
    var me = this;
    return sol.common.IxUtils.optimizedExecute(
      "RF_sol_common_service_SordProvider",
      { ids: guid, output: [{ source: { type: "SORD", key: "id" } }] },
      me._optimize,
      "objIdFromGuid",
      ["output"]
    ).sords[0];

  },

  copyPhotoToCourse: function (photo, course) {
    var me = this;
    return sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      source: me.getObjIdFromGuid(photo),
      objId: String(course),
      name: me.photoName,
      copySourceAcl: false,
      inheritDestinationAcl: true
    });
  },

  setCourseCoverImage: function (course, photoguid) {
    var me = this;
    (course[me._props.courseid] && photoguid)
      && (me._setEntries[0].value = photoguid)
      && sol.common.IxUtils.execute("RF_sol_function_Set", { objId: course[me._props.courseid], entries: me._setEntries });
  },

  process: function () {
    var me = this, id = (me.objId || me.course), course = [];

    if (me._courseConfig.id = String(id)) {
      course = sol.common.IxUtils.optimizedExecute(
        "RF_sol_common_service_SordProvider",
        me._courseConfig, me._optimize,
        (me.objId ? "courseObjId" : "courseGuid"),
        ["output"]
      ).sords;
    }

    if (!course.length) {
      throw "course " + course + " not found.";
    }
    course = course[0];
    me.setCourseCoverImage(course, me.photoguid);
  }
});

/**
 * @member sol.learning.ix.functions.SetCourseCoverImage
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  fun = sol.create("sol.learning.ix.functions.SetCourseCoverImage", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.SetCourseCoverImage
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  fun = sol.create("sol.learning.ix.functions.SetCourseCoverImage", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.SetCourseCoverImage
 * @method RF_sol_learning_function_SetCourseCoverImage
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_SetCourseCoverImage(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  rfArgs.objId = undefined; // only allowed in workflows
  fun = sol.create("sol.learning.ix.functions.SetCourseCoverImage", rfArgs);

  fun.process();
}