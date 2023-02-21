
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
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js

var logger = sol.create("sol.Logger", { scope: "sol.hr.ix.functions.generators.GenerateFileShortDesc" });

/**
 * @author ESt, ELO Digital Office GmbH
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
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.hr.ix.functions.generators.GenerateFileShortDesc", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  /** @cfg {String} objId (required)
   * Object ID
   */

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],
  
  inject: {
    templateField: { config: "hr", prop: "entities.file.functions.generatefileshortdescription.generatorConfig.generatorTemplateField", template: true }, // ""
    templateFolder: { config: "hr", prop: "entities.file.functions.generatefileshortdescription.generatorConfig.templatesFolder", template: true } // ""
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    var me = this;
    return me.getTemplateId("Personnel file short description", me.templateField, me.templateFolder);
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
 * @member sol.common.ix.functions.generators.GenerateFileReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_GenerateFileReference", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      genProc;

  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  genProc = sol.create("sol.hr.ix.functions.generators.GenerateFileShortDesc", params);

  genProc.process();

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
      genProc;

  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  genProc = sol.create("sol.hr.ix.functions.generators.GenerateFileShortDesc", params);

  genProc.process();

  logger.exit("onExitNode_GenerateFileReference");
}

/**
 * @member sol.common.ix.functions.Generators
 * @method RF_sol_common_function_generateFileShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_hr_function_generateFileShortDesc(iXSEContext, args) {
  logger.enter("RF_sol_common_function_generateFileReference", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      genProc = sol.create("sol.hr.ix.functions.generators.GenerateFileShortDesc", params),
      result;
  result = genProc.process();
  logger.exit("RF_sol_common_function_generateFileShortDesc");
  return result;
}

