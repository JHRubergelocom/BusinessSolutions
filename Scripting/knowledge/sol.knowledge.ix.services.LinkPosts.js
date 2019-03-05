
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

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.LinkPosts" }); // eslint-disable-line one-var

/**
 * Link posts
 *
 * # Link posts
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_service_Link_Posts", {
 *       fromPostGuid: "(7146D09A-3889-BE1F-EDC7-631166F86797)",
 *       toPostGuids: ["(7146D09A-3889-BE1F-EDC7-631178129823)", "(7146D09A-3889-BE1F-EDC7-631178129825)"]
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
sol.define("sol.knowledge.ix.services.LinkPosts", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["fromPostGuid", "toPostGuids"],

  /**
   * @cfg {String} fromPostGuid (required)
   * From Post
   */

  /**
   * @cfg {String|String[]} toPostGuids (required)
   * To Posts
   */

  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [params]);

    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
  },

  /**
   * Link posts.
   * @return {Object}
   */
  linkPosts: function () {
    var me = this,
        space, post, postId, postsLinkTo, flowName, flowNameData;

    if (!me.fromPostGuid) {
      throw "InitializationException: 'fromPostGuid' has to be defined";
    }

    if (!me.toPostGuids) {
      throw "InitializationException: 'toPostGuids' has to be defined";
    }

    postsLinkTo = (sol.common.ObjectUtils.isArray(me.toPostGuids)) ? me.toPostGuids : [me.toPostGuids];



    post = sol.common.RepoUtils.getSord(me.fromPostGuid);
    if (!post || !"KNOWLEDGE_POST".equals(sol.common.SordUtils.getObjKeyValue(post, "SOL_TYPE"))) {
      throw "Reading post failed. Passed object with name '" + post.name + "' is not a post.";
    }

    space = sol.common.RepoUtils.getSord(me.toPostGuids);
    if (!space || !"KNOWLEDGE_SPACE".equals(sol.common.SordUtils.getObjKeyValue(space, "SOL_TYPE"))) {
      throw "Reading space failed. Passed object with name '" + space.name + "' is not a space.";
    }

    if (!me.knowledgeConfig.postLocales.defaultLocale) {
      throw "PostLocales Default Locale not found";
    }

    if (!sol.common.AclUtils.hasEffectiveRights(me.fromPostGuid, { rights: { d: true, w: true } })) {
      throw "Current User has no delete/write right to current post";
    }

    if (!sol.common.AclUtils.hasEffectiveRights(me.toPostGuids, { rights: { w: true } })) {
      throw "Current User has no write right to current space";
    }

    post = ixConnect.ix().checkoutSord(me.fromPostGuid, SordC.mbAllIndex, LockC.NO);

    if (me.containsClassName(me.knowledgeConfig.updateXDateServices)) {
      post.XDateIso = sol.common.SordUtils.nowIsoForConnection();
    }
    postId = ixConnect.ix().checkinSord(post, SordC.mbAllIndex, LockC.NO);

    flowNameData = { sordName: String(post.name) };
    flowName = sol.create("sol.common.Template", { source: me.knowledgeConfig.workflows.linkPosts.workflowNameTemplate }).apply(flowNameData);
    sol.common.WfUtils.startWorkflow(me.knowledgeConfig.workflows.linkPosts.workflowTemplate, flowName, post.id);

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
 * @member sol.knowledge.ix.services.LinkPosts
 * @method RF_sol_knowledge_service_Link_Posts
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Link_Posts(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Link_Posts", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "fromPostGuid", "toPostGuids");
  service = sol.create("sol.knowledge.ix.services.LinkPosts", params);
  result = rfUtils.stringify(service.linkPosts());

  logger.exit("RF_sol_knowledge_service_Link_Posts", result);

  return result;
}
