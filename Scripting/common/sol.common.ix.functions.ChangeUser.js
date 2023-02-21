
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_moment.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.DynAdHocFlowUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.ChangeUser" });

/**
 * Changes the user of a workflow node.
 *
 * The user will be read from an index field (`fromIndex`), a map field (`fromMap`) or from a workflow map field (`fromWfMap`).
 * If more then one was defined, the priority is `fromIndex` -> `fromMap` -> `fromWfMap`.
 * The same rule applies for `defaultFromIndex` -> `defaultFromMap`. The defaultFrom-properties can be used to read a fallback user
 * from a field, if the user defined in a fromIndex-field was not valid.
 * If no user was found, the default user will be used.
 *
 * The WF-Map Field `CHANGEUSER_CHANGEDUSERBY` is filled depending on which source was used for setting the user if logFallbackMode is true.
 * "FROMFIELD"     -> User defined in a configured `from*-property` was used
 * "DEFAULTFIELD"  -> Fallback-user defined in a configured `defaultFrom*-property` was used
 * "SUPERVISOR"    -> `supervisor-property` was used
 * "DEFAULT"       -> `default-property` was used
 * "ADMINISTRATOR" -> Administrator was used because none of the other users was valid.
 * This can be especially useful, if you wish to inform a workflow-form user that he/she only received the form because of a fallback
 *
 * The node can be specified by the nodes ID or name.
 * If booth are defined, the ID will be used.
 * If `changeCurrentNode` is true, the node with the currentNodeId will be altered.
 * If neither `nodeId`, nor `nodeName` is specified, the script tries to alter all direct successor person nodes.
 *
 * # As workflow node
 *
 * - `ObjId` is set based on the element that the workflow is attached to.
 * - `CurrentNodeId` is set based on the workflow node which executes the script.
 *
 * Following configuration should be applied to the comments field.
 *
 *     {
 *       "defaultUser": "ELO Service",
 *       "nodeId": 7,
 *       "fromIndex": "OWNER",
 *       "userRights": { "r": true }
 *     }
 *
 * # Prerequisites
 * This function modul can only be used in workflow scripts.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.SordUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.WfMap
 * @requires  sol.common.MapTable
 * @requires  sol.common.ix.FunctionBase
 * @requires  sol.common.ix.DynAdHocFlowUtils
 */
sol.define("sol.common.ix.functions.ChangeUser", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["wFDiagram", "currentNodeId", "defaultUser"],

  /**
   * @cfg {de.elo.ix.client.WFDiagram} wFDiagram (required)
   * The WFDiagram to which the changes should me applied to
   */
  wFDiagram: undefined,

  /**
   * @cfg {Number} currentNodeId (required)
   * The ID of the current node.
   * It is used to find the successing person nodes if no ID or name is defined, or to change the user of the node itself, if changeCurrentNode is true
   */
  currentNodeId: undefined,

  /**
   * @cfg {String} defaultUser (required)
   * The user that should be set if none is specified/found
   */
  defaultUser: undefined,

  /**
   * @cfg {String} nodeId
   * Find node to change by node.id
   */
  nodeId: undefined,

  /**
   * @cfg {String} nodeName
   * Find node to change by node.name
   */
  nodeName: undefined,

  /**
   * @cfg {String} fromIndex
   * Read user from a group field
   */
  fromIndex: undefined,

  /**
   * @cfg {String} fromMap
   * Read user from a map field
   */
  fromMap: undefined,

  /**
   * @cfg {String} fromWfMap
   * Read user from a workflow map field
   */
  fromWfMap: undefined,

  /**
   * @cfg {String} fromWfMapTable
   * Read user from workflow map table
   */
  fromWfMapTable: undefined,

  /**
   * @cfg {String} defaultFromIndex
   * Read default user from a group field
   */
  defaultFromIndex: undefined,

  /**
   * @cfg {String} defaultFromMap
   * Read default user from a map field
   */
  defaultFromMap: undefined,

  /**
   * @cfg {String} defaultFromWfMap
   * Read default user from a workflow map field
   */
  defaultFromWfMap: undefined,

  /**
   * @cfg {String} defaultFromWfMapTable
   * Read default user from workflow map table
   */
  defaultFromWfMapTable: undefined,

  /**
   * @cfg {String} [previousUserWfMapFieldName=PREVIOUS_USER]
   * Name of the previous user workflow map field
   */

  /**
   * @cfg {Boolean} [changeCurrentNode=false]
   * if true, the user of the current node will be changed, regardless if an ID or name is defined;
   * of course this will only work on nodes with type = WFNodeC.TYPE_PERSONNODE
   */
  changeCurrentNode: false,

  /**
   * @cfg {Integer} [skipNonUserNodes=undefined]
   * if set to a value > 0, x nodes will be skipped in search for (a) user node(s)
   * this is useful, if you can't use ChangeUser directly before a user-node but have to put some
   * other command e.g. ChangeRights inbetween.
   * Attention: This does not traverse multiple routes.
   */
  skipNonUserNodes: undefined,

  /**
   * @cfg {Boolean} [logFallbackMode=false]
   * Logs the user change fallback mode to the WF-Map Field `CHANGEUSER_CHANGEDUSERBY`
   */
  logFallbackMode: false,

  /**
   * @cfg {Object}
   * Rights that will be added for the node user to the workflow object and it's children
   *
   * Example for read access:
   *
   *     { r: true }
   */
  userRights: undefined,

  /**
   * @cfg {Boolean} [supervisor=false]
   * Sets the supervisor of the given user as node user
   */
  supervisor: false,

  /**
   * @cfg {Number} [userDelayDays=0]
   * The person node might be displayed to the user delayed by this number of days.
   */

  /**
   * @cfg {Object[]} nodeEscalations Node escalations
   * @cfg {Object} nodeEscalations.user Node escalation user
   * @cfg {String} nodeEscalations.user.value Node escalation user name
   * @cfg {Boolean} [nodeEscalations.user.supervisor=false] Escalate to the users supervisor
   * @cfg {Number} nodeEscalations.timeLimitMinutes Node escalation minutes
   *
   * If no user has been set, the new node user is used.
   *
   * Example:
   *     {
   *       "fromWfMapTable": "USER",
   *       "defaultUser": "Administrator",
   *       "nodeEscalations": [{
   *         "user": {
   *           "supervisor": true
   *         },
   *         "timeLimitMinutes": 1440
   *       }]
   *     }
   */
  nodeEscalations: undefined,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  getUserFromField: function (fromIndex, fromMap, fromWfMap, fromWfMapTable) {
    var me = this, sord, user, mapItems;
    if (fromIndex) {
      sord = ixConnect.ix().checkoutSord(me.wFDiagram.objId, EditInfoC.mbSord, LockC.NO).sord;
      user = sol.common.SordUtils.getObjKeyValue(sord, fromIndex);
    } else if (fromMap) {
      mapItems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, me.wFDiagram.objId, [fromMap], LockC.NO).items;
      if (mapItems && mapItems.length > 0) {
        user = mapItems[0].value;
      }
    } else if (fromWfMap) {
      mapItems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, me.wFDiagram.id, [fromWfMap], LockC.NO).items;
      if (mapItems && mapItems.length > 0) {
        user = mapItems[0].value;
        // add removing the first item, to enable 'lists' of users, where each call of this function uses the first from the list and disposes it
      }
    } else if (fromWfMapTable) {
      user = sol.common.ix.DynAdHocFlowUtils.shiftUser(me.wFDiagram.id, me.wFDiagram.objId, {
        userNameKey: fromWfMapTable,
        previousUserNameKey: me.previousUserWfMapFieldName,
        currentUserKey: me.currentUserKey
      });
    }

    return user;
  },

  findNextUserNodes: function (wf, cur, max) {
    var result = [], nodes, type = WFNodeC.TYPE_PERSONNODE;

    do {
      nodes = sol.common.WfUtils.getSuccessorNodes(wf, cur);
    }
    while (
      max-- && !Array.isArray( // while cur is a nodeId and not an array
        cur = (
          (nodes.length === 1 && (sol.common.WfUtils.getSuccessorNodes(wf, cur, type).length === 0)) // if the found node is a single node but not a user node
            ? nodes[0].id // set cur to successor node id
            : result = sol.common.WfUtils.getSuccessorNodes(wf, cur, type) // set nodes (& end the loop)
        )
      )
    );

    return result;
  },

  /**
   * Change the node user.
   */
  process: function () {
    var me = this,
        user, userNodes, i, node, oldUser, newUser, userExists, changedUserMode = "", wfMap, maxSkipCount,
        userDelayDateIso;

    if (me.changeCurrentNode) {
      userNodes = [sol.common.WfUtils.getNode(me.wFDiagram, me.currentNodeId)];
    } else if (me.nodeId) {
      userNodes = [sol.common.WfUtils.getNode(me.wFDiagram, me.nodeId)];
    } else if (me.nodeName) {
      userNodes = [sol.common.WfUtils.getNodeByName(me.wFDiagram, me.nodeName)];
      if (!userNodes || (userNodes.length == 0) || !userNodes[0]) {
        throw "Node '" + me.nodeName + "' not found";
      }
    } else if (me.skipNonUserNodes) {
      maxSkipCount = (+me.skipNonUserNodes);
      if (maxSkipCount >= 0) {
        userNodes = me.findNextUserNodes(me.wFDiagram, me.currentNodeId, maxSkipCount);
      }
    } else {
      userNodes = sol.common.WfUtils.getSuccessorNodes(me.wFDiagram, me.currentNodeId, WFNodeC.TYPE_PERSONNODE);
    }

    user = me.getUserFromField(me.fromIndex, me.fromMap, me.fromWfMap, me.fromWfMapTable);
    if (sol.common.UserUtils.userExists(user)) {
      changedUserMode = "FROMFIELD";
    } else {
      user = me.getUserFromField(me.defaultFromIndex, me.defaultFromMap, me.defaultFromWfMap, me.defaultFromWfMapTable);
      if (sol.common.UserUtils.userExists(user)) {
        changedUserMode = "DEFAULTFIELD";
      } else {
        user = undefined;
      }
    }

    if (me.supervisor && user) {
      user = sol.common.UserUtils.getSupervisor(user);
      if (sol.common.UserUtils.userExists(user)) {
        changedUserMode = "SUPERVISOR";
      } else {
        user = undefined;
      }
    }

    if (!user) {
      user = me.defaultUser;
      if (sol.common.UserUtils.userExists(user)) {
        changedUserMode = "DEFAULT";
      } else {
        me.logger.warn(["User/Group '{0}' defined in defaultUser-property is not valid!", me.defaultUser]);
      }
    }

    if (userNodes.length == 0) {
      throw "There aren't any user nodes to change the node user: currentNodeId=" + me.currentNodeId;
    }

    for (i = 0; i < userNodes.length; i++) {

      node = userNodes[i];

      oldUser = node.userName;
      newUser = user;

      userExists = sol.common.UserUtils.userExists(user);

      if (!userExists) {
        newUser = 0;
        changedUserMode = "ADMINISTRATOR";
      }

      sol.common.WfUtils.changeNodeUser(node, newUser, { changeDesignDepartment: true });

      sol.common.WfUtils.setNodeEscalations(node, me.nodeEscalations, newUser);

      if (me.userDelayDays) {
        userDelayDateIso = sol.common.SordUtils.nowIsoForConnection(ixConnect, {
          add: { days: me.userDelayDays }
        });
        node.userDelayDateIso = userDelayDateIso;
      }

      if (me.userRights && userExists) {
        sol.common.AclUtils.changeRightsInBackground(me.wFDiagram.objId, { mode: "ADD", users: [user], rights: me.userRights });
      }

      if (me.logFallbackMode) {
        wfMap = sol.create("sol.common.WfMap", { flowId: me.wFDiagram.id, objId: me.wFDiagram.objId });
        wfMap.read();
        wfMap.setValue("CHANGEUSER_CHANGEDUSERBY", changedUserMode);
        wfMap.write();
      }
      me.logger.info(["changed NodeUser from '{0}' to '{1}' using mode '{2}'", oldUser, newUser, changedUserMode]);
    }
  }
});


/**
 * @member sol.common.ix.functions.ChangeUser
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_ChangeUser", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "defaultUser");
  params.wFDiagram = wFDiagram;
  params.currentNodeId = nodeId;
  params.clInfo = clInfo;

  module = sol.create("sol.common.ix.functions.ChangeUser", params);
  module.process();

  logger.exit("onEnterNode_ChangeUser");
}


/**
 * @member sol.common.ix.functions.ChangeUser
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_ChangeUser", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "defaultUser");
  params.wFDiagram = wFDiagram;
  params.currentNodeId = nodeId;
  params.clInfo = clInfo;

  module = sol.create("sol.common.ix.functions.ChangeUser", params);
  module.process();

  logger.exit("onExitNode_ChangeUser");
}
