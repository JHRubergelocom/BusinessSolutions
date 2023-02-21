//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.mixins.Configuration.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.RemoveItemAcl" });

/**
 * @requires sol.common.IxUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.Injection
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.meeting.ix.functions.RemoveItemAcl", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String|Number} objId
   * The objId, guid or ARCPATH of the meeting object
   */

  process: function () {
    var me = this, itemFolder;

    itemFolder = me.findItemFolder();
    if (itemFolder) {
      sol.common.IxUtils.execute("RF_sol_function_RemoveAcl", {
        objId: itemFolder.id,
        mapKey: me.mapKey,
        users: me.users,
        recursive: me.recursive,
        removeRead: me.removeRead,
        removeWrite: me.removeWrite,
        removeDelete: me.removeDelete,
        removeEdit: me.removeEdit,
        removeList: me.removeList,
        removePermission: me.removePermission,
        asAdmin: me.asAdmin
      });
    }
  },

  findItemFolder: function () {
    var me = this;
    return sol.common.IxUtils.execute("RF_sol_meeting_function_FindMeetingItemListFolder", {
      objId: me.objId
    });
  }
});

/**
 * @member sol.meeting.ix.functions.RemoveItemAcl
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(client, userId, wfDiagram, nodeId) {
  logger.enter("onEnterNode_RemoveItemAcl", { flowId: wfDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),
      generator;

  params.objId = String(wfDiagram.objId);
  params.flowId = String(wfDiagram.id);

  if (params.asAdmin) {
    sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  }

  generator = sol.create("sol.meeting.ix.functions.RemoveItemAcl", params);

  generator.process();

  logger.exit("onEnterNode_RemoveItemAcl");
}

/**
 * @member sol.meeting.ix.functions.RemoveItemAcl
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  logger.enter("onExitNode_RemoveItemAcl", { flowId: wfDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),
      generator;

  params.objId = String(wfDiagram.objId);
  params.flowId = String(wfDiagram.id);

  if (params.asAdmin) {
    sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  }

  generator = sol.create("sol.meeting.ix.functions.RemoveItemAcl", params);

  generator.process();

  logger.exit("onExitNode_RemoveItemAcl");
}


/**
* @member sol.meeting.ix.functions.RemoveItemAcl
* @method RF_sol_meeting_function_RemoveItemAcl
* @static
* @inheritdoc sol.common.ix.FunctionBase#RF_sol_meeting_function_RemoveItemAcl
*/
function RF_sol_meeting_function_RemoveItemAcl(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"), result;


  if (rfParams.asAdmin) {
    sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfParams);
  }

  result = sol.create("sol.meeting.ix.functions.RemoveItemAcl", rfParams).process();

  return sol.common.JsonUtils.stringifyQuick(result);
}