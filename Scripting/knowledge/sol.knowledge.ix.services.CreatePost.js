
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.SubscriptionUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.CreatePost" }); // eslint-disable-line one-var

/**
 * Creates a post
 *
 * # Create a post
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Create", {
 *       type: "Article",
 *       subject: "Subject1",
 *       content: "Content1",
 *       spaceFolderId: "96657",
 *       lang: "de",
 *       topics: ["Topic1", "Topic2"],
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
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.SubscriptionUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.knowledge.ix.KnowledgeUtils
 */
sol.define("sol.knowledge.ix.services.CreatePost", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["spaceFolderId", "type", "subject"],

  /**
   * @cfg {String} type
   * Type
   */

  /**
   * @cfg {String} subject
   * Subject
   */

  /**
   * @cfg {String} content
   * Content
   */

  /**
   * @cfg {String} spaceFolderId
   * Knowledge space folder ID
   */

  /**
   * @cfg {Array} topics
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
   * @cfg {Array} createdFiles
   * Object IDs of created files
   */

  /**
   * @cfg {String} lang
   * If set with a language abbreviation, that language will be used. The login language is the default.
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
   * Creates a new post within the current space.
   * @return {Object}
   */
  createPost: function () {
    var me = this,
        postTemplateObjId, postTemplate, post, now, objId, flowNameData, workflowTemplateName, flowName, guid, language;

    postTemplateObjId = sol.common.RepoUtils.getObjIdFromRelativePath(me.knowledgeConfig.postTypeTemplateFolderId, "/" + me.type);

    if (!postTemplateObjId) {
      throw "Post template not found";
    }

    if (!me.knowledgeConfig.postLocales.defaultLocale) {
      throw "PostLocales Default Locale not found";
    }


    postTemplate = sol.common.RepoUtils.getSord(postTemplateObjId);
    me.spaceFolderId = sol.common.RepoUtils.getObjId(me.spaceFolderId);

    if (!sol.common.AclUtils.hasEffectiveRights(me.spaceFolderId, { rights: { l: true } })) {
      throw "Current User has no list right to current space";
    }

    post = sol.common.SordUtils.cloneSord(postTemplate, { dstParentId: me.spaceFolderId });
    sol.common.SordUtils.addRights(post, { users: ["$CURRENTUSER"], rights: me.knowledgeConfig.services.createPost.userRights });

    post.desc = me.content;
    now = sol.common.SordUtils.nowIsoForConnection();
    post.IDateIso = now;
    if (!post.XDateIso || me.containsClassName(me.knowledgeConfig.updateXDateServices)) {
      post.XDateIso = now;
    }
    sol.common.SordUtils.setObjKeyValue(post, me.knowledgeConfig.fields.objectType, me.knowledgeConfig.services.createPost.objectType);
    sol.common.SordUtils.setObjKeyValue(post, me.knowledgeConfig.fields.knowledgePostSubject, me.subject);
    sol.common.SordUtils.setObjKeyValue(post, me.knowledgeConfig.fields.knowledgePostType, me.type);
    if (!me.topics) {
      me.topics = [];
    }
    sol.common.SordUtils.setObjKeyValues(post, me.knowledgeConfig.fields.knowledgeTopics, me.topics);
    if (!me.pinnedAt) {
      me.pinnedAt = [];
    }
    sol.common.SordUtils.setObjKeyValues(post, me.knowledgeConfig.fields.knowledgePinnedAt, me.pinnedAt);

    if (me.label) {
      sol.common.SordUtils.setObjKeyValue(post, me.knowledgeConfig.fields.knowledgeLabel, me.label);
    }

    if (me.lang && (me.lang.length === 2)) {
      language = me.lang;
    } else {
      language = me.knowledgeConfig.postLocales.defaultLocale;
    }
    sol.common.SordUtils.setObjKeyValue(post, me.knowledgeConfig.fields.knowledgeLanguage, language);

    post.type = postTemplate.type;
    objId = ixConnect.ix().checkinSord(post, SordC.mbAllIndex, LockC.NO);

    sol.common.RepoUtils.moveSords(me.createdFiles, objId);

    sol.knowledge.ix.KnowledgeUtils.createReferences(me.createReferences, objId);
    sol.knowledge.ix.KnowledgeUtils.deleteReferences(me.deleteReferences, objId);

    flowNameData = { sordName: String(post.name) };
    flowName = sol.create("sol.common.Template", { source: me.knowledgeConfig.workflows.createPost.workflowNameTemplate }).apply(flowNameData);

    workflowTemplateName = sol.common.SordUtils.getObjKeyValue(post, me.knowledgeConfig.workflows.createPost.workflowTemplateFieldName);
    if (!workflowTemplateName) {
      throw "Workflow template name is empty: postType=" + me.type;
    }

    sol.common.WfUtils.startWorkflow(workflowTemplateName, flowName, objId);

    guid = sol.common.RepoUtils.getGuid(objId);

    sol.common.ix.SubscriptionUtils.subscribeToElement(objId);

    return { objId: objId, guid: guid };
  }
});

/**
 * @member sol.knowledge.ix.services.Post
 * @method RF_sol_knowledge_service_Post_Create
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Post_Create(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Post_Create", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "spaceFolderId", "type", "subject");
  service = sol.create("sol.knowledge.ix.services.CreatePost", params);
  result = rfUtils.stringify(service.createPost());

  logger.exit("RF_sol_knowledge_service_Post_Create", result);

  return result;
}
