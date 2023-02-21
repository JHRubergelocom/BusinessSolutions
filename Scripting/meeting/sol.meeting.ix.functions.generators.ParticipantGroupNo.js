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

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.generators.ParticipantGroupNo" });

/**
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * Generates an ID for a document
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
sol.define("sol.meeting.ix.functions.generators.ParticipantGroupNo", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  /** @cfg {String} objId (required)
   * Object ID
   */

  mixins: ["sol.meeting.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    templateField: { config: "meeting", prop: "entities.participantGroup.generators.participantGroupNo.generatorConfig.generatorTemplateField", template: false },
    templateFolder: { config: "meeting", prop: "entities.participantGroup.generators.participantGroupNo.generatorConfig.templatesFolder", template: false },
    targetField: { config: "meeting", prop: "entities.participantGroup.generators.participantGroupNo.generatorConfig.targetField", template: false }
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    var me = this;
    
    return me.getTemplateId("Participant Group no", me.templateField, me.templateFolder);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifier
   */
  getIdentifier: function () {
    var me = this;
    
    if (!me.targetField) {
      throw "getIdentifier(): ParticipantGroup No. field name must not be empty.";
    }
    
    return sol.common.SordUtils.getObjKeyValue(me.sord, me.targetField);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#setIdentifier
   */
  setIdentifier: function (No) {
    var me = this;
    
    if (!me.targetField) {
      throw "setIdentifier(): ParticipantGroup No. field name must not be empty.";
    }
    
    sol.common.SordUtils.setObjKeyValue(me.sord, me.targetField, No.trim());
  }
});

/**
 * @member sol.common.ix.functions.generators.GenerateFileReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(info, userId, diagram, nodeId) {
  logger.enter("onEnterNode_ParticipantGroupNo", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
      generator;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.generators.ParticipantGroupNo", params);

  generator.process();

  logger.exit("onEnterNode_ParticipantGroupNo");
}

/**
 * @member sol.common.ix.functions.generators.GenerateFileReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(info, userId, diagram, nodeId) {
  logger.enter("onExitNode_ParticipantGroupNo", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
  generator;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.generators.ParticipantGroupNo", params);

  generator.process();

  logger.exit("onExitNode_ParticipantGroupNo");
}

/**
 * @member sol.common.ix.functions.Generators
 * @method RF_sol_meeting_function_generateParticipantGroupNo
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_generateParticipantGroupNo(context, args) {
  logger.enter("RF_sol_common_function_generateMeetingNo", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args, "objId"),
      generator = sol.create("sol.meeting.ix.functions.generators.ParticipantGroupNo", params),
      result;

  result = generator.process();

  logger.exit("RF_sol_meeting_function_generateParticipantGroupNo");
  return result;
}

