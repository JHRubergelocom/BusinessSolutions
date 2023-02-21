//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.IxUtils.js
/**
 *
 */
sol.define("sol.meeting.voting.ix.Voting", {

  initialize: function (objId) {
    var me = this;
    me.objId = objId;
    me.sord = me.validateAndGet(objId);
    me.$super("sol.Base", "initialize", [objId]);
  },


  validateAndGet: function (objId) {
    var me = this, voting;

    voting = sol.common.RepoUtils.getSord(objId);
    if (!voting || !"MEETING_VOTE".equals(sol.common.SordUtils.getObjKeyValue(voting, "SOL_TYPE"))) {
      throw Error("Reading meeting voting failed. Passed object with name '" + (voting.name || "undefined") + "' is not of type meeting");
    }
    if (voting.deleted === true) {
      throw Error("Reading meeting voting failed. Object with id '" + me.objId + " has been deleted");
    }
    return voting;
  },

  checkPermissions: function (permissions) {
    var me = this;
    if (!sol.common.AclUtils.hasEffectiveRights(me.objId, permissions)) {
      throw Error("Current User has no delete right to current voting");
    }
  }

});

/**
 * TODO: sol.meeting.voting.ix.Votings -> sol.meeting.voting.ix.VotingUtils in extra file
 */
sol.define("sol.meeting.voting.ix.Votings", {

  singleton: true,

  get: function (options) {
    options = options || {};
    if (!options.objId) {
      throw Error("objId must be set");
    }
    return sol.common.IxUtils.execute("RF_sol_meeting_voting_service_Voting_Get", {
      objId: options.objId
    });
  },

  /**
   * Determine voting root folder within
   *
   * @param
   * @return {de.elo.ix.client.Sord} Sord
   */
  findVotingFolder: function (objId, solType) {
    var me = this, result,
      _solType = solType || "ITEM_VOTING_STRUCTURE";

    if (!objId) {
      throw Error("objId must be defined to determine voting folder");
    }

    result = sol.common.RepoUtils.findChildren(objId, {
      level: 1,
      includeDocuments: false,
      objKeysObj: {
        SOL_TYPE: _solType
      }
    });

    if (!result || result.length === 0) {
      throw Error("Voting folder is missing in objId=" + objId + ", solType=" + _solType);
    }

    if (result && result.length > 1) {
      me.logger.warn("item folder contains multiple voting folders. Use first match " + result[0].id);
    }

    return result[0];
  },

  updateDesc: function (objId, desc) {
    if (!objId) {
      throw Error("objId must be set");
    }

    if (!sol.common.StringUtils.isBlank(desc)) {
      sol.common.IxUtils.execute("RF_sol_function_Set", {
        objId: objId,
        entries: [
          // TODO: sanitize content before write to elo
          { type: "SORD", key: "desc", value: desc }
        ]
      });
    }
  }

});