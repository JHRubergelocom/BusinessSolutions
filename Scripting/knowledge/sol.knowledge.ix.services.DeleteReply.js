
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.SubscriptionUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js
//@include lib_sol.knowledge.ix.ReputationUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.DeleteReply" }); // eslint-disable-line one-var

/**
 * Deletes a reply
 *
 * # Delete a reply
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_service_Reply_Delete", {
 *       postGuid: "(7146D09A-3889-BE1F-EDC7-631166F86797)" *
 *       objId: "(C7076526-791B-7111-24CC-F477256868BE)"
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
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.Map
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.SubscriptionUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.knowledge.ix.KnowledgeUtils
 * @requires sol.knowledge.ix.ReputationUtils
 */
sol.define("sol.knowledge.ix.services.DeleteReply", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["postGuid", "objId"],

  /**
   * @cfg {String} postGuid (required)
   * Post GUID
   */

  /**
   * @cfg {String} objId (required)
   * Object ID
   */

  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [params]);

    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
  },

  /**
   * Deletes a reply.
   * @return {Object}
   */
  execute: function () {
    var me = this,
        reply, flowName, flowNameData, post, score, contentType, replySolved;

    if (!sol.common.AclUtils.hasEffectiveRights(me.objId, { rights: { d: true } })) {
      throw "Current User has no delete right to current reply";
    }

    post = sol.common.RepoUtils.getSord(me.postGuid);

    score = sol.common.SordUtils.decObjKeyValue(post, me.knowledgeConfig.fields.knowledgeCountReplies);

    if (me.containsClassName(me.knowledgeConfig.updateXDateServices)) {
      post.XDateIso = sol.common.SordUtils.nowIsoForConnection(ixConnectAdmin);
    }
    ixConnectAdmin.ix().checkinSord(post, SordC.mbAllIndex, LockC.NO);

    // count maximum replies for this post
    sol.knowledge.ix.ReputationUtils.maxCount("RECEIVE_POST_REPLIES_MAX",
    post.ownerId,
    score);

    contentType = sol.common.SordUtils.getObjKeyValue(post, "KNOWLEDGE_CONTENT_TYPE");
    sol.knowledge.ix.ReputationUtils.maxCount("RECEIVE_POST_REPLIES_" + contentType + "_MAX",
        post.ownerId,
        score);

    sol.common.ix.SubscriptionUtils.unsubscribeFromElement(post.id);
    sol.common.ix.SubscriptionUtils.unsubscribeFromElement(me.objId);

    // unmark solved reply
    reply = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);
    replySolved = sol.common.SordUtils.getObjKeyValue(reply, "KNOWLEDGE_SOLVED");
    if (replySolved == "1") {
      sol.common.IxUtils.execute("RF_sol_knowledge_service_Reply_UnMarkSolved", {
        replyGuid: reply.guid
      });

    }

    flowNameData = { sordName: String(reply.name) };
    flowName = sol.create("sol.common.Template", { source: me.knowledgeConfig.workflows.deleteReply.workflowNameTemplate }).apply(flowNameData);
    sol.common.WfUtils.startWorkflow(me.knowledgeConfig.workflows.deleteReply.workflowTemplate, flowName, reply.id);

    return { success: true };
  }
});

/**
 * @member sol.knowledge.ix.services.DeleteReply
 * @method RF_sol_knowledge_service_Reply_Delete
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Reply_Delete(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Reply_Delete", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "postGuid", "objId");
  service = sol.create("sol.knowledge.ix.services.DeleteReply", params);
  result = rfUtils.stringify(service.execute());

  logger.exit("RF_sol_knowledge_service_Reply_Delete", result);

  return result;
}
