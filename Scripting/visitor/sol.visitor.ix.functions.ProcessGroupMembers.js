
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.visitor.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.functions.ProcessGroupMembers" });

/**
 * Processes the group members
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  handlebars
 * @requires  sol.common.SordUtils
 * @requires  sol.common.AclUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.AsyncUtils
 * @requires  sol.common.Template
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 * @requires  sol.visitor.Utils
 *
 */
sol.define("sol.visitor.ix.functions.ProcessGroupMembers", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["visitorGroupObjId", "memberWorkflow"],

  /**
   * @cfg {String} objId (required)
   */
  visitorGroupObjId: undefined,

  workflowTplId: undefined,

  memberMark: undefined,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.visitorConfig = sol.visitor.Utils.loadConfig();
  },

  /**
   * Processes the group members
   */
  process: function () {
    var me = this,
        visitorGroupMemberSords, i, visitorGroupMemberSord, wfName, startWorkflow, keyValues, allMembersProcessed,
        status;

    visitorGroupMemberSords = sol.common.RepoUtils.findChildren(me.visitorGroupObjId);

    for (i = 0; i < visitorGroupMemberSords.length; i++) {
      visitorGroupMemberSord = visitorGroupMemberSords[i];

      startWorkflow = true;

      if (me.memberMark) {
        startWorkflow = sol.common.SordUtils.getValue(visitorGroupMemberSord, me.memberMark);
        me.memberMark.value = "";
        keyValues = sol.common.SordUtils.updateSord(visitorGroupMemberSord, [me.memberMark]);
        if (keyValues) {
          ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, visitorGroupMemberSord.id, visitorGroupMemberSord.id, keyValues, LockC.NO);
        }
      }

      wfName = me.memberWorkflow;

      if (startWorkflow) {
        ixConnect.ix().startWorkFlow(me.memberWorkflow, wfName, visitorGroupMemberSord.id);
      } else {
        allMembersProcessed = false;
      }
    }

    if (me.groupWorkflow) {
      allMembersProcessed = true;

      visitorGroupMemberSords = sol.common.RepoUtils.findChildren(me.visitorGroupObjId);

      for (i = 0; i < visitorGroupMemberSords.length; i++) {
        visitorGroupMemberSord = visitorGroupMemberSords[i];

        status = sol.common.SordUtils.getObjKeyValue(visitorGroupMemberSord, "VISITOR_STATUS") + "";
        if (status.indexOf(me.memberStatus) != 0) {
          allMembersProcessed = false;
          break;
        }
      }

      if (allMembersProcessed) {
        wfName = me.groupWorkflow;
        ixConnect.ix().startWorkFlow(me.groupWorkflow, wfName, me.visitorGroupObjId);
      }
    }
  }
});

/**
 * @member sol.visitor.ix.functions.ProcessGroupMembers
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_ProcessGroupMembers", { flowId: wfDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.visitorGroupObjId = wfDiagram.objId;
  module = sol.create("sol.visitor.ix.functions.ProcessGroupMembers", params);
  module.process();

  logger.exit("onEnterNode_ProcessGroupMembers");
}


/**
 * @member sol.visitor.ix.functions.ProcessGroupMembers
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_ProcessGroupMembers", { flowId: wfDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.visitorGroupObjId = wfDiagram.objId;
  module = sol.create("sol.visitor.ix.functions.ProcessGroupMembers", params);
  module.process();

  logger.exit("onExitNode_ProcessGroupMembers");
}
