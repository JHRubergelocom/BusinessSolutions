
//@include lib_Class.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.invoice.ix.LineApprovalMixin.js
//@include lib_sol.common.ix.DynAdHocFlowUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.SetNextLineApprover" }); // eslint-disable-line one-var

/**
 * Sets the next line approvers
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @requires  sol.common.Config
 * @requires  sol.common.Roles
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.invoice.ix.functions.SetNextLineApprover", {
  extend: "sol.common.ix.FunctionBase",
  mixins: ["sol.invoice.ix.LineApprovalMixin"],

  /**
   * @cfg {String} objId
   * Object ID
   */

  /**
   * @cfg {de.elo.ix.client.WFDiagram} wfDiagram
   * Workflow diagram
   */

  initialize: function (config) {
    var me = this;
    me.approvalConfig = me.loadConfig();
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this;

    if (!me.objId) {
      me.objId = me.wfDiagram.objId;
    }

    if (!me.approvalConfig.sordMapTableColumnNames) {
      return;
    }

    me.flowId = me.wfDiagram.id;

    if (sol.common.ix.DynAdHocFlowUtils.hasNextUser(me.flowId, me.objId)) {
      return;
    }

    me.sord = sol.common.RepoUtils.getSord(me.objId);

    me.buildApprovalData();

    me.markLines();

    me.sordMapTable.write();
    me.wfMap.write();

    if (me.approvalData.firstNextApprover) {
      sol.common.ix.DynAdHocFlowUtils.createDynAdHocFlow(me.flowId, me.objId, [{ name: me.approvalData.firstNextApprover }], { append: true });
    }

    me.logger.debug(["SetNextLineApprover: {0}", JSON.stringify(me.approvalData)]);
  },

  buildApprovalData: function () {
    var me = this,
        sordMap;

    me.approvalData = {};

    sordMap = sol.create("sol.common.SordMap", { objId: me.objId });
    me.sordMapTable = sol.create("sol.common.MapTable", { map: sordMap, columnNames: me.approvalConfig.sordMapTableColumnNames });

    me.wfMap = sol.create("sol.common.WfMap", { flowId: me.flowId, objId: me.objId });
    me.wfMap.read();

    me.setApprovalIds();

    me.buildApproved();
    me.buildApprovers();

    me.findNextApprovers();
    me.findFirstNextApprover();
  },

  buildApproved: function () {
    var me = this,
        i = 0,
        line, approvalId, approvedPrefix, approvedTable, approver, approved;

    while (true) {
      i++;
      line = me.approvalData.lines[me.approvalConfig.keyName.lineNo + i];
      if (!line) {
        return;
      }
      approvalId = line.approvalId;

      approvedPrefix = me.approvalConfig.keyName.approvalId + approvalId + "_" + me.approvalConfig.keyName.approvedSuffix;

      approvedTable = sol.create("sol.common.MapTable", { map: me.wfMap, read: false, columnNames: [approvedPrefix] });

      approved = [];
      while (approvedTable.hasNextRow()) {
        approvedTable.nextRow();
        approver = approvedTable.getValue(approvedPrefix);
        approved.push(approver);
      }

      me.approvalData.approvals[me.approvalConfig.keyName.approvalId + approvalId].approved = approved;
    }
  },

  buildApprovers: function () {
    var me = this,
        lineNo;

    me.sordMapTable.reset();
    while (me.sordMapTable.hasNextRow()) {
      me.sordMapTable.nextRow();
      lineNo = me.sordMapTable.getDisplayIndex();
      me.findLineApproverNames(lineNo);
    }
  },

  findNextApprovers: function () {
    var me = this,
        i = 0,
        line, approvalId, approvers, approved, approval, nextApprover;

    while (true) {
      i++;
      line = me.approvalData.lines[me.approvalConfig.keyName.lineNo + i];
      if (!line) {
        return;
      }
      nextApprover = "";
      approvalId = line.approvalId;
      approval = me.approvalData.approvals[me.approvalConfig.keyName.approvalId + approvalId];
      approvers = approval.approvers || [];
      approved = approval.approved || [];
      if (approvers.length > approved.length) {
        nextApprover = approvers[approved.length];
        me.approvalData.approvals[me.approvalConfig.keyName.approvalId + approvalId].nextApprover = nextApprover;
        me.approvalData.approvals[me.approvalConfig.keyName.approvalId + approvalId].nextApproverPos = approved.length;
      }
    }
  },

  findFirstNextApprover: function () {
    var me = this,
        i = 0,
        approver = "",
        approverPos = Number.MAX_VALUE,
        line, currentLine, currentApprovalId, approvalId, currentApproverPos;

    while (true) {
      i++;
      currentLine = me.approvalData.lines[me.approvalConfig.keyName.lineNo + i];
      if (!currentLine) {
        break;
      }
      currentApprovalId = currentLine.approvalId;
      currentApproverPos = me.approvalData.approvals[me.approvalConfig.keyName.approvalId + currentApprovalId].nextApproverPos;
      if (currentApproverPos < approverPos) {
        line = i;
        approvalId = currentApprovalId;
        approver = me.approvalData.approvals[me.approvalConfig.keyName.approvalId + currentApprovalId].nextApprover;
        approverPos = currentApproverPos;
      }
    }

    if (approver) {
      me.approvalData.firstNextApprover = approver;
      me.logger.info(["Next line approval: line={0}, approvalId={1}, approverPos={2}, approver={3}", line, approvalId, approverPos, approver]);
    }
  },

  markLines: function () {
    var me = this,
        i = 0,
        line, approvalId, approver;

    while (true) {
      i++;
      line = me.approvalData.lines[me.approvalConfig.keyName.lineNo + i];
      if (!line) {
        return "";
      }
      approvalId = line.approvalId;
      approver = me.approvalData.approvals[me.approvalConfig.keyName.approvalId + approvalId].nextApprover;
      if (approver == me.approvalData.firstNextApprover) {
        me.wfMap.setValue(me.approvalConfig.keyName.approver + i, me.approvalData.firstNextApprover);
      }
    }
  }
});

/**
 * @member sol.common.ix.functions.SetNextLineApprover
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_SetNextLineApprovers", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.wfDiagram = wfDiagram;

  module = sol.create("sol.invoice.ix.functions.SetNextLineApprover", params);

  module.process();

  logger.exit("onEnterNode_SetNextLineApprovers");
}

/**
 * @member sol.common.ix.functions.SetNextLineApprover
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_SetNextLineApprover", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.wfDiagram = wfDiagram;

  module = sol.create("sol.invoice.ix.functions.SetNextLineApprover", params);

  module.process();

  logger.exit("onExitNode_SetNextLineApprover");
}

/**
 * @member sol.common.ix.functions.SetNextLineApprover
 * @method RF_sol_commmon_function_SetNextLineApprover
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_invoice_function_SetNextLineApprover(iXSEContext, args) {
  var params, module;

  logger.enter("RF_sol_common_function_SetNextLineApprover", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
  module = sol.create("sol.invoice.ix.functions.SetNextLineApprover", params);

  module.process();

  logger.exit("RF_sol_common_function_SetNextLineApprover");
}
