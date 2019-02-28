
//@include lib_Class.js

/**
 * Utility functions for the ELO Notification Services
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloas
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
        language;

    userId = (typeof userId != "undefined") ? userId : ixConnect.loginResult.user.id;

    userProfile = sol.create("sol.common.UserProfile", { userId: userId });
    option = userProfile.getOption(me.loadNotifyConfig().email.optionKey) || 0;
    language = userProfile.getOption(me.notifyConfig.email.language) || ixConnect.loginResult.clientInfo.language;
    reportConfig.language = language;
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
        userProfile, flagName, bitMask, flag;

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
    userProfile.write();
  }
});
