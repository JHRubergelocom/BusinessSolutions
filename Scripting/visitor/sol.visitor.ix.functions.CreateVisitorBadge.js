
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.AsUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.visitor.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.functions.CreateVisitorBadge" });

/**
 * Calls a ELOas direct rule to create a visitor badge
 *
 * @author AR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.visitor.ix.functions.CreateVisitorBadge", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg {Object} config
   * Configuration object passed to the elo as action sol.visitor.as.actions.CreateVisitorBadge
   */

  initialize: function (config) {
    var me = this;
    me.config = config;
    me.$super("sol.common.ix.FunctionBase", "initialize", [{}]);
  },

  process: function () {
    var me = this,
        result, resultStr;
    me.config.ruleName = "sol.visitor.as.functions.CreateVisitorBadge";
    result = sol.common.AsUtils.callAs(me.config);
    resultStr = sol.common.JsonUtils.stringifyAll(result);
    return resultStr;
  }
});

/**
 * @member sol.visitor.ix.functions.CreateVisitorBadge
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  logger.enter("onEnterNode_CreateVisitorBadge", { flowId: wfDiagram.id, nodeId: nodeId });
  var config = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),
      module;

  config.objId = String(wfDiagram.objId);
  config.flowId = wfDiagram.id;
  config.nodeId = nodeId;

  module = sol.create("sol.visitor.ix.functions.CreateVisitorBadge", config);
  module.process();
  logger.exit("onEnterNode_CreateVisitorBadge");
}

/**
 * @member sol.visitor.ix.functions.CreateVisitorBadge
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(ci, userId, wfDiagram, nodeId) {
  logger.enter("onExitNode_CreateVisitorBadge", { flowId: wfDiagram.id, nodeId: nodeId });
  var config = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),
      module;

  config.objId = String(wfDiagram.objId);
  config.flowId = wfDiagram.id;
  config.nodeId = nodeId;

  module = sol.create("sol.visitor.ix.functions.CreateVisitorBadge", config);
  module.process();
  logger.exit("onExitNode_CheckForward");
}

/**
 * @member sol.visitor.ix.functions.CreateVisitorBadge
 * @method RF_sol_visitor_function_CreateVisitorBadge
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_visitor_function_CreateVisitorBadge(ec, configAny) {
  logger.enter("RF_sol_visitor_function_CreateVisitorBadge", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny),
      module;

  module = sol.create("sol.visitor.ix.functions.CreateVisitorBadge", config);
  logger.exit("RF_sol_visitor_function_CreateVisitorBadge");
  return module.process();
}
