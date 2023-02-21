//@include lib_Class.js

sol.define("sol.meeting.mixins.Configuration", {
  mixin: true,

  $configRelation: {
    meeting: "/meeting/Configuration/meeting.config",
    meetingType: "/meeting/Configuration/meetingType.config",
    localizedKwls: "/meeting/Configuration/localizedKwls.config",
    meetingItem: "/meeting/Configuration/meetingItem.config",
    permissions: "/meeting/Configuration/permissions.config",
    rules: "/meeting/Configuration/rules.config",
    notification: "/meeting/Configuration/notification.config"
  }
});