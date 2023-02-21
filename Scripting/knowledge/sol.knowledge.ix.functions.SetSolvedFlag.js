
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.functions.SetSolvedFlag" }); // eslint-disable-line one-var

/**
 * Marks / unmarks, a post or a replay as solved.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloix
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.knowledge.ix.functions.SetSolvedFlag", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {Boolean} [solved=false] (optional)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Sets / resets the flag.
   */
  process: function () {
    var me = this,
        sord;

    sord = ixConnectAdmin.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

    sol.common.SordUtils.setObjKeyValue(sord, "KNOWLEDGE_SOLVED", (me.solved === true) ? "1" : "0");

    ixConnectAdmin.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
  }

});

/**
 * @member sol.knowledge.ix.functions.SetSolvedFlag
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_SetSolvedFlag", { flowId: wfDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),
  params.objId = wfDiagram.objId;

  module = sol.create("sol.knowledge.ix.functions.SetSolvedFlag", params);
  module.process();

  logger.exit("onExitNode_SetSolvedFlag");
}
