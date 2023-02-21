
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.dev.ix.ActionUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.functions.GenerateComponent" });
/**
 * Generate Components from templates.
 *
 * Dynamic parts are in [handlebars] (http://handlebarsjs.com/) syntax (see also {@link sol.common.Template})
 * and have access to the sord object in form of a {@link sol.common.ObjectFormatter.TemplateSord TemplateSord}.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute('RF_sol_dev_function_GenerateComponent', {
 *       objId: "4711"
 *     });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  handlebars
 * @requires  sol.common.SordUtils
 * @requires  sol.common.Map
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.ObjectFormatter
 * @requires  sol.common.Template
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.dev.ix.functions.GenerateComponent", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */
  objId: undefined,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Moves the element to a new location.
   */
  process: function () {
    var me = this,
        tempId;

    if (!me.objId) {
      throw "sol.dev.ix.functions.GenerateComponent(): Object Id must not be empty";
    }
    me.config = sol.dev.ix.ActionUtils.loadConfigDevInternal();
    if (!sol.dev.ix.ActionUtils.existPathFullNameSpace(me.objId)) {
      return;
    }
    sol.dev.ix.ActionUtils.setLogger(me.logger);
    sol.dev.ix.ActionUtils.setObjId(me.objId);
    sol.dev.ix.ActionUtils.processComponent();

    sol.dev.ix.ActionUtils.moveSord(me.objId, "0");
    me.logger.info(["generate component sord (objId={0}, name={1}): {2} -> {3}", me.objId]);

    tempId = sol.common.RepoUtils.preparePath(me.config.tempComponentPath);
    sol.dev.ix.ActionUtils.moveSord(tempId, me.objId);
  }
});

/**
 * @member sol.dev.ix.functions.GenerateComponent
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_GenerateComponent", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.dev.ix.functions.GenerateComponent", params);

  module.process();

  logger.exit("onEnterNode_GenerateComponent");
}


/**
 * @member sol.dev.ix.functions.GenerateComponent
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_GenerateComponent", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.dev.ix.functions.GenerateComponent", params);

  module.process();

  logger.exit("onExitNode_GenerateComponent");
}


/**
 * @member sol.dev.ix.functions.GenerateComponent
 * @method RF_sol_dev_function_GenerateComponent
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_dev_function_GenerateComponent(iXSEContext, args) {
  logger.enter("RF_sol_dev_function_GenerateComponent", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.dev.ix.functions.GenerateComponent", params);

  module.process();

  logger.exit("RF_sol_dev_function_GenerateComponent");
}

