
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.AsUtils.js
//@include lib_sol.common_monitoring.ix.MonitorUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js

/**
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.HttpUtils
 * @requires sol.common.AsUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 * Calls a IX-service `paramService` and then calls an IX-function `targetFunction` with service-results.
 * Can call an Update-function if specified in `registerUpdate`.
 *
 * ## Example
 *
 *     {
 *       "paramService": "RF_sol_hr_service_GetCookingIngredients",
 *       "targetFunction": "RF_sol_function_CookUsingIngredients",
 *       "registerUpdate": "sol.hr.as.functions.RegisterIngredientsUpdate"
 *       // "additionalParameterX": "value" any additional parameters
 *     }
 *
 * ## Parameters
 *
 * The following properties are exposed to the `paramService`:
 *
 * - wfOwnerName
 * - wfFlowId
 * - wfName
 * - wfObjId
 * - wfTemplateName
 * - objId (=wfObjId if used in Workflow)
 * - flowId (=wfFlowId if used in Workflow)
 *
 * The object returned by the `paramService` is passed to the `targetFunction` without
 * any modifications. Be sure to include all parameters needed in `targetFunction` in the `paramService`'s return value.
 *
 * ## AS
 * AS-function calls are experimental
 *
 */
sol.define("sol.hr.ix.functions.ParamServiceFunctionPipe", {
  extend: "sol.common.ix.FunctionBase",

  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [params]);
    me.params = params;
  },

  process: function () {
    var me = this, paramServiceResult;

    paramServiceResult = sol.common.IxUtils.execute(me.paramService, me.params); // Get params from service

    me.targetFunction && (me.targetFunction.indexOf(".") > 0)  // AS-rule
    ? sol.common.AsUtils.callAs({
      objId: me.wfObjId,
      param2Obj: paramServiceResult,
      ruleName: me.targetFunction,
      mode: "run",  // requires "Rules"-rule, since Direct rules need mode:get
      expectJsonResponse: false,
      solutionNameForAsConfig: me.asSolutionName || "hr"
    })
    : sol.common.IxUtils.execute(me.targetFunction, paramServiceResult);  // IX-RF

    // register an update
    me.registerUpdate && sol.common_monitoring.ix.MonitorUtils.registerUpdate(
      (paramServiceResult && paramServiceResult.objId) || me.objId,
      me.registerUpdate
    );
  }
});

function prepareWorkflowParameters(params, wfDiagram) {
  var me = this;
  params.wfOwnerName = String(wfDiagram.ownerName);
  params.wfFlowId = String(wfDiagram.id);
  params.wfName = String(wfDiagram.name);
  params.wfObjId = String(wfDiagram.objId);
  params.objId = String(params.wfObjId || me.objId);
  params.flowId = String(params.wfFlowId || me.flowId);
  params.wfTemplateName = String(wfDiagram.templateName);
}

/**
 * @member sol.common.ix.functions.ParamServiceFunctionPipe
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  prepareWorkflowParameters(params, wfDiagram);

  fun = sol.create("sol.hr.ix.functions.ParamServiceFunctionPipe", params);

  fun.process();
}

/**
 * @member sol.common.ix.functions.ParamServiceFunctionPipe
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  prepareWorkflowParameters(params, wfDiagram);

  fun = sol.create("sol.hr.ix.functions.ParamServiceFunctionPipe", params);

  fun.process();
}


/**
 * @member sol.common.ix.functions.ParamServiceFunctionPipe
 * @method RF_sol_hr_function_ParamServiceFunctionPipe
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_hr_function_ParamServiceFunctionPipe(iXSEContext, args) {
  var rfParams, fun;

  rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  fun = sol.create("sol.hr.ix.functions.ParamServiceFunctionPipe", rfParams);

  fun.process();
}
