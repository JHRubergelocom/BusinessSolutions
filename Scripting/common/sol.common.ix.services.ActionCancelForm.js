
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.ActionCancelForm" });

/**
 * Forwards a workflow to the next cancel node.
 *
 * This service is called by the clients if a user closes a workflow form dialog in order to cancel an action.
 *
 * Please note that cancel nodes should be defined by using a localization key `sol.common.wf.node.cancel`.
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 * @requires  sol.common.IxUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.ActionCancelForm", {
  extend: "sol.common.ix.ServiceBase",

  wfMapSavedFlag: "FORM_SAVED",

  /**
   * @cfg {String} flowId (required)
   * Flow ID
   */

  /**
   * @cfg {String} nodeId (required)
   * Node ID
   */

  /**
   * @cfg {Array} cancelNodeNameTranslationKeys
   * Translation keys for the node name of cancel nodes
   */
  cancelNodeNameTranslationKeys: [
    "sol.common.wf.node.cancel",
    "sol.common.wf.node.abort",
    "sol.common.wf.node.abbort"
  ],

  /**
   * @cfg {Array} cancelIconNames
   * Icon names of cancel nodes
   */
  cancelIconNames: [
    "sol.common.Cancel",
    "sol.common.Abort",
    "sol.common.Abbort"
  ],

  initialize: function (config) {
    var me = this;

    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Forwards a workflow to the next cancel node
   * @return {Object}
   */
  process: function () {
    var me = this,
        result = false,
        saveClicked, workflow, succNode;

    saveClicked = me.determineAndResetSavedState();

    if (!saveClicked) {
      workflow = sol.common.WfUtils.getWorkflow(me.flowId);

      succNode = sol.common.WfUtils.getSuccessorNode(workflow, me.nodeId, {
        nameTranslationKeys: me.cancelNodeNameTranslationKeys,
        iconNames: me.cancelIconNames
      });

      if (succNode) {
        sol.common.WfUtils.forwardWorkflow(me.flowId, me.nodeId, [succNode.id]);
        result = true;
      }
    }

    return { result: result };
  },

  /**
   * @private
   * Determines, if the 'saved flag' (wf map field `FORM_SAVED`) is set to '1'.
   * If that's the case it returns `true` and resets the flag, else it returns `false` and leaves the entry untouched.
   * @return {Boolean}
   */
  determineAndResetSavedState: function () {
    var me = this,
        wfMap, savedFlag;

    wfMap = sol.create("sol.common.WfMap", {
      flowId: me.flowId,
      objId: me.nodeId
    });
    wfMap.read([me.wfMapSavedFlag]);

    savedFlag = (wfMap.getValue(me.wfMapSavedFlag) === "1");

    if (savedFlag === true) {
      wfMap.setValue(me.wfMapSavedFlag, null);
      wfMap.write();
    }

    return savedFlag;
  }
});

/**
 * @member sol.common.ix.services.ActionCancelForm
 * @method RF_sol_common_service_ActionCancelForm
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_ActionCancelForm(ec, args) {
  logger.enter("RF_sol_common_service_ActionCancelForm", args);
  var params,
      result = {},
      resultString, service;

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  if (params.flowId && params.nodeId) {
    service = sol.create("sol.common.ix.services.ActionCancelForm", params);
    result = service.process();
  }

  logger.exit("RF_sol_common_service_ActionCancelForm", result);

  resultString = JSON.stringify(result);

  return resultString;
}
