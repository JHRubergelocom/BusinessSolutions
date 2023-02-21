
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.EditReply" }); // eslint-disable-line one-var

/**
 * Edits a reply
 *
 * # Edit a reply
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_service_Reply_Edit", {
 *       objId: "(C7076526-791B-7111-24CC-F477256868BE)",
 *       content: "Content3",
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
 * @requires sol.common.ix.ServiceBase
 * @requires sol.knowledge.ix.KnowledgeUtils
 */
sol.define("sol.knowledge.ix.services.EditReply", {
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
   * @cfg {Array} createdFiles
   * Object IDs of created files
   */

  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [params]);

    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
  },

  /**
   * Edits a reply.
   * @return {Object}
   */
  execute: function () {
    var me = this,
        reply, objId, post, flowName, flowNameData;

    reply = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

    if (me.content) {
      reply.desc = me.content;
      reply.XDateIso = sol.common.SordUtils.nowIsoForConnection(ixConnect);
    }

    objId = ixConnect.ix().checkinSord(reply, SordC.mbAllIndex, LockC.NO);

    sol.common.RepoUtils.moveSords(me.createdFiles, objId);

    if (me.containsClassName(me.knowledgeConfig.updateXDateServices)) {
      post = ixConnectAdmin.ix().checkoutSord(reply.parentId, SordC.mbAllIndex, LockC.NO);
      post.XDateIso = sol.common.SordUtils.nowIsoForConnection(ixConnectAdmin);
      ixConnectAdmin.ix().checkinSord(post, SordC.mbAllIndex, LockC.NO);
    }

    flowNameData = { sordName: String(post.name) };
    flowName = sol.create("sol.common.Template", { source: me.knowledgeConfig.workflows.editReply.workflowNameTemplate }).apply(flowNameData);

    sol.common.WfUtils.startWorkflow(me.knowledgeConfig.workflows.editReply.workflowTemplate, flowName, objId);

    return { objId: objId };
  }
});

/**
 * @member sol.knowledge.ix.services.EditReply
 * @method RF_sol_knowledge_service_Reply_Edit
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Reply_Edit(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Reply_Edit", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.knowledge.ix.services.EditReply", params);
  result = rfUtils.stringify(service.execute());

  logger.exit("RF_sol_knowledge_service_Reply_Edit", result);

  return result;
}
