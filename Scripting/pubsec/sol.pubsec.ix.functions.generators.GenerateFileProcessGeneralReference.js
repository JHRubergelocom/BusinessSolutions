
//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.functions.GenerateIdentifier.js
//@include lib_sol.pubsec.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.pubsec.ix.functions.generators.GenerateFileProcessGeneralReference" });

/**
 * Generates an ID for a file process by template
 */
sol.define("sol.pubsec.ix.functions.generators.GenerateFileProcessGeneralReference", {
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
    return me.getTemplateId("File process reference", me.config.fileProcess.fileProcessGeneralTemplateNameField, me.config.generators.templateFolderIds.fileProcessGeneralReference);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifier
   */
  getIdentifier: function () {
    var me = this,
        fileProcessGeneralReferenceFieldName = me.config.file.referenceField;
    if (!fileProcessGeneralReferenceFieldName) {
      throw "getReference(): File process reference field name must not be empty.";
    }
    return sol.common.SordUtils.getObjKeyValue(me.sord, fileProcessGeneralReferenceFieldName);
  },
  
  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#setIdentifier
   */
  setIdentifier: function (fileProcessGeneralReference) {
    var me = this,
        fileProcessGeneralReferenceFieldName = me.config.fileProcess.generalReferenceField;
    if (!fileProcessGeneralReferenceFieldName) {
      throw "setReference(): File process reference field name must not be empty.";
    }
    sol.common.SordUtils.setObjKeyValue(me.sord, fileProcessGeneralReferenceFieldName, fileProcessGeneralReference);
  }
});

/**
 * @member sol.common.ix.functions.generators.GenerateFileProcessGeneralReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_GenerateFileProcessGeneralReference", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.pubsec.ix.functions.generators.GenerateFileProcessGeneralReference", params);
  module.process();
  logger.exit("onEnterNode_GenerateFileProcessGeneralReference");
}

/**
 * @member sol.common.ix.functions.generators.GenerateFileProcessGeneralReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_GenerateFileProcessGeneralReference", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.pubsec.ix.functions.generators.GenerateFileProcessGeneralReference", params);
  module.process();
  logger.exit("onExitNode_GenerateFileProcessGeneralReference");
}

/**
 * @member sol.common.ix.functions.Generators
 * @method RF_sol_pubsec_function_GenerateFileProcessGeneralReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_pubsec_function_GenerateFileProcessGeneralReference(iXSEContext, args) {
  logger.enter("RF_sol_common_function_GenerateFileProcessGeneralReference", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.pubsec.ix.functions.generators.GenerateFileProcessGeneralReference", params),
      result = module.process();
  logger.exit("RF_sol_common_function_GenerateFileProcessGeneralReference");
  return result;
}

