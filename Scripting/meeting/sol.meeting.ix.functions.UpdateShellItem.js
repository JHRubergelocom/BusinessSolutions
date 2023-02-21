importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.TemplateSordUtils.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.meeting.ix.MeetingItemRepository.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.UpdateShellItem" });

/**
 *
 * @requires sol.common.IxUtils
 * @requires sol.common.Injection
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.TemplateSordUtils
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.meeting.ix.MeetingItemRepository
 */
sol.define("sol.meeting.ix.functions.UpdateShellItem", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],
  
  mixins: [
    "sol.common.mixins.Inject",
    "sol.meeting.mixins.Configuration"
  ],
  
  inject: {
    sord: { sordIdFromProp: "objId", optional: false },
    updateConfig: { config: "meetingItem", prop: "meetingItem.functions.updateShellItem.scriptProperties", template: true },
    itemOutput: { config: "meetingItem", prop: "meetingItem.outputs.itemWithdraw", template: false }
  },

  process: function () {
    var me = this, link, result = {};
    link = me.getLink();

    if (!link) {
      return result;
    }

    if (!sol.common.RepoUtils.isRepoId(link)) {
      throw Error("Withdraw Meeting Item: link is invalid");
    }

    if (sol.common.RepoUtils.isObjId(link)) {
      
      me.shellItem = sol.meeting.ix.MeetingItemRepository.findMeetingItem(link, me.itemOutput, "meeting-item-withdraw");
    
      result.objId = me.getShellItemId();
      result.updated = me.updateShellItem();
      result.deleted = me.isShellItemDeleted(result.objId);

      if (result.deleted === true) {
        return result;
      }

      result.deleted = (me.isItemInAgendaPool(result.objId)) ? me.deleteShellItem(result.objId) : false;
    }
      
    return result;
  },

  getLink: function () {
    var me = this;
    return sol.common.TemplateSordUtils.getObjKey(me.sord, "MEETING_ITEM_LINK");
  },

  getShellItemId: function () {
    var me = this, id;
    id = me.shellItem.get("id");
    if (!id) {
      throw "Missing meeting item id";
    }
    return id;
  },

  updateShellItem: function () {
    var me = this;
    sol.common.IxUtils.execute(me.updateConfig.set.name, me.updateConfig.set.args);
    sol.common.IxUtils.execute(me.updateConfig.color.name, me.updateConfig.color.args);
    return true;
  },

  isShellItemDeleted: function (id) {
    var me = this, deleted;
    deleted = (me.shellItem.get("deleted") === "true");
    if (deleted) {
      me.logger.warn(["Linked meeting item has been deleted= '{0}'", id]);
    }
    return deleted;
  },

  isItemInAgendaPool: function () {
    var me = this, meetingDay;
    meetingDay = me.getShellItemDay();
    if (!meetingDay) {
      throw Error("Field meeting item day should not be empty");
    }
    return (meetingDay == "0");
  },

  getShellItemDay: function () {
    var me = this;
    return me.shellItem.get("dayIndex");
  },

  deleteShellItem: function (id) {
    var me = this;
    try {
      sol.common.IxUtils.execute(me.updateConfig.delete.name, me.updateConfig.delete.args);
      return true;
    } catch (ex) {
      me.logger.warn(["Could not delete sord {0}", id], ex);
      return false;
    }
  }

});


/**
 * @member sol.meeting.ix.functions.UpdateShellItem
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_UpdateShellItem", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;


  module = sol.create("sol.meeting.ix.functions.UpdateShellItem", params);
  module.process();

  logger.exit("onEnterNode_UpdateShellItem");
}


/**
 * @member sol.meeting.ix.functions.UpdateShellItem
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_UpdateShellItem", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;

  module = sol.create("sol.meeting.ix.functions.UpdateShellItem", params);
  module.process();

  logger.exit("onExitNode_UpdateShellItem");
}

/**
 * @member sol.meeting.ix.functions.UpdateShellItem
 * @method RF_sol_meeting_function_UpdateShellItem
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_UpdateShellItem(ec, args) {
  var params, module, result;

  logger.enter("RF_sol_meeting_function_UpdateShellItem", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);

  module = sol.create("sol.meeting.ix.functions.UpdateShellItem", params);
  result = module.process();
  logger.exit("RF_sol_meeting_function_UpdateShellItem");
  return JSON.stringify(result);
}
