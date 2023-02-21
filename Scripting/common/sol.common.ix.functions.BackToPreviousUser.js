
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.DynAdHocFlowUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.BackToPreviousUser" });

/**
 * Send a dynamic ad-hocc workflow back to the previous user
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.2
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
sol.define("sol.common.ix.functions.BackToPreviousUser", {
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


  /**
   * Send a dynamic ad-hocc workflow back to the previous user
   * @return {Boolean}
   */
  process: function () {
    var me = this,
        config;

    config = {
      currentUserKey: me.currentUserKey,
      previousUserKey: me.previousUserKey
    };

    sol.common.ix.DynAdHocFlowUtils.backToPreviousUser(me.wfDiagram.id, me.wfDiagram.objId, config);

    return true;
  }
});

/**
 * @member sol.common.ix.functions.BackToPreviousUser
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  logger.enter("onExitNode_BackToPreviousUser", { flowId: wfDiagram.id, nodeId: nodeId });
  var params, module;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.wfDiagram = wfDiagram;

  module = sol.create("sol.common.ix.functions.BackToPreviousUser", params);
  module.process();

  logger.exit("onExitNode_BackToPreviousUser");
}
