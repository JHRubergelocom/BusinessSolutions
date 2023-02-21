
//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.functions.GenerateIdentifier.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.functions.generators.GenerateSpaceReference" }); // eslint-disable-line one-var

/**
 * Generates an ID for a file by template
 */
sol.define("sol.knowledge.ix.functions.generators.GenerateSpaceReference", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  /** @cfg {String} objId (required)
   * Object ID
   */

  initialize: function (params) {
    var me = this;
    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
    me.$super("sol.Base", "initialize", [params]);
    me.applyIdentifier = true;
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    var me = this;
    return me.getTemplateId("Space reference", me.knowledgeConfig.fields.knowledgeSpaceReferenceGen, me.knowledgeConfig.generators.templateFolderIds.spaceReference);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifier
   */
  getIdentifier: function () {
    var me = this,
        spaceReferenceFieldName;

    spaceReferenceFieldName = me.knowledgeConfig.fields.knowledgeSpaceReference;

    if (!spaceReferenceFieldName) {
      throw "getReference(): Space reference field name must not be empty.";
    }
    return sol.common.SordUtils.getObjKeyValue(me.sord, spaceReferenceFieldName);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#setIdentifier
   */
  setIdentifier: function (spaceReference) {
    var me = this,
        spaceReferenceFieldName;

    spaceReferenceFieldName = me.knowledgeConfig.fields.knowledgeSpaceReference;
    if (!spaceReferenceFieldName) {
      throw "setReference(): Space reference field name must not be empty.";
    }
    sol.common.SordUtils.setObjKeyValue(me.sord, spaceReferenceFieldName, spaceReference);
  }
});


/**
 * @member sol.knowledge.ix.functions.generators.GenerateSpaceReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_GenerateSpaceReference", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);

  params.objId = wFDiagram.objId;
  module = sol.create("sol.knowledge.ix.functions.generators.GenerateSpaceReference", params);
  module.process();
  logger.exit("onExitNode_GenerateSpaceReference");
}


/**
 * @member sol.knowledge.ix.functions.generators.GenerateSpaceReference
 * @method RF_sol_knowledge_function_generators_GenerateSpaceReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_knowledge_function_generators_GenerateSpaceReference(iXSEContext, args) {
  logger.enter("RF_sol_knowledge_function_generators_GenerateSpaceReference", args);

  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "updateExisting"),
      module = sol.create("sol.knowledge.ix.functions.generators.GenerateSpaceReference", params);

  module.process();

  logger.exit("RF_sol_knowledge_function_generators_GenerateSpaceReference");
}