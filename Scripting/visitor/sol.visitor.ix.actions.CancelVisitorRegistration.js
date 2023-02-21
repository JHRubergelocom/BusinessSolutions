
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.visitor.ix.VisitorUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.actions.CancelVisitorRegistration" });

/**
 * Cancels a visitor registration.
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |visitor.templateFolderId|Path or ID to the visitor template folder|
 * |visitor.createWorkflowPrefixKey|The prefix for the workflow name|
 * |visitor.createWorkflowNameTemplate|The template for the workflow name (in Handlebars syntax)|
 *
 * # Workflow name template
 * Usable variables in the template for the workflow name
 *
 * - wfPrefix {String}
 * - visitorType {String}
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ActionBase
 * @requires sol.visitor.ix.VisitorUtils
 */
sol.define("sol.visitor.ix.actions.CancelVisitorRegistration", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "user"],

  /**
   * @cfg {de.elo.ix.client.ClientInfo} ci (required)
   */

  /**
   * @cfg {de.elo.ix.client.UserInfo} user (required)
   */

  /**
   * @cfg {String} visitorObjId
   * Object ID of the visitor from archive selection. Either `visitorObjId` or `choosenVisitorObjId` has to be defined.
   */

  /**
   * @cfg {String} choosenVisitorObjId
   * Object ID of the visitor from the selection dialog. Either `visitorObjId` or `choosenVisitorObjId` has to be defined.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
    sol.ns("sol.visitor");
    me.config = sol.visitor.ix.VisitorUtils.loadConfig();

    if (!me.visitorObjId && !me.choosenVisitorObjId) {
      throw "InitializationException: either 'visitorObjId' or 'choosenVisitorObjId' has to be defined";
    }

  },

  getName: function () {
    return "CancelVisitorRegistration";
  },

  process: function () {
    var me = this,
        wfPrefix, wfNumber, wfName, lookupObjId, flowId, objId, sord, visitorStatusKey, solType;

    lookupObjId = me.choosenVisitorObjId || me.visitorObjId;

    objId = sol.common.RepoUtils.getValidParent(lookupObjId, "SOL_TYPE", me.config.visitor.typeOfVisitors);

    if (objId !== null) {
      sord = sol.common.RepoUtils.getSord(objId);

      wfPrefix = me.getLocalizedString(me.ci, me.config.visitor.requestWorkflows.cancelVisitorRegistration.workflowPrefixKey);

      wfNumber = me.actionId;
      wfName = sol.create("sol.common.Template", { source: me.config.visitor.requestWorkflowNameTemplate }).apply({ wfPrefix: wfPrefix, wfDate: new Date(), wfNumber: wfNumber });

      me.requireUserRights(sord, { rights: "RW", language: me.ci });

      visitorStatusKey = sol.common.SordUtils.getLocalizedKwlKey(sord, { type: "GRP", key: "VISITOR_STATUS" });
      if (visitorStatusKey == "PR") {
        solType = sol.common.SordUtils.getObjKeyValue(sord, "SOL_TYPE");
        if (solType == me.config.visitor.solTypeVisitorGroup) {
          flowId = sol.visitor.ix.VisitorUtils.startCancelGroupRegistrationWorkflow(objId, wfName);
        } else {
          flowId = sol.visitor.ix.VisitorUtils.startCancelVisitorRegistrationWorkflow(objId, wfName);
        }

        me.addWfDialogEvent(flowId, { objId: objId, dialogId: me.getName() });

        me.addRefreshEvent(objId, { type: "WF_STATUS", value: "CANCELREGISTRATION", flowId: flowId });
      } else {
        me.addErrorEvent("sol.visitor.ix.actions.CancelVisitorRegistration.error.onlyPreregisteredVisitCanBeCanceled", null, null, me.ci);
      }
    } else {
      me.addErrorEvent("sol.visitor.ix.actions.CheckInVisitor.errorInvalidElement", null, null, me.ci);
    }
  }
});

/**
 * @member sol.visitor.ix.actions.CancelVisitorRegistration
 * @method RF_sol_visitor_action_CancelVisitorRegistration
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_visitor_action_CancelVisitorRegistration(ec, configAny) {
  logger.enter("RF_sol_visitor_action_CancelVisitorRegistration", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny),
      cancelVisitorRegistration, result;

  config.ci = ec.ci;
  config.user = ec.user;

  cancelVisitorRegistration = sol.create("sol.visitor.ix.actions.CancelVisitorRegistration", config);
  result = cancelVisitorRegistration.execute();
  logger.exit("RF_sol_visitor_action_CancelVisitorRegistration", result);
  return result;
}

