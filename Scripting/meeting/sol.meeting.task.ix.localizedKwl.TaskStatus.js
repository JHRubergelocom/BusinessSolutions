
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.LocalizedKwlIterator.js

/**
 * Localized keyword list for meeting status.
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.ix.LocalizedKwlIterator
 * @requires sol.meeting.mixins.Configuration
 *
 * TODO: Refactor to localizedKwl.Base when the BaseFunction is done
 */
sol.define("sol.meeting.task.ix.localizedKwl.TaskStatus", {
  extend: "sol.common.ix.LocalizedKwlIterator",

  /**
   * @cfg {String} kwlName
   * Name of the keyword list. The name corresponds to the configuration
   * property that contains the configuration keyword list
   */
  kwlName: "taskStatus",

  initialize: function () {
    var me = this,
      config;

    config = sol.create("sol.common.Config", { compose: "/meeting_task/Configuration/localizedKwls.config" }).config;
    me.$super("sol.common.ix.LocalizedKwlIterator", "initialize", [config[me.kwlName]]);
  }
});

/**
 * Implements a localized keyword list for contract relations
 * @static
 * @member sol.meeting.ix.localizedKwl.MeetingStatus
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.meeting.ix.localizedKwl.MeetingStatus" }),
      iterator;

  try {
    log.info("LocalizedKeywordList (");

    iterator = sol.create("sol.meeting.task.ix.localizedKwl.TaskStatus", {});

    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
