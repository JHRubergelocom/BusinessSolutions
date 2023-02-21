
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.LocalizedKwlIterator.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js


/**
 * Localized keyword list for meeting item status.
 *
 * @author SDi, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.ix.LocalizedKwlIterator
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.meeting.ix.localizedKwl.MeetingItemStatus", {
  extend: "sol.common.ix.LocalizedKwlIterator",

  /**
   * @cfg {String} kwlName
   * Name of the keyword list. The name corresponds to the configuration
   * property that contains the configuration keyword list
   */
  kwlName: "meetingItemStatus",

  initialize: function () {
    var me = this,
      config;

    config = sol.create("sol.common.Config", { compose: "/meeting/Configuration/localizedKwls.config" }).config;
    me.$super("sol.common.ix.LocalizedKwlIterator", "initialize", [config[me.kwlName]]);
  }
});

/**
 * Implements a localized keyword list for contract relations
 * @static
 * @member sol.meeting.ix.localizedKwl.MeetingItemStatus
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.meeting.ix.localizedKwl.MeetingItemStatus" }),
      iterator;

  try {
    log.info("LocalizedKeywordList (");

    iterator = sol.create("sol.meeting.ix.localizedKwl.MeetingItemStatus", {});

    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
