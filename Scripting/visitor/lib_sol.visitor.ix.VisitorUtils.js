
//@include lib_Class.js

/**
 * Utility functions for visitor handling.
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.visitor.Utils
 */
sol.define("sol.visitor.ix.VisitorUtils", {
  singleton: true,

  /**
   * Builds the workflow name
   * @param {String} wfName Workflow name
   * @param {Object} params Parameters
   * @return {String} Workflow name
   */
  buildWfName: function (wfName, params) {
    var me = this,
        baseConfig;

    params = params || {};

    if (params.interactive == false) {
      baseConfig = me.loadBaseConfig();
      wfName = baseConfig.serviceWfPrefix + wfName;
    }

    return wfName;
  },

  /**
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.preRegisterGroup.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @return {String} The flowId of the new workflow
   */
  startPreRegisterGroupWorkflow: function (objId, wfName) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.visitor.requestWorkflows.preRegisterGroup.workflowTemplateName, wfName, objId);
  },

  /**
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.registerVisitor.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @param {Object} params Parameters
   * @param {Boolean} params.interactive Interactive
   * @return {String} The flowId of the new workflow
   */
  startRegisterVisitorWorkflow: function (objId, wfName, params) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.visitor.requestWorkflows.registerVisitor.workflowTemplateName, wfName, objId);
  },

  /**
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.registerGroup.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @return {String} The flowId of the new workflow
   */
  startRegisterGroupWorkflow: function (objId, wfName) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.visitor.requestWorkflows.registerGroup.workflowTemplateName, wfName, objId);
  },

  /**
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.checkInVisitor.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @param {Object} params Parameters
   * @param {Boolean} params.interactive Interactive
   * @return {String} The flowId of the new workflow
   */
  startCheckInVisitorWorkflow: function (objId, wfName, params) {
    var me = this;
    me.loadConfig();
    wfName = me.buildWfName(wfName, params);

    return ixConnect.ix().startWorkFlow(me.config.visitor.requestWorkflows.checkInVisitor.workflowTemplateName, wfName, objId);
  },

  /**
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.recheckInVisitor.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @param {Object} params Parameters
   * @param {Boolean} params.interactive Interactive
   * @return {String} The flowId of the new workflow
   */
  startReCheckInVisitorWorkflow: function (objId, wfName, params) {
    var me = this;
    me.loadConfig();
    wfName = me.buildWfName(wfName, params);

    return ixConnect.ix().startWorkFlow(me.config.visitor.requestWorkflows.recheckInVisitor.workflowTemplateName, wfName, objId);
  },

  /**
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.checkOutVisitor.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @param {Object} params Parameters
   * @param {Boolean} params.interactive Interactive
   * @return {String} The flowId of the new workflow
   */
  startCheckOutVisitorWorkflow: function (objId, wfName, params) {
    var me = this;
    me.loadConfig();
    wfName = me.buildWfName(wfName, params);

    return ixConnect.ix().startWorkFlow(me.config.visitor.requestWorkflows.checkOutVisitor.workflowTemplateName, wfName, objId);
  },

  /**
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.cancelVisitorRegistration.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @return {String} The flowId of the new workflow
   */
  startCancelVisitorRegistrationWorkflow: function (objId, wfName) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.visitor.requestWorkflows.cancelVisitorRegistration.workflowTemplateName, wfName, objId);
  },

  /**
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.cancelVisitorRegistration.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @return {String} The flowId of the new workflow
   */
  startCancelGroupRegistrationWorkflow: function (objId, wfName) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.visitor.requestWorkflows.cancelGroupRegistration.workflowTemplateName, wfName, objId);
  },

  /**
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.captureVisitorPicture.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @return {String} The flowId of the new workflow
   */
  startCaptureVisitorPictureWorkflow: function (objId, wfName) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.visitor.requestWorkflows.captureVisitorPicture.workflowTemplateName, wfName, objId);
  },

  /**
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.createSignatureDocument.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @return {String} The flowId of the new workflow
   */
  startCreateSignatureDocumentWorkflow: function (objId, wfName) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.visitor.requestWorkflows.createSignatureRequest.workflowTemplateName, wfName, objId);
  },

  /**
   * Loads the configuration from the JSON file: `/Administration/Business Solutions/visitor/Configuration/visitor.config`
   * @return {Object}
   */
  loadConfig: function () {
    var me = this;

    me.config = sol.create("sol.common.Config", { compose: "/visitor/Configuration/visitor.config" }).config;

    return me.config;
  },

  /**
   * Loads the configuration from the JSON file: `/Administration/Business Solutions/common/Configuration/base.config`
   * @return {Object}
   */
  loadBaseConfig: function () {
    return sol.create("sol.common.Config", { compose: "/common/Configuration/base.config" }).config;
  }
});
