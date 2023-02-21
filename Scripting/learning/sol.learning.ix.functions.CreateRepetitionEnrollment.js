
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
    },
    search: {
      config: "learning",
      prop: "entities.enrollment.functions.createrepetitionenrollment.search"
    },
    create: {
      config: "learning",
      prop: "entities.enrollment.functions.createrepetitionenrollment.create"
    }
  },

  process: function () {
    var me = this;

    return me.createEnrollment(
      me.getRepetitionCourseReference(
        me.getCourseFromEnrollment(me.enrollmentToExpire)
      ),
      me.getEnrollmentUser(me.enrollmentToExpire)
    );
  },

  getCourseFromEnrollment: function (enrollment) {
    var me = this,
        request = sol.common.ObjectUtils.clone(me.search);

    request.params = me.renderParams(request.params, { sord: enrollment });

    return (me.optimizedExecute(request, "courseFromEnrollment") || { sords: [] }).sords[0];
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

    return me.optimizedExecute(request, "createRepetitionEnrollment") || { message: "creation failed" };
  },

  optimizedExecute: function (request, optimizeField) {
    var me = this;

    return sol.common.IxUtils.optimizedExecute(
      request.provider,
      request.params,
      me._optimize,
      optimizeField,
      ["output"]
    );
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
