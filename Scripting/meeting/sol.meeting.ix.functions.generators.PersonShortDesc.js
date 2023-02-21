
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

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.generators.PersonShortDesc" });

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
sol.define("sol.meeting.ix.functions.generators.PersonShortDesc", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  /** 
   * @cfg {String} objId (required)
   * Object ID
   */

  mixins: ["sol.meeting.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    templateField: { config: "meeting", prop: "entities.participant.generators.personshortdescription.generatorConfig.generatorTemplateField", template: true },
    templateFolder: { config: "meeting", prop: "entities.participant.generators.personshortdescription.generatorConfig.templatesFolder", template: true }
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#process
   */
  process: function () {
    var me = this;

    me.$super("sol.common.ix.functions.GenerateIdentifier", "process", []);
    
    return { code: "success", info: "short description generated" };
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    var me = this;
    return me.getTemplateId("Person short description", me.templateField, me.templateFolder);
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
 * @member sol.common.ix.functions.generators.PersonShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(info, userId, diagram, nodeId) {
  logger.enter("onEnterNode_PersonShortDesc", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
      generator;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.generators.PersonShortDesc", params);

  generator.process();

  logger.exit("onEnterNode_PersonShortDesc");
}

/**
 * @member sol.common.ix.functions.generators.PersonShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(info, userId, diagram, nodeId) {
  logger.enter("onExitNode_PersonShortDesc", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
      generator;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.generators.PersonShortDesc", params);

  generator.process();

  logger.exit("onExitNode_PersonShortDesc");
}

/**
 * @member sol.meeting.ix.functions.generators.PersonShortDesc
 * @method RF_sol_meeting_function_generatePersonShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_generatePersonShortDesc(context, args) {
  logger.enter("RF_sol_meeting_function_generatePersonShortDesc", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args, "objId"),
      generator = sol.create("sol.meeting.ix.functions.generators.PersonShortDesc", params),
      result;

  result = generator.process();

  logger.exit("RF_sol_meeting_function_generatePersonShortDesc");
  return JSON.stringify(result); 
}



