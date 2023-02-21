
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
//@include lib_sol.hrorgchart.mixins.Configuration.js
//@include lib_sol.common.Injection.js

var logger = sol.create("sol.Logger", { scope: "sol.hr.ix.functions.generators.GenerateChartElementShortDesc" });

/**
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 * 
 * Generates a short description for an organizational chart element
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
 * @requires sol.hrorgchart.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.hr.ix.functions.generators.GenerateChartElementShortDesc", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  mixins: ["sol.hrorgchart.mixins.Configuration", "sol.common.mixins.Inject"],
  
  inject: {
    templateField: { config: "hrorgchart", prop: "entities.chartelement.functions.generatechartelementshortdescription.generatorConfig.generatorTemplateField", template: true }, // ""
    templateFolder: { config: "hrorgchart", prop: "entities.chartelement.functions.generatechartelementshortdescription.generatorConfig.templatesFolder", template: true } // ""    
  },

  /** @cfg {String} objId (required)
   * Object ID
   */

  shorthandConfig: [
    { id: "gen", src: "solconfigs.hr_orgchart", prop: "entities.chartelement.functions.generatechartelementshortdescription.generatorConfig" },
    { id: "templateField", src: "cfg.gen", prop: "generatorTemplateField" }, // str
    { id: "templateFolder", src: "cfg.gen", prop: "templatesFolder" }  // str
  ],

  initialize: function (params) {
    var me = this;
    me.$super("sol.Base", "initialize", [params]);
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    var me = this;
    return me.getTemplateId("Chart element short description", me.templateField, me.templateFolder);
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
 * @member sol.common.ix.functions.generators.GenerateChartElementShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_GenerateChartElementShortDesc", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      genProc;

  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  genProc = sol.create("sol.hr.ix.functions.generators.GenerateChartElementShortDesc", params);

  genProc.process();

  logger.exit("onEnterNode_GenerateChartElementShortDesc");
}

/**
 * @member sol.common.ix.functions.generators.GenerateChartElementShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_GenerateChartElementShortDesc", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      genProc;

  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  genProc = sol.create("sol.hr.ix.functions.generators.GenerateChartElementShortDesc", params);

  genProc.process();

  logger.exit("onExitNode_GenerateChartElementShortDesc");
}

/**
 * @member sol.common.ix.functions.Generators
 * @method RF_sol_common_function_generateChartElementShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_hr_function_generateChartElementShortDesc(iXSEContext, args) {
  logger.enter("RF_sol_common_function_generateChartElementShortDesc", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      genProc = sol.create("sol.hr.ix.functions.generators.GenerateChartElementShortDesc", params),
      result;
  result = genProc.process();
  logger.exit("RF_sol_common_function_generateChartElementShortDesc");
  return result;
}

