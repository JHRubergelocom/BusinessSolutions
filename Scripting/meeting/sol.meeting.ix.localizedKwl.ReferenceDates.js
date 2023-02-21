
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.LocalizedKwlIterator.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.meeting.ix.localizedKwl.Base.js
//@include lib_sol.meeting.mixins.Configuration.js


/**
 * Localized keyword list for Reference Dates
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
sol.define("sol.meeting.ix.localizedKwl.ReferenceDates", {
  extend: "sol.meeting.ix.localizedKwl.Base",
  kwlName: "ReferenceDates"
});

/**
 * Implements a localized keyword list for Reference Dates
 * @static
 * @member sol.meeting.ix.localizedKwl.ReferenceDates
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.meeting.ix.localizedKwl.ReferenceDates" }),
      iterator;

  try {
    log.info("LocalizedKeywordList (");

    iterator = sol.create("sol.meeting.ix.localizedKwl.ReferenceDates", {});

    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
