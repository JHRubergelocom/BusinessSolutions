
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
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.ChangePostType" }); // eslint-disable-line one-var

/**
 * Changes a post type
 *
 * # Change a post type
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_ChangeType", {
 *       objId: "(7146D09A-3889-BE1F-EDC7-631166F86797)",
 *       type: "Article",
 *       solutionId: "(7146D09A-3889-BE1F-EDC7-631173421797)"
 *     });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
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
 * @requires sol.knowledge.ix.KnowledgeUtils
 */
sol.define("sol.knowledge.ix.services.ChangePostType", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId", "type", "solutionId"],

  /**
   * @cfg {String} objId (required)
   * Object ID
   */

  /**
   * @cfg {String} type (required)
   * Type
   */

  /**
   * @cfg {String} solutionId (required)
   * Solution ID
   */


  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [params]);
    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
  },

  /**
   * Changes a post type.
   * @return {Object}
   */
  changePostType: function () {
    var me = this,
        post, objId, flowName, flowNameData, postTemplateObjId, postTemplate,
        label, contentType, postType, postReferenceGen, postReference,
        postSolved;

    if (sol.common.AclUtils.hasEffectiveRights(me.objId, { rights: { w: true } })) {
      postTemplateObjId = sol.common.RepoUtils.getObjIdFromRelativePath(me.knowledgeConfig.postTypeTemplateFolderId, "/" + me.type);
      if (!postTemplateObjId) {
        throw "Post template not found";
      }
      postTemplate = sol.common.RepoUtils.getSord(postTemplateObjId);

      label = sol.common.SordUtils.getObjKeyValue(postTemplate, "KNOWLEDGE_LABEL");
      contentType = sol.common.SordUtils.getObjKeyValue(postTemplate, "KNOWLEDGE_CONTENT_TYPE");
      postType = me.type;
      postReferenceGen = sol.common.SordUtils.getObjKeyValue(postTemplate, "KNOWLEDGE_POST_REFERENCE_GEN");
      postReference = sol.common.SordUtils.getObjKeyValue(postTemplate, "KNOWLEDGE_POST_REFERENCE");
      post = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);
      if (me.containsClassName(me.knowledgeConfig.updateXDateServices)) {
        post.XDateIso = sol.common.SordUtils.nowIsoForConnection();
      }
      sol.common.SordUtils.setObjKeyValue(post, "KNOWLEDGE_LABEL", label);
      sol.common.SordUtils.setObjKeyValue(post, "KNOWLEDGE_CONTENT_TYPE", contentType);
      sol.common.SordUtils.setObjKeyValue(post, "KNOWLEDGE_POST_TYPE", postType);
      sol.common.SordUtils.setObjKeyValue(post, "KNOWLEDGE_POST_REFERENCE_GEN", postReferenceGen);
      sol.common.SordUtils.setObjKeyValue(post, "KNOWLEDGE_POST_REFERENCE", postReference);
      post.type = postTemplate.type;

      objId = ixConnect.ix().checkinSord(post, SordC.mbAllIndex, LockC.NO);

      postSolved = sol.knowledge.ix.KnowledgeUtils.getContentTypePermissions(contentType).solved;
      if (postSolved === false) {
        if (me.solutionId != "-1") {
          sol.common.IxUtils.execute("RF_sol_knowledge_service_Reply_UnMarkSolved", {
            replyGuid: me.solutionId
          });
        }
      }

      flowNameData = { sordName: String(post.name) };
      flowName = sol.create("sol.common.Template", { source: me.knowledgeConfig.workflows.changePostType.workflowNameTemplate }).apply(flowNameData);
      sol.common.WfUtils.startWorkflow(me.knowledgeConfig.workflows.changePostType.workflowTemplate, flowName, objId);

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
 * @method RF_sol_knowledge_service_Post_ChangeType
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Post_ChangeType(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Post_ChangeType", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "type", "solutionId");
  service = sol.create("sol.knowledge.ix.services.ChangePostType", params);
  result = rfUtils.stringify(service.changePostType());

  logger.exit("RF_sol_knowledge_service_Post_ChangeType", result);

  return result;
}
