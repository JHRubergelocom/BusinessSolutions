
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordMap.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.knowledge.ix.ReputationUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.Rating" });

/**
 * Posts or replies can either be upvoted or downvoted.
 *
 * # Vote on a post or reply
 *
 * post/reply can either be upvoted or downvoted
 *
 *     sol.common.IxUtils.execute("RF_sol_knowledge_service_Rating_VotingUp", {
 *       // pass objId of post/reply
 *       objId: "4711"
 *     });
 *
 *     sol.common.IxUtils.execute("RF_sol_knowledge_service_Rating_VotingDown", {
 *       // pass objId of post/reply
 *       objId: "4711"
 *     });
 *
 * # Vote for another user
 *
 * Posts or replies can either be upvoted or downvoted.
 * In addition the userId can be given if the current user has administrative rights.
 *
 *     sol.common.IxUtils.execute("RF_sol_knowledge_service_Rating_VotingUp", {
 *       // pass objId of post/reply and the id of the user
 *       objId: "4711",
 *       userId: "3"
 *     });
 *
 * @author NM, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires moment.js
 * @requires sol.common.Config
 * @requires sol.common.DateUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordMap
 * @requires sol.common.SordUtils
 * @requires sol.common.UserUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.ObjectFormatter
 */
sol.define("sol.knowledge.ix.services.Rating", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId", "userId"],

  /**
   * @private
   * @property {de.elo.ix.client.SordZ}
   */
  sordZ: SordC.mbAllIndex,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.sord = ixConnectAdmin.ix().checkoutSord(me.objId, me.sordZ, LockC.NO);
    me.objId = me.sord.id;
    me.userName = sol.common.UserUtils.getUserInfo(me.userId).name;
  },

  /**
   * @private
   * Checks solution type of sord.
   * @param {String} solType
   * @return {Boolean} Result check
   */
  checkType: function (solType) {
    var me = this;

    if (!me.sord || !solType.equals(sol.common.SordUtils.getObjKeyValue(me.sord, "SOL_TYPE"))) {
      return false;
    }
    return true;
  },

  /**
   * @private
   * Checks if user has already voted.
   * @return {Boolean} Result check
   */
  checkUserHasVoted: function () {
    var me = this,
        map, mapKey, ratingDateIso;

    map = sol.create("sol.common.SordMap", { objId: me.objId, asAdmin: true });
    mapKey = "RATING_VOTED_" + me.userName;
    map.read(mapKey);

    if (map.keyAndValueExist(mapKey)) {
      return true;
    }
    ratingDateIso = sol.common.DateUtils.dateToIso(Date());
    map.setValue(mapKey, ratingDateIso);
    map.write();
    return false;
  },

  /**
   * @private
   * Checks solution type of sord.
   * @param {Boolean} down vote down if set
   * @return {Object} Result check
   */
  vote: function (down) {
    var me = this,
        score, result,
        owner = me.sord.ownerId,
        current = me.userId,
        contentType = sol.common.SordUtils.getObjKeyValue(me.sord, "KNOWLEDGE_CONTENT_TYPE");

    if (owner == current) {
      result = { success: false };
      return result;
    }
    if (me.checkType("KNOWLEDGE_POST") || me.checkType("KNOWLEDGE_REPLY")) {
      if (!me.checkUserHasVoted()) {
        score = sol.common.SordUtils.getObjKeyValueAsNumber(me.sord, "KNOWLEDGE_SCORE");
        if (down) {
          score--;
          if (me.checkType("KNOWLEDGE_POST")) {
            sol.knowledge.ix.ReputationUtils.grant("POST_DOWNVOTE", current);
            sol.knowledge.ix.ReputationUtils.grant("RECEIVE_POST_DOWNVOTE", owner);
          }
          if (me.checkType("KNOWLEDGE_REPLY")) {
            sol.knowledge.ix.ReputationUtils.grant("REPLY_DOWNVOTE", current);
            sol.knowledge.ix.ReputationUtils.grant("RECEIVE_REPLY_DOWNVOTE", owner);
          }
        } else {
          score++;
          if (me.checkType("KNOWLEDGE_POST")) {
            sol.knowledge.ix.ReputationUtils.grant("POST_UPVOTE", current);
            sol.knowledge.ix.ReputationUtils.grant("RECEIVE_POST_UPVOTE", owner);
            sol.knowledge.ix.ReputationUtils.maxCount("RECEIVE_POST_VOTES_MAX", owner, score);
            sol.knowledge.ix.ReputationUtils.maxCount("RECEIVE_POST_VOTES_" + contentType + "_MAX", owner, score);
          }
          if (me.checkType("KNOWLEDGE_REPLY")) {
            sol.knowledge.ix.ReputationUtils.grant("REPLY_UPVOTE", current);
            sol.knowledge.ix.ReputationUtils.grant("RECEIVE_REPLY_UPVOTE", owner);
            sol.knowledge.ix.ReputationUtils.maxCount("RECEIVE_REPLY_VOTES_MAX", owner, score);
            sol.knowledge.ix.ReputationUtils.maxCount("RECEIVE_REPLY_VOTES_" + contentType + "_MAX", owner, score);
          }
        }
        result = { success: true };
        sol.common.SordUtils.setObjKeyValueAsNumber(me.sord, "KNOWLEDGE_SCORE", score + "");
        ixConnectAdmin.ix().checkinSord(me.sord, me.sordZ, LockC.NO);
      } else {
        result = { success: false };
      }
    } else {
      result = { success: false };
    }
    return result;
  },

  /**
   * @private
   * Vote down.
   * @return {Object} Result check
   */
  voteDown: function () {
    var me = this;
    return me.vote(true);
  },

  /**
   * @private
   * Vote up.
   * @return {Object} Result check
   */
  voteUp: function () {
    var me = this;
    return me.vote();
  }
});

/**
 * @member sol.knowledge.ix.services.Rating
 * @method RF_sol_knowledge_service_Rating_VotingDown
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Rating_VotingDown(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      currentUser, params, service, result;

  logger.enter("RF_sol_knowledge_service_Rating_VotingDown", args);

  currentUser = sol.common.UserUtils.getCurrentUserInfo();

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  if ((params.userId && !sol.common.UserUtils.isMainAdmin(currentUser)) || !params.userId) {
    params.userId = currentUser.id;
  }

  service = sol.create("sol.knowledge.ix.services.Rating", params);
  result = rfUtils.stringify(service.voteDown());

  logger.exit("RF_sol_knowledge_service_Rating_VotingDown", result);

  return result;
}
/**
 * @member sol.knowledge.ix.services.Rating
 * @method RF_sol_knowledge_service_Rating_VotingUp
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Rating_VotingUp(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      currentUser, params, service, result;

  logger.enter("RF_sol_knowledge_service_Rating_VotingUp", args);

  currentUser = sol.common.UserUtils.getCurrentUserInfo();

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  if ((params.userId && !sol.common.UserUtils.isMainAdmin(currentUser)) || !params.userId) {
    params.userId = currentUser.id;
  }

  service = sol.create("sol.knowledge.ix.services.Rating", params);
  result = rfUtils.stringify(service.voteUp());

  logger.exit("RF_sol_knowledge_service_Rating_VotingUp", result);

  return result;
}
