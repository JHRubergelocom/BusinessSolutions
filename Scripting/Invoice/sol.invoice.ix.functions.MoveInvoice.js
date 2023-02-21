
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.invoice.ix.functions.ChangeUser" });

/**
 * Moves the invoice to a new location.
 *
 * The path is specified in the `sol.invoice.Config` file in the `paths.indexed` property.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.common.Config
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.IxUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.invoice.ix.functions.MoveInvoice", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Moves the invoice to a new location
   */
  process: function () {
    var me = this,
        config;

    config = sol.create("sol.common.Config", { compose: "/invoice/Configuration/sol.invoice.config" }).config;

    me.rightsConfig = me.rightsConfig || { mode: "SET", inherit: true };

    sol.common.IxUtils.execute("RF_sol_function_Move", {
      objId: me.objId,
      asAdmin: me.asAdmin,
      path: config.paths.indexed.value,
      rightsConfig: me.rightsConfig
    });
  }
});

/**
 * @member sol.invoice.ix.functions.MoveInvoice
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(ci, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_MoveInvoice", { flowId: wfDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;

  module = sol.create("sol.invoice.ix.functions.MoveInvoice", params);
  module.process();

  logger.exit("onEnterNode_MoveInvoice");
}

/**
 * @member sol.invoice.ix.functions.MoveInvoice
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(ci, userId, wfDiagram, nodeId) {
  var params, module;
  logger.enter("onExitNode_MoveInvoice", { flowId: wfDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;

  module = sol.create("sol.invoice.ix.functions.MoveInvoice", params);
  module.process();

  logger.exit("onExitNode_MoveInvoice");
}
