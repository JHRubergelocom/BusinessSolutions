
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
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common_monitoring.ix.MonitorUtils.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.EditPost" }); // eslint-disable-line one-var

/**
 * Edits a post
 *
 * # Edit a post
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Edit", {
 *       objId: "(7146D09A-3889-BE1F-EDC7-631166F86797)",
 *       content: "Content2",
 *       lang: "de",
 *       topics: ["Topic3", "Topic4"],
 *       pinnedAt: ["pin1", "pin2"],
 *       label: "Label1",
 *       createdFiles: ["(0C055DF8-9567-A640-0C01-741E5C264250)", "(BD628BE4-5951-E722-0B07-6F903756A226)"],
 *       createReferences: ["(0C055DF8-9567-A640-0C01-53A231289DD1)", "(BD628BE4-5951-E722-0B07-44FFED3412AA)"],
 *       deleteReferences: ["(0C055DF8-9567-A640-99A1-741E5C264250)", "(BD628BE4-5951-BB23-C123-6F903756A226)"]
 *     });
 *
 * @author MW, ELO Digital Office GmbH
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
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common_monitoring.ix.MonitorUtils
 * @requires sol.knowledge.ix.KnowledgeUtils
 */
sol.define("sol.knowledge.ix.services.EditPost", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   * Object ID
   */

  /**
   * @cfg {String} content
   * Content
   */

  /**
   * @cfg {String} subject
   * Subject
   */

  /**
   * @cfg {String[]} topics
   * Topics
   */

  /**
   * @cfg {Array} pinnedAt
   * PinnedAt
   */
  
  /**
   * @cfg {String} label
   * Label
   */

  /**
   * @cfg {String[]} createdFiles
   * Object IDs of created files
   */

  /**
   * @cfg {String} lang
   * language abbreviation, that language will be used.
   * The length has to be 2.
   */

  /**
   * @cfg {Array} createReferences
   * Object IDs of referenzes to create in post
   */

  /**
   * @cfg {Array} deleteReferences
   * Object IDs of referenzes to delete in post
   */

  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [params]);

    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
  },

  /**
   * Edits a post.
   * @return {Object}
   */
  editPost: function () {
    var me = this,
        post, objId, flowName, flowNameData;

    if (sol.common.AclUtils.hasEffectiveRights(me.objId, { rights: { w: true } })) {

      if (!me.knowledgeConfig.postLocales.defaultLocale) {
        throw "PostLocales Default Locale not found";
      }

      post = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);
      if (me.content) {
        post.desc = me.content;
      }
      if (me.subject) {
        sol.common.SordUtils.setObjKeyValue(post, me.knowledgeConfig.fields.knowledgePostSubject, me.subject);
      }
      if (me.topics) {
        sol.common.SordUtils.setObjKeyValues(post, me.knowledgeConfig.fields.knowledgeTopics, me.topics);
      }
      if (me.pinnedAt) {
        sol.common.SordUtils.setObjKeyValues(post, me.knowledgeConfig.fields.knowledgePinnedAt, me.pinnedAt);
      }

      if (me.label) {
        sol.common.SordUtils.setObjKeyValue(post, me.knowledgeConfig.fields.knowledgeLabel, me.label);
      }  

      if (me.lang && (me.lang.length === 2)) {
        sol.common.SordUtils.setObjKeyValue(post, me.knowledgeConfig.fields.knowledgeLanguage, me.lang);
      } else {
        sol.common.SordUtils.setObjKeyValue(post, me.knowledgeConfig.fields.knowledgeLanguage, me.knowledgeConfig.postLocales.defaultLocale);
      }

      if (me.containsClassName(me.knowledgeConfig.updateXDateServices)) {
        post.XDateIso = sol.common.SordUtils.nowIsoForConnection();
      }
      objId = ixConnect.ix().checkinSord(post, SordC.mbAllIndex, LockC.NO);

      sol.common.RepoUtils.moveSords(me.createdFiles, objId);

      sol.knowledge.ix.KnowledgeUtils.createReferences(me.createReferences, objId);
      sol.knowledge.ix.KnowledgeUtils.deleteReferences(me.deleteReferences, objId);

      flowNameData = { sordName: String(post.name) };
      flowName = sol.create("sol.common.Template", { source: me.knowledgeConfig.workflows.editPost.workflowNameTemplate }).apply(flowNameData);

      sol.common.WfUtils.startWorkflow(me.knowledgeConfig.workflows.editPost.workflowTemplate, flowName, objId);

      me.registerUpdates(post);
    }

    return { objId: objId };
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
 * @member sol.knowledge.ix.services.Post
 * @method RF_sol_knowledge_service_Post_Edit
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Post_Edit(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Post_Edit", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.knowledge.ix.services.EditPost", params);
  result = rfUtils.stringify(service.editPost());

  logger.exit("RF_sol_knowledge_service_Post_Edit", result);

  return result;
}
