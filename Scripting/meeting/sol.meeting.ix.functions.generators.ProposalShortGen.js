
//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.functions.GenerateIdentifier.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.generators.ProposalShortGen" });

/**
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * Generates a short description for a document
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.ix.functions.GenerateIdentifier
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.meeting.ix.functions.generators.ProposalShortGen", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  /**
   * @cfg {String} objId (required)
   * Object ID
   */

  mixins: ["sol.meeting.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    templateName: { config: "meeting", prop: "entities.proposals.generators.proposalshortdescription.generatorConfig.templateName", template: true },
    templateFolder: { config: "meeting", prop: "entities.proposals.generators.proposalshortdescription.generatorConfig.templateFolder", template: true }
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    var me = this;
    return me.getObjIdFromRelativePath("Proposal short description", me.templateName, me.templateFolder);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifier
   */
  getIdentifier: function () {
    var me = this;
    return me.sord.name;
  },
  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#setIdentifier
   */
  setIdentifier: function (shortDescription) {
    var me = this;
    me.sord.name = shortDescription.trim();
  }
});

/**
 * @member sol.common.ix.functions.generators.ProposalsShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(client, userId, diagram, nodeId) {
  logger.enter("onEnterNode_ProposalShortDesc", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
      generator;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.generators.ProposalsShortDesc", params);

  generator.process();

  logger.exit("onEnterNode_ProposalShortDesc");
}

/**
 * @member sol.common.ix.functions.generators.ProposalsShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_MeetingItemShortDesc", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      generator;

  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  generator = sol.create("sol.meeting.ix.functions.generators.ProposalShortGen", params);

  generator.process();

  logger.exit("onExitNode_MeetingItemShortDesc");
}

/**
 * @member sol.common.ix.functions.Generators
 * @method RF_sol_meeting_function_generateProposalShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_generateProposalShortDesc(iXSEContext, args) {
  logger.enter("RF_sol_meeting_function_generateProposalShortDesc", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      generator = sol.create("sol.meeting.ix.functions.generators.ProposalShortGen", params),
      result;

  result = generator.process();

  logger.exit("RF_sol_meeting_function_generateProposalShortDesc");
  return result;
}



