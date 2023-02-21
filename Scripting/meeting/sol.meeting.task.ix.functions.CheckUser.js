importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ConnectionUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.task.ix.functions.CheckUser" });

/**
* Checks if a user stored by name in
* a sord's index field exists, is visible,
* and isn't locked. 
* 
* { keyname: "MEETING_TASK_ASSIGNEE" }
*
* # As workflow node
*
* `ObjId` is set based on the element that the workflow is attached to.
* Following configuration should be applied to the comments field.
* If a workflow is active, its status is set to the user status
*
*     {
*       "keyname": "MEETING_TASK_ASSIGNEE"
*     }
*
* # As an IX function call
*
* In addition to the workflow node configuration the objId must be passed.
*
*     sol.common.IxUtils.execute("RF_sol_meeting_function_Task_CheckUser", {
*       objId: "4711",
*       keyname: "MEETING_TASK_ASSIGNEE"
*     });
*
*
*
* @author ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.JsonUtils
* @requires sol.common.ix.FunctionBase
* @requires sol.common.ix.RepoUtils
* @requires sol.common.SordUtils
* @requires sol.common.UserUtils
* @requires sol.common.IxUtils
* @requires sol.common.WfUtils
* @requires sol.common.ix.RfUtils
*
*/
sol.define("sol.meeting.task.ix.functions.CheckUser", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "keyName"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.status = { isValid: "VALID", isInvalid: "INVALID" };
    me.assignELOTask = me.assignELOTask || false;
  },
  /**
   * Checks if user exists by reading 
   * a value in an index field.
   * Writes Status to WF Status if there is an active WF and
   * the user should receive an ELO Task
   * @returns {Object}
   */
  process: function () {
    var me = this, result = {};
    
    result.userName = me.getUserNameFromField(me.objId, me.keyName);
    result.isValidUser = me.checkUser(result.userName);

    if (me.flowId && me.wfDiagram && me.assignELOTask === true) {
      sol.common.WfUtils.setWorkflowStatus(me.wfDiagram, result.isValidUser);
    }

    return result;
    
  },
  /**
   * Checks if user exists, is visible,
   * and isn't locked.
   * Returns user status
   * @param {String} userName 
   * @returns {String} userStatus 
   */
  checkUser: function (userName) {
    var me = this, searchParams = {}, userNames, userStatus;
    
    if (userName) {
      searchParams.name = userName;
      searchParams.visible = true;
      searchParams.excludeLockedUsers = true;
      searchParams.max = 1;
      userNames = sol.common.UserUtils.getUserNames(searchParams);
    }
    
    userStatus = (userNames && userNames.length === 1) ? me.status.isValid : me.status.isInvalid;
    return userStatus;
  },
  /**
   * Reads String from an Index Field
   * @param {String} objId
   * @param {String} keyName
   * @returns {String}
   */
  getUserNameFromField: function (objId, keyName) {
    var asAdmin = true, connection, sord;
    if (!objId || !keyName) {
      throw Error("ObjId and/or keyname is empty");
    }
    connection = sol.common.IxConnectionUtils.getConnection(asAdmin);
    sord = sol.common.RepoUtils.getSord(objId, { connection: connection, sordZ: new SordZ(SordC.mbObjKeys) });
    
    if (!sol.common.SordUtils.getObjKey(sord, keyName)) {
      throw Error("Missing field");
    }
    
    return sol.common.SordUtils.getObjKeyValue(sord, keyName) || "";
  }
});

/**
 * @member sol.common.ix.functions.CheckUser
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;
  
  logger.enter("onEnterNode_CheckUser", { flowId: wfDiagram.id, nodeId: nodeId });
  
  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.wfDiagram = wfDiagram;
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  
  module = sol.create("sol.meeting.task.ix.functions.CheckUser", params);
  module.process();

  logger.exit("onEnterNode_CheckUser");
}


/**
 * @member sol.common.ix.functions.CheckUser
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_CheckUser", { flowId: wfDiagram.id, nodeId: nodeId });
  
  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.wfDiagram = wfDiagram;
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  
  module = sol.create("sol.meeting.task.ix.functions.CheckUser", params);
  module.process();
  
  logger.exit("onExitNode_CheckUser");
}

/**
* @member sol.meeting.task.ix.functions.CheckUser
* @method RF_sol_meeting_task_function_Task_CheckUser
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_function_Task_CheckUser(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "keyName"),
      userCheck, result;
  
  userCheck = sol.create("sol.meeting.task.ix.functions.CheckUser", rfParams);
  result = userCheck.process();
  return sol.common.JsonUtils.stringifyAll(result);
}