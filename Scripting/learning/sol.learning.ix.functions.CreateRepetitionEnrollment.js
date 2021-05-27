
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.functions.CreateRepetitionEnrollment", {
  extend: "sol.common.ix.FunctionBase",

  _optimize: {},

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    enrollmentToExpire: {
      sordIdFromProp: "objId"
    }
  },

  search: {
    provider: "RF_sol_common_service_SordProvider",
    params: {
      masks: [""],
      search: [
        { key: "SOL_TYPE", value: ["COURSE"] },
        { key: "COURSE_REFERENCE", value: "{{sord.objKeys.COURSE_REFERENCE}}" }
      ],
      output: [
        { source: { type: "GRP", key: "COURSE_REFERENCE" }, target: { prop: "COURSE_REFERENCE" } },
        { source: { type: "MAP", key: "COURSE_REPETITION_REFERENCE" }, target: { prop: "COURSE_REPETITION_REFERENCE" } }
      ],
      options: {
        allowEmptyMask: true,
        formatAsTemplateSord: true
      }
    },
    optimize: "course"
  },

  create: {
    provider: "RF_sol_learning_function_CreateEnrollmentHeadless",
    params: {
      status: "ENROLLED"
    },
    optimize: "createenrollment"
  },

  process: function () {
    var me = this,
        result = {
          course: me.getCourseFromEnrollment(me.enrollmentToExpire)
        };

    result.result = me.createEnrollment(
      me.getRepetitionCourseReference(
        me.getCourseFromEnrollment(me.enrollmentToExpire)
      ),
      me.getEnrollmentUser(me.enrollmentToExpire)
    );

    return result;
  },

  getCourseFromEnrollment: function (enrollment) {
    var me = this,
        request = sol.common.ObjectUtils.clone(me.search);

    request.params = me.renderParams(request.params, { sord: enrollment });

    return (me.optimizedExecute(request) || { sords: [] }).sords[0];
  },

  optimizedExecute: function (request) {
    var me = this;

    return sol.common.IxUtils.optimizedExecute(
      request.provider,
      request.params,
      me._optimize,
      request.optimize,
      ["output"]
    );

  },

  renderParams: function (template, params) {
    return sol.common.TemplateUtils.render(template, params);
  },

  getRepetitionCourseReference: function (course) {
    return sol.common.ObjectUtils.getProp(course, "mapKeys.COURSE_REPETITION_REFERENCE");
  },

  getEnrollmentUser: function (enrollment) {
    return sol.common.ObjectUtils.getProp(enrollment, "objKeys.COURSE_ENROLLMENT_USER");
  },

  createEnrollment: function (courseReference, enrollmentUser) {
    var me = this,
        request = sol.common.ObjectUtils.clone(me.create);

    request.params.course = courseReference;
    request.params.user = enrollmentUser;

    return me.optimizedExecute(request) || { message: "creation failed" };
  }
});

/**
 * @member sol.learning.ix.functions.CreateRepetitionEnrollment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.learning.ix.functions.CreateRepetitionEnrollment", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.CreateRepetitionEnrollment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.learning.ix.functions.CreateRepetitionEnrollment", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.CreateRepetitionEnrollment
 * @method RF_sol_learning_function_CreateRepetitionEnrollment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_CreateRepetitionEnrollment(iXSEContext, args) {
  var rfArgs, fun, logger = sol.create("sol.Logger", { scope: "sol.learning.ix.functions.CreateRepetitionEnrollment" });
  logger.enter("RF_sol_learning_function_CreateRepetitionEnrollment");

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);

  fun = sol.create("sol.learning.ix.functions.CreateRepetitionEnrollment", rfArgs);

  logger.exit("RF_sol_learning_function_CreateRepetitionEnrollment");
  return JSON.stringify(fun.process());
}
