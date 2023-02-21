
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

var logger = sol.create("sol.Logger", { scope: "sol.contract.ix.functions.generators.GenerateContractNo" });

/**
 * Generates an ID for a file by template
 */
sol.define("sol.contract.ix.functions.generators.GenerateContractNo", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  /** @cfg {String} objId (required)
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
    return me.getTemplateId("Contract no.", sol.contract.Config.fields.contractNoGen, sol.contract.Config.generators.templateFolderIds.contractNo);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifier
   */
  getIdentifier: function () {
    var me = this,
        contractNoFieldName = sol.contract.Config.fields.contractNo;
    if (!contractNoFieldName) {
      throw "getIdentifier(): Contract no. field name must not be empty.";
    }
    return sol.common.SordUtils.getObjKeyValue(me.sord, contractNoFieldName);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#setIdentifier
   */
  setIdentifier: function (contractNo) {
    var me = this,
        contractNoFieldName = sol.contract.Config.fields.contractNo;
    if (!contractNoFieldName) {
      throw "setIdentifier(): Contract no. field name must not be empty.";
    }
    sol.common.SordUtils.setObjKeyValue(me.sord, contractNoFieldName, contractNo);
  }
});

/**
 * @member sol.common.ix.functions.generators.GenerateFileReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_GenerateFileReference", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.contract.ix.functions.generators.GenerateContractNo", params);

  module.process();

  logger.exit("onEnterNode_GenerateFileReference");
}

/**
 * @member sol.common.ix.functions.generators.GenerateFileReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_GenerateFileReference", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.contract.ix.functions.generators.GenerateContractNo", params);

  module.process();

  logger.exit("onExitNode_GenerateFileReference");
}

/**
 * @member sol.common.ix.functions.Generators
 * @method RF_sol_contract_function_generateContractNo
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_contract_function_generateContractNo(iXSEContext, args) {
  logger.enter("RF_sol_common_function_generateFileReference", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.contract.ix.functions.generators.GenerateContractNo", params),
      result;
  result = module.process();
  logger.exit("RF_sol_contract_function_generateContractNo");
  return result;
}

