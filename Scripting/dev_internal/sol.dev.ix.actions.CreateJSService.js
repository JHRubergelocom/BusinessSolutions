
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
//@include lib_sol.common.Map.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.dev.ix.ActionUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.actions.CreateJSService" });

/**
 * Creates a new new jsservice.
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.Map
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
sol.define("sol.dev.ix.actions.CreateJSService", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "user", "jsserviceType"],

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
    me.config = sol.dev.ix.ActionUtils.loadConfigDevInternal();
  },

  getName: function () {
    return "CreateJSService";
  },

  process: function () {
    var me = this,
        name, objId, flowId, sord,
        wfTemplate, solId;

    if (!me.templateId) {
      me.addErrorEvent("sol.dev.ix.actions.CreateJSService.error.target", null, null, me.ci);
      return;
    }

    name = me.buildElementName();

    objId = sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      objId: "0",
      source: me.templateId,
      copySourceAcl: false,
      inheritDestinationAcl: false,
      name: me.jsserviceType + " - " + me.getTimeStampString(),
      asAdmin: true
    });

    sord = sol.common.RepoUtils.getSord(objId);
    ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);

    wfTemplate = me.getWfTemplate(me.jsserviceType);
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
   * @param {String} jsserviceType
   * @return {String}
   */
  getWfTemplate: function (jsserviceType) {
    var me = this,
        wfTemplate;

    switch (jsserviceType) {
      case "Default":
        wfTemplate = me.config.workflows.createJSService.workflowTemplateName;
        break;
      default:
        wfTemplate = me.config.workflows.createJSService.workflowTemplateName;
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

    prefix = me.getLocalizedString(me.ci, me.config.workflows.createJSService.workflowPrefixKey);
    return sol.create("sol.common.Template", { source: me.config.workflows.createJSService.workflowNameTemplate }).apply({ wfPrefix: prefix, jsserviceType: me.jsserviceType });
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
 * @member sol.dev.ix.actions.CreateJSService
 * @method RF_sol_dev_action_CreateJSService
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_dev_action_CreateJSService(ec, configAny) {
  logger.enter("RF_sol_dev_action_CreateJSService", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "jsserviceType", "templateId"),
      createJSService, result;

  config.ci = ec.ci;
  config.user = ec.user;

  createJSService = sol.create("sol.dev.ix.actions.CreateJSService", config);
  result = createJSService.execute();
  logger.exit("RF_sol_dev_action_CreateJSService", result);
  return result;
}


