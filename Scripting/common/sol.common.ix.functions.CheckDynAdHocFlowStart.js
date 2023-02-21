
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.DynAdHocFlowUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.CheckDynAdHocFlowStart" });

/**
 * Checks whether a dynamic ad-hoc workflow should be started.
 * It checks if there is an appropriate user entry in the workflow map.
 *
 * This function module can only be used as an end script in a workflow decision node.
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloix
 * @requires  sol.common.WfUtils
 * @requires  sol.common.WfMap
 * @requires  sol.common.MapTable
 * @requires  sol.common.ix.FunctionBase
 * @requires  sol.common.ix.DynAdHocFlowUtils
 *
 */
sol.define("sol.common.ix.functions.CheckDynAdHocFlowStart", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["wfDiagram"],

  /**
   * @cfg {de.elo.ix.client.WFDiagram} wfDiagram (required)
   * The WFDiagram to which the changes should me applied to
   */

  /**
   * @cfg {de.elo.ix.client.String} [cycleStartStatus=CYCLE_START]
   * Workflow status if the cycle should be started
   */

  initialize: function (config) {
    var me = this;
    me.params = config;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Checks the dynacmic ad hoc workflow start
   */
  process: function () {
    var me = this,
        wfStatus = "",
        hasNextUser, hasCurrentUser;

    hasNextUser = sol.common.ix.DynAdHocFlowUtils.hasNextUser(me.wfDiagram.id, me.wfDiagram.objId, me.params);
    hasCurrentUser = sol.common.ix.DynAdHocFlowUtils.hasCurrentUser(me.wfDiagram.id, me.wfDiagram.objId, me.params);

    if (hasNextUser || hasCurrentUser) {
      wfStatus = me.cycleStartStatus || "CYCLE_START";
    }

    sol.common.WfUtils.setWorkflowStatus(me.wfDiagram, wfStatus);
  }
});

/**
 * @member sol.common.ix.functions.CheckDynAdHocFlowStart
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  logger.enter("onExitNode_CheckDynAdHocFlowStart", { flowId: wfDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),
      module, result;

  params.wfDiagram = wfDiagram;
  module = sol.create("sol.common.ix.functions.CheckDynAdHocFlowStart", params);
  result = module.process();

  logger.exit("onExitNode_CheckDynAdHocFlowStart");
  return result;
}

/* ____
 * ___                                      .-~    '.
 * `-._~-.                                  / /  ~@\   )
 *      \  \                               | /  \~\.  `\
 *      ]  |                              /  |  |< ~\(..)
 *     /   !                        _.--~T   \  \<   .,,
 *    /   /                 ____.--~ .    _  /~\ \< /
 *   /   /             .-~~'        /|   /o\ /-~\ \_|
 *  /   /             /     )      |o|  / /|o/_   '--'
 * /   /           .-'(     l__   _j \_/ / /\|~    .
 * /    l          /    \       ~~~|    `/ / / \.__/l_
 * |     \     _.-'      ~-\__     l      /_/~-.___.--~
 * |      ~---~           /   ~~'---\_    __[o,
 * l  .                _.    ___     _>-/~
 * \  \     .      .-~   .-~   ~>--'  /
 *  \  ~---'            /         _.-'
 *   '-.,_____.,_  _.--~\     _.-~
 *               ~~     (   _}
 *                      `. ~(
 *                        )  \   DYNADHOC SAURUS, the
 *                  /,`--'~\--'~\
 *                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 */
