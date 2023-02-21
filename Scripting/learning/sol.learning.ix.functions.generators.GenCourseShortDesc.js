
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
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

var logger = sol.create("sol.Logger", { scope: "sol.learning.ix.functions.generators.GenCourseShortDesc" });

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
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.functions.generators.GenCourseShortDesc", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  /** @cfg {String} objId (required)
   * Object ID
   */

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    templateField: { config: "learning", prop: "entities.course.functions.generatecourseshortdescription.generatorConfig.generatorTemplateField", template: true }, // ""
    templateFolder: { config: "learning", prop: "entities.course.functions.generatecourseshortdescription.generatorConfig.templatesFolder", template: true } // ""
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    var me = this;
    return me.getTemplateId("Course short description", me.templateField, me.templateFolder);
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
function onEnterNode(_clInfo, _userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_GenerateFileReference", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      genProc;

  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  genProc = sol.create("sol.learning.ix.functions.generators.GenCourseShortDesc", params);

  genProc.process();

  logger.exit("onEnterNode_GenerateFileReference");
}

/**
 * @member sol.common.ix.functions.generators.GenerateFileReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_GenerateFileReference", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      genProc;

  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  genProc = sol.create("sol.learning.ix.functions.generators.GenCourseShortDesc", params);

  genProc.process();

  logger.exit("onExitNode_GenerateFileReference");
}

/**
 * @member sol.common.ix.functions.Generators
 * @method RF_sol_learning_function_generateCourseShortDesc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_generateCourseShortDesc(iXSEContext, args) {
  logger.enter("RF_sol_common_function_generateCourseReference", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      genProc = sol.create("sol.learning.ix.functions.generators.GenCourseShortDesc", params),
      result;
  result = genProc.process();
  logger.exit("RF_sol_learning_function_generateCourseShortDesc");
  return result;
}

