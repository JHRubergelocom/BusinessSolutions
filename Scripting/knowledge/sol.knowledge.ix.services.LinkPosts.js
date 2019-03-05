
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.ServiceBase.js
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
 * # UnLink posts
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_service_UnLink_Posts", {
 *       fromPostGuid: "(7146D09A-3889-BE1F-EDC7-631166F86797)",
 *       toPostGuids: ["(7146D09A-3889-BE1F-EDC7-631178129823)", "(7146D09A-3889-BE1F-EDC7-631178129825)"]
 *     });
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
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
   * @private
   * @param {Boolean} unlink
   * @return {Object}
   */
  linkPosts: function (unlink) {
    var me = this,
        i, post, postLinkTo, postsLinkTo;

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

    for (i = 0; i < postsLinkTo.length; i++) {
      postLinkTo = sol.common.RepoUtils.getSord(postsLinkTo[i]);
      if (!postLinkTo || !"KNOWLEDGE_POST".equals(sol.common.SordUtils.getObjKeyValue(postLinkTo, "SOL_TYPE"))) {
        throw "Reading postLinkTo failed. Passed object with name '" + postLinkTo.name + "' is not a post.";
      }
    }

    if (unlink) {
      ixConnect.ix().unlinkSords(me.fromPostGuid, postsLinkTo, null);
    } else {
      ixConnect.ix().linkSords(me.fromPostGuid, postsLinkTo, LinkSordC.PAIR);
    }

    return { success: true };
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

/**
 * @member sol.knowledge.ix.services.LinkPosts
 * @method RF_sol_knowledge_service_UnLink_Posts
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_UnLink_Posts(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_UnLink_Posts", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "fromPostGuid", "toPostGuids");
  service = sol.create("sol.knowledge.ix.services.LinkPosts", params);
  result = rfUtils.stringify(service.linkPosts(true));

  logger.exit("RF_sol_knowledge_service_UnLink_Posts", result);

  return result;
}
