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
//@include lib_sol.common.ix.ServiceBase.js

//@include lib_sol.meeting.ix.Meeting.js
//@include lib_sol.meeting.ix.MeetingRepository.js
//@include lib_sol.meeting.ix.MeetingItemRepository.js
//@include lib_sol.meeting.mixins.Configuration.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.Meeting" });

/**
* Provides service functions for meeting
*
* sol.common.IxUtils.execute("RF_sol_meeting_service_Meeting_Get", {
*       // pass objId oder GUID
*       id: "4711",
*       queries: {
*         agenda: true
*       },
*       excludes: {
*          agendaPool: true,
*          structuralItems: true,
*          itemContainer: true
*       }
* });
*
* @author MHe, ELO Digital Office GmbH
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
sol.define("sol.meeting.ix.services.Meeting", {
  extend: "sol.common.ix.ServiceBase",

  /**
    * @cfg id {Number|String} Either an regular repo Id or the meeting reference
    */

  /**
     * @cfg queries
     * @cfg queries.agenda {Boolean} Agenda search will be triggered as well
     */

  /**
     * @cfg excludes
     * @cfg excludes.agendaPool {Boolean} If true all items within the agenda pool will excluded from the response
     * @cfg excludes.structuralItems {Boolean} If true all structural items will excluded from the response
     * @cfg excludes.itemContainer {Boolean} If true all item container will excluded from the response
     */

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    meetingOutput: { config: "meeting", prop: "entities.meeting.outputs.meetingFull" },
    itemOutput: { config: "meetingItem", prop: "meetingItem.outputs.itemFull", template: false }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    if (!me.getId()) {
      throw Error("Either `id` or `objId` must be set.");
    }

    // objId is also supports for backwards compatiblity
    me.findFunction = sol.common.RepoUtils.isRepoId(me.getId())
      ? "findMeetingById"
      : "findMeetingByRef";

    me.queries = me.queries || {};
    me.excludes = me.excludes || {};
  },

  getId: function () {
    return this.id || this.objId;
  },

  process: function () {
    var me = this, response, meeting, agenda;

    meeting = sol.meeting.ix.MeetingRepository[me.findFunction](me.getId(), me.meetingOutput, "meeting");

    response = me.appendMeetingResponse(response, meeting);

    if (me.shouldQueryAgenda()) {
      agenda = sol.meeting.ix.MeetingItemRepository
        .findItemsByMeeting(meeting.getReference(), me.itemOutput, "agenda");

      if (me.shouldExcludeAgendaPool()) {
        // TODO: extract to utility function
        agenda.sords = (agenda.sords || []).filter(function (item) {
          return item.dayIndex != "0";
        });
      }

      if (me.shouldExcludeAgendaItemContainer()) {
        agenda.sords = me.excludeSolType(agenda.sords, "MEETING_ITEM_CONTAINER");
      }

      if (me.shouldExcludeAgendaStructuralItems()) {
        agenda.sords = me.excludeSolType(agenda.sords, "STRUCTURAL_ITEM");
      }

      response = me.appendAgendaResponse(response, agenda.sords);
    }

    me.shouldQueryMemberships()
            && (response = me.appendMembershipResponse(response, meeting.get()));

    return response;
  },

  shouldQueryAgenda: function () {
    var me = this;
    return me.queries.agenda === true;
  },

  shouldQueryMemberships: function () {
    var me = this;
    return me.queries.memberships === true;
  },

  shouldExcludeAgendaPool: function () {
    var me = this;
    return me.excludes.agendaPool === true;
  },

  shouldExcludeAgendaStructuralItems: function () {
    var me = this;
    return me.excludes.structuralItems === true;
  },

  shouldExcludeAgendaItemContainer: function () {
    var me = this;
    return me.excludes.itemContainer === true;
  },

  appendMeetingResponse: function (result, meeting) {
    result = {
      meeting: {
        sord: meeting.get(),
        config: {}
      }
    };

    return result;
  },

  appendMembershipResponse: function (result, meeting) {
    var user = ixConnect.loginResult.user;
    result.user = {
      id: user.id,
      name: user.name,
      memberships: {
        organizerGroup: sol.common.UserUtils.isInGroup(meeting.adminGroup, { userId: user.id })
      }
    };
    return result;
  },

  appendAgendaResponse: function (result, items) {
    result.agenda = {
      sords: items
    };

    return result;
  },

  excludeSolType: function (sords, type) {
    return (sords || []).filter(function (item) {
      return item.solType != type;
    });
  }
});

/**
* @member sol.meeting.ix.services.Meeting
* @method RF_sol_meeting_service_Meeting_Get
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_Meeting_Get(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      meetingService = sol.create("sol.meeting.ix.services.Meeting", rfParams),
      result = meetingService.process();
  return sol.common.JsonUtils.stringifyQuick(result);
}