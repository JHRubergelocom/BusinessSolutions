
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordMap.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ObjectFormatter.js


var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.Reply" });

/**
 * Provides service functions for mark solving reply.
 *
 * # Mark solving reply
 *
 *     sol.common.IxUtils.execute("RF_sol_knowledge_service_Reply_MarkSolved", {
 *       // pass replyGuid of post/reply and the id of the user
 *       replyGuid: "GUID"
 *     });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires moment.js
 * @requires sol.common.Config
 * @requires sol.common.AclUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordMap
 * @requires sol.common.SordUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.UserUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.knowledge.ix.services.Reply", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["replyGuid"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.create("sol.common.Config", { compose: "/knowledge/Configuration/knowledge.config" }).config;
  },

  /**
   * @private
   * @param {String} mode
   * @param {String} sordName
   * @param {Boolean} unMark
   * @return {String}
   */
  buildElementName: function (mode, sordName, unMark) {
    var me = this,
        wfName;

    switch (mode) {
      case "reply":
        if (unMark) {
          wfName = sol.create("sol.common.Template", { source: me.config.workflows.replyUnMarkSolved.workflowNameTemplate }).apply({ sordName: sordName });
        } else {
          wfName = sol.create("sol.common.Template", { source: me.config.workflows.replyMarkSolved.workflowNameTemplate }).apply({ sordName: sordName });
        }
        break;
      case "post":
        if (unMark) {
          wfName = sol.create("sol.common.Template", { source: me.config.workflows.postUnMarkSolved.workflowNameTemplate }).apply({ sordName: sordName });
        } else {
          wfName = sol.create("sol.common.Template", { source: me.config.workflows.postMarkSolved.workflowNameTemplate }).apply({ sordName: sordName });
        }
        break;
      default:
        if (unMark) {
          wfName = sol.create("sol.common.Template", { source: me.config.workflows.replyUnMarkSolved.workflowNameTemplate }).apply({ sordName: sordName });
        } else {
          wfName = sol.create("sol.common.Template", { source: me.config.workflows.replyMarkSolved.workflowNameTemplate }).apply({ sordName: sordName });
        }
        break;
    }
    if (wfName.length > 120) {
      wfName = wfName.substr(0, 120);
    }
    return wfName;
  },

  /**
   * @private
   * @param {String} mode
   * @param {Boolean} unMark
   * @return {String}
   */
  getWfTemplate: function (mode, unMark) {
    var me = this,
        wfTemplate;

    switch (mode) {
      case "reply":
        if (unMark) {
          wfTemplate = me.config.workflows.replyUnMarkSolved.workflowTemplateName;
        } else {
          wfTemplate = me.config.workflows.replyMarkSolved.workflowTemplateName;
        }
        break;
      case "post":
        if (unMark) {
          wfTemplate = me.config.workflows.postUnMarkSolved.workflowTemplateName;
        } else {
          wfTemplate = me.config.workflows.postMarkSolved.workflowTemplateName;
        }
        break;
      default:
        if (unMark) {
          wfTemplate = me.config.workflows.replyUnMarkSolved.workflowTemplateName;
        } else {
          wfTemplate = me.config.workflows.replyMarkSolved.workflowTemplateName;
        }
        break;
    }
    return wfTemplate;
  },

  /**
   * @private
   * Check, if current user has marked the same reply as another user.
   * @param {de.elo.ix.client.Sord} postSord
   * @param {de.elo.ix.client.Sord} replySord
   * @param {Boolean} unMark
   * @return {Boolean} Result check
   */
  checkSameSolvedStatus: function (postSord, replySord, unMark) {
    var statSolvedPost, statSolvedReply;

    statSolvedPost = sol.common.SordUtils.getObjKeyValue(postSord, "KNOWLEDGE_SOLVED");
    statSolvedReply = sol.common.SordUtils.getObjKeyValue(replySord, "KNOWLEDGE_SOLVED");

    if (!unMark) {
      if (statSolvedPost == "1") {
        if (statSolvedReply == "1") {
          return true;
        }
      }
    }

    if (unMark) {
      if (statSolvedPost == "0") {
        if (statSolvedReply == "0") {
          return true;
        }
      }
    }

    return false;
  },

  /**
   * Starts a workflow and returns the new workflow Id.
   * Uses {@link sol.common.WfUtils#startWorkflow WfUtils.startWorkflow}.
   *
   * @param {String} objId
   * @param {String} templateId
   * @param {String} name The workflow name
   * @return {String} The workflow ID
   */
  startWorkflow: function (objId, templateId, name) {
    return sol.common.WfUtils.startWorkflow(templateId, name, objId);
  },

  /**
   * @private
   * Mark solving reply.
   * @return {Object} Result check
   */
  markSolved: function () {
    var me = this,
        replySord, postSord, name, wfTemplate, flowIdReply, flowIdPost,
        statSolvedPost, hasWriteRightsPost;

    replySord = sol.common.RepoUtils.getSord(me.replyGuid);
    postSord = sol.common.RepoUtils.findObjectTypeInHierarchy(replySord.id, ["KNOWLEDGE_POST"]);

    if (postSord) {
      // Check, if current user has marked the same reply as another user
      statSolvedPost = sol.common.SordUtils.getObjKeyValue(postSord, "KNOWLEDGE_SOLVED");
      if (statSolvedPost == "1") {
        if (!me.checkSameSolvedStatus(postSord, replySord)) {
          return { success: false, errorCode: "10", errorMessage: "Solving already marked" };
        }
      }
      // Check, if currrent user has w right, set solve flags in post and replyS
      hasWriteRightsPost = sol.common.AclUtils.hasEffectiveRights(postSord.id, { rights: { w: true } });
      if (hasWriteRightsPost) {
        // reply
        name = me.buildElementName("reply", replySord.name);
        wfTemplate = me.getWfTemplate("reply");
        flowIdReply = me.startWorkflow(replySord.id, wfTemplate, name);
        // post
        name = me.buildElementName("post", postSord.name);
        wfTemplate = me.getWfTemplate("post");
        flowIdPost = me.startWorkflow(postSord.id, wfTemplate, name);
        return { success: true, flowIdReply: flowIdReply, flowIdPost: flowIdPost };
      }
    }
    return { success: false };
  },

  /**
   * @private
   * Unmark solving reply.
   * @return {Object} Result check
   */
  unMarkSolved: function () {
    var me = this,
        replySord, postSord, name, wfTemplate, flowIdReply, flowIdPost,
        hasWriteRightsPost;

    replySord = sol.common.RepoUtils.getSord(me.replyGuid);
    postSord = sol.common.RepoUtils.findObjectTypeInHierarchy(replySord.id, ["KNOWLEDGE_POST"]);

    if (postSord) {
      // Check, if currrent user has w right, set solve flags in post and replyS
      hasWriteRightsPost = sol.common.AclUtils.hasEffectiveRights(postSord.id, { rights: { w: true } });
      if (hasWriteRightsPost) {
        // reply
        name = me.buildElementName("reply", replySord.name, true);
        wfTemplate = me.getWfTemplate("reply", true);
        flowIdReply = me.startWorkflow(replySord.id, wfTemplate, name);
        // post
        name = me.buildElementName("post", postSord.name, true);
        wfTemplate = me.getWfTemplate("post", true);
        flowIdPost = me.startWorkflow(postSord.id, wfTemplate, name);
        return { success: true, flowIdReply: flowIdReply, flowIdPost: flowIdPost };
      }
    }
    return { success: false };
  }
});

/**
 * @member sol.knowledge.ix.services.Reply
 * @method RF_sol_knowledge_service_Reply_MarkSolved
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Reply_MarkSolved(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Reply_MarkSolved", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "replyGuid");
  service = sol.create("sol.knowledge.ix.services.Reply", params);
  result = rfUtils.stringify(service.markSolved());

  logger.exit("RF_sol_knowledge_service_Reply_MarkSolved", result);

  return result;
}

/**
 * @member sol.knowledge.ix.services.Reply
 * @method RF_sol_knowledge_service_Reply_UnMarkSolved
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Reply_UnMarkSolved(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Reply_UnMarkSolved", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "replyGuid");
  service = sol.create("sol.knowledge.ix.services.Reply", params);
  result = rfUtils.stringify(service.unMarkSolved());

  logger.exit("RF_sol_knowledge_service_Reply_UnMarkSolved", result);

  return result;
}
