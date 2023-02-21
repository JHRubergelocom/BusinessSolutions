
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.ServiceBase.js


var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.Space" });

/**
 * Provides service functions for knowledge spaces.
 *
 * # Create a new topic
 *
 * Topics can either be of type QUESTION, ARTICLE or IDEA.
 *
 *     sol.common.IxUtils.execute("RF_sol_knowledge_service_Space_AddPost", {
 *       objId: "4711",   // objId of the knowledge space
 *       title: "How can a custom service be created?",
 *       content: "I was just looking at some examples and was thinking...",
 *       type: "QUESTION"
 *       objKeys: {
 *          KNOWLEDGE_TAGS: ["TAG1"],
 *       }
 *     });
 *
 *     // result, item was not altered, but will be returned anyway (it might have been altered by another user) //
 *     {
 *       postObjId: "4712"
 *     }
 *
 *
 * @author NM, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires moment.js
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.knowledge.ix.services.Space", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId"],

  /**
   * @private
   * @property {de.elo.ix.client.SordZ}
   */
  sordZ: SordC.mbAllIndex,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.sord = ixConnect.ix().checkoutSord(me.objId, me.sordZ, LockC.NO);
  },

  /**
   * Creates a new post within the current space.
   * @return {Object}
   */
  addPost: function () {
    var me = this,
        post, postObjId;

    if (!me.hasListAccess(me.sord)) {
      throw "No rights for adding posts.";
    }

    post = ixConnect.ix().createSord(me.objId, "Knowledge Post", EditInfoC.mbSord).sord;

    post.name = me.title;
    post.desc = me.content;
    sol.common.SordUtils.updateKeywording(post, me.objKeys);

    postObjId = ixConnect.ix().checkinSord(post, me.sordZ, LockC.NO);

    return {
      postObjId: postObjId
    };
  },

  /**
   * @private
   * Checks, if a sord was checked out with write access.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  hasWriteAccess: function (sord) {
    var flags, hasWriteAccess;

    flags = sord.access;
    hasWriteAccess = (flags & CONST.ACCESS.LUR_WRITE) === CONST.ACCESS.LUR_WRITE;

    return hasWriteAccess;
  },

  /**
   * @private
   * Checks, if a sord was checked out with list access.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  hasListAccess: function (sord) {
    var flags, hasListAccess;

    flags = sord.access;
    hasListAccess = (flags & CONST.ACCESS.LUR_LIST) === CONST.ACCESS.LUR_LIST;

    return hasListAccess;
  }

});

/**
 * @member sol.knowledge.ix.services.Space
 * @method RF_sol_knowledge_service_Space_AddPost
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Space_AddPost(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Space_AddPost", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.knowledge.ix.services.Space", params);
  result = rfUtils.stringify(service.addPost());

  logger.exit("RF_sol_knowledge_service_Space_AddPost", result);

  return result;
}
