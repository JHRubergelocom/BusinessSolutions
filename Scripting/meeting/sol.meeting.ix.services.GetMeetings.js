importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

var logger = sol.create("sol.Logger", {scope: "sol.meeting.ix.services.GetMeetings"});

/**
 * Retrieves available meetings.
 *
 *
 * @author SDi, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.UserUtils
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.meeting.ix.services.GetMeetings", {
  extend: "sol.common.ix.ServiceBase",

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.meeting.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    fields: {config: "meeting", prop: "fields"},
    getMeetingsConfig: { config: "meeting", prop: "entities.meeting.services.getmeetings.meetings" }, // {}
    getMeetingsConfigMin: { config: "meeting", prop: "entities.meeting.services.getmeetings.meetingsMin" }, // {}
    getParticipantsConfig: { config: "meeting", prop: "entities.meeting.services.getmeetings.participants" }, // {}
    getParticipantsConfigMin: { config: "meeting", prop: "entities.meeting.services.getmeetings.partcipantsMin" }, // {}
    getParticipationsConfig: { config: "meeting", prop: "entities.meeting.services.getmeetings.participations" }, // {}
    getParticipationsConfigMin: { config: "meeting", prop: "entities.meeting.services.getmeetings.partcipationsMin" } // {}
  },

  addSearchFilter: function(criteria, filter) {
    Object.keys(filter).forEach(function (field) {
      criteria.push({key: field, value: filter[field]});
    });
  },

  //TODO cover image functions might be removed if unused
  getMeetingCovers: function(coverGuids) {
    var me = this;

    return sol.common.IxUtils.execute("RF_sol_common_service_GetDocumentsPreviewURLs", {
      objIds: coverGuids,
      previewSize: me._activeConfig.coverImageSize,
      startPage: 1,
      endPage: 1,
      flatten: true
    });
  },

  //TODO cover image functions might be removed if unused
  addMettingCovers: function (sords) {
    var me = this, wantsCover = [], covers, coverCount;

    covers = me.getMeetingCovers(
      sords
        .filter(function (sord, i) {
          return sord.MEETING_COVER_IMAGE && wantsCover.push(i);
        })
        .map(function (sord) {
          return sord.MEETING_COVER_IMAGE;
        })
      );

    if((coverCount = Object.keys(covers || {}).length)) {
      me.logger.debug(["Processing {0} cover images.", coverCount]);

      wantsCover.forEach(function (sordIndex) {
        var sord = sords[sordIndex];

        (sord.cover = covers[sord.MEETING_COVER_IMAGE]) && me.logger.debug(["found and added cover image {0} for course {1}.", sord.MEETING_COVER_IMAGE, sord.guid]);
      });

      me.logger.debug(["Processing done.", coverCount]);
    } else {
      me.logger.debug("No cover images found.");
    }
  },

  getParticipants: function(references) {
    var me = this, participants, config;

    if(!references.length) return [];

    config = me.minimumDataForRequired ? me.getParticipantsConfigMin : me.getParticipantsConfig;
    config.search.push({key: me.fields.meetingReference, value: references});
    me.logger.debug("Finding participants.", config.search);

    if(me.minimumDataForRequired) {
      participants = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me.getParticipantsConfigMin, me._optimize, "participantsMin", ["output"]).sords;
    } else {
      participants = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me.getParticipantsConfig, me._optimize, "participants", ["output"]).sords;
    }

    return participants;
  },

  getParticipations: function(references, mail) {
    var me = this, participations, config;

    if(!references.length) return [];
    
    config = me.minimumDataForRequired ? me.getParticipationsConfigMin : me.getParticipationsConfig;
    config.search.push({key: me.fields.meetingPersonEmail, value: mail});
    config.search.push({key: me.fields.meetingReference, value: references});
    me.logger.debug("Finding participations.", config.search);

    if(me.minimumDataForRequired) {
      participations = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me.getParticipationsConfigMin, me._optimize, "participationsMin", ["output"]).sords;
    } else {
      participations = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me.getParticipationsConfig, me._optimize, "participations", ["output"]).sords;
    }

    return participations;
  },

  addParticipants: function(meetings) {
    var me = this, wants = [], participants, count;

    participants = me.getParticipants(
      meetings
        .filter(function(meeting, i) { return meeting[me.fields.meetingReference] && wants.push(i); })
        .map(function(meeting) { return meeting[me.fields.meetingReference]; })
      );

    if((count = participants.length)) {
      me.logger.info(["Processing {0} participants.", count]);

      wants.forEach(function(index) {
        meetings[index].participants = participants.filter(function(participant) {
          return participant[me.fields.meetingReference] == meetings[index][me.fields.meetingReference];
        });
      });

      me.logger.debug(["Processing done.", count]);
    } else {
      me.logger.debug("No participants.");
    }
  },

  addParticipations: function(meetings, mail) {
    var me = this, wants = [], participations = {}, count;

    me.getParticipations(
      meetings
        .filter(function(meeting, i) {
          return meeting[me.fields.meetingReference] && wants.push(i); 
        })
        .map(function(meeting) {
          return meeting[me.fields.meetingReference];
        }),
        mail
      ).forEach(function(participation) {
        participations[participation[me.fields.meetingReference]] = participation || {};
      });

    if((count = Object.keys(participations).length)) {
      me.logger.info(["Processing {0} participations.", count]);

      wants.forEach(function(index) {
        meetings[index].participation = participations[meetings[index][me.fields.meetingReference]];
      });

      me.logger.debug(["Processing done.", count]);
    } else {
      me.logger.debug("No participations.");
    }
  },

  parsePagingOptions: function () {
    var me = this;

    if(me.searchId || me.paging) {
      me.paging && (me._activeConfig.options.paging = me.paging);
      me.searchId && (me._activeConfig.options.searchId = me.searchId);
      me._activeConfig.options.pageSize = me.pageSize || me._activeConfig.options.pageSize;
      (me.startFrom !== undefined) && (me._activeConfig.options.startPagingFrom = me.startFrom);
      me.endPaging && (me._activeConfig.options.endPaging = me.endPaging);
    }
  },

  parseOptions: function () {
    var me = this;

    me.parsePagingOptions();
    me.findDirect && (me._activeConfig.options.findDirect = me.findDirect);
    me.query && (me._activeConfig.options.query = me.query);
    me.filter && me.addSearchFilter(me._activeConfig.search, me.filter);
  },

  process: function () {
    var me = this, result, groupResult;

    me._activeConfig = me.minimumDataForRequired ? me.getMeetingsConfigMin : me.getMeetingsConfig;
    me.parseOptions();

    if(me.groupBy) {
      me.logger.debug("Reading context terms for fields.", me.groupBy);
      result = {groups: {}};

      (Array.isArray(me.groupBy) ? me.groupBy : [me.groupBy]).forEach(function (groupBy) {
        me.getMeetingsConfig.options.fuzzy = {groupBy: {type: "GRP", key: groupBy}};
        
        groupResult = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me.getMeetingsConfig, me._optimize, "meetingsGroupBy", ["output"]);
        result.groups[groupBy] = groupResult.groups;
      });
    } else {
      me.logger.debug("Finding meetings.", me._activeConfig.search);

      if(me.minimumDataForRequired) {
        result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me.getMeetingsConfigMin, me._optimize, "meetingsMin", ["output"]);
      } else {
        result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me.getMeetingsConfig, me._optimize, "meetings", ["output"]);

        me.logger.debug(["Processing cover image urls for courses. Image size: {0}.", me.getMeetingsConfig.coverImageSize]);
        me.addMettingCovers(result.sords || []);
      }
           
      me.participation && me.addParticipations(result.sords || [], String(ixConnect.loginResult.user.userProps[UserInfoC.PROP_NAME_EMAIL]));
      me.participants && me.addParticipants(result.sords || []);
    }

    return result.searchId ? {searchId: result.searchId, moreResults: result.moreResults, sords: result.sords} : (me.groupBy ? {groups: result.groups} : {sords: result.sords});
  }
});

/**
 * @member sol.meeting.ix.services.GetMeetings
 * @method RF_sol_meeting_service_GetMeetings
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_meeting_service_GetMeetings(context, args) {
  logger.enter("RF_sol_meeting_service_GetMeetings", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args);
  delete params._optimize;

  service = sol.create("sol.meeting.ix.services.GetMeetings", params);
  result = JSON.stringify(service.process());

  logger.exit("RF_sol_meeting_service_GetMeetings", result);
  return result;
}

/**
 * @member sol.meeting.ix.services.GetMeetings
 * @method RF_sol_meeting_service_GetMeetingsFilters
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_meeting_service_GetMeetingsFilters(context, args) {
  logger.enter("RF_sol_meeting_service_GetMeetingsFilters", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args);
  delete params._optimize;

  service = sol.create("sol.meeting.ix.services.GetMeetings", params);
  result = JSON.stringify(service.process());

  logger.exit("RF_sol_meeting_service_GetMeetingsFilters", result);
  return result;
}