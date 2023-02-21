importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.CheckSolutionEnabled" });

/**
 * Checks if a `solution` is enabled.
 *
 * When called as RF it returns false if the `solution` is not enabled, true if it is enabled.
 *
 * When used in a workflow script, it updates the ELO_WF_STATUS to either "SOLUTION_ENABLED" or "SOLUTION_DISABLED" (see {@link #DEFAULT_POSITIVE_STATUS} and {@link #DEFAULT_NEGATIV_STATUS}).
 *
 * @param
 * 
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Template
 * @requires sol.common.RepoUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.CheckSolutionEnabled", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["solution"],

  /** @cfg {String} solution (required)
   * module/package name of solution to be checked.
   */

  /**
   * @private
   * @property {String} [DEFAULT_POSITIVE_STATUS="SOLUTION_ENABLED"] Default workflow status in case of a successful check
   */
  DEFAULT_POSITIVE_STATUS: "SOLUTION_ENABLED",
  /**
   * @private
   * @property {String} [DEFAULT_NEGATIV_STATUS="SOLUTION_DISABLED"] Default workflow status in case of a successful check
   */
  DEFAULT_NEGATIV_STATUS: "SOLUTION_DISABLED",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Check, if solution is enabled.
   */
  process: function () {
    var me = this,
        enabled = me.checkSolutionEnabled(),
        startNode, status;

    if (me.wfDiagram) {
      startNode = sol.common.WfUtils.getNode(me.wfDiagram, 0);
      status = (enabled) ? me.DEFAULT_POSITIVE_STATUS : me.DEFAULT_NEGATIV_STATUS;

      startNode.yesNoCondition = status;
      me.logger.info(["changed ELO_WF_STATUS to '{0}' (flowId={1})", status, me.wfDiagram.id]);
    }

    return enabled;
  },

  /**
   * @private
   * Checks if `solution` is enabled by checking the existence of the solution folder inside the Business solutions folder.
   * @return {Boolean}
   */
  checkSolutionEnabled: function () {
    var me = this,
        repoUtils = sol.common.RepoUtils, modulePath, moduleObjId, solutionEnabled;
         
        
    if (typeof me.solution === "string" && me.solution.trim()) {
      modulePath = repoUtils.resolveSpecialFolder("{{bsFolderPath}}/" + me.solution.trim().toLowerCase()),
      moduleObjId = repoUtils.getObjId(modulePath),
      solutionEnabled = !!moduleObjId;
    } else {
      throw "solution parameter must be a non-empty string.";
    }

    me.logger.info(["check finished: {0} enabled={1};", me.solution, solutionEnabled]);

    return solutionEnabled;
  }

});


/**
 * @member sol.common.ix.functions.CheckSolutionEnabled
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_CheckSolutionEnabled", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "solution");  
  params.wfDiagram = wFDiagram;

  (sol.create("sol.common.ix.functions.CheckSolutionEnabled", params)).process();

  logger.exit("onEnterNode_CheckSolutionEnabled");
}

/**
 * @member sol.common.ix.functions.CheckSolutionEnabled
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_CheckSolutionEnabled", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "solution");  
  params.wfDiagram = wFDiagram;

  (sol.create("sol.common.ix.functions.CheckSolutionEnabled", params)).process();

  logger.exit("onExitNode_CheckSolutionEnabled");
}

/**
 * @member sol.common.ix.functions.CheckSolutionEnabled
 * @method RF_sol_common_function_CheckSolutionEnabled
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_common_function_CheckSolutionEnabled(iXSEContext, args) {
  logger.enter("RF_sol_common_function_CheckSolutionEnabled", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "solution"),
      module = sol.create("sol.common.ix.functions.CheckSolutionEnabled", params);

  logger.exit("RF_sol_common_function_CheckSolutionEnabled");
  return sol.common.ix.RfUtils.stringify({ enabled: module.process() });
}
