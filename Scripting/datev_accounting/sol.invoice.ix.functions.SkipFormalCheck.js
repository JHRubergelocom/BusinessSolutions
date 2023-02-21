
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.invoice.ix.functions.SkipFormalCheck" });

/**
 * Checks wether the formal check should be skipped
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.invoice.ix.functions.SkipFormalCheck", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["wfDiagram"],

  /**
   * @cfg {de.elo.ix.client.WFDiagram} wfDiagram (required)
   * The WFDiagram to which the changes should me applied to
   */

  /**
   * @cfg {de.elo.ix.client.String} [skipStatus=SKIP]
   * Workflow status if the formal check should be skipped
   */

  /**
   * @cfg {String} [mode=NEVER] Mode
   * # Modes:
   *
   * - `NEVER`: Never skip the formal check
   * - `EVER`: Ever skip the formal check
   * - `DATACOLLECTION`: Skip the formal check if the field `INVOICE_DATACOLLECTION` is filled.
   * - `DOCXTRACTOR`: Skip the formal check if the field `INVOICE_DATACOLLECTION` contains the value `DOCXTRACTOR`
   */

  initialize: function (config) {
    var me = this;
    me.params = config;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Performs the check whether the dynamic ad-hoc workflow should be left
   */
  process: function () {
    var me = this,
        wfStatus = "",
        invoiceConfig, sord, dataCollectionValue;

    invoiceConfig = sol.create("sol.common.Config", { compose: "/sol.datev.accounting/Configuration/sol.invoice.config" }).config;

    sord = sol.common.RepoUtils.getSord(me.wfDiagram.objId);

    me.mode = me.mode || "NEVER";
    me.skipStatus = me.skipStatus || "SKIP";

    dataCollectionValue = sol.common.SordUtils.getObjKeyValue(sord, invoiceConfig.fields.INVOICE_DATACOLLECTION.value);

    switch (me.mode) {
      case "DATACOLLECTION":
        if (!!dataCollectionValue) {
          wfStatus = me.skipStatus;
        }
        break;
      case "DOCXTRACTOR":
        if (dataCollectionValue && (dataCollectionValue.toUpperCase() == "DOCXTRACTOR")) {
          wfStatus = me.skipStatus;
        }
        break;
      case "EVER":
        wfStatus = me.skipStatus;
        break;
      default:
        break;
    }

    sol.common.WfUtils.setWorkflowStatus(me.wfDiagram, wfStatus);
  }
});

/**
 * @member sol.invoice.ix.functions.SkipFormalCheck
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_CheckDynAdHocFlowStart", { flowId: wfDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.wfDiagram = wfDiagram;

  module = sol.create("sol.invoice.ix.functions.SkipFormalCheck", params);
  module.process();

  logger.exit("onExitNode_CheckDynAdHocFlowStart");
}
