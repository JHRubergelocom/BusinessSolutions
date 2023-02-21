//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.functions.GenerateIdentifier.js
//@include lib_sol.pubsec.ix.ProcessUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.pubsec.ix.functions.generators.GenerateProcessReference" });

/**
 * Generates an ID for a process by template
 */
sol.define("sol.pubsec.ix.functions.generators.GenerateProcessReference", {
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
    return me.getTemplateId("Process reference", me.config.fields.processReferenceTemplate, me.config.generators.templateFolderIds.processReference);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifier
   */
  getIdentifier: function () {
    var me = this,
        processReferenceFieldName = me.config.fields.processReference;
    if (!processReferenceFieldName) {
      throw "getReference(): Process reference field name must not be empty.";
    }
    return sol.common.SordUtils.getObjKeyValue(me.sord, processReferenceFieldName);
  },
  
  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#setIdentifier
   */
  setIdentifier: function (processReference) {
    var me = this,
        processReferenceFieldName = me.config.fields.processReference;
    if (!processReferenceFieldName) {
      throw "setReference(): Process reference field name must not be empty.";
    }
    sol.common.SordUtils.setObjKeyValue(me.sord, processReferenceFieldName, processReference);
  }
});

/**
 * @member sol.pubsec.ix.functions.generators.GenerateProcessReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_GenerateProcessReference", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.pubsec.ix.functions.generators.GenerateProcessReference", params);
  module.process();
  logger.exit("onEnterNode_GenerateProcessReference");
}

/**
 * @member sol.pubsec.ix.functions.generators.GenerateProcessReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_GenerateProcessReference", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.pubsec.ix.functions.generators.GenerateProcessReference", params);
  module.process();
  logger.exit("onExitNode_GenerateProcessReference");
}

/**
 * @member sol.pubsec.ix.functions.generators.GenerateProcessReference
 * @method RF_sol_common_function_GenerateProcessReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_common_function_GenerateProcessReference(iXSEContext, args) {
  logger.enter("RF_sol_common_function_GenerateProcessReference", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.pubsec.ix.functions.generators.GenerateProcessReference", params),
      result = module.process();
  logger.exit("RF_sol_common_function_GenerateProcessReference");
  return result;
}
