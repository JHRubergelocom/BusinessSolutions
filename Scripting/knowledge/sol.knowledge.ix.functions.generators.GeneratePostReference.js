
//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.functions.GenerateIdentifier.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.functions.generators.GeneratePostReference" }); // eslint-disable-line one-var

/**
 * Generates an ID for a file by template
 */
sol.define("sol.knowledge.ix.functions.generators.GeneratePostReference", {
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
    return me.getTemplateId("Post reference", me.knowledgeConfig.fields.knowledgePostReferenceGen, me.knowledgeConfig.generators.templateFolderIds.postReference);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifier
   */
  getIdentifier: function () {
    var me = this,
        postReferenceFieldName;

    postReferenceFieldName = me.knowledgeConfig.fields.knowledgePostReference;

    if (!postReferenceFieldName) {
      throw "getReference(): Post reference field name must not be empty.";
    }
    return sol.common.SordUtils.getObjKeyValue(me.sord, postReferenceFieldName);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#setIdentifier
   */
  setIdentifier: function (postReference) {
    var me = this,
        postReferenceFieldName;

    postReferenceFieldName = me.knowledgeConfig.fields.knowledgePostReference;
    if (!postReferenceFieldName) {
      throw "setReference(): Post reference field name must not be empty.";
    }
    sol.common.SordUtils.setObjKeyValue(me.sord, postReferenceFieldName, postReference);
  }
});


/**
 * @member sol.knowledge.ix.functions.generators.GeneratePostReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_GeneratePostReference", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);

  params.objId = wFDiagram.objId;
  module = sol.create("sol.knowledge.ix.functions.generators.GeneratePostReference", params);
  module.process();
  logger.exit("onExitNode_GeneratePostReference");
}


/**
 * @member sol.knowledge.ix.functions.generators.GeneratePostReference
 * @method RF_sol_knowledge_function_generators_GeneratePostReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_knowledge_function_generators_GeneratePostReference(iXSEContext, args) {
  logger.enter("RF_sol_knowledge_function_generators_GeneratePostReference", args);

  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "updateExisting"),
      module = sol.create("sol.knowledge.ix.functions.generators.GeneratePostReference", params);

  module.process();

  logger.exit("RF_sol_knowledge_function_generators_GeneratePostReference");
}

