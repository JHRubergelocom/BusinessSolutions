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

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.generators.MeetingItemPoolNo" });

/**
 *
 * Generates an ID for a meeting item pool
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
sol.define("sol.meeting.ix.functions.generators.MeetingItemPoolNo", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  /** @cfg {String} objId (required)
   * Object ID
   */

  mixins: ["sol.meeting.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    templateFolder: { config: "itemPool", prop: "itemPool.generators.no.default.path" },
    generatorFile: { config: "itemPool", prop: "itemPool.generators.no.default.name" },
    targetField: { config: "itemPool", prop: "itemPool.generators.no.default.targetField" }
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    var me = this;
    return me.getObjIdFromRelativePath("Meeting item pool no.", me.generatorFile, me.templateFolder);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifier
   */
  getIdentifier: function () {
    var me = this;

    if (!me.targetField) {
      throw "getIdentifier(): Meeting No. field name must not be empty.";
    }
    return sol.common.SordUtils.getObjKeyValue(me.sord, me.targetField);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#setIdentifier
   */
  setIdentifier: function (No) {
    var me = this;

    if (!me.targetField) {
      throw "setIdentifier(): Meeting No. field name must not be empty.";
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
  logger.enter("onEnterNode_generateMeetingItemPoolNo", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
      generator;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.generators.MeetingItemPoolNo", params);

  generator.process();

  logger.exit("onEnterNode_generateMeetingItemPoolNo");
}

/**
 * @member sol.common.ix.functions.generators.GenerateFileReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(info, userId, diagram, nodeId) {
  logger.enter("onExitNode_generateMeetingItemPoolNo", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
  generator;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.generators.MeetingItemPoolNo", params);

  generator.process();

  logger.exit("onExitNode_generateMeetingItemPoolNo");
}

/**
 * @member sol.common.ix.functions.Generators
 * @method RF_sol_meeting_function_generateMeetingItemPoolNo
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_generateMeetingItemPoolNo(context, args) {
  logger.enter("RF_sol_common_function_generateMeetingItemPoolNo", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args, "objId"),
      generator = sol.create("sol.meeting.ix.functions.generators.MeetingItemPoolNo", params),
      result;

  result = generator.process();

  logger.exit("RF_sol_common_function_generateMeetingItemPoolNo");
  return result;
}

