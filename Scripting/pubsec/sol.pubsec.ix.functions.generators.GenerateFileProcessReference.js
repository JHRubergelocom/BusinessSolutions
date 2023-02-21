
//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.functions.GenerateIdentifier.js
//@include lib_sol.pubsec.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.pubsec.ix.functions.generators.GenerateFileProcessReference" });

/**
 * Generates an ID for a file process by template
 */
sol.define("sol.pubsec.ix.functions.generators.GenerateFileProcessReference", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  /** @cfg {String} objId (required)
   * Object ID
   */

  initialize: function (config) {
    var me = this;
    me.config = sol.pubsec.Utils.loadConfig();
    me.$super("sol.Base", "initialize", [config]);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    var me = this;
    return me.getTemplateId("File process reference", me.config.fileProcess.fileProcessTemplateNameField, me.config.generators.templateFolderIds.fileProcessReference);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifier
   */
  getIdentifier: function () {
    var me = this,
        fileProcessReferenceFieldName = me.config.file.referenceField;
    if (!fileProcessReferenceFieldName) {
      throw "getReference(): File process reference field name must not be empty.";
    }
    return sol.common.SordUtils.getObjKeyValue(me.sord, fileProcessReferenceFieldName);
  },
  
  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#setIdentifier
   */
  setIdentifier: function (fileProcessReference) {
    var me = this,
        fileProcessReferenceFieldName = me.config.fileProcess.referenceField;
    if (!fileProcessReferenceFieldName) {
      throw "setReference(): File process reference field name must not be empty.";
    }
    sol.common.SordUtils.setObjKeyValue(me.sord, fileProcessReferenceFieldName, fileProcessReference);
  }
});

/**
 * @member sol.common.ix.functions.generators.GenerateFileProcessReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_GenerateFileProcessReference", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.pubsec.ix.functions.generators.GenerateFileProcessReference", params);
  module.process();
  logger.exit("onEnterNode_GenerateFileProcessReference");
}

/**
 * @member sol.common.ix.functions.generators.GenerateFileProcessReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_GenerateFileProcessReference", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.pubsec.ix.functions.generators.GenerateFileProcessReference", params);
  module.process();
  logger.exit("onExitNode_GenerateFileProcessReference");
}

/**
 * @member sol.common.ix.functions.Generators
 * @method RF_sol_pubsec_function_GenerateFileProcessReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_pubsec_function_GenerateFileProcessReference(iXSEContext, args) {
  logger.enter("RF_sol_common_function_GenerateFileProcessReference", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.pubsec.ix.functions.generators.GenerateFileProcessReference", params),
      result = module.process();
  logger.exit("RF_sol_common_function_GenerateFileProcessReference");
  return result;
}

