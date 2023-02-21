
//@include lib_Class.js
//@include lib_sol.common.AclUtils.js
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

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.actions.SelfCheckIn" });

/**
 * Check in current user.
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.AclUtils
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
sol.define("sol.visitor.ix.actions.SelfCheckIn", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "user"],

  _optimize: {},

  utils: {
    getSord: function (sordId, sordC, lockC) {
      return ixConnect.ix().checkoutSord(sordId, sordC || SordC.mbAllIndex, lockC || LockC.NO);
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
        longTermBadgeId;

    longTermBadgeId = sol.common.ObjectUtils.getProp(params, "$templating.$type.objId");

    me.params = params || {};
    me.$super("sol.common.ix.ActionBase", "initialize", [params]);
    sol.ns("sol.visitor");
    me.config = sol.visitor.ix.VisitorUtils.loadConfig();
    me.params = me.params || {};
    me.params.longTermBadgeId = longTermBadgeId;
  },

  getName: function () {
    return "SelfCheckIn";
  },

  process: function () {
    var me = this,
        params,
        longTermBadgeSord;

    params = sol.common.ObjectUtils.mergeObjects({}, [me.params || {}, me.config || {}]);

    longTermBadgeSord = me.getLongTermBadgeSord(me.params.longTermBadgeId);

    if (me.mayCheckIn(longTermBadgeSord)) {
      me.startCheckIn(longTermBadgeSord, params);
    } else {
      me.addErrorEvent("sol.visitor.ix.actions.CheckInVisitor.errorInvalidLongtermBadge", null, null, me.ci);
    }
  },

  getLongTermBadgeSord: function (longTermBadgeId) {
    var me = this;
    return me.utils.getSord(longTermBadgeId);
  },

  mayCheckIn: function (longTermBadgeSord) {
    return sol.visitor.Utils.isLongtermBadge(longTermBadgeSord)
      && sol.visitor.Utils.isLongtermBadgeActive(longTermBadgeSord)
      && sol.visitor.Utils.isLongtermBadgeInValidTimerange(longTermBadgeSord);
  },

  startCheckIn: function (longTermBadgeSord, params) {
    var me = this,
        visitorSord,
        flowId;

    visitorSord = me.createAndReturnVisitorFromLongTermBadge(longTermBadgeSord, params);
    me.linkLongTermBadgeWithNewlyCreatedVisitor([longTermBadgeSord.id, visitorSord.id]);

    /**
     *  Change rights
     */
    sol.common.AclUtils.changeRightsInBackground(
      visitorSord.id,
      sol.common.TemplateUtils.render({
        users: [
          {
            name: "{{user.name}}",
            rights: {
              r: true,
              w: true,
              e: true,
              d: true,
              l: true
            }
          }
        ],
        recursive: true,
        mode: "SET"
      }, {
        user: me.user,
        visitor: visitorSord,
        longTermBadge: longTermBadgeSord
      })
    );

    flowId = me.startSelfCheckInWorkflow(visitorSord.id, params);

    me.showWorkflowFormular(visitorSord.id, flowId);
    me.addRefreshEvent(visitorSord.id, { type: "WF_STATUS", value: "CHECKIN", flowId: flowId });
  },

  createAndReturnVisitorFromLongTermBadge: function (longTermBadgeSord, params) {
    var me = this,
        intermediateSord,
        visitorSord;

    intermediateSord = me.createAndReturnIntermediateSord(longTermBadgeSord);
    visitorSord = me.createAndReturnVisitorSord(intermediateSord, params);

    return visitorSord;
  },

  createAndReturnIntermediateSord: function (longTermBadgeSord) {
    var me = this,
        visitorObjId,
        visitorSord;

    visitorObjId = me.copyLongTermBadge(longTermBadgeSord);
    visitorSord = me.utils.getSord(visitorObjId, SordC.mbLean);

    return visitorSord;
  },

  copyLongTermBadge: function (longTermBadgeSord) {
    return sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      objId: "0",
      source: longTermBadgeSord.id,
      copySourceAcl: true,
      inheritDestinationAcl: false,
      asAdmin: true,
      copyOnlyBaseElement: true,
      useQuickCopy: true
    });
  },

  createAndReturnVisitorSord: function (intermediateSord, params) {
    var me = this,
        visitorSord,
        visitorTemplateSord;

    visitorTemplateSord = me.getVisitorTemplateSord(intermediateSord, params);
    visitorSord = me.convertIntermediateSordToVisitor(intermediateSord, visitorTemplateSord);

    return visitorSord;
  },

  getVisitorTemplateSord: function (visitorSord, params) {
    var me = this,
        visitorType,
        visitorTemplateId;

    visitorType = sol.common.SordUtils.getObjKeyValue(visitorSord, "LONGTERM_BADGE_VISITOR_TEMPLATE");
    visitorTemplateId = me.getTemplateArcPath(visitorType, params);

    return me.utils.getSord(visitorTemplateId, SordC.mbLean);
  },

  getTemplateArcPath: function (visitorType, params) {
    return sol.common.RepoUtils.getObjIdFromRelativePath(params.visitor.templateFolderId, "/" + visitorType);
  },

  convertIntermediateSordToVisitor: function (intermediateSord, visitorTemplateSord) {
    var me = this,
        visitorSord;

    visitorSord = me.changeVisitorMask(intermediateSord, visitorTemplateSord.mask);

    sol.common.SordUtils.updateSord(visitorSord, [
      { type: "GRP", key: "VISITOR_REFERENCE_GEN", value: sol.common.SordUtils.getObjKeyValue(visitorTemplateSord, "VISITOR_REFERENCE_GEN") },
      { type: "GRP", key: "VISITOR_NAME_GEN", value: sol.common.SordUtils.getObjKeyValue(visitorTemplateSord, "VISITOR_NAME_GEN") },
      { type: "GRP", key: "LONGTERM_BADGE_REFERENCE", value: sol.common.SordUtils.getObjKeyValue(visitorSord, "LONGTERM_BADGE_REFERENCE") }
    ]);

    me.checkInVisitorSord(visitorSord);

    return visitorSord;
  },

  changeVisitorMask: function (visitorSord, mask) {
    var connection = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;
    return connection.ix().changeSordMask(visitorSord, mask, EditInfoC.mbSord).sord;
  },

  checkInVisitorSord: function (visitorSord) {
    var connection = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;
    connection.ix().checkinSord(visitorSord, SordC.mbLean, LockC.NO);
  },

  linkLongTermBadgeWithNewlyCreatedVisitor: function (ids) {
    var connection = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;
    connection.ix().linkSords(ids.shift(), ids, LinkSordC.PAIR);
  },

  startSelfCheckInWorkflow: function (visitorObjId, params) {
    var wfConfig;

    wfConfig = {
      nameTemplate: params.visitor.requestWorkflowNameTemplate,
      prefixKey: params.visitor.requestWorkflows.selfcheckin.workflowPrefixKey,
      ci: params.ci,
      number: params.actionId,
      templateName: params.visitor.requestWorkflows.selfcheckin.workflowTemplateName
    };

    return sol.visitor.ix.VisitorUtils.startWorkflow(visitorObjId, wfConfig, { interactive: params.interactive });
  },

  showWorkflowFormular: function (visitorObjId, flowId) {
    var me = this,
        dialogTitle;

    dialogTitle = sol.common.TranslateTerms.translate("sol.visitor.form.longTermBadge.selfcheckin", me.ci);

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
 * @member sol.visitor.ix.actions.SelfCheckIn
 * @method RF_sol_visitor_action_SelfCheckIn
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_visitor_action_SelfCheckIn(ec, configAny) {
  logger.enter("RF_sol_visitor_action_SelfCheckIn", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny),
      selfCheckIn, result;

  config.ci = ec.ci;
  config.user = ec.user;

  selfCheckIn = sol.create("sol.visitor.ix.actions.SelfCheckIn", config);
  result = selfCheckIn.execute();
  logger.exit("RF_sol_visitor_action_SelfCheckIn", result);
  return result;
}

