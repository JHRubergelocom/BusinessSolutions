
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.LocalizedKwlIterator.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.meeting.ix.localizedKwl.Base.js
//@include lib_sol.meeting.mixins.Configuration.js


/**
 * Localized keyword list for Notification Participant Search Templates.
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.Injection
 * @requires sol.common.ix.LocalizedKwlIterator
 * @requires sol.meeting.ix.localizedKwl.Base
 * @requires sol.meeting.mixins.Configuration
 */
sol.define("sol.meeting.ix.localizedKwl.notification.ParticipantSearchTemplates", {
  extend: "sol.meeting.ix.localizedKwl.Base",
  kwlName: "ParticipantSearchTemplates"
});

/**
 * Implements a localized keyword list for Participant Search Templates
 * @static
 * @member sol.meeting.ix.localizedKwl.notification.ParticipantSearchTemplates
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.meeting.ix.localizedKwl.notification.ParticipantSearchTemplates" }),
      iterator;

  try {
    log.info("LocalizedKeywordList (");

    iterator = sol.create("sol.meeting.ix.localizedKwl.notification.ParticipantSearchTemplates", {});

    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
