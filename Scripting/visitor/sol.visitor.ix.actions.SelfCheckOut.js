
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.visitor.Utils.js
//@include lib_sol.visitor.ix.VisitorUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.actions.SelfCheckOut" });

/**
 * Check in current user.
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
 * @requires sol.visitor.Utils
 * @requires sol.visitor.ix.VisitorUtils
 */
sol.define("sol.visitor.ix.actions.SelfCheckOut", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "user"],

  _optimize: {},

  utils: {
    getSord: function (sordId, sordC, lockC) {
      var connection = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;
      return connection.ix().checkoutSord(sordId, sordC || SordC.mbAllIndex, lockC || LockC.NO);
    }
  },

  /**
   * @cfg {de.elo.ix.client.ClientInfo} ci (required)
   */

  /**
   * @cfg {de.elo.ix.client.UserInfo} user (required)
   */

  initialize: function (params) {
    var me = this,
        visitorId;

    visitorId = sol.common.ObjectUtils.getProp(params, "$templating.$type.objId");

    me.params = params || {};
    me.$super("sol.common.ix.ActionBase", "initialize", [params]);
    sol.ns("sol.visitor");
    me.config = sol.visitor.ix.VisitorUtils.loadConfig();
    me.params = me.params || {};
    me.params.visitorId = visitorId;

  },

  getName: function () {
    return "SelfCheckOut";
  },

  process: function () {
    var me = this,
        params,
        visitorSord;

    params = sol.common.ObjectUtils.mergeObjects({}, [me.params || {}, me.config || {}]);

    visitorSord = me.getVisitorSord(me.params.visitorId);

    if (me.mayCheckOut(visitorSord)) {
      me.startCheckOut(visitorSord, params);
    } else {
      me.addErrorEvent("sol.visitor.ix.actions.CheckOutVisitor.errorInvalidLongtermBadge", null, null, me.ci);
    }
  },

  getVisitorSord: function (visitorId) {
    var me = this;
    return me.utils.getSord(visitorId);
  },

  mayCheckOut: function (visitorSord) {
    return visitorSord != null;
  },

  startCheckOut: function (visitorSord, params) {
    var me = this,
        flowId;

    flowId = me.startSelfCheckOutWorkflow(visitorSord.id, params);

    me.showWorkflowFormular(visitorSord.id, flowId);

    me.addRefreshEvent(visitorSord.id, { type: "WF_STATUS", value: "CHECKOUT", flowId: flowId });
  },

  startSelfCheckOutWorkflow: function (visitorObjId, params) {
    var wfConfig;

    wfConfig = {
      nameTemplate: params.visitor.requestWorkflowNameTemplate,
      prefixKey: params.visitor.requestWorkflows.selfcheckout.workflowPrefixKey,
      ci: params.ci,
      number: params.actionId,
      templateName: params.visitor.requestWorkflows.selfcheckout.workflowTemplateName
    };

    return sol.visitor.ix.VisitorUtils.startWorkflow(visitorObjId, wfConfig, { interactive: params.interactive });
  },

  showWorkflowFormular: function (visitorObjId, flowId) {
    var me = this,
        dialogTitle;

    dialogTitle = sol.common.TranslateTerms.translate("sol.visitor.form.longTermBadge.selfcheckout", me.ci);

    me.addWfDialogEvent(
      flowId,
      {
        objId: visitorObjId,
        dialogId: me.getName(),
        title: dialogTitle
      });
  }
});

/**
 * @member sol.visitor.ix.actions.SelfCheckOut
 * @method RF_sol_visitor_action_SelfCheckOut
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_visitor_action_SelfCheckOut(ec, configAny) {
  logger.enter("RF_sol_visitor_action_SelfCheckOut", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny),
      SelfCheckOut, result;

  config.ci = ec.ci;
  config.user = ec.user;

  SelfCheckOut = sol.create("sol.visitor.ix.actions.SelfCheckOut", config);
  result = SelfCheckOut.execute();
  logger.exit("RF_sol_visitor_action_SelfCheckOut", result);
  return result;
}

