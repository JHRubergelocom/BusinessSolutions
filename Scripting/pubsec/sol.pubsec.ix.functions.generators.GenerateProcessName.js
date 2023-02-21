//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.functions.GenerateIdentifier.js
//@include lib_sol.pubsec.ix.ProcessUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.pubsec.ix.functions.generators.GenerateProcessName" });

/**
 * Generates a name for a process by template
 */
sol.define("sol.pubsec.ix.functions.generators.GenerateProcessName", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  /** @cfg {String} objId
   * Object ID
   */

  initialize: function (config) {
    var me = this;
    me.config = sol.pubsec.ix.ProcessUtils.loadConfig();
    me.$super("sol.Base", "initialize", [config]);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    var me = this;
    return me.getTemplateId("Short Description", me.config.fields.processShortDescriptionTemplate, me.config.generators.templateFolderIds.processShortDescription);
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
  setIdentifier: function (name) {
    var me = this;
    me.sord.name = name;
  }
});

/**
 * @member sol.common.ix.functions.generators.GenerateProcessName
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_GenerateProcessName", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.pubsec.ix.functions.generators.GenerateProcessName", params);
  module.process();
  logger.exit("onEnterNode_GenerateProcessName");
}

/**
 * @member sol.common.ix.functions.generators.GenerateProcessName
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_GenerateProcessName", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.pubsec.ix.functions.generators.GenerateProcessName", params);
  module.process();
  logger.exit("onExitNode_GenerateProcessName");
}

/**
 * @member sol.common.ix.functions.Generators
 * @method RF_sol_pubsec_function_generateProcessName
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_pubsec_function_generateProcessName(iXSEContext, args) {
  logger.enter("RF_sol_pubsec_function_generateProcessName", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.pubsec.ix.functions.generators.GenerateProcessName", params),
      result = module.process();
  logger.exit("RF_sol_pubsec_function_generateProcessName");
  return result;
}
