
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

var logger = sol.create("sol.Logger", { scope: "sol.contract.ix.functions.generators.GenerateContractShortDesc" });

/**
 * Generates a name for a file by template
 */
sol.define("sol.contract.ix.functions.generators.GenerateContractShortDesc", {
  extend: "sol.common.ix.functions.GenerateIdentifier",
  /** @cfg {String} objId
   * Object ID
   */

  initialize: function (config) {
    var me = this;
    sol.ns("sol.contract");
    sol.contract.Config = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;
    me.$super("sol.Base", "initialize", [config]);
  },
  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    var me = this;
    return me.getTemplateId("Contract short description", sol.contract.Config.fields.contractShortDescGen, sol.contract.Config.generators.templateFolderIds.contractShortDescription);
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
    var me = this,
        prevLength = (shortDescription) ? String(shortDescription).length : 0;
    me.sord.name = me.truncateSordName(shortDescription);
    if (String(me.sord.name).length < prevLength) {
      me.logger.debug("Sord name truncated.");
    }
  }
});

/**
 * @member sol.common.ix.functions.generators.GenerateShortDescription
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_GenerateShortDescription", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.contract.ix.functions.generators.GenerateContractShortDesc", params);

  module.process();

  logger.exit("onEnterNode_GenerateShortDescription");
}

/**
 * @member sol.common.ix.functions.generators.GenerateShortDescription
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_GenerateShortDescription", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.contract.ix.functions.generators.GenerateContractShortDesc", params);

  module.process();

  logger.exit("onExitNode_GenerateShortDescription");
}

/**
 * @member sol.common.ix.functions.Generators
 * @method RF_sol_contract_function_generateContractShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_contract_function_generateContractShortDesc(iXSEContext, args) {
  logger.enter("RF_sol_contract_function_generateContractShortDesc", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.contract.ix.functions.generators.GenerateContractShortDesc", params),
      result;
  result = module.process();
  logger.exit("RF_sol_contract_function_generateContractShortDesc");
  return result;
}
