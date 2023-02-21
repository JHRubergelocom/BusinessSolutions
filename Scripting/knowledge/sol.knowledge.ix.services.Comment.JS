
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common_monitoring.ix.MonitorUtils.js
//@include lib_sol.common.ix.SubscriptionUtils.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.Comment" });

/**
 * Provides service functions for Comments.
 *
 *
 * @author NM, ELO Digital Office GmbH
 * @version 1.01.002
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.IxUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.Template
 * @requires sol.common.AclUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common_monitoring.ix.MonitorUtils
 * @requires sol.common.ix.SubscriptionUtils
 * @requires sol.knowledge.ix.KnowledgeUtils
 */
sol.define("sol.knowledge.ix.services.Comment", {
  extend: "sol.common.ix.ServiceBase",

  maxComments: 100,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
  },

  /**
   * @private
   * Adds a user comment to the feed.
   * @return {Object} feedActionId of created user comment
   */
  addComment: function () {
    var me = this,
        action, feedActionId, sordPostReply;

    if (!me.objId) {
      throw "InitializationException: 'objId' has to be defined";
    }

    if (!me.text) {
      throw "InitializationException: 'text' has to be defined";
    }

    if (!sol.common.AclUtils.hasEffectiveRights(me.objId, { rights: { l: true } })) {
      throw "Current User has no list right to 'objId'";
    }

    sordPostReply = sol.common.RepoUtils.getSord(me.objId);
    if (!sordPostReply || !"OPEN".equals(sol.common.SordUtils.getObjKeyValue(sordPostReply, "KNOWLEDGE_STATUS"))) {
      throw "Reading status post/reply failed. Passed object with name '" + sordPostReply.name + "' is not opened.";
    }

    if (me.text) {
      action = ixConnect.feedService.createAction(EActionType.UserComment, me.objId);
      action.text = me.text;
      feedActionId = ixConnect.feedService.checkinAction(action, ActionC.mbAll);
    }

    if (me.containsClassName(me.knowledgeConfig.updateXDateServices)) {
      sol.knowledge.ix.KnowledgeUtils.updateXdate(me.objId, me.knowledgeConfig);
    }

    return { feedActionId: feedActionId };
  },

  /**
   * @private
   * Edits a user comment to the feed.
   * @return {Bolean} Indicates that editing of user comment was successful
   */
  editComment: function () {
    var me = this,
        action, feedGuid, sordPostReply;

    if (!me.objId) {
      throw "InitializationException: 'objId' has to be defined";
    }

    if (!me.text) {
      throw "InitializationException: 'text' has to be defined";
    }

    if (!me.feedActionId) {
      throw "InitializationException: 'feedActionId' has to be defined";
    }

    action = ixConnect.feedService.checkoutAction(me.feedActionId, ActionC.mbAll);
    feedGuid = String(action.feedGuid);

    if (sol.common.ix.SubscriptionUtils.getFeedGuid(me.objId) != feedGuid) {
      throw "InitializationException: 'objId' does not fit 'action.feedGuid'";
    }

    sordPostReply = sol.common.RepoUtils.getSord(me.objId);

    if (!sol.common.AclUtils.hasEffectiveRights(sordPostReply, { rights: { l: true } })) {
      throw "Current User has no list right to 'objId'";
    }

    if (!sordPostReply || !"OPEN".equals(sol.common.SordUtils.getObjKeyValue(sordPostReply, "KNOWLEDGE_STATUS"))) {
      throw "Reading status post/reply failed. Passed object with name '" + sordPostReply.name + "' is not opened.";
    }

    action.text = me.text;
    ixConnect.feedService.checkinAction(action, ActionC.mbAll);

    return { true: true };
  },

  /**
   * @private
   * Changes a reply to a user comment to the feed.
   * @return {Object} feedActionId of created user comment
   */
  changeReplyToComment: function () {
    var me = this,
        action, feedActionId, sordPost, sordReply, userInfoReply,
        result;

    if (!me.postGuid) {
      throw "InitializationException: 'postGuid' has to be defined";
    }

    if (!me.replyGuid) {
      throw "InitializationException: 'replyGuid' has to be defined";
    }

    if (!me.objId) {
      throw "InitializationException: 'objId' has to be defined";
    }

    if (!me.text) {
      throw "InitializationException: 'text' has to be defined";
    }

    sordPost = sol.common.RepoUtils.getSord(me.postGuid);
    if (!sordPost || !"KNOWLEDGE_POST".equals(sol.common.SordUtils.getObjKeyValue(sordPost, "SOL_TYPE"))) {
      throw "Reading post failed. Passed object with name '" + sordPost.name + "' is not a post.";
    }

    sordReply = sol.common.RepoUtils.getSord(me.replyGuid);
    if (!sordReply || !"KNOWLEDGE_REPLY".equals(sol.common.SordUtils.getObjKeyValue(sordReply, "SOL_TYPE"))) {
      throw "Reading reply failed. Passed object with name '" + sordReply.name + "' is not a reply.";
    }

    if (!"OPEN".equals(sol.common.SordUtils.getObjKeyValue(sordReply, "KNOWLEDGE_STATUS"))) {
      throw "Reading status reply failed. Passed object with name '" + sordReply.name + "' is not opened.";
    }

    if (!sol.common.AclUtils.hasEffectiveRights(me.objId, { rights: { l: true } })) {
      throw "Current User has no list right to 'objId'";
    }

    result = sol.common.IxUtils.execute("RF_sol_knowledge_service_Reply_Delete", {
      postGuid: me.postGuid,
      objId: me.replyGuid
    });

    if (!result.success) {
      throw "Deleting reply with name '" + sordReply.name + "' failed";
    }

    userInfoReply = sol.common.UserUtils.getUserInfo(sordReply.ownerId);

    if (me.text) {
      action = ixConnectAdmin.feedService.createAction(EActionType.UserComment, me.objId);
      action.text = me.text;
      action.userId = userInfoReply.id;
      action.userGuid = userInfoReply.guid;
      action.userName = userInfoReply.name;
      feedActionId = ixConnectAdmin.feedService.checkinAction(action, ActionC.mbAll);
    }

    if (me.containsClassName(me.knowledgeConfig.updateXDateServices)) {
      sol.knowledge.ix.KnowledgeUtils.updateXdate(me.objId, me.knowledgeConfig);
    }

    return { feedActionId: feedActionId };
  }

});

/**
 * @member sol.knowledge.ix.services.Comment
 * @method RF_sol_knowledge_service_Comment_Add
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Comment_Add(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Comment_Add", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "text");
  service = sol.create("sol.knowledge.ix.services.Comment", params);
  result = service.addComment();
  logger.exit("RF_sol_knowledge_service_Comment_Add", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

/**
 * @member sol.knowledge.ix.services.Comment
 * @method RF_sol_knowledge_service_Comment_Edit
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Comment_Edit(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Comment_Edit", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "feedActionId", "text");
  service = sol.create("sol.knowledge.ix.services.Comment", params);
  result = service.editComment();
  logger.exit("RF_sol_knowledge_service_Comment_Edit", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

/**
 * @member sol.knowledge.ix.services.Comment
 * @method RF_sol_knowledge_service_ChangeReplyToComment
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_ChangeReplyToComment(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_ChangeReplyToComment", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "postGuid", "replyGuid", "objId", "text");
  service = sol.create("sol.knowledge.ix.services.Comment", params);
  result = service.changeReplyToComment();
  logger.exit("RF_sol_knowledge_service_ChangeReplyToComment", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
