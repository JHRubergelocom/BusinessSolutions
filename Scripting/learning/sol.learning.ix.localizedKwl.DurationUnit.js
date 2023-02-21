
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.learning.ix.localizedKwl.Base.js

/**
 * Localized keyword list for duration units
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.TranslateTerms
 * @requires sol.learning.ix.localizedKwl.Base
 */
sol.define("sol.learning.ix.localizedKwl.DurationUnit", {
  extend: "sol.learning.ix.localizedKwl.Base",
  kwlName: "durationunit"
});

/**
 * Implements a localized keyword list for requisition status
 * @static
 * @member sol.learning.ix.localizedKwl.DurationUnit
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.learning.ix.localizedKwl.DurationUnit" }),
      iterator;
  try {
    log.info("LocalizedKeywordList (");
    iterator = sol.create("sol.learning.ix.localizedKwl.DurationUnit", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
