importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.Map.js
//@include lib_sol.meeting.voting.mixins.Configuration.js
//@include lib_sol.meeting.voting.ix.Voting.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.voting.services.UpdateVoting" });

/**
* 
*
* @author JK, ELO Digital Office GmbH
*
* @eloix
* @requires lib_Class.js
* @requires sol.common.JsonUtils
* @requires sol.common.ix.ServiceBase
* @requires sol.common.ix.RepoUtils
* @requires sol.common.ix.AclUtils
  @requires sol.common.SordUtils
* @requires sol.common.IxUtils
* @requires sol.meeting.mixins.Configuration
* @requires sol.common.Injection
* @requires sol.common.Map.js
*/
sol.define("sol.meeting.voting.services.UpdateVoting", {
  extend: "sol.common.ix.ServiceBase",

  mixins: [
    "sol.meeting.voting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {},

  options: {
    mapping: []
  },

  vote: {},

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.templateSord = me.getSourceTemplateSord();
    
    if (!config.objId && !config.source) {
      throw Error("Either `objId` or `source` as templateSord must be defined");
    }

    sol.create("sol.common.Injection").inject(me);
  },

  getSourceTemplateSord: function () {
    var me = this;

    return (me.source || {}).templateSord || {};
  },

  voteVoting: function () {
    var me = this,
        result, map, value, sord, status;

    sord = ixConnectAdmin.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);
    status = sol.common.SordUtils.getObjKeyValue(sord, "MEETING_VOTING_STATUS");
    if (status.indexOf("O -") === 0) {
      map = sol.create('sol.common.SordMap', {
        objId: me.objId
      });
      map.read();
      if (map.keyAndValueExist("MEETING_VOTING_USERID_" + me.vote.userId)) {
        result = { success: false, reason: "ALREADY_VOTED" };
      } else {
        value = sol.common.DateUtils.dateToIso(Date()) + "¶" + me.vote.answer + "¶" + me.vote.count;
        map.setValue("MEETING_VOTING_USERID_" + me.vote.userId, value);
        map.write();
        result = { success: true, map: map };
      }
      me.calculateVotes(map);
    } else {
      result = { success: false, reason: "VOTING_NOT_OPEN" };
    }

    return result;
  },

  updateVoting: function () {
    var me = this, voting, votingResult, serviceResult = {},
        templateSord = me.templateSord || {};

    // validate automatically whether the object is a meeting voting
    voting = sol.create("sol.meeting.voting.ix.Voting", me.objId);
    voting.checkPermissions({ rights: { w: true } });

    votingResult = sol.common.IxUtils.execute("RF_sol_function_FillSord", {
      source: {
        templateSord: templateSord
      },
      target: {
        objId: me.objId,
        startWorkflow: me.updateConfig.target.startWorkflow
      }
    });

    serviceResult.result = votingResult;

    if (me.options.includeResult) {
      serviceResult.voting = sol.meeting.voting.ix.Votings.get({ objId: votingResult.objId });
    }

    return serviceResult;
  },
    
  saveVoting: function () {
    var me = this, voting, votingResult, serviceResult = {},
        templateSord = me.templateSord || {};
    
    // validate automatically whether the object is a meeting voting
    voting = sol.create("sol.meeting.voting.ix.Voting", me.objId);
    voting.checkPermissions({ rights: { w: true } });

    votingResult = sol.common.IxUtils.execute("RF_sol_function_FillSord", {
      source: {
        templateSord: templateSord
      },
      target: {
        objId: me.objId
      }
    });

    serviceResult.result = votingResult;

    if (me.options.includeResult) {
      serviceResult.voting = sol.meeting.voting.ix.Votings.get({ objId: votingResult.objId });
    }

    return serviceResult;
  },

  calculateVotes: function (map) {
    var value, values, votings = {};

    map.read();
    Object.keys(map.data).forEach(function (key) {
      if (key.indexOf("MEETING_VOTING_USERID_") === 0) {
        value = map.data[key];
        values = value.split("¶");
        if (values.length === 3) {
          // example of the string:
          // 20210809071102¶MEETING_VOTING_VOTED_ANSWER1¶1
          // date of vote - voting - count
          // so values[1] is the voting we have to add the number of counts in values[2]
          if (votings[values[1]]) {
            votings[values[1]] = parseInt(votings[values[1]], 10) + parseInt(values[2], 10);
          } else {
            votings[values[1]] = parseInt(values[2], 10);
          }
        }
      }
    });
    map.setValues(votings);
    map.write();
  }
});

/**
* @member sol.meeting.voting.services.UpdateVoting
* @method RF_sol_meeting_voting_service_Voting_Finish
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Voting_Finish(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      votingService, result;

  rfParams.inject = {
    updateConfig: { config: "voting", prop: "voting.services.finishVoting" }
  };

  votingService = sol.create("sol.meeting.voting.services.UpdateVoting", rfParams);
  result = votingService.updateVoting();
  return sol.common.JsonUtils.stringifyQuick(result);
}

/**
* @member sol.meeting.voting.services.UpdateVoting
* @method RF_sol_meeting_voting_service_Voting_Save
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Voting_Save(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      votingService, result;

  votingService = sol.create("sol.meeting.voting.services.UpdateVoting", rfParams);
  result = votingService.saveVoting();

  return sol.common.JsonUtils.stringifyQuick(result);
}

/**
* @member sol.meeting.voting.services.UpdateVoting
* @method RF_sol_meeting_voting_service_Voting_Open
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Voting_Open(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      votingService, result;

  rfParams.inject = {
    updateConfig: { config: "voting", prop: "voting.services.openVoting" }
  };
  
  votingService = sol.create("sol.meeting.voting.services.UpdateVoting", rfParams);
  result = votingService.updateVoting();

  return sol.common.JsonUtils.stringifyQuick(result);
}

/**
* @member sol.meeting.voting.services.UpdateVoting
* @method RF_sol_meeting_voting_service_Voting_EmptyOpen
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Voting_EmptyOpen(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      votingService, result;

  rfParams.inject = {
    updateConfig: { config: "voting", prop: "voting.services.emptyOpenVoting" }
  };
  
  votingService = sol.create("sol.meeting.voting.services.UpdateVoting", rfParams);
  result = votingService.updateVoting();

  return sol.common.JsonUtils.stringifyQuick(result);
}

/**
* @member sol.meeting.voting.services.UpdateVoting
* @method RF_sol_meeting_voting_service_Voting_Vote
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Voting_Vote(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      votingService, result;
  
  votingService = sol.create("sol.meeting.voting.services.UpdateVoting", rfParams);
  result = votingService.voteVoting();

  return sol.common.JsonUtils.stringifyQuick(result);
}