
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.UserDispatcher" });

/**
 * Decides, which direction the workflow should be dispatched, regarding the configured requirements.
 *
 * Can be used as node exit script. It updates the ELO_WF_STATUS field as configured. The status can be used in a decision node.
 *
 * # As workflow node
 *
 * Following configuration can be applied to the comments field.
 *
 *     {
 *       "wfStatus": { "onSuccess": "IS_IN_GROUP", "onFailure": "NOT_IN_GROUP" },
 *       "requirements": [
 *         { "type": "inGroup", "value": "sol.pubsec.admin.Record" }
 *       ]
 *     }
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 * @requires  sol.common.UserUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.UserDispatcher", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["wfDiagram", "userId", "objId"],

  /**
   * @cfg {de.elo.ix.client.WFDiagram} wfDiagram (required)
   * The workflow which should be checked.
   */

  /**
   * @cfg {String} userId (required)
   * The ID of the user, who should be checked.
   */

  /**
   * @cfg {String} objId (required)
   * ID of the element which should be checked
   */

  /**
   * @cfg {Object} wfStatus
   *
   *     "wfStatus": { "onSuccess": "left", "onFailure": "right" }
   *
   * This object can override the default workflow states which will be set after the check, if ths was used in a workflow node.
   * If the is `undefined`, the function will throw an exception in case the checke fails.
   *
   * - `onSuccess`: set as ELO_WF_STATUS after a successfull check
   * - `onFailure`: set as ELO_WF_STATUS after a check failure
   */

  /**
   * @cfg {Object[]} requirements
   * This is an array with configurations which requirements a user has to fullfill. If empty, the check always succeeds.
   *
   *     "requirements": [
   *        { "type": "inGroup", "value": "sol.pubsec.admin.Record" },
   *        { "type": "inGroup", "value": "sol.pubsec.sysadmin.Record" },
   *        { "type": "hasEffectiveRights", "rights": { "rights": { "d": "true" } } }
   *     ]
   *
   * With this configuration the check would only succeed, if the user is in both groups ('sol.pubsec.admin.Record' and 'sol.pubsec.sysadmin.Record').
   * The value can also be the group ID.
   */

  /**
   * @cfg {Object} nextNodes
   *
   *     "nextNodes": { "onSuccess": ["OK", "Approve"], "onFailure": ["Cancel", "Reject"] }
   *
   *     or
   *
   *     "nextNodes": { "onSuccess": "OK", "onFailure": "Cancel" }
   *
   * This object determines the next nodes to activate in dependence of the workflow status.
   *
   * - `onSuccess`: array of next nodes or string of one next node to activate after a successfull check
   * - `onFailure`: array of next nodes or string of one next node to activate after a check failure
   */

  /**
   * @private
   * @property {String} [DEFAULT_PASSED_STATUS="SUCCESS"] Default workflow status in case of a successful check
   */
  DEFAULT_PASSED_STATUS: "SUCCESS",

  /**
   * @private
   * @property {String} [DEFAULT_FAILED_STATUS="FAILURE"] Default workflow status in case of a check failure
   */
  DEFAULT_FAILED_STATUS: "FAILURE",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Performs the check.
   */
  process: function () {
    var me = this,
        status, nextNodes, i, node, succNodes;

    if (me.checkRequirements()) {
      status = (me.wfStatus && me.wfStatus.onSuccess) ? me.wfStatus.onSuccess : me.DEFAULT_PASSED_STATUS;
      nextNodes = (me.nextNodes && me.nextNodes.onSuccess) ? me.nextNodes.onSuccess : undefined;
    } else {
      status = (me.wfStatus && me.wfStatus.onFailure) ? me.wfStatus.onFailure : me.DEFAULT_FAILED_STATUS;
      nextNodes = (me.nextNodes && me.nextNodes.onFailure) ? me.nextNodes.onFailure : undefined;
    }

    sol.common.WfUtils.setWorkflowStatus(me.wfDiagram, status);
    if (nextNodes) {
      if (sol.common.ObjectUtils.isString(nextNodes)) {
        nextNodes = [nextNodes];
      } else if (!sol.common.ObjectUtils.isArray(nextNodes)) {
        throw "nextNodes has incorrect datatype";
      }
      succNodes = sol.common.WfUtils.getSuccessorNodes(me.wfDiagram, me.nodeId);
      for (i = 0; i < succNodes.length; i++) {
        node = succNodes[i];
        if (nextNodes.indexOf(String(node.name)) < 0) {
          node.allowActivate = false;
        } else {
          node.isNext = 1;
        }
      }
    }
  },

  /**
   * @private
   * Checks, if the configured requirements are meet.
   * @return {Boolean}
   */
  checkRequirements: function () {
    var me = this,
        checkResult = false;

    if (me.requirements && (me.requirements.length > 0)) {
      checkResult = me.requirements.every(function (requirement) {
        return me.checkRequirement(requirement);
      });
    } else {
      checkResult = true;
    }
    return checkResult;
  },

  /**
   * @private
   * Checks an inividual requirement.
   * @param {Object} requirement
   * @return {Boolean}
   */
  checkRequirement: function (requirement) {
    var me = this;
    switch (requirement.type) {
      case "inGroup":
        return sol.common.UserUtils.isInGroup(requirement.value, { userId: me.userId });
      case "hasEffectiveRights":
        return sol.common.AclUtils.hasEffectiveRights(me.objId, { rights: requirement.rights });
      default:
        return false;
    }
  }

});


/**
 * @member sol.common.ix.functions.UserDispatcher
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_UserDispatcher", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.wfDiagram = wFDiagram;
  params.userId = userId;
  params.objId = wFDiagram.objId;
  params.nodeId = nodeId;

  module = sol.create("sol.common.ix.functions.UserDispatcher", params);
  module.process();

  logger.exit("onExitNode_UserDispatcher");
}
