
//@include lib_Class.js
//@include lib_sol.common.TranslateTerms.js

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
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
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
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.editVisitorRegistration.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @return {String} The flowId of the new workflow
   */
  startEditVisitorRegistrationWorkflow: function (objId, wfName) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.visitor.requestWorkflows.editVisitorRegistration.workflowTemplateName, wfName, objId);
  },

  /**
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.editVisitorRegistration.workflowTemplateName`
   * @param {String} objId The objId on which the workflow should be started
   * @param {String} wfName The Name of the new workflow
   * @return {String} The flowId of the new workflow
   */
  startEditGroupRegistrationWorkflow: function (objId, wfName) {
    var me = this;
    me.loadConfig();
    return ixConnect.ix().startWorkFlow(me.config.visitor.requestWorkflows.editGroupRegistration.workflowTemplateName, wfName, objId);
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
   * Starts the workflow defined in the configuration: `visitor.requestWorkflows.selfCheckInVisitor.workflowTemplateName`
   * @param {String}  objId The objId on which the workflow should be started
   * @param {Object}  wfConfig Config object
   * @param {String}  wfConfig.nameTemplate The Template of wfName of the new workflow
   * @param {String}  wfConfig.ci The client info
   * @param {String}  wfConfig.prefixKey The prefix key of the new workflow
   * @param {Date}    [wfConfig.date=new Date()] (optional) a date used as template data
   * @param {String}  wfConfig.number The corresponding action id / number used as template data
   * @param {String}  wfConfig.name The Name of the new workflow
   * @param {String}  wfConfig.templateName The Template Name of the new workflow
   * @param {Object}  params Parameters
   * @param {Boolean} params.interactive Interactive
   * @return {String} The flowId of the new workflow
   */
  startWorkflow: function (objId, wfConfig, params) {
    var me = this,
        name;

    if (!wfConfig.name) {
      name = me.getWfNameFromTemplate(wfConfig);
    } else {
      name = wfConfig.name;
    }

    return ixConnect.ix().startWorkFlow(wfConfig.templateName, me.buildWfName(name, params), objId);
  },

  /**
   * @private
   *
   * @param {Object} wfConfig @see startWorkFlow
   * @return {String} The wfName of the new workflow
   */
  getWfNameFromTemplate: function (wfConfig) {
    var me = this;

    return sol.create(
      "sol.common.Template",
      {
        source: wfConfig.nameTemplate
      })
      .apply(me.getWfNameTemplateData(wfConfig));
  },

  /**
   * @private
   *
   * @param {Object} wfConfig @see startWorkFlow
   * @return {String} Template data for the wfName
   */
  getWfNameTemplateData: function (wfConfig) {
    var me = this;

    return {
      wfPrefix: me.getLocalizedString(
        wfConfig.ci,
        wfConfig.prefixKey
      ),
      wfDate: wfConfig.date || new Date(),
      wfNumber: wfConfig.number
    };
  },

  /**
   * Get a localized string for a key.
   * @param {String|de.elo.ix.client.ClientInfo} language Either an ISO language String, or an de.elo.ix.client.ClientInfo Object
   * @param {String} key The key in the resource files
   * @return {String}
   */
  getLocalizedString: function (language, key) {
    return sol.common.TranslateTerms.getTerm(language, key);
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
