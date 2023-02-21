
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

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.DeletePost" }); // eslint-disable-line one-var

/**
 * Deletes a post
 *
 * # Delete a post
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Delete", {
 *       objId: "(7146D09A-3889-BE1F-EDC7-631166F86797)"
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
sol.define("sol.knowledge.ix.services.DeletePost", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId"],

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
   * Deletes a post.
   * @return {Object}
   */
  deletePost: function () {
    var me = this,
        post, flowName, flowNameData;

    if (!me.knowledgeConfig.postLocales.defaultLocale) {
      throw "PostLocales Default Locale not found";
    }

    if (!sol.common.AclUtils.hasEffectiveRights(me.objId, { rights: { d: true } })) {
      throw "Current User has no delete right to current post";
    }

    post = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);
    sol.common.ix.SubscriptionUtils.unsubscribeFromElement(post.id);

    flowNameData = { sordName: String(post.name) };
    flowName = sol.create("sol.common.Template", { source: me.knowledgeConfig.workflows.deletePost.workflowNameTemplate }).apply(flowNameData);
    sol.common.WfUtils.startWorkflow(me.knowledgeConfig.workflows.deletePost.workflowTemplate, flowName, post.id);

    return { success: true };
  }

});

/**
 * @member sol.knowledge.ix.services.Post
 * @method RF_sol_knowledge_service_Post_Delete
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Post_Delete(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Post_Delete", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.knowledge.ix.services.DeletePost", params);
  result = rfUtils.stringify(service.deletePost());

  logger.exit("RF_sol_knowledge_service_Post_Delete", result);

  return result;
}
