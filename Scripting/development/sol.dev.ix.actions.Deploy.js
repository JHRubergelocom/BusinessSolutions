
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ExceptionUtils.js
//@include lib_sol.dev.ix.ActionUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.actions.Deploy" });

/**
 * Deploys / Undeploys a package.
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ActionBase
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.ix.functions.CopyFolderContents
 * @requires sol.common.ix.functions.CopySordData
 * @requires sol.common.ActionUtils
 */
sol.define("sol.dev.ix.actions.Deploy", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "user", "objId", "mode"],

  /**
   * @cfg {de.elo.ix.client.ClientInfo} ci (required)
   */

  /**
   * @cfg {de.elo.ix.client.UserInfo} user (required)
   */

  /**
   * @cfg {String} objId (required)
   * Object ID of the selected package
   */

  /**
   * @cfg {String} mode (required)
   * Deploy or undeploy selected package
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
    me.config = sol.dev.ix.ActionUtils.loadConfigDev();
  },

  getName: function () {
    return "Deploy";
  },

  process: function () {
    var me = this,
        name, flowId, wfTemplate, sord;

    if ((!me.objId) || (!me.isPackage(me.objId))) {
      if (me.mode == "deploy") {
        me.addErrorEvent("sol.dev.ix.actions.Deploy.error.target", null, null, me.ci);
      } else {
        me.addErrorEvent("sol.dev.ix.actions.Undeploy.error.target", null, null, me.ci);
      }
      return;
    }

    if (me.mode == "undeploy") {
      sord = sol.common.RepoUtils.getSord(me.objId);
      if (sord.name.indexOf("undeployed") > -1) {
        me.addErrorEvent("sol.dev.ix.actions.Undeploy.error.target", null, null, me.ci);
        return;
      }
    }

    name = me.buildElementName(me.mode);
    wfTemplate = me.getWfTemplate(me.mode);
    flowId = me.startWorkflow(me.objId, wfTemplate, name);

    if (flowId) {
      me.addWfDialogEvent(flowId, { objId: me.objId, title: name, dialogId: me.getName() });
      me.addRefreshEvent(me.objId);
    }
  },

  isPackage: function (objId) {
    var sord;

    sord = sol.common.RepoUtils.getSord(objId);
    return sol.common.SordUtils.hasDocMask(sord, "ELO Business Solution");
  },

  /**
   * @private
   * @param {String} mode
   * @return {String}
   */
  getWfTemplate: function (mode) {
    var me = this,
        wfTemplate;

    switch (mode) {
      case "deploy":
        wfTemplate = me.config.workflows.Deploy.workflowTemplateName;
        break;
      case "undeploy":
        wfTemplate = me.config.workflows.Undeploy.workflowTemplateName;
        break;
      default:
        wfTemplate = me.config.workflows.Deploy.workflowTemplateName;
    }
    return wfTemplate;
  },

  /**
   * @private
   * @return {Object}
   */
  buildElementName: function (mode) {
    var me = this,
        prefix, wfName;

    switch (mode) {
      case "deploy":
        prefix = me.getLocalizedString(me.ci, me.config.workflows.Deploy.workflowPrefixKey);
        wfName = sol.create("sol.common.Template", { source: me.config.workflows.Deploy.workflowNameTemplate }).apply({ wfPrefix: prefix, mode: me.mode });
        break;
      case "undeploy":
        prefix = me.getLocalizedString(me.ci, me.config.workflows.Undeploy.workflowPrefixKey);
        wfName = sol.create("sol.common.Template", { source: me.config.workflows.Undeploy.workflowNameTemplate }).apply({ wfPrefix: prefix, mode: me.mode });
        break;
      default:
        prefix = me.getLocalizedString(me.ci, me.config.workflows.Undeploy.workflowPrefixKey);
        wfName = sol.create("sol.common.Template", { source: me.config.workflows.Undeploy.workflowNameTemplate }).apply({ wfPrefix: prefix, mode: me.mode });
    }
    return wfName;
  }

});

/**
 * @member sol.dev.ix.actions.Deploy
 * @method RF_sol_dev_action_Deploy
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_dev_action_Deploy(ec, configAny) {
  logger.enter("RF_sol_dev_action_Deploy", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "objId", "mode"),
      Deploy, result;

  config.ci = ec.ci;
  config.user = ec.user;

  Deploy = sol.create("sol.dev.ix.actions.Deploy", config);
  result = Deploy.execute();
  logger.exit("RF_sol_dev_action_Deploy", result);
  return result;
}


