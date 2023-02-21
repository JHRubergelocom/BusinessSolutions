
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.ix.LocalizedKwlIterator.js


/**
 * Localized keyword list for meeting person roles.
 *
 * @author EOe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.ix.LocalizedKwlIterator
 */
sol.define("sol.meeting.ix.localizedKwl.MeetingPersonRole", {
  extend: "sol.common.ix.LocalizedKwlIterator",

  /**
   * @cfg {String} kwlName
   * Name of the keyword list. The name corresponds to the configuration
   * property that contains the configuration keyword list
   */
  kwlName: "meetingPersonRole",

  initialize: function () {
    var me = this,
      config;

    config = sol.create("sol.common.Config", { compose: "/meeting/Configuration/localizedKwls.config" }).config;
    me.$super("sol.common.ix.LocalizedKwlIterator", "initialize", [config[me.kwlName]]);
  }
});

/**
 * Implements a localized keyword list for meeting person roles
 * @static
 * @member sol.meeting.ix.localizedKwl.MeetingPersonRole
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.meeting.ix.localizedKwl.MeetingPersonRole" }),
    iterator;

  try {
    log.info("LocalizedKeywordList (");

    iterator = sol.create("sol.meeting.ix.localizedKwl.MeetingPersonRole", {});

    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
