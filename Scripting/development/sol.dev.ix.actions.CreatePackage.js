
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
//@include lib_sol.dev.ix.ActionUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.actions.CreatePackage" });

/**
 * Creates a new new package.
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
 * @requires sol.common.ActionUtils
 */
sol.define("sol.dev.ix.actions.CreatePackage", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "user", "packageType"],

  /**
   * @cfg {de.elo.ix.client.ClientInfo} ci (required)
   */

  /**
   * @cfg {de.elo.ix.client.UserInfo} user (required)
   */

  /**
   * @cfg {String} templateId (required)
   * Object ID of the template
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
    me.config = sol.dev.ix.ActionUtils.loadConfigDev();
  },

  getName: function () {
    return "CreatePackage";
  },

  process: function () {
    var me = this,
        name, objId, flowId, sord,
        wfTemplate, solId;

    if (!me.templateId) {
      me.addErrorEvent("sol.dev.ix.actions.CreatePackage.error.target", null, null, me.ci);
      return;
    }
    name = me.buildElementName();

    objId = sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      objId: "0",
      source: me.templateId,
      copySourceAcl: false,
      inheritDestinationAcl: false,
      name: me.packageType + " - " + me.getTimeStampString(),
      asAdmin: true,
      useQuickCopy: true
    });

    wfTemplate = me.getWfTemplate(me.packageType);
    flowId = me.startWorkflow(objId, wfTemplate, name);

    if (flowId) {
      me.addWfDialogEvent(flowId, { objId: objId, title: name, dialogId: me.getName() });
    }

    if (me.config.solutionFolderPath) {
      solId = sol.common.RepoUtils.preparePath(me.config.solutionFolderPath);
      me.addGotoIdEvent(solId);
    }
  },

  /**
   * @private
   * @param {String} packageType
   * @return {String}
   */
  getWfTemplate: function (packageType) {
    var me = this,
        wfTemplate;

    switch (packageType) {
      case "Default Package":
        wfTemplate = me.config.workflows.createPackage.workflowTemplateName;
        break;
      default:
        wfTemplate = me.config.workflows.createPackage.workflowTemplateName;
    }
    return wfTemplate;
  },

  /**
   * @private
   * @return {Object}
   */
  buildElementName: function () {
    var me = this,
        prefix;

    prefix = me.getLocalizedString(me.ci, me.config.workflows.createPackage.workflowPrefixKey);
    return sol.create("sol.common.Template", { source: me.config.workflows.createPackage.workflowNameTemplate }).apply({ wfPrefix: prefix, packageType: me.packageType });
  },

  /**
   * @private
   * @return {String}
   */
  getTimeStampString: function () {
    return String(Packages.org.apache.commons.lang.time.DateFormatUtils.format(new java.util.Date(), "yyyyMMddHHmmss"));
  }
});

/**
 * @member sol.dev.ix.actions.CreatePackage
 * @method RF_sol_dev_action_CreatePackage
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_dev_action_CreatePackage(ec, configAny) {
  logger.enter("RF_sol_dev_action_CreatePackage", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "packageType", "templateId"),
      createPackage, result;

  config.ci = ec.ci;
  config.user = ec.user;

  createPackage = sol.create("sol.dev.ix.actions.CreatePackage", config);
  result = createPackage.execute();
  logger.exit("RF_sol_dev_action_CreatePackage", result);
  return result;
}


