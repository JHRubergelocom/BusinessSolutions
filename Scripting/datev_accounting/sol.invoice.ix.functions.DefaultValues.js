
//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.DynKwlUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.invoice.ix.Invoice.js

importPackage(Packages.de.elo.ix.client);

var logger = sol.create("sol.Logger", { scope: "sol.invoice.ix.functions.DefaultValues" });

/**
 * @class sol.invoice.ix.functions.DefaultValues
 * Fills the invoice default values.
 *
 *
 * # As workflow node
 * Only supported for {@link sol.invoice.ix.functions.DefaultValues#onExitNode}
 *
 * ObjId is set based on the element that the workflow is attached to.
 * There's no need for passing configuration option to the comments area of the workflow node.
 *
 * # As IX function call
 *
 *     sol.common.IxUtils.execute('RF_sol_invoice_setDefaultValues', {
 *       objId: "4711"
 *     });
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.1
 *
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Config
 * @requires sol.common.SordMap
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.DynKwlUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.invoice.ix.Invoice
 *
 */

/**
 * @member sol.invoice.ix.functions.DefaultValues
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var me = this,
      sord, tplSord, invoice;

  logger.enter("onExitNode_DefaultValues", { flowId: wFDiagram.id, nodeId: nodeId });

  try {
    sord = ixConnect.ix().checkoutSord(wFDiagram.objId, EditInfoC.mbSord, LockC.NO).sord;

    if (me.logger.debugEnabled) {
      tplSord = sol.common.SordUtils.getTemplateSord(sord).sord;
      me.logger.debug("DefaultValues: before: " + JSON.stringify(tplSord));
    }

    invoice = sol.create("sol.invoice.ix.Invoice", { sord: sord });

    invoice.setDefaultValues();

    ixConnect.ix().checkinSord(sord, SordC.mbAll, LockC.NO);

    if (me.logger.debugEnabled) {
      tplSord = sol.common.SordUtils.getTemplateSord(sord).sord;
      me.logger.debug("DefaultValues: after: " + JSON.stringify(tplSord));
    }
  } catch (ex) {
    logger.warn("Exception: " + ex);
  }

  logger.exit("onExitNode_DefaultValues");
}

/**
 * @member sol.invoice.ix.functions.DefaultValues
 * @method RF_sol_invoice_setDefaultValues
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_invoice_setDefaultValues(ec, jsonParams) {

  var params, sord, invoice;

  try {
    params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, jsonParams, "objId");
    sord = ixConnect.ix().checkoutSord(params.objId, EditInfoC.mbSord, LockC.NO).sord;
    invoice = sol.create("sol.invoice.ix.Invoice", { sord: sord });
    invoice.setDefaultValues();
    ixConnect.ix().checkinSord(sord, SordC.mbAll, LockC.NO);
  } catch (ex) {
    logger.warn("Exception: " + ex);
  }
}
