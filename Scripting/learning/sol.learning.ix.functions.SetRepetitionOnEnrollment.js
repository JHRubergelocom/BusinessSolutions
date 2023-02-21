
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.learning.mixins.Configuration.js

/**
 * @author ELO Digital Office GmbH
 * @version 1.02
 *
 * @eloix
 *
 * @requires sol.common.Injection
 * @requires sol.common.IxUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.ix.RfUtils
 * @requires sol.learning.mixins.Configuration
 */
sol.define("sol.learning.ix.functions.SetRepetitionOnEnrollment", {
  extend: "sol.common.ix.FunctionBase",

  _optimize: {},
  _optimizationKey: "setRepetition",
  _output: ["output"],

  searchConfigPath: "source.fromService.params.search",

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId" },
    setRepetition: { config: "learning", prop: "entities.enrollment.workflowMixins.setRepetition.fill", template: true },
    search: { config: "learning", prop: "entities.enrollment.workflowMixins.setRepetition.search", template: true }
  },

  process: function () {
    var me = this;

    sol.common.ObjectUtils.setProp(
      me.setRepetition.params,
      me.searchConfigPath,
      me.removeEmptySearchEntries(me.search)
    );

    return sol.common.IxUtils.optimizedExecute(
      me.setRepetition.name,
      me.setRepetition.params,
      me._optimize,
      me._optimizationKey,
      me._output
    );
  },

  removeEmptySearchEntries: function (searchEntries) {
    var me = this;

    return sol.common.ObjectUtils.type(searchEntries, "array")
      ? searchEntries.filter(me.isNotEmpty.bind(me, "value"))
      : [];
  },

  isNotEmpty: function (attribute, obj) {
    var me = this;
    return me.isEmpty(attribute, obj);
  },

  isEmpty: function (attribute, obj) {
    return obj[attribute];
  }
});

/**
 * @member sol.learning.ix.functions.SetRepetitionOnEnrollment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;

  sol.create("sol.learning.ix.functions.SetRepetitionOnEnrollment", params).process();
}

/**
 * @member sol.learning.ix.functions.SetRepetitionOnEnrollment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;

  sol.create("sol.learning.ix.functions.SetRepetitionOnEnrollment", params).process();
}

/**
 * @member sol.learning.ix.functions.SetRepetitionOnEnrollment
 * @method RF_sol_learning_function_SetRepetitionOnEnrollment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_SetRepetitionOnEnrollment(iXSEContext, args) {
  var rfArgs, result;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);

  result = sol.create("sol.learning.ix.functions.SetRepetitionOnEnrollment", rfArgs).process();

  return JSON.stringify(result);
}