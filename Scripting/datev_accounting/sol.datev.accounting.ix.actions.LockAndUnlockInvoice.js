importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.AsUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.TranslateTerms.js


var logger = sol.create("sol.Logger", {
    scope: "sol.datev.accounting.ix.actions.LockAndUnlockInvoice"
});

/**
 * Retrieves the available document types.
 *
 * @author Grigorescu Bogdan Stefan, ELO Digital Office GmbH
 *
 */
sol.define("sol.datev.accounting.ix.actions.LockAndUnlockInvoice", {
    extend: "sol.common.ix.ActionBase",
    requiredConfig: ["sordId", "template", "title"],

    initialize: function (config) {
        var me = this;
        me.$super("sol.common.ix.ActionBase", "initialize", [config]);
    },

    process: function () {
        var me = this;
        var flow = sol.common.WfUtils.getActiveWorkflows(me.sordId, {
            template: me.template,
            user: true
        })[0];
        log.warn("Flow: " + flowId);
        if (flow) {
            sol.common.WfUtils.cancelWorkflow(flow.getId(),true);
        }
        var flowId = me.startWorkflow(me.sordId, me.template, me.title);
        me.addWfDialogEvent(flowId, {
            objId: me.sordId,
            title: sol.common.TranslateTerms.translate(me.title)
        });
      

    },
    getName: function () {
        return "LockAndUnlockInvoice";
    }

});

/**
 * @member sol.datev.accounting.ix.actions.LockAndUnlockInvoice
 * @method RF_sol_datev_accounting_action_LockAndUnlockInvoice
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_datev_accounting_action_LockAndUnlockInvoice(ec, configAny) {
    logger.enter("RF_sol_datev_accounting_action_LockAndUnlockInvoice", configAny);
    var rfUtils = sol.common.ix.RfUtils,
        config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny),
        service, result;

    service = sol.create("sol.datev.accounting.ix.actions.LockAndUnlockInvoice", config);
    result = service.execute();
    logger.exit("RF_sol_datev_accounting_action_LockAndUnlockInvoice", result);
    return result;
}