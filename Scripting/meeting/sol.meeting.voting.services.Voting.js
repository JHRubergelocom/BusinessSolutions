importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.TemplateSordUtils.js
//@include lib_sol.meeting.voting.ix.Voting.js
//@include lib_sol.meeting.voting.mixins.Configuration.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.Voting" });

/**
*
* @author JK, ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.JsonUtils
* @requires sol.common.ix.ServiceBase
* @requires sol.common.Injection
* @requires sol.common.IxUtils
* @requires sol.meeting.mixins.Configuration
* @requires sol.meeting.voting.ix.Voting
*/
sol.define("sol.meeting.voting.ix.services.Voting", {
  extend: "sol.common.ix.ServiceBase",

  mixins: [
    "sol.meeting.voting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  _optimize: {},

  throwError: true,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.inject = me.inject || {};
    me.options = me.options || {};

    if (config.objId) {
      me.inject.sord = { sordIdFromProp: "objId" };
    } else if (config.source) {
      // TODO: config.source should be an object at least
      me.inject.sord = { prop: "source" };
    } else {
      throw Error("Either `objId` or `source` as templateSord must be defined");
    }

    Object.keys(config.inject || {})
      .forEach(function (key) {
        if (!me.inject[key]) {
          me.inject[key] = config.inject[key];
        }
      });

    // inject is created dynamically here so we can pass an objId
    // to find reference id or pass a templateSord object
    sol.create("sol.common.Injection").inject(me);
  },

  getVoting: function () {
    var me = this, result, voting;

    if (me.objId) {
      result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", {
        ids: [me.objId],
        output: me.output,
        options: {
          maxResult: 1,
          formatAsTemplateSord: true,
          ignorePropertyNames: false
        }
      }, me._optimize, "votings", ["output"]);
    } else {
      result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", {
        masks: me.search.masks,
        search: me.search.search,
        output: me.output,
        options: {
          maxResult: 1,
          formatAsTemplateSord: true,
          ignorePropertyNames: false
        }
      }, me._optimize, "votings", ["output"]);

      if (!result || !result.sords || result.sords.length === 0) {
        throw Error("voting could not be dertermine");
      }

    }
    voting = result.sords[0];

    if (me.shouldTranslateMapKeys(voting)) {
      // resolve all mapKeys, this is only a workaround solution until we can customize
      // app localization keys
      voting.mapKeys = sol.common.TemplateUtils.render(voting.mapKeys, {});
    }

    return voting;
  },

  shouldTranslateMapKeys: function(templateSord) {
    return sol.common.TemplateSordUtils.getMapKey(templateSord, "MEETING_VOTE_USE_TRANSLATION_KEYS") === "true";
  },

  findVotingsByReference: function () {
    var me = this, result;

    if (!me.search) {
      throw Error("Configuration Error. search prop is not defined in findVotingsByReference");
    }

    result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", {
      masks: me.search.masks,
      search: me.search.search,
      output: me.output,
      options: {
        formatAsTemplateSord: true,
        ignorePropertyNames: false
      }
    }, me._optimize, "votings", ["output"]);

    // resolve template handlebars
    result.sords
      .filter(function (tplSord) {
        // map content is always string content
        return sol.common.TemplateSordUtils.getMapKey(tplSord, "MEETING_VOTE_USE_TRANSLATION_KEYS") === "true";
      }).forEach(function (tplSord) {
        // resolve all mapKeys, this is only a workaround solution until we can customize
        // app localization keys
        tplSord.mapKeys = sol.common.TemplateUtils.render(tplSord.mapKeys, {});
    });

    return {
      votings: result.sords
    };
  },

  findVotingFolder: function () {
    var me = this,
        id;

    try {
      id = sol.meeting.voting.ix.Votings.findVotingFolder(me.objId).id;

      return me.asElementService ? { elements: [id] } : id;
    } catch (error) {
      me.logger.warn(["An error occured in service `Voting` {0}", error.message]);
      if (me.throwError) {
        throw error;
      }
    }
  }
});

/**
* @member sol.meeting.voting.ix.services.Voting
* @method RF_sol_meeting_voting_service_Voting_FindVotings
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Voting_FindVotings(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      votingService, result;

  rfParams.inject = rfParams.inject || {
    output: { config: "voting", prop: "voting.outputs.votingFull", template: false },
    search: { config: "voting", prop: "voting.services.findVotingsByReference", template: true }
  };

  votingService = sol.create("sol.meeting.voting.ix.services.Voting", rfParams);
  result = votingService.findVotingsByReference();
  return sol.common.JsonUtils.stringifyQuick(result);
}

/**
* @member sol.meeting.voting.ix.services.Voting
* @method RF_sol_meeting_voting_service_Voting_FindVotings
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Voting_FindAllMeetingVotings(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      votingService, result;

  rfParams.inject = rfParams.inject || {
    output: { config: "voting", prop: "voting.outputs.votingFull", template: false },
    search: { config: "voting", prop: "voting.services.findAllMeetingVotingsByReference", template: true }
  };

  votingService = sol.create("sol.meeting.voting.ix.services.Voting", rfParams);
  result = votingService.findVotingsByReference();
  return sol.common.JsonUtils.stringifyQuick(result);
}


/**
* @member sol.meeting.voting.ix.services.Voting
* @method RF_sol_meeting_voting_service_Voting_Get
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Voting_Get(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      votingService, result;

  // will be ignore when objId is set
  rfParams.inject = rfParams.inject || {
    output: { config: "voting", prop: "voting.outputs.votingFull", template: false },
    search: { config: "voting", prop: "voting.services.getVoting", template: true }
  };

  votingService = sol.create("sol.meeting.voting.ix.services.Voting", rfParams);
  result = votingService.getVoting();
  return sol.common.JsonUtils.stringifyQuick(result);
}

/**
* @member sol.meeting.voting.ix.services.Voting
* @method RF_sol_meeting_voting_service_Voting_Folder_Get
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Voting_Folder_Get(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      votingService,
      result;

  votingService = sol.create("sol.meeting.voting.ix.services.Voting", rfParams);

  result = votingService.findVotingFolder();
  return sol.common.JsonUtils.stringifyQuick(result);
}