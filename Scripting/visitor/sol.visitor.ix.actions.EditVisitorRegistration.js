
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.visitor.ix.VisitorUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.actions.EditVisitorRegistration" });

/**
 * Edits a visitor registration.
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |visitor.requestWorkflows.editGroupRegistration.workflowPrefixKey|The prefix for the workflow name for visitors|
 * |visitor.requestWorkflows.editVisitorRegistration.workflowPrefixKey|The prefix for the workflow name for visitor groups|
 * |visitor.requestWorkflowNameTemplate|The template for the workflow name (in Handlebars syntax)|
 *
 * # Workflow name template
 * Usable variables in the template for the workflow name
 *
 * - wfPrefix {String}
 * - wfDate {String}
 * - wfNumber {String}
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
sol.define("sol.visitor.ix.actions.EditVisitorRegistration", {
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
    return "EditVisitorRegistration";
  },

  process: function () {
    var me = this,
        wfPrefix, wfNumber, wfName, lookupObjId, flowId, objId, sord, visitorStatusKey, solType;

    lookupObjId = me.choosenVisitorObjId || me.visitorObjId;

    objId = sol.common.RepoUtils.getValidParent(lookupObjId, "SOL_TYPE", me.config.visitor.typeOfVisitors);

    if (objId !== null) {
      sord = sol.common.RepoUtils.getSord(objId);

      solType = sol.common.SordUtils.getObjKeyValue(sord, "SOL_TYPE");
      if (solType == me.config.visitor.solTypeVisitorGroup) {
        wfPrefix = me.getLocalizedString(me.ci, me.config.visitor.requestWorkflows.editGroupRegistration.workflowPrefixKey);
      } else {
        wfPrefix = me.getLocalizedString(me.ci, me.config.visitor.requestWorkflows.editVisitorRegistration.workflowPrefixKey);
      }

      wfNumber = me.actionId;
      wfName = sol.create("sol.common.Template", { source: me.config.visitor.requestWorkflowNameTemplate }).apply({ wfPrefix: wfPrefix, wfDate: new Date(), wfNumber: wfNumber });

      me.requireUserRights(sord, { rights: "RW", language: me.ci });

      visitorStatusKey = sol.common.SordUtils.getLocalizedKwlKey(sord, { type: "GRP", key: "VISITOR_STATUS" });
      if (visitorStatusKey == "PR") {
        if (solType == me.config.visitor.solTypeVisitorGroup) {
          flowId = sol.visitor.ix.VisitorUtils.startEditGroupRegistrationWorkflow(objId, wfName);
        } else {
          flowId = sol.visitor.ix.VisitorUtils.startEditVisitorRegistrationWorkflow(objId, wfName);
        }

        me.addWfDialogEvent(flowId, { objId: objId, dialogId: me.getName() });

        me.addRefreshEvent(objId, { type: "WF_STATUS", value: "EDITREGISTRATION", flowId: flowId });
      } else {
        me.addErrorEvent("sol.visitor.ix.actions.EditVisitorRegistration.error.onlyPreregisteredVisitCanBeEdited", null, null, me.ci);
      }
    } else {
      me.addErrorEvent("sol.visitor.ix.actions.CheckInVisitor.errorInvalidElement", null, null, me.ci);
    }
  }
});


/**
 * @member sol.visitor.ix.actions.EditVisitorRegistration
 * @method RF_sol_visitor_action_EditVisitorRegistration
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_visitor_action_EditVisitorRegistration(ec, configAny) {
  var params, editVisitorRegistration, result;
  logger.enter("RF_sol_visitor_action_EditVisitorRegistration", configAny);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);
  params.ci = ec.ci;
  params.user = ec.user;

  editVisitorRegistration = sol.create("sol.visitor.ix.actions.EditVisitorRegistration", params);
  result = editVisitorRegistration.execute();
  logger.exit("RF_sol_visitor_action_EditVisitorRegistration", result);

  return result;
}

