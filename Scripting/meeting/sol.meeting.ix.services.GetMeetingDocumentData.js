importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TemplateSordUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.ServiceBase.js

//@include lib_sol.meeting.ix.Meeting.js
//@include lib_sol.meeting.ix.MeetingRepository.js
//@include lib_sol.meeting.ix.MeetingItemRepository.js
//@include lib_sol.meeting.mixins.Configuration.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.GetMeetingDocumentData" });

/**
* Provides service functions for meeting documents
*
* sol.common.IxUtils.execute("RF_sol_meeting_service_GetMeetingDocumentData", {
*       objId: "4711"
* });
*
* @author FS, ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.JsonUtils
* @requires sol.common.ix.ServiceBase
* @requires sol.common.IxUtils
* @requires sol.meeting.mixins.Configuration
* @requires sol.common.Injection
* @requires sol.meeting.ix.MeetingRepository
* @requires sol.meeting.ix.MeetingItemRepository
*/
sol.define("sol.meeting.ix.services.GetMeetingDocumentData", {
  extend: "sol.common.ix.ServiceBase",

  /**
    * @cfg objId {Number} objId of the meeting
    */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    if (!me.objId) {
      throw "Missing property `objId`";
    }
  },

  process: function () {
    var me = this, result, response = {};

    result = me.findMeetingInformation();

    response.meeting = me.appendMeeting(response, result.sords, {
      maskName: "Meeting"
    });

    response.meeting = me.appendMeetingWfMapFields(response.meeting);

    response.meeting = me.appendMeetingItems(response.meeting, result.sords);

    response.meeting.participants = me.appendMeetingChild(response.meeting, result.sords, {
      maskName: "Meeting Participant",
      objKey: "MEETING_REFERENCE"
    });

    return response;
  },

  findMeetingInformation: function () {
    var me = this, result, i, response = {};

    result = sol.common.RepoUtils.findChildren(me.objId, {
      includeFolders: true,
      includeDocuments: false,
      recursive: true,
      level: 4
    });

    //we also need the meeting object
    result.push(sol.common.RepoUtils.getSord(me.objId));

    response.sords = [];
    for (i = 0; i < result.length; i++) {
      response.sords.push(sol.common.ObjectFormatter.format({
        sord: {
          formatter: "sol.common.ObjectFormatter.TemplateSord",
          data: result[i],
          config: {
            sordKeys: ["id", "maskName", "name", "desc", "ownerName"],
            allFormBlobFields: true,
            allMapFields: true
          }
        }
      }).sord);
    }
    return response;
  },

  appendMeeting: function (response, data, config) {
    response = data.filter(function (item) {
      return item.maskName == config.maskName;
    });
    return response[0];
  },

  appendMeetingItems: function (meeting, data) {
    var me = this,
        i;

    meeting.items = data.filter(function (item) {
      return item.maskName == "Meeting Item" && item.objKeys.MEETING_ITEM_DAY > 0;
    });

    for (i = 0; i < meeting.items.length; i++) {
      //TODO: overthink the html tags #BSMM-1981
      meeting.items[i] = me.replaceHtmlTags(meeting.items[i]);

      meeting.items[i].tasks = me.appendMeetingChild(meeting.items[i], data, {
        maskName: "Meeting Task",
        objKey: "MEETING_ITEM_ID"
      });

      meeting.items[i].notes = me.appendMeetingChild(meeting.items[i], data, {
        maskName: "Meeting Note",
        objKey: "MEETING_ITEM_ID"
      });

      //additional filter to just get the relevant notes
      meeting.items[i].notes = meeting.items[i].notes.filter(function (note) {
        return note.objKeys["MEETING_NOTE_MINUTES_RELEVANT"] == "1";
      });

      meeting.items[i].votings = me.appendMeetingChild(meeting.items[i], data, {
        maskName: "Meeting Voting",
        objKey: "MEETING_ITEM_ID"
      });
      meeting.items[i].votings = me.appendVotingResult(meeting.items[i].votings, meeting);

      meeting.items[i].proposal = me.appendMeetingChild(meeting.items[i], data, {
        maskName: "Meeting Proposal",
        objKey: "MEETING_ITEM_ID"
      });

      //there has to be only one proposal
      meeting.items[i].proposal = (meeting.items[i].proposal.length == 1) ? meeting.items[i].proposal[0] : {};

      //TODO: overthink the html tags #BSMM-1981
      meeting.items[i].proposal.formBlobs = me.replaceHtmlTags(meeting.items[i].proposal.formBlobs);

      if (me.partialKey && meeting.wfMapKeys[me.partialKey] == "1") {
        meeting.items[i].shouldInclude = (meeting.wfMapKeys["MEETING_ITEM_PARTIAL_INSERT" + (i + 1)] == 1);
      } else {
        meeting.items[i].shouldInclude = true;
      }

    }
    return meeting;
  },

  appendMeetingChild: function (response, data, config) {
    response = data.filter(function (item) {
      return item.maskName == config.maskName && item.objKeys[config.objKey] == response.objKeys[config.objKey];
    });
    return response;
  },

  appendVotingResult: function (votings, meeting) {
    var i, voting, prop, pos, key, index, language;

    for (i = 0; i < votings.length; i++) {
      voting = votings[i];
      voting.votes = [];
      for (prop in votings[i].mapKeys) {
        pos = prop.search(/\d+$/);
        if (pos > 0 && prop.indexOf("ANSWER") > -1) {
          key = prop.substring(0, pos);
          index = parseInt(prop.substring(pos), 10) - 1;
          voting.votes[index] = voting.votes[index] ? voting.votes[index] : {};
          //meeting apply mapkeys.CURRENT_LANGUAGE
          language = meeting.mapKeys["CURRENT_LANGUAGE"];

          voting.votes[index][key] = sol.create("sol.common.Template", {
            source: (language ? votings[i].mapKeys[prop].replace("}}", "'" + language + "' }}") : votings[i].mapKeys[prop])
          }).apply();
        }
      }
    }
    return votings;
  },

  appendMeetingWfMapFields: function (meeting) {
    var me = this,
        map, allMapFields, field;

    map = sol.create("sol.common.WfMap", { objId: me.objId, flowId: me.flowId });
    allMapFields = map.read();
    for (field in allMapFields) {
      meeting.wfMapKeys[field] = allMapFields[field];
    }
    return meeting;
  },

  replaceHtmlTags: function (data) {
    //TODO: overthink the html tags #BSMM-1981
    for (var prop in data) {
      if (typeof data[prop] === "string") {
        data[prop] = data[prop].replace(/<[^>]*>/g, "");
      }
    }
    return data;
  }
});

/**
* @member sol.meeting.ix.services.GetMeetingDocumentData
* @method RF_sol_meeting_service_GetMeetingDocumentData
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_GetMeetingDocumentData(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      meetingService = sol.create("sol.meeting.ix.services.GetMeetingDocumentData", rfParams),
      result = meetingService.process();
  return sol.common.JsonUtils.stringifyQuick(result);
}