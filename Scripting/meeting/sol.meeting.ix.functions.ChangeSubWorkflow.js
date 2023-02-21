

importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.FunctionBase.js


var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.ChangeSubWorkflow" }); // eslint-disable-line one-var


/**
 * Change a subworkflow node in a wfDiagram.
 *
 * The script must be entered as start or end node at the subworkflow node itself.
 *
 * Call this function in a standalone node is currently not supported!
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.WfUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.StringUtilss
 */
sol.define("sol.meeting.ix.functions.ChangeSubWorkflow", {
  extend: "sol.common.ix.FunctionBase",
  requiredConfig: ["objId"],
  mixins: [
    "sol.common.mixins.Inject"
  ],

  inject: {
    sord: { sordIdFromProp: "objId", optional: false }
  },

  process: function () {
    var me = this, node;

    // in workflow mode we dont need checkout workflow diagramm itself
    if (!me.wfDiagram && me.flowId) {
      me.wfDiagram = sol.common.WfUtils.getWorkflow(me.flowId);
    }

    if (me.currentNodeId) {
      // we can get current node only when currentNodeId is passed
      node = sol.common.WfUtils.getNode(me.wfDiagram, me.currentNodeId);

      if (sol.common.WfUtils.isSubworkflowNode(node)) {
        me.logger.info(["current node `{0}` is a subworkflow", me.currentNodeId]);
        node.subTemplateId = me.getWorkflowTemplateId(
          me.getWorkflowTemplateNameBySord()
        );
      } else {
        throw Error(me.currentNodeId + " is not from type `WFNodeC.TYPE_CALL_SUB_WORKFLOW`. It is not possible to set subworklow template");
      }

    } else {
      throw Error("Function is currently not supported, when `currentNodeId` is not passed to the function");
    }
  },

  getWorkflowTemplateNameBySord: function () {
    var me = this,
      templateName = sol.common.ObjectUtils.getProp(me.sord, "objKeys.STANDARD_WORKFLOW");

    if (sol.common.StringUtils.isEmpty(templateName)) {
      throw Error("no workflow is passed in GRP `STANDARD_WORKFLOW`" + JSON.stringify(me.sord));
    }

    return templateName;
  },

  getWorkflowTemplateId: function (templateName) {
    var wfId;
    if (sol.common.StringUtils.isEmpty(templateName)) {
      throw Error("Could not retrieve workflow templateId because templateName is empty");
    }

    // checks if client has passed a templateId directly
    if (sol.common.StringUtils.isNumeric(templateName)) {
      wfId = templateName;
    } else {
      wfId = sol.common.WfUtils.getWorkflowTemplateId(templateName);
    }

    return wfId;
  }
});

/**
 * @member sol.meeting.ix.functions.ChangeSubWorkflow
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
 function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_ChangeSubWorkflow", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.wfDiagram = wfDiagram;
  params.currentNodeId = nodeId;
  module = sol.create("sol.meeting.ix.functions.ChangeSubWorkflow", params);

  module.process();

  logger.exit("onEnterNode_ChangeSubWorkflow");
}

/**
 * @member sol.meeting.ix.functions.ChangeSubWorkflowTemplate
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_ChangeSubWorkflow", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.wfDiagram = wfDiagram;
  params.currentNodeId = nodeId;
  module = sol.create("sol.meeting.ix.functions.ChangeSubWorkflow", params);

  module.process();

  logger.exit("onExitNode_ChangeSubWorkflow");
}
