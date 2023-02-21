importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Retrieves all to a meeting item connected persons
 *
 *
 * @author ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.Class
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.meeting.ix.services.GetMeetingConnectedPersons", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.meeting.mixins.Configuration", "sol.common.mixins.Inject"],

  _optimize: {},

  /**
   * Injected configurations which will not be templated within inject mechanism, will be templated before executtion
   */
  inject: {
    sord: { sordIdFromProp: "objId", optional: false },
    meetingBoard: { config: "meetingBoard", prop: "meetingBoards.services.GetBoard", template: true },
    meeting: { config: "meeting", prop: "entities.meeting.services.getMeeting", template: true },
    meetingItem: { config: "meetingItem", prop: "meetingItem.services.getItem", template: true },
    members: { config: "meetingBoard", prop: "meetingBoards.services.GetMembersForPermissions", template: false }, // will be rendered if called
    participants: { config: "meeting", prop: "entities.meeting.services.getParticipantsEloUserIds", template: false }, // will be rendered if called
    meetingItemProposal: { config: "proposals", prop: "services.GetProposalTemplateSord", template: false }, // will be rendered if called
    meetingItemVotingFolder: { config: "meetingItem", prop: "meetingItem.services.getVotingFolder", template: false } // will be rendered if called
  },

  process: function () {
    var me = this,
        connectedData;

    connectedData = {
      meetingBoard: me.getMeetingBoard(),
      meeting: me.getMeeting(),
      meetingItem: me.getMeetingItem()
    };

    if (connectedData.meetingBoard) {
      connectedData.meetingBoardOrganizer = me.getMeetingBoardOrganizer(connectedData);
      connectedData.meetingBoardOwner = me.getMeetingBoardOwner(connectedData);
      connectedData.meetingBoardMembers = me.getMeetingBoardMembers(connectedData);
    }

    if (connectedData.meeting) {
      connectedData.meetingOwner = me.getMeetingOwner(connectedData);
      connectedData.meetingParticipants = me.getMeetingParticipants(connectedData);
    }

    if (connectedData.meetingItem) {
      connectedData.meetingItemOwner = me.getMeetingItemOwner(connectedData);
      connectedData.meetingItemResponsible = me.getMeetingItemResponsible(connectedData);
      connectedData.meetingItemSpeaker = me.getMeetingItemSpeaker(connectedData);

      connectedData.meetingItemProposal = me.getMeetingItemProposal(connectedData);
      if (connectedData.meetingItemProposal) {
        connectedData.meetingItemProposalOwner = me.getMeetingItemProposalOwner(connectedData);
      }
      connectedData.meetingItemVotingFolder = me.getMeetingItemVotingFolderId(connectedData);
    }

    return me.asElementService
      ? { elements: [connectedData] }
      : connectedData;
  },

  getMeetingBoard: function () {
    var me = this,
        currentSordSolType = me.getSolType(me.sord);

    switch (currentSordSolType) {
      case "MEETING_BOARD":
        return me.sord;
      default:
        return me.getFirstSord(
          me.execute(
            me.meetingBoard.name,
            me.meetingBoard.args,
            "meetingBoard"
          )
        );
    }
  },

  getMeetingBoardOrganizer: function (templateData) {
    return sol.common.ObjectUtils.getProp(templateData, "meetingBoard.objKeys.MEETING_BOARD_ORGANIZER");
  },

  getMeetingBoardOwner: function (templateData) {
    var ownerName = sol.common.ObjectUtils.getProp(templateData, "meetingBoard.ownerName");

    return ownerName != "ELO Service" ? ownerName : "";
  },

  getMeetingBoardMembers: function (templateData) {
    var me = this;

    return me.getValuesFromArray(
      me.execute(
        me.members.name,
        sol.common.TemplateUtils.render(me.members.args, { sord: templateData.meetingBoard }),
        "members"
      ),
      "MEETING_PERSON_ELOUSERID"
    );
  },

  getMeeting: function () {
    var me = this,
        currentSordSolType = me.getSolType(me.sord);

    switch (currentSordSolType) {
      case "MEETING_BOARD":
        return null;
      case "MEETING":
        return me.sord;
      default:
        return me.getFirstSord(
          me.execute(
            me.meeting.name,
            me.meeting.args,
            "meeting"
          )
        );
    }
  },

  getMeetingOwner: function (templateData) {
    var ownerName = sol.common.ObjectUtils.getProp(templateData, "meeting.ownerName");

    return ownerName != "ELO Service" ? ownerName : "";
  },

  getMeetingParticipants: function (templateData) {
    var me = this;

    return me.getValuesFromArray(
      me.execute(
        me.participants.name,
        sol.common.TemplateUtils.render(me.participants.args, { sord: templateData.meeting }),
        "participants"
      ),
      "MEETING_PERSON_ELOUSERID"
    );
  },

  getMeetingItem: function () {
    var me = this,
        currentSordSolType = me.getSolType(me.sord);

    switch (currentSordSolType) {
      case "MEETING_BOARD":
      case "MEETING":
        return null;
      case "MEETING_ITEM":
        return me.sord;
      default:
        return me.getFirstSord(
          me.execute(
            me.meetingItem.name,
            me.meetingItem.args,
            "meetingItem"
          )
        );
    }
  },

  getMeetingItemOwner: function (templateData) {
    var ownerName = sol.common.ObjectUtils.getProp(templateData, "meetingItem.ownerName");

    return ownerName != "ELO Service" ? ownerName : "";
  },

  getMeetingItemResponsible: function (templateData) {
    return sol.common.ObjectUtils.getProp(templateData, "meetingItem.objKeys.MEETING_ITEM_RESPONSIBLE_PERSON");
  },

  getMeetingItemSpeaker: function (templateData) {
    return sol.common.ObjectUtils.getProp(templateData, "meetingItem.objKeys.MEETING_ITEM_SPEAKER");
  },

  getMeetingItemProposal: function (templateData) {
    var me = this,
        currentSordSolType = me.getSolType(me.sord);

    switch (currentSordSolType) {
      case "MEETING":
      case "MEETING_BOARD":
        return null;
      case "MEETING_PROPOSAL":
        return me.sord;
      default:
        try {
          return (me.execute(
            me.meetingItemProposal.name,
            sol.common.TemplateUtils.render(me.meetingItemProposal.args, { sord: templateData.meetingItem }),
            me.meetingItemProposal.args,
            "meetingItemProposal"
          ) || {}).proposal;
        } catch (error) {
          // ignore error (proposal could not be determined, because not every meeting item has a proposal)
          return null;
        }
    }
  },

  getMeetingItemProposalOwner: function (templateData) {
    var ownerName = sol.common.ObjectUtils.getProp(templateData, "meetingItemProposal.ownerName");

    return ownerName != "ELO Service" ? ownerName : "";
  },

  getMeetingItemVotingFolderId: function (connectedData) {
    var me = this,
        currentSordSolType = me.getSolType(me.sord);

    switch (currentSordSolType) {
      case "MEETING_ITEM":
        return me.getFirstSord(
          me.execute(
            me.meetingItemVotingFolder.name,
            sol.common.TemplateUtils.render(me.meetingItemVotingFolder.args, { sord: connectedData.meetingItem }),
            "meetingItemVotingFolder"
          )
        );
      default:
      case "MEETING":
      case "MEETING_BOARD":
        return null;
    }
  },

  getSolType: function (templateSord) {
    return sol.common.ObjectUtils.getProp(templateSord, "objKeys.SOL_TYPE");
  },

  getFirstSord: function (result) {
    var me = this;

    return me.getElements(result)[0];
  },

  getValuesFromArray: function (result, key) {
    var me = this;
    return me.getElements(result)
      .map(function (element) {
        return sol.common.ObjectUtils.getProp(element, key);
      });
  },

  getElements: function (result) {
    return (result || {}).sords || (result || {}).elements || [];
  },

  execute: function (name, args, optimizationName) {
    var me = this;
    try {
      return optimizationName
        ? sol.common.IxUtils.optimizedExecute(name, args, me._optimize, optimizationName, ["output"])
        : sol.common.IxUtils.execute(name, args);
    } catch (error) {
      me.logger.info("ERROR executing " + name + " with params " + JSON.stringify(args));
      return null;
    }
  }
});

/**
 * @member sol.meeting.ix.services.GetMeetings
 * @method RF_sol_meeting_service_GetMeetingConnectedPersons
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_meeting_service_GetMeetingConnectedPersons(context, args) {
  var params,
      service,
      result,
      logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.GetMeetings" });

  logger.enter("RF_sol_meeting_service_GetMeetingConnectedPersons", args);


  params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args);
  delete params._optimize;

  service = sol.create("sol.meeting.ix.services.GetMeetingConnectedPersons", params);
  result = JSON.stringify(service.process());

  logger.exit("RF_sol_meeting_service_GetMeetingConnectedPersons", result);

  return result;
}