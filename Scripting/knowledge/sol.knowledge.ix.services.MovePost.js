
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.SubscriptionUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common_monitoring.ix.MonitorUtils.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.MovePost" }); // eslint-disable-line one-var

/**
 * Moves a post
 *
 * # Move a post
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Move", {
 *       postGuid: "(7146D09A-3889-BE1F-EDC7-631166F86797)",
 *       spaceGuid: "(7146D09A-3889-BE1F-EDC7-631178129823)"
 *     });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.DateUtils
 * @requires sol.common.Template
 * @requires sol.common.AclUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.SubscriptionUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common_monitoring.ix.MonitorUtils
 * @requires sol.knowledge.ix.KnowledgeUtils
 */
sol.define("sol.knowledge.ix.services.MovePost", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["postGuid", "spaceGuid"],

  /**
   * @cfg {String} postGuid (required)
   * Source Post
   */

  /**
   * @cfg {String} spaceGuid (required)
   * Target Space
   */

  /**
   * @cfg {String} [comment=""] (optional)
   * Comment
   */
  comment: "",

  /**
   * @cfg {Boolean} [changeDate=true] (optional)
   * If `true`, the date will be changed
   */
  changeDate: true,

  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [params]);

    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
  },

  /**
   * Moves a post.
   * @return {Object}
   */
  movePost: function () {
    var me = this,
        space, post, postId, flowName, flowNameData, XDateIsoOld, action, isoString;

    if (!me.postGuid) {
      throw "InitializationException: 'postGuid' has to be defined";
    }

    if (!me.spaceGuid) {
      throw "InitializationException: 'spaceGuid' has to be defined";
    }

    post = sol.common.RepoUtils.getSord(me.postGuid);
    if (!post || !"KNOWLEDGE_POST".equals(sol.common.SordUtils.getObjKeyValue(post, "SOL_TYPE"))) {
      throw "Reading post failed. Passed object with name '" + post.name + "' is not a post.";
    }

    space = sol.common.RepoUtils.getSord(me.spaceGuid);
    if (!space || !"KNOWLEDGE_SPACE".equals(sol.common.SordUtils.getObjKeyValue(space, "SOL_TYPE"))) {
      throw "Reading space failed. Passed object with name '" + space.name + "' is not a space.";
    }

    if (!me.knowledgeConfig.postLocales.defaultLocale) {
      throw "PostLocales Default Locale not found";
    }

    if (!sol.common.AclUtils.hasEffectiveRights(me.postGuid, { rights: { d: true, w: true } })) {
      throw "Current User has no delete/write right to current post";
    }

    if (!sol.common.AclUtils.hasEffectiveRights(me.spaceGuid, { rights: { w: true } })) {
      throw "Current User has no write right to current space";
    }

    sol.common.IxUtils.execute("RF_sol_function_Move", {
      objId: me.postGuid,
      targetId: me.spaceGuid,
      adjustRights: true
    });

    post = ixConnect.ix().checkoutSord(me.postGuid, SordC.mbAllIndex, LockC.NO);
    XDateIsoOld = post.XDateIso;

    if (me.containsClassName(me.knowledgeConfig.updateXDateServices)) {
      post.XDateIso = sol.common.SordUtils.nowIsoForConnection();
    }

    if (me.changeDate === false) {
      post.XDateIso = XDateIsoOld;
    }

    if (me.changeDate === true) {    
      isoString = sol.common.DateUtils.nowIso({ utcOffset: 0 });
      sol.common.SordUtils.setObjKeyValue(post, "KNOWLEDGE_LAST_EDITED_DATE", isoString);      
    }              

    postId = ixConnect.ix().checkinSord(post, SordC.mbAllIndex, LockC.NO);

    flowNameData = { sordName: String(post.name) };
    flowName = sol.create("sol.common.Template", { source: me.knowledgeConfig.workflows.movePost.workflowNameTemplate }).apply(flowNameData);
    sol.common.WfUtils.startWorkflow(me.knowledgeConfig.workflows.movePost.workflowTemplate, flowName, post.id);

    if (!me.comment.equals("")) {
      action = ixConnect.feedService.createAction(EActionType.UserComment, post.id);
      action.text = me.comment;
      ixConnect.feedService.checkinAction(action, ActionC.mbAll);
    }

    me.registerUpdates(post);

    return { success: true, postId: postId };
  },

  /**
   * @private
   * Registers an update workflow for the post, and all replies.
   * @param {de.elo.ix.client.Sord} post
   */
  registerUpdates: function (post) {
    var me = this,
        updatePostWfTemplate, updateReplyWfTemplate, replies;

    updatePostWfTemplate = me.knowledgeConfig.workflows.updatePost.workflowTemplateName;
    updateReplyWfTemplate = me.knowledgeConfig.workflows.updateReply.workflowTemplateName;

    sol.common_monitoring.ix.MonitorUtils.registerUpdate(post.id, updatePostWfTemplate);

    replies = sol.common.RepoUtils.findChildren(post.id, {
      includeFolders: true,
      includeDocuments: false,
      maskId: me.knowledgeConfig.services.createReply.mask
    });
    if (replies && (replies.length > 0)) {
      replies.forEach(function (reply) {
        sol.common_monitoring.ix.MonitorUtils.registerUpdate(reply.id, updateReplyWfTemplate);
      });
    }
  }

});

/**
 * @member sol.knowledge.ix.services.MovePost
 * @method RF_sol_knowledge_service_Post_Move
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Post_Move(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Post_Move", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "postGuid", "spaceGuid");
  service = sol.create("sol.knowledge.ix.services.MovePost", params);
  result = rfUtils.stringify(service.movePost());

  logger.exit("RF_sol_knowledge_service_Post_Move", result);

  return result;
}
