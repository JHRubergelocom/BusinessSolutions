
//@include lib_Class.js

/**
 * Utility functions for the ELO Notification Services
 *
 * @author ELO Digital Office GmbH
 * @version 1.06.001
 *
 * @eloas
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.RepoUtils
 */
sol.define("sol.notify.Utils", {
  singleton: true,

  flags: {
    enableMail: 1,
    sendAlways: 2,
    withGroups: 4,
    withDeputies: 8,
    withWeekend: 16,
    onlyOnce: 32,
    newsMyElo: 64
  },

  /**
   * Loads the notify configuration
   * @return {Object}
   */
  loadNotifyConfig: function () {
    var me = this;
    me.notifyConfig = sol.create("sol.common.Config", { compose: "/notify/Configuration/notify.config" }).config;
    return me.notifyConfig;
  },

  /**
   * Reads the report configuration
   * @param {String} userId
   * @return {Object} Report configuration
   */
  readReportConfig: function (userId) {
    var me = this,
        reportConfig = {},
        userProfile, option, flagName, bitMask,
        language, timeZoneKey, reportEndDaysString, delayDaysString;

    userId = (typeof userId != "undefined") ? userId : ixConnect.loginResult.user.id;

    userProfile = sol.create("sol.common.UserProfile", { userId: userId });
    option = userProfile.getOption(me.loadNotifyConfig().email.optionKey) || 0;
    language = userProfile.getOption(me.notifyConfig.email.language) || ixConnect.loginResult.clientInfo.language;
    reportConfig.language = language;
    timeZoneKey = me.notifyConfig.email.timeZoneKey || "ELOas.SendWfAsMail.timeZone";
    reportConfig.timeZone = userProfile.getOption(timeZoneKey);

    reportEndDaysString = userProfile.getOption("ELOas.SendWfAsMail.reportEndDays");
    reportConfig.reportEndDays = Number(reportEndDaysString);

    delayDaysString = userProfile.getOption("ELOas.SendWfAsMail.delayDays");
    reportConfig.delayDays = Number(delayDaysString);

    for (flagName in me.flags) {
      bitMask = me.flags[flagName];
      reportConfig[flagName] = sol.common.UserProfileUtils.isOptionBitSet(option, bitMask);
    }

    return reportConfig;
  },

  /**
   * Writes the report configuration
   * @param {String} userId User ID
   * @param {String} reportConfig Report configuration
   */
  writeReportConfig: function (userId, reportConfig) {
    var me = this,
        optionValue = 0,
        userProfile, flagName, bitMask, flag, timeZoneKey, reportEndDaysKey, delayDaysKey;

    userId = (typeof userId != "undefined") ? userId : ixConnect.loginResult.user.id;
    reportConfig = reportConfig || {};

    userProfile = sol.create("sol.common.UserProfile", { userId: userId });

    for (flagName in me.flags) {
      bitMask = me.flags[flagName];
      flag = reportConfig[flagName];
      if (typeof flag != "undefined") {
        optionValue = sol.common.UserProfileUtils.setOptionBit(optionValue, flag, bitMask);
      }
    }

    userProfile.setOption(me.loadNotifyConfig().email.optionKey, optionValue);
    if (reportConfig.language) {
      userProfile.setOption(me.notifyConfig.email.language, reportConfig.language);
    }

    if (reportConfig.timeZone) {
      timeZoneKey = me.notifyConfig.email.timeZoneKey || "ELOas.SendWfAsMail.timeZone";
      userProfile.setOption(timeZoneKey, reportConfig.timeZone);
    }

    if (typeof reportConfig.reportEndDays != "undefined") {
      reportEndDaysKey = me.notifyConfig.email.reportEndDaysKey || "ELOas.SendWfAsMail.reportEndDays";
      userProfile.setOption(reportEndDaysKey, reportConfig.reportEndDays);
    }

    if (typeof reportConfig.delayDays != "undefined") {
      delayDaysKey = me.notifyConfig.email.delayDaysKey || "ELOas.SendWfAsMail.delayDays";
      userProfile.setOption(delayDaysKey, reportConfig.delayDays);
    }

    userProfile.write();
  }
});
