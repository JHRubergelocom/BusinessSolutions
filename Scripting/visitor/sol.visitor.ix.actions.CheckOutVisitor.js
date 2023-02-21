
//@include lib_Class.js
//@include lib_moment.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.visitor.ix.VisitorUtils.js
//@include lib_sol.common.SordUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.actions.CheckOutVisitor" });

/**
 * Check out a visitor.
 *
 * # Sequence
 *
 * ...
 * ...
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
sol.define("sol.visitor.ix.actions.CheckOutVisitor", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "user", "visitorObjId"],

  /**
   * @cfg {de.elo.ix.client.ClientInfo} ci (required)
   */

  /**
   * @cfg {de.elo.ix.client.UserInfo} user (required)
   */

  /**
   * @cfg {String} visitorObjId (required)
   * Object ID of the visitor
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
    sol.ns("sol.visitor");
    me.config = sol.visitor.ix.VisitorUtils.loadConfig();
  },

  getName: function () {
    return "CheckOutVisitor";
  },

  process: function () {
    var me = this,
        wfPrefix, wfNumber, wfName, objId, flowId,
        departureDateIso, departureTimeString;

    me.interactive = (typeof me.interactive == "undefined") ? true : me.interactive;

    wfPrefix = me.getLocalizedString(me.ci, me.config.visitor.requestWorkflows.checkOutVisitor.workflowPrefixKey);
    wfNumber = me.actionId;
    wfName = sol.create("sol.common.Template", { source: me.config.visitor.requestWorkflowNameTemplate }).apply({ wfPrefix: wfPrefix, wfDate: new Date(), wfNumber: wfNumber });

    objId = sol.common.RepoUtils.getValidParent(me.visitorObjId, "SOL_TYPE", me.config.visitor.typeOfVisitors);

    me.requireUserRights(objId, { rights: "RW", language: me.ci });

    me.interactive = (me.config.visitor.checkoutVisitorWithoutDialog) ? false : me.interactive;

    if (objId !== null) {
      if (me.interactive) {
        flowId = sol.visitor.ix.VisitorUtils.startCheckOutVisitorWorkflow(objId, wfName, { interactive: me.interactive });
        me.addWfDialogEvent(flowId, { objId: objId, dialogId: me.getName() });
        me.addRefreshEvent(objId, { type: "WF_STATUS", value: "CHECKOUT", flowId: flowId });
      } else {
        me.sord = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO);
        departureDateIso = sol.common.SordUtils.nowIsoForConnection(ixConnect, { pattern: "YYYYMMDD" });
        sol.common.SordUtils.setObjKeyValue(me.sord, "VISITOR_DEPARTUREDATE", departureDateIso);
        departureTimeString = sol.common.SordUtils.nowIsoForConnection(ixConnect, { pattern: "HH:mm" });
        sol.common.SordUtils.setObjKeyValue(me.sord, "VISITOR_DEPARTURETIME", departureTimeString);
        ixConnect.ix().checkinSord(me.sord, SordC.mbAllIndex, LockC.NO);
        flowId = sol.visitor.ix.VisitorUtils.startCheckOutVisitorWorkflow(objId, wfName, { interactive: me.interactive });
      }
    } else {
      me.addErrorEvent("sol.visitor.ix.actions.CheckInVisitor.errorInvalidElement", null, null, me.ci);
    }
  }
});

/**
 * @member sol.visitor.ix.actions.CheckOutVisitor
 * @method RF_sol_visitor_action_CheckOutVisitor
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_visitor_action_CheckOutVisitor(ec, configAny) {
  logger.enter("RF_sol_visitor_action_CheckOutVisitor", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "visitorObjId"),
      checkOutVisitor, result;

  config.ci = ec.ci;
  config.user = ec.user;

  checkOutVisitor = sol.create("sol.visitor.ix.actions.CheckOutVisitor", config);
  result = checkOutVisitor.execute();
  logger.exit("RF_sol_visitor_action_CheckOutVisitor", result);
  return result;
}

