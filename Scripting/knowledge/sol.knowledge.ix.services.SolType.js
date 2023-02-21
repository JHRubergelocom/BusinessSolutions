
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js


var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.SolType" });

/**
 * Provides service functions for knowledge soltypes.
 *
 * # Get infos about the soltype
 *
 * Soltype can either be of type space, post or reply.
 *
 *     sol.common.IxUtils.execute("RF_sol_knowledge_service_SolType_GetInfo", {
 *       objId: "4711"   // objId of the knowledge soltype
 *     });
 *
 *     // result, but will be returned anyway (it can be empty if soltype is not defined or valid) //
 *     {
 *       solType: " KNOWLEDGE_SPACE"
 *       knowledgeSpaceReference: "ELOHR"  // If soltype is space
 *       guid: "(54EFE97E-F4B7-F3C3-3AD8-E492376222C6)" // If soltype is post
 *       parentGuid: "(54EFE97E-F4B7-F3C3-3AD8-E492376222C6)" // If soltype is reply
 *     }
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires moment.js
 * @requires sol.common.Config
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.knowledge.ix.KnowledgeUtils
 */
sol.define("sol.knowledge.ix.services.SolType", {
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
   * Get info about the current soltype.
   * @return {Object}
   */
  getInfo: function () {
    var me = this,
        solType, result, knowledgeConfig;

    solType = sol.common.SordUtils.getObjKeyValue(me.sord, "SOL_TYPE");
    if (!solType) {
      return {};
    }

    result = {};
    result.solType = solType;
    result.name = me.sord.name;
    knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();

    if (solType == knowledgeConfig.objectTypes.board) {
      result.knowledgeBoardReference = sol.common.SordUtils.getObjKeyValue(me.sord, "KNOWLEDGE_BOARD_REFERENCE");
    }

    if (solType == knowledgeConfig.objectTypes.space) {
      result.knowledgeSpaceReference = sol.common.SordUtils.getObjKeyValue(me.sord, "KNOWLEDGE_SPACE_REFERENCE");
      result.knowledgeBoardReference = sol.common.SordUtils.getObjKeyValue(me.sord, "KNOWLEDGE_BOARD_REFERENCE");
      result.boardId = sol.knowledge.ix.KnowledgeUtils.findBoard(me.objId).id;
    }

    if (solType == knowledgeConfig.objectTypes.post) {
      result.knowledgeSpaceReference = sol.common.SordUtils.getObjKeyValue(me.sord, "KNOWLEDGE_SPACE_REFERENCE");
      result.knowledgeBoardReference = sol.common.SordUtils.getObjKeyValue(me.sord, "KNOWLEDGE_BOARD_REFERENCE");
      result.spaceId = sol.knowledge.ix.KnowledgeUtils.findSpace(me.objId).id;
      result.boardId = sol.knowledge.ix.KnowledgeUtils.findBoard(me.objId).id;
    }

    if (solType == knowledgeConfig.objectTypes.reply) {
      result.knowledgeSpaceReference = sol.common.SordUtils.getObjKeyValue(me.sord, "KNOWLEDGE_SPACE_REFERENCE");
      result.knowledgeBoardReference = sol.common.SordUtils.getObjKeyValue(me.sord, "KNOWLEDGE_BOARD_REFERENCE");
      result.postId = sol.knowledge.ix.KnowledgeUtils.findPost(me.objId).id;
      result.spaceId = sol.knowledge.ix.KnowledgeUtils.findSpace(me.objId).id;
      result.boardId = sol.knowledge.ix.KnowledgeUtils.findBoard(me.objId).id;
    }

    return result;
  }

});

/**
 * @member sol.knowledge.ix.services.SolType
 * @method RF_sol_knowledge_service_SolType_GetInfo
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_SolType_GetInfo(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_SolType_GetInfo", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.knowledge.ix.services.SolType", params);
  result = rfUtils.stringify(service.getInfo());

  logger.exit("RF_sol_knowledge_service_SolType_GetInfo", result);

  return result;
}
