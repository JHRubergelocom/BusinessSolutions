
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.learning.ix.localizedKwl.Base.js

/**
 * Localized keyword list for course status
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.TranslateTerms
 * @requires sol.learning.ix.localizedKwl.Base
 */
sol.define("sol.learning.ix.localizedKwl.CourseStatus", {
  extend: "sol.learning.ix.localizedKwl.Base",
  kwlName: "coursestatus"
});

/**
 * Implements a localized keyword list for requisition status
 * @static
 * @member sol.learning.ix.localizedKwl.CourseStatus
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.learning.ix.localizedKwl.CourseStatus" }),
      iterator;
  try {
    log.info("LocalizedKeywordList (");
    iterator = sol.create("sol.learning.ix.localizedKwl.CourseStatus", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
