
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.privacy.ix.services.ProcessingActivityPreconditions" });


sol.define("sol.privacy.ix.services.ProcessingActivityPreconditions", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["targetId"],

  /**
   * Checks the preconditions for the delegation.
   * @returns {Object}
   */
  checkDelegation: function () {
    var me = this,
        result = { valid: true },
        processingActivity, currentStatus;

    processingActivity = ixConnectAdmin.ix().checkoutSord(me.targetId, SordC.mbLean, LockC.NO);
    currentStatus = sol.common.SordUtils.getObjKeyValue(processingActivity, "PRIVACY_PROCACTIVITY_STATUS");

    if (currentStatus == "DRAFT_DELEGATED") {
      result.valid = false;
      result.msg = sol.common.TranslateTerms.translate("sol.privacy.service.delegate.alreadydelegated");
    }

    return result;
  },

  /**
   * Checks the preconditions for the approval process.
   * @returns {Object}
   */
  checkApproval: function () {
    var me = this,
        result = { valid: true },
        activeApprovalWorkflows;

    activeApprovalWorkflows = sol.common.WfUtils.getActiveWorkflows(me.targetId, {
      template: "sol.privacy.gdpr.processingactivity.approve"
    });

    if (activeApprovalWorkflows && (activeApprovalWorkflows.length > 0)) {
      result.valid = false;
      result.msg = sol.common.TranslateTerms.translate("sol.privacy.service.approval.alreadyrunning");
    }

    return result;
  }

});


/**
 * @member sol.privacy.ix.services.ProcessingActivityPreconditions
 * @method RF_sol_privacy_service_DelegateProcessingActivityPreconditions
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_privacy_service_DelegateProcessingActivityPreconditions(ec, args) {
  var config, service, result;

  logger.enter("RF_sol_privacy_service_DelegateProcessingActivityPreconditions", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "targetId");
  config.ci = ec.ci;

  service = sol.create("sol.privacy.ix.services.ProcessingActivityPreconditions", config);
  result = sol.common.ix.RfUtils.stringify(service.checkDelegation());
  logger.exit("RF_sol_privacy_service_DelegateProcessingActivityPreconditions", result);
  return result;
}

/**
 * @member sol.privacy.ix.services.ProcessingActivityPreconditions
 * @method RF_sol_privacy_service_ApproveProcessingActivityPreconditions
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_privacy_service_ApproveProcessingActivityPreconditions(ec, args) {
  var config, service, result;

  logger.enter("RF_sol_privacy_service_ApproveProcessingActivityPreconditions", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "targetId");
  config.ci = ec.ci;

  service = sol.create("sol.privacy.ix.services.ProcessingActivityPreconditions", config);
  result = sol.common.ix.RfUtils.stringify(service.checkApproval());
  logger.exit("RF_sol_privacy_service_ApproveProcessingActivityPreconditions", result);
  return result;
}
