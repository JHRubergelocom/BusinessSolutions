
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.mixins.Configuration.js


var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.Reference" });

/**
 * Create a reference from source object to referencePaths
 * 
 * # Example as a workflow node
 *  {
 *     "source": "4711",
 *     "referencePaths": ["ARCPATH:/Meeting-Management/"]
 *  }
 * 
 * # Example as a IX function call
 *    sol.common.IxUtils.execute("RF_sol_function_Reference", {
 *      "source": "4711",
 *      "referencePaths": ["ARCPATH:/Meeting-Management/"]
 *   })
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.ObjectUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.meeting.ix.functions.Reference", {
  extend: "sol.common.ix.FunctionBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this,
      params = me.resolveTemplate({
        source: me.source,
        referencePaths: me.referencePaths
      });

    me.executeMove(params);
    return { code: "success", message: "move operation succeeded", data: { objId: me.objId, params: params} };
  },

  executeMove: function (params) {
    var me = this;
    return sol.common.IxUtils.execute("RF_sol_function_Move", {
      objId: params.source || me.objId,
      referencePaths: params.referencePaths
    });
  },

  resolveTemplate: function (source) {
    var me = this;
    return sol.common.TemplateUtils.render(source, { sord: me.getTemplateSord() });
  },

  getTemplateSord: function () {
    var me = this;
    me.sord = sol.common.WfUtils.getTemplateSord(
      ((me.asAdmin && typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect).ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO),
      me.flowId,
      { asAdmin: me.asAdmin || false, formBlobs: me.formBlobs || false }
    ).sord;

    return me.sord;
  }
});

/**
 * @member sol.meeting.ix.functions.Reference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
 function onEnterNode(client, userId, diagram, nodeId) {
  logger.enter("onEnterNode_SetPermission", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
      generator;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.Reference", params);

  generator.process();

  logger.exit("onEnterNode_SetPermission");
}

/**
 * @member sol.meeting.ix.functions.Reference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_Reference", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      generator;

  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  generator = sol.create("sol.meeting.ix.functions.Reference", params);

  generator.process();

  logger.exit("onExitNode_Reference");
}


/**
 * @member sol.meeting.ix.functions.Reference
 * @method RF_sol_learning_function_Reference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_Reference(iXSEContext, args) {
  var rfArgs, fun;
  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "source", "referencePaths");
  fun = sol.create("sol.meeting.ix.functions.Reference", rfArgs);
  return JSON.stringify(fun.process());
}
