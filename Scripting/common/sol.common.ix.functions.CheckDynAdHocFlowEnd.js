
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.DynAdHocFlowUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.CheckDynAdHocFlowEnd" });

/**
 * Checks wether the dynamic ad-hoc worflow cycle should be existed
 *
 * This function module checks whether there is a next user defined in the workflow map of the given object
 * respectively the workflow status was set to 'CANCELED' or 'REJECTED'.
 * In this case the worklow cycle will be left.
 *
 * The function can only be used as a workflow start script of a cycle end node.
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires  sol.common.WfUtils
 * @requires  sol.common.WfMap
 * @requires  sol.common.MapTable
 * @requires  sol.common.ix.FunctionBase
 * @requires  sol.common.ix.DynAdHocFlowUtils
 *
 */
sol.define("sol.common.ix.functions.CheckDynAdHocFlowEnd", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["wfDiagram"],

  /**
   * @cfg {de.elo.ix.client.WFDiagram} wfDiagram (required)
   * The WFDiagram to which the changes should me applied to
   */

  initialize: function (config) {
    var me = this;
    me.params = config;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  wfStatusCanceledValues: ["CANCEL", "CANCELED", "REJECT", "REJECTED"],

  /**
   * Performs the check whether the dynamic ad-hoc workflow should be left
   * @return {Boolean}
   */
  process: function () {
    var me = this,
        wfStatus,
        result = true;

    wfStatus = sol.common.WfUtils.getWorkflowStatus(me.wfDiagram);

    if (me.wfStatusCanceledValues.indexOf(wfStatus) > -1) {
      return false;
    }

    sol.common.ix.DynAdHocFlowUtils.clearCurrentUser(me.wfDiagram.id, me.wfDiagram.objId, me.params);

    if (!sol.common.ix.DynAdHocFlowUtils.hasNextUser(me.wfDiagram.id, me.wfDiagram.objId, me.params)) {
      return false;
    }

    return result;
  }
});

/**
 * @member sol.common.ix.functions.CheckDynAdHocFlowEnd
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clientInfo, userId, wfDiagram, nodeId) {
  logger.enter("onExitNode_CheckDynAdHocFlowEnd", { flowId: wfDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),
      module, result;

  params.wfDiagram = wfDiagram;
  module = sol.create("sol.common.ix.functions.CheckDynAdHocFlowEnd", params);
  result = module.process();

  logger.exit("onExitNode_CheckDynAdHocFlowEnd");
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
 *                        )  \    DYNADHOC SAURUS, the
 *                  /,`--'~\--'~\
 *                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 */