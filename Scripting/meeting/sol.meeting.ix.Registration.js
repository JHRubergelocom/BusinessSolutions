
//@include lib_Class.js
//@include lib_sol.common.ix.ServiceRegistry.js

/**
 * @class sol.meeting.ix.Registration
 * Registers all services and configurations exposed by the meeting solution.
 */
sol.common.ix.ServiceRegistry.register("meeting_update_registration_config", {
  type: sol.common.ix.ServiceRegistry.TYPES.CONFIG,
  name: "Meeting update registration",
  description: "Description of how a meeting update has to be registered.",
  cfg: {
    templateId: "sol.meeting.Update"
  },
  ns: "sol.meeting",
  functions: [sol.common.ix.ServiceRegistry.FUNCTIONS.REGISTER_UPDATE],
  soltypes: ["MEETING"]
});

sol.common.ix.ServiceRegistry.register("meeting_board_update_registration_config", {
  type: sol.common.ix.ServiceRegistry.TYPES.CONFIG,
  name: "Meeting update registration",
  description: "Description of how a meeting board update has to be registered.",
  cfg: {
    templateId: "sol.meeting.meetingBoard.Update"
  },
  ns: "sol.meeting",
  functions: [sol.common.ix.ServiceRegistry.FUNCTIONS.REGISTER_UPDATE],
  soltypes: ["MEETING_BOARD"]
});

sol.common.ix.ServiceRegistry.register("meeting_board_member_update_registration_config", {
  type: sol.common.ix.ServiceRegistry.TYPES.CONFIG,
  name: "MeetingBoard member update registration",
  description: "Description of how a meeting board member update has to be registered.",
  cfg: {
    templateId: "sol.meeting.meetingBoard.UpdateMember"
  },
  ns: "sol.meeting",
  functions: [sol.common.ix.ServiceRegistry.FUNCTIONS.REGISTER_UPDATE],
  soltypes: ["MEMBER"]
});

sol.common.ix.ServiceRegistry.register("meeting_item_update_registration_config", {
  type: sol.common.ix.ServiceRegistry.TYPES.CONFIG,
  name: "Meeting item update registration",
  description: "Description of how a meeting item update has to be registered.",
  cfg: {
    templateId: "sol.meeting.item.Update"
  },
  ns: "sol.meeting",
  functions: [sol.common.ix.ServiceRegistry.FUNCTIONS.REGISTER_UPDATE],
  soltypes: ["MEETING_ITEM"]
});

sol.common.ix.ServiceRegistry.register("participant_update_registration_config", {
  type: sol.common.ix.ServiceRegistry.TYPES.CONFIG,
  name: "Participant update registration",
  description: "Description of how a participant update has to be registered.",
  cfg: {
    templateId: "sol.meeting.UpdateParticipant"
  },
  ns: "sol.meeting",
  functions: [sol.common.ix.ServiceRegistry.FUNCTIONS.REGISTER_UPDATE],
  soltypes: ["PARTICIPANT"]
});