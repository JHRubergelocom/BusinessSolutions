
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.CheckDxEnabled" });

/**
 * Checks if DX is enabled.
 *
 * When called as RF it just throws an exception when DX is not enabled.
 *
 * When used in a workflow script, it updates the ELO_WF_STATUS to either "DX_ENABLED" or "DX_DISABLED" (see {@link #DEFAULT_POSITIVE_STATUS} and {@link #DEFAULT_NEGATIV_STATUS}).
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Template
 * @requires sol.common.RepoUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.connector_dx.ix.functions.CheckDxEnabled", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @private
   * @property {String} [DEFAULT_POSITIVE_STATUS="DX_ENABLED"] Default workflow status in case of a successful check
   */
  DEFAULT_POSITIVE_STATUS: "DX_ENABLED",
  /**
   * @private
   * @property {String} [DEFAULT_NEGATIV_STATUS="DX_DISABLED"] Default workflow status in case of a successful check
   */
  DEFAULT_NEGATIV_STATUS: "DX_DISABLED",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Check, if DX is enabled.
   */
  process: function () {
    var me = this,
        enabled = me.checkDxEnabled(),
        startNode, status;

    if (me.wfDiagram) {
      startNode = sol.common.WfUtils.getNode(me.wfDiagram, 0);
      status = (enabled) ? me.DEFAULT_POSITIVE_STATUS : me.DEFAULT_NEGATIV_STATUS;

      startNode.yesNoCondition = status;
      me.logger.info(["changed ELO_WF_STATUS to '{0}' (flowId={1})", status, me.wfDiagram.id]);
    }

  },

  /**
   * @private
   * Checks if DX is enabled by checking the existence of the connector_dx folder inside the Business solutions folder.
   * @return {Boolean}
   */
  checkDxEnabled: function () {
    var me = this,
        repoUtils = sol.common.RepoUtils,
        dxModulePath = repoUtils.resolveSpecialFolder("{{bsFolderPath}}/connector_dx"),
        dxModuleObjId = repoUtils.getObjId(dxModulePath),
        dxEnabled = !!dxModuleObjId;

    if (!me.wfDiagram && !dxEnabled) {
      throw "DX is not enabled";
    }

    me.logger.info(["check finished: dx_enabled={0};", dxEnabled]);

    return dxEnabled;
  }

});


/**
 * @member sol.connector_dx.ix.functions.CheckDxEnabled
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_CheckDxEnabled", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = { wfDiagram: wFDiagram },
      module = sol.create("sol.connector_dx.ix.functions.CheckDxEnabled", params);

  module.process();

  logger.exit("onEnterNode_CheckDxEnabled");
}

/**
 * @member sol.connector_dx.ix.functions.CheckDxEnabled
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_CheckDxEnabled", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = { wfDiagram: wFDiagram },
      module = sol.create("sol.connector_dx.ix.functions.CheckDxEnabled", params);

  module.process();

  logger.exit("onExitNode_CheckDxEnabled");
}

/**
 * @member sol.connector_dx.ix.functions.CheckDxEnabled
 * @method RF_sol_connector_dx_function_CheckDxEnabled
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_connector_dx_function_CheckDxEnabled(iXSEContext, args) {
  logger.enter("RF_sol_connector_dx_function_CheckDxEnabled", args);
  var module = sol.create("sol.connector_dx.ix.functions.CheckDxEnabled");

  module.process();

  logger.exit("RF_sol_connector_dx_function_CheckDxEnabled");
}

