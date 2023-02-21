
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.CheckFromService" });

/**
 * Checks if a workflow was started by a service.
 *
 * To perform the check, this class uses {@link sol.common.WfUtils#isServiceWf}
 *
 * Can be used as node exit script. It updates the ELO_WF_STATUS field as configured.
 *
 * # As workflow node
 *
 * Following configuration can be applied to the comments field.
 *
 *     {
 *       "wfStatus": { "fromService": "CREATED_FROM_SERVICE", "noneService": "NOT_CREATED_FROM_SERVICE" }
 *     }
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloix
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.CheckFromService", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["wfDiagram"],

  /**
   * @cfg {de.elo.ix.client.WFDiagram} wfDiagram (required)
   * The workflow which should be checked.
   */

  /**
   * @cfg {Object} wfStatus
   *
   *     "wfStatus": { "fromService": "yaaay", "noneService": "ohNooo" }
   *
   * This object can override the default workflow states which will be set after the check, if ths was used in a workflow node.
   * If the is `undefined`, the unction will throw an exception in case the checke fails.
   *
   * - `fromService`: set as ELO_WF_STATUS after a successfull check
   * - `noneService`: set as ELO_WF_STATUS after a check failure
   */

  /**
   * @private
   * @property {String} [DEFAULT_PASSED_STATUS="FROM_SERVICE"] Default workflow status in case of a successful check
   */
  DEFAULT_PASSED_STATUS: "FROM_SERVICE",

  /**
   * @private
   * @property {String} [DEFAULT_FAILED_STATUS="FROM_USER"] Default workflow status in case of a check failure
   */
  DEFAULT_FAILED_STATUS: "FROM_USER",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Performs the check.
   */
  process: function () {
    var me = this,
        isServiceWf, status;

    isServiceWf = sol.common.WfUtils.isServiceWf(me.wfDiagram);

    if (isServiceWf) {
      status = (me.wfStatus && me.wfStatus.fromService) ? me.wfStatus.fromService : me.DEFAULT_PASSED_STATUS;
    } else {
      status = (me.wfStatus && me.wfStatus.noneService) ? me.wfStatus.noneService : me.DEFAULT_FAILED_STATUS;
    }

    sol.common.WfUtils.setWorkflowStatus(me.wfDiagram, status);
  }

});


/**
 * @member sol.common.ix.functions.CheckFromService
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_FromServiceCheck", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.wfDiagram = wFDiagram;
  module = sol.create("sol.common.ix.functions.CheckFromService", params);

  module.process();

  logger.exit("onExitNode_FromServiceCheck");
}
