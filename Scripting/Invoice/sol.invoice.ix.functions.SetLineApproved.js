
//@include lib_Class.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.invoice.ix.LineApprovalMixin.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.SetLineApproved" }); // eslint-disable-line one-var

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
sol.define("sol.invoice.ix.functions.SetLineApproved", {
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
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this,
        lineNo, sordMap, approvalId, approverKey,
        approver, approvalIdKey, lineApproverNames;

    if (!me.objId) {
      me.objId = me.wfDiagram.objId;
    }

    me.flowId = me.wfDiagram.id;

    me.approvalConfig = me.loadConfig();

    me.sord = sol.common.RepoUtils.getSord(me.objId);

    sordMap = sol.create("sol.common.SordMap", { objId: me.objId });
    me.sordMapTable = sol.create("sol.common.MapTable", { map: sordMap, columnNames: me.approvalConfig.sordMapTableColumnNames });

    me.wfMap = sol.create("sol.common.WfMap", { flowId: me.flowId, objId: me.objId });
    me.wfMap.read();

    me.setApprovalIds();

    me.sordMapTable.reset();

    while (me.sordMapTable.hasNextRow()) {
      me.sordMapTable.nextRow();
      lineNo = me.sordMapTable.getDisplayIndex();

      approvalIdKey = me.approvalConfig.keyName.approvalId + lineNo;
      approvalId = me.wfMap.getNumValue(approvalIdKey);

      if (approvalId) {

        approverKey = me.approvalConfig.keyName.approver + lineNo;
        approver = me.wfMap.getValue(approverKey);

        if (approver == "?") {
          lineApproverNames = me.findLineApproverNames(lineNo);
          if (lineApproverNames && (lineApproverNames.length > 0)) {
            approver = lineApproverNames[0];
            me.logger.debug(["New line approval: approver={0}"], approver);
            if ((ixConnect.loginResult.user.name != approver) && (!sol.common.UserUtils.isInGroup(approver))) {
              approver = "";
            }
          }
        }

        if (approver) {
          me.wfMap.setValue(approverKey, "");
          me.setLineApproved(me.wfMap, approvalId, approver);
        }
      }
    }
  }
});

/**
 * @member sol.common.ix.functions.SetLineApproved
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_SetLineApproved", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.wfDiagram = wfDiagram;

  module = sol.create("sol.invoice.ix.functions.SetLineApproved", params);

  module.process();

  logger.exit("onExitNode_SetLineApproved");
}

/**
 * @member sol.common.ix.functions.SetLineApproved
 * @method RF_sol_commmon_function_SetLineApproved
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_invoice_function_SetLineApproved(iXSEContext, args) {
  var params, module;

  logger.enter("RF_sol_common_function_SetLineApproved", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
  module = sol.create("sol.invoice.ix.functions.SetLineApproved", params);

  module.process();

  logger.exit("RF_sol_common_function_SetLineApproved");
}

