importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.meeting.voting.mixins.Configuration.js
//@include lib_sol.meeting.voting.ix.Voting.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.CreateVoting" });

/**
*
* @author ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.JsonUtils
* @requires sol.common.ix.ServiceBase
* @requires sol.common.ix.RepoUtils
* @requires sol.common.ix.AclUtils
* @requires sol.common.IxUtils
* @requires sol.meeting.mixins.Configuration
* @requires sol.meeting.voting.ix.Voting
* @requires sol.common.Injection
*/
sol.define("sol.meeting.voting.ix.services.CreateVoting", {
  extend: "sol.common.ix.ServiceBase",

  mixins: [
    "sol.meeting.voting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  _optimize: {},

  inject: {
    createSordConfig: { config: "voting", prop: "voting.services.createVoting", template: true },
    output: { config: "voting", prop: "voting.outputs.votingFull" },
    metadataMapping: { config: "voting", prop: "voting.services.createVoting.metadataMapping" },
    params: { prop: "params" }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.options = me.options || {
      includeResult: false
    };
    me.templateSord = config.templateSord;

    // transform objId, guid, arcpath to an objId to check permissions
    me.votingsFolderId = sol.meeting.voting.ix.Votings.findVotingFolder(me.objId).id;

    // prepare context object for templating
    me.params = {
      votingFolderId: me.votingsFolderId
    };

    sol.create("sol.common.Injection").inject(me);
  },

  createVotingFromScratch: function () {
    var me = this, votingResult, serviceResult;

    me.checkPermissions(me.votingsFolderId);
    votingResult = me.createVoting(me.templateSord);

    serviceResult = {
      params: me.params,
      result: votingResult,
      sord: null
    };

    sol.common.WfUtils.startWorkflow(me.createSordConfig.startWorkflow.name, me.createSordConfig.startWorkflow.title, votingResult.objId);
    serviceResult.sord = me.refreshVoting(votingResult);

    return serviceResult;
  },

  checkPermissions: function (votingsFolderId) {
    if (!sol.common.AclUtils.hasEffectiveRights(votingsFolderId, { rights: { l: true } })) {
      throw Error("Current User has no list right to current votinglist");
    }

    return true;
  },

  createVoting: function (templateSord) {
    var me = this, votingResult;

    if (!templateSord) {
      throw Error("source is not defined and could not use for creating new voting");
    }

    votingResult = sol.common.IxUtils.execute("RF_sol_function_FillSord", {
      source: { templateSord: templateSord },
      target: {
        fromService: me.createSordConfig.fromService,
        metadataMapping: me.metadataMapping
      },
      options: {
        mandatoryFields: me.createSordConfig.mandatoryFields
      }
    });

    // FillSord currently not supported direclty modified sordKeys
    // so we call Set function when desc should be updated
    if (votingResult && votingResult.objId && templateSord.desc) {
      me.updateVotingContent(votingResult.objId, templateSord.desc);
    }

    return votingResult;
  },

  updateVotingContent: function (objId, desc) {
    if (!sol.common.StringUtils.isBlank(desc)) {
      sol.common.IxUtils.execute("RF_sol_function_Set", {
        objId: objId,
        entries: [
          // TODO: sanitize content before write to elo
          { type: "SORD", key: "desc", value: desc }
        ]
      });
    }
  },

  refreshVoting: function (votingResult) {
    if (!votingResult || !votingResult.objId) {
      throw Error("Voting object could not be created or something went wrong. No objId was returned");
    }

    return sol.common.IxUtils.execute("RF_sol_meeting_voting_service_Voting_Get", {
      objId: votingResult.objId
    });
  }
});

/**
* @member sol.meeting.voting.ix.services.Voting
* @method RF_sol_meeting_voting_service_Voting_Create
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Voting_Create(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "votingsFolderId"),
      votingService, result;

  votingService = sol.create("sol.meeting.voting.ix.services.CreateVoting", rfParams);
  result = votingService.createVotingFromScratch();
  return sol.common.JsonUtils.stringifyQuick(result);
}

/**
* @member sol.meeting.voting.ix.services.Voting
* @method RF_sol_meeting_voting_service_Voting_CreateItemVoting
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Voting_CreateItemVoting(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      votingService, result;

  votingService = sol.create("sol.meeting.voting.ix.services.CreateVoting", rfParams);
  result = votingService.createVotingFromScratch();
  return sol.common.JsonUtils.stringifyQuick(result);
}