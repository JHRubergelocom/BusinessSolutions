
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.SubscriptionUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js
//@include lib_sol.knowledge.ix.ReputationUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.CreateReply" }); // eslint-disable-line one-var

/**
 * Creates a reply
 *
 * # Create a reply
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_service_Reply_Create", {
 *       type: "Reply",
 *       postGuid: "(7146D09A-3889-BE1F-EDC7-631166F86797)",
 *       content: "Content1",
 *       createdFiles: ["(0C055DF8-9567-A640-0C01-741E5C264250)", "(BD628BE4-5951-E722-0B07-6F903756A226)"]
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
sol.define("sol.knowledge.ix.services.CreateReply", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["postGuid", "type", "subject"],

  /**
   * @cfg {String} type
   * Type
   */

  /**
   * @cfg {String} postGuid
   * Post GUID
   */

  /**
   * @cfg {String} content
   * Content
   */

  /**
   * @cfg {Array} createdFiles
   * Object IDs of created files
   */

  /**
   * @cfg {String} feedId
   * feedId
   */

  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [params]);

    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
  },

  /**
   * Creates a reply within the current post.
   * @return {Object}
   */
  createReply: function () {
    var me = this, conn = ixConnect,
        post, replyTemplateObjId, reply, replyTemplate, space, objId, flowNameData, workflowTemplateName, flowName, guid, score,
        contentType, action, currentUser;

    post = sol.common.RepoUtils.getSord(me.postGuid);
    replyTemplateObjId = sol.common.RepoUtils.getObjIdFromRelativePath(me.knowledgeConfig.replyTypeTemplateFolderId, "/" + me.type);
    if (!replyTemplateObjId) {
      throw "Reply template not found";
    }

    if (!sol.common.AclUtils.hasEffectiveRights(post.id, { rights: { l: true } })) {
      throw "Current User has no list right to current post";
    }

    replyTemplate = sol.common.RepoUtils.getSord(replyTemplateObjId);
    space = sol.knowledge.ix.KnowledgeUtils.findSpace(post.id);
    reply = sol.common.SordUtils.cloneSord(post, {
      dstSord: replyTemplate,
      dstParentId: me.postGuid,
      memberNames: ["name", "type"],
      objKeyNames: me.knowledgeConfig.services.createReply.copyFieldNames
    });

    reply.aclItems = space.aclItems;
    sol.common.SordUtils.addRights(reply, { users: ["$CURRENTUSER"], rights: me.knowledgeConfig.services.createReply.userRights });
    sol.common.SordUtils.setObjKeyValue(reply, me.knowledgeConfig.fields.objectType, me.knowledgeConfig.services.createReply.objectType);
    reply.desc = me.content;
    reply.type = replyTemplate.type;

    if (me.feedId) {
      if (me.feedId != "-1") {
        action = ixConnect.feedService.checkoutAction(me.feedId, ActionC.mbAll);
        currentUser = ixConnect.loginResult.user;
        if (currentUser.id != action.userId) {
          if (sol.common.AclUtils.hasEffectiveRights(space.id, { rights: { w: true } })) {
            conn = ixConnectAdmin;
            reply.ownerId = action.userId;
            reply.ownerName = action.userName;
          }        
        }  
      }
    }

    objId = conn.ix().checkinSord(reply, SordC.mbAllIndex, LockC.NO);
    sol.common.RepoUtils.moveSords(me.createdFiles, objId);
    score = sol.common.SordUtils.incObjKeyValue(post, me.knowledgeConfig.fields.knowledgeCountReplies);

    if (me.containsClassName(me.knowledgeConfig.updateXDateServices)) {
      post.XDateIso = sol.common.SordUtils.nowIsoForConnection(ixConnectAdmin);
    }
    ixConnectAdmin.ix().checkinSord(post, SordC.mbAllIndex, LockC.NO);

    flowNameData = { sordName: String(post.name) };
    flowName = sol.create("sol.common.Template", { source: me.knowledgeConfig.workflows.createReply.workflowNameTemplate }).apply(flowNameData);

    workflowTemplateName = sol.common.SordUtils.getObjKeyValue(reply, me.knowledgeConfig.workflows.createReply.workflowTemplateFieldName);
    if (!workflowTemplateName) {
      throw "Workflow template name is empty: replyType=" + me.type;
    }

    // count maximum replies for this post
    sol.knowledge.ix.ReputationUtils.maxCount("RECEIVE_POST_REPLIES_MAX", post.ownerId, score);

    contentType = sol.common.SordUtils.getObjKeyValue(post, "KNOWLEDGE_CONTENT_TYPE");
    sol.knowledge.ix.ReputationUtils.maxCount("RECEIVE_POST_REPLIES_" + contentType + "_MAX", post.ownerId, score);

    sol.common.WfUtils.startWorkflow(workflowTemplateName, flowName, objId);

    guid = sol.common.RepoUtils.getGuid(objId);

    sol.common.ix.SubscriptionUtils.subscribeToElement(post.id);
    sol.common.ix.SubscriptionUtils.subscribeToElement(objId);

    return { objId: objId, guid: guid };
  }
});

/**
 * @member sol.knowledge.ix.services.Post
 * @method RF_sol_knowledge_service_Reply_Create
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Reply_Create(ec, args) {
  var params, service, result;

  logger.enter("RF_sol_knowledge_service_Reply_Create", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "postGuid", "type", "content");
  service = sol.create("sol.knowledge.ix.services.CreateReply", params);
  result = sol.common.ix.RfUtils.stringify(service.createReply());

  logger.exit("RF_sol_knowledge_service_Reply_Create", result);

  return result;
}
