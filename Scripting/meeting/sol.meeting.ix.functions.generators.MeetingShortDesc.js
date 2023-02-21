
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

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.generators.MeetingShortDesc" });

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
sol.define("sol.meeting.ix.functions.generators.MeetingShortDesc", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  /** 
   * @cfg {String} objId (required)
   * Object ID
   */

  mixins: ["sol.meeting.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    templateField: { config: "meeting", prop: "entities.meeting.generators.meetingshortdescription.generatorConfig.generatorTemplateField", template: true },
    templateFolder: { config: "meeting", prop: "entities.meeting.generators.meetingshortdescription.generatorConfig.templatesFolder", template: true }
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    var me = this;

    return me.getTemplateId("Meeting short description", me.templateField, me.templateFolder);
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
 * @member sol.common.ix.functions.generators.MeetingShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(info, userId, diagram, nodeId) {
  logger.enter("onEnterNode_MeetingShortDesc", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
      generator;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.generators.MeetingShortDesc", params);

  generator.process();

  logger.exit("onEnterNode_MeetingShortDesc");
}

/**
 * @member sol.common.ix.functions.generators.MeetingShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(info, userId, diagram, nodeId) {
  logger.enter("onExitNode_MeetingShortDesc", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
      generator;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.generators.MeetingShortDesc", params);

  generator.process();

  logger.exit("onExitNode_MeetingShortDesc");
}

/**
 * @member sol.common.ix.functions.generators.MeetingShortDesc
 * @method RF_sol_learning_function_generateCourseShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_generateMeetingShortDesc(context, args) {
  logger.enter("RF_sol_common_function_generateMeetingShortDesc", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args, "objId"),
      generator = sol.create("sol.meeting.ix.functions.generators.MeetingShortDesc", params),
      result;

  result = generator.process();

  logger.exit("RF_sol_common_function_generateMeetingShortDesc");
  return result;
}



