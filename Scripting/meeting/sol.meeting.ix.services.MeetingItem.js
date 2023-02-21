importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.meeting.ix.MeetingRepository.js
//@include lib_sol.meeting.ix.ProposalTypeActions.js
//@include lib_sol.meeting.ix.MeetingItemRepository.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.MeetingItem" });


/**
 * @requires sol.common.IxUtils
 * @requires sol.common.Injection
 * @requires sol.common.JsonUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.meeting.ix.MeetingRepository
 * @requires sol.meeting.ix.ProposalTypeActions
 * @requires sol.meeting.ix.MeetingItemRepository
 *
 */
sol.define("sol.meeting.ix.services.MeetingItem", {
  extend: "sol.common.ix.ServiceBase",

  /**
    * @cfg id {Number|String} Either an regular repo Id or the meeting item reference
    */

  /**
     * @cfg queries
     * @cfg queries.memberships {Boolean} Check if the current user is in special roles
     * @cfg queries.attachments {Boolean} Added attachments of the item
     * @cfg queries.proposal {Boolean} Added the regarding proposal to the result
     * @cfg queries.proposalActions {Boolean}
     */

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    itemOutput: { config: "meetingItem", prop: "meetingItem.outputs.itemFull" },
    meetingOutput: { config: "meeting", prop: "entities.meeting.outputs.meetingFull" }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    if (!me.getId()) {
      throw Error("Either `id` or `objId` must be set.");
    }

    me.queries = me.queries || {};
  },

  getId: function () {
    return this.id || this.objId;
  },

  process: function () {
    var me = this, response, meetingItem;
    meetingItem = sol.meeting.ix.MeetingItemRepository
      .findMeetingItem(me.getId(), me.itemOutput, "meeting-item");

    response = me.createMeetingItemResponse(meetingItem);

    // get meeting internally. If multiple use cases need meeting here
    // meeting should get in separate function
    me.shouldQueryMemberships() &&
            (response = me.appendMembershipResponse(response, meetingItem));

    me.shouldQueryAttachments() &&
            (response = me.appendAttachments(response, meetingItem));

    me.shouldQueryProposal() &&
            (response = me.appendProposalResponse(response, meetingItem));

    me.shouldQueryProposalActions() &&
            (response = me.appendProposalActions(response, meetingItem));

    return response;
  },

  shouldQueryMemberships: function () {
    var me = this;
    return me.queries.memberships === true;
  },

  shouldQueryAttachments: function () {
    var me = this;
    return me.queries.attachments === true;
  },

  shouldQueryProposal: function () {
    var me = this;
    return me.queries.proposal === true;
  },

  shouldQueryProposalActions: function () {
    var me = this;
    // TODO: this is only necessary when user has correct permissions
    return me.queries.proposalActions === true;
  },

  appendProposalActions: function (response, meetingItem) {
    var proposalActionMapper = sol.create("sol.meeting.ix.ProposalTypeActions");

    response.resolutionActions = proposalActionMapper.getActions(meetingItem.get("proposalCode"));
    return response;
  },

  appendProposalResponse: function (response, meetingItem) {
    var me = this, proposal;

    try {
      // TODO: replace with ProposalRepository
      proposal = sol.common.IxUtils.execute("RF_sol_meeting_service_GetProposal", {
        source: {
          objKeys: {
            MEETING_ITEM_ID: meetingItem.getReference()
          }
        },
        query: {
          collectChildren: true
        },
        options: { elementArg: "proposal" }
      });

      response.proposal = {
        sord: proposal.proposal,
        attachments: proposal.children
      };

    } catch (ex) {
      me.logger.debug(["An error occured during findProposal item={0}", meetingItem.getReference()], ex);
    }

    return response;
  },

  appendMembershipResponse: function (response, meetingItem) {
    var me = this,
        user = ixConnect.loginResult.user,
        meeting = sol.meeting.ix.MeetingRepository.findMeeting(meetingItem.get("meetingReference"), me.meetingOutput, "meeting");
    response.user = {
      id: user.id,
      name: user.name,
      memberships: {
        organizerGroup: sol.common.UserUtils.isInGroup(meeting.get("adminGroup"), { userId: user.id })
      }
    };
    return response;
  },

  appendAttachments: function (response, meetingItem) {
    response.item.attachments = sol.meeting.ix.MeetingItemRepository
      .findAttachmentsByItem(meetingItem.id);
    return response;
  },

  createMeetingItemResponse: function (meetingItem) {
    var response = {};
    response.item = {
      sord: meetingItem.get(),
      config: {}
    };

    return response;
  }

});

/**
* @member sol.meeting.ix.services.MeetingItem
* @method RF_sol_meeting_service_MeetingItem_Get
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_MeetingItem_Get(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      itemService = sol.create("sol.meeting.ix.services.MeetingItem", rfParams),
      result = itemService.process();
  return sol.common.JsonUtils.stringifyQuick(result);
}