
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.LocalizedKwlIterator.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.meeting.ix.localizedKwl.Base.js
//@include lib_sol.meeting.mixins.Configuration.js

/**
 * Localized keyword list for calendar units in deadlines
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
sol.define("sol.meeting.ix.localizedKwl.CalendarUnitDeadline", {
  extend: "sol.meeting.ix.localizedKwl.Base",
  kwlName: "CalendarUnitDeadline"
});

/**
 * Implements a localized keyword list for meeting relations
 * @static
 * @member sol.meeting.ix.localizedKwl.CalendarUnitDeadline
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.meeting.ix.localizedKwl.CalendarUnitDeadline" }),
      iterator;
  try {
    log.info("LocalizedKeywordList (");
    iterator = sol.create("sol.meeting.ix.localizedKwl.CalendarUnitDeadline", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
