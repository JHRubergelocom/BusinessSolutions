
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Roles.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.invoice.ix.functions.ChangeUser" });

/**
 * Change the user of the successor person nodes, using the JSON configuration from `sol.invoice.WorkflowUserRoles.config`.
 * Refer to {@link sol.common.Roles} for more information.
 *
 * This function module can only be used in workflow scripts.
 *
 * # As workflow node
 * ObjId is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 *     {
 *       "defaultUser": "Administrator",
 *       "role": "ACCOUNTING"
 *       "nodeEscalations": [{ "timeLimitMinutes": 1 }]
 *     }
 *
 * Please node that additional configuration is done using `sol.invoice.WorkflowUserRoles.config` regarding to the role (or node name as fallback).
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.common.Config
 * @requires  sol.common.SordUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.Roles
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.invoice.ix.functions.ChangeUser", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["wFDiagram", "currentNodeId", "defaultUser"],

  /** @cfg {de.elo.ix.client.WFDiagram} wFDiagram (required)
   * The WFDiagram to which the changes should me applied to
   */
  wFDiagram: undefined,

  /** @cfg {Number} currentNodeId (required)
   * The ID of the current node.
   * It is used to find the successing person nodes if no ID or name is defined, or to change the user of the node itself, if changeCurrentNode is true
   */
  currentNodeId: undefined,

  /** @cfg {String} defaultUser (required)
   * the user that should be set if none is specified/found
   */
  defaultUser: undefined,

  /** @cfg {String} role (optional)
   * This role tht will be used, to lookup the users from the configuration.
   * If empty the node name will be used.
   */
  role: undefined,

  /** @cfg {Boolean} [changeCurrentNode=false]
   * if true, the user of the current node will be changed;
   * of course this is only supported on nodes with type = WFNodeC.TYPE_PERSONNODE
   */
  changeCurrentNode: false,

  /**
   * @cfg {Array} nodeEscalations
   * Node escalations
   *
   * @cfg {Object} nodeEscalations[].user Node escalation user
   * @cfg {String} nodeEscalations[].user.value Node escalation user name
   * @cfg {Number} nodeEscalations[].timeLimitMinutes Node escalation minutes
   *
   * If no user has been set, the determinated node user is used.
   *
   * Example:
   *     { "timeLimitMinutes": 1 }
   */
  nodeEscalations: undefined,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Change the node user.
   */
  process: function () {
    var me = this,
        wfUtils = sol.common.WfUtils,
        userConfig = sol.create("sol.common.Config", { compose: "/invoice/Configuration/sol.invoice.WorkflowUserRoles.config" }).config.roles,
        sord = ixConnect.ix().checkoutSord(me.wFDiagram.objId, EditInfoC.mbSord, LockC.NO).sord,
        userNodes, role, user, oldUser, text;

    if (me.changeCurrentNode) {
      userNodes = [wfUtils.getNode(me.wFDiagram, me.currentNodeId)];
    } else {
      userNodes = wfUtils.getSuccessorNodes(me.wFDiagram, me.currentNodeId, WFNodeC.TYPE_PERSONNODE);
    }

    userNodes.forEach(function (node) {
      role = me.role || node.name;
      user = sol.common.Roles.getUsers(role, sord, userConfig)[0];

      if (!user) {
        user = me.defaultUser;
      }

      oldUser = node.userName;
      wfUtils.changeNodeUser(node, user, { changeDesignDepartment: true });

      sol.common.WfUtils.setNodeEscalations(node, me.nodeEscalations, user);

      text = me.logger.format(["Changed NodeUser from '{0}' to '{1}'", oldUser, user]);

      me.logger.info(text);
    });
  }

});


/**
 * @member sol.invoice.ix.functions.ChangeUser
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_ChangeUser", { flowId: wFDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "defaultUser");

  params.wFDiagram = wFDiagram;
  params.currentNodeId = nodeId;
  module = sol.create("sol.invoice.ix.functions.ChangeUser", params);

  module.process();

  logger.exit("onEnterNode_ChangeUser");
}


/**
 * @member sol.invoice.ix.functions.ChangeUser
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_ChangeUser", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "defaultUser");

  params.wFDiagram = wFDiagram;
  params.currentNodeId = nodeId;
  module = sol.create("sol.invoice.ix.functions.ChangeUser", params);

  module.process();

  logger.exit("onExitNode_ChangeUser");
}
