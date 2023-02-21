
//@include lib_Class.js

/**
 * Utility functions for contract handling.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.RepoUtils
 */
sol.define("sol.contract.ix.ContractUtils", {
  singleton: true,

  /**
   * Starts the workflow defined in the configuration: `contract.requestWorkflows.closeContract.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @return {String} The flowId of the new workflow
   */
  startCloseContractWorkflow: function (objId, wfName) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.contract.requestWorkflows.closeContract.workflowTemplateName, wfName, objId);
  },

  /**
   * Starts the workflow defined in the configuration: `contract.requestWorkflows.opencontract.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @return {String} The flowId of the new workflow
   */
  startOpenContractWorkflow: function (objId, wfName) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.contract.requestWorkflows.openContract.workflowTemplateName, wfName, objId);
  },

  /**
   * Starts the workflow defined in the configuration: `contract.requestWorkflows.deleteContract.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @return {String} The flowId of the new workflow
   */
  startDeleteContractWorkflow: function (objId, wfName) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.contract.requestWorkflows.deleteContract.workflowTemplateName, wfName, objId);
  },

  /**
   * Loads the configuration from the JSON contract: `/Administration/Business Solutions/contract/Configuration/contract.config`
   * @return {Object}
   */
  loadConfig: function () {
    var me = this;

    me.config = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;

    return me.config;
  }
});
