
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.DynKwlSearchIterator.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.learning.ix.dynkwl.courseIterator.Base.js

/**
 * Dynamic keyword list that returns the sord content of required courses selected by solution object type.
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.DynKwlSearchIterator
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.learning.ix.dynkwl.courseIterator.Base
 */
sol.define("sol.learning.ix.dynkwl.RequiredCourseIterator", {
  extend: "sol.learning.ix.dynkwl.courseIterator.Base",

  inject: {
    solutiontypes: { config: "learning", prop: "entities.course.dynkwls.course.const.solutiontypes", template: true },
    status: { config: "learning", prop: "entities.course.dynkwls.course.const.status", template: true },
    searchParams: { config: "learning", prop: "entities.course.dynkwls.course.searchParams" },
    tableTitle: { config: "learning", prop: "entities.course.dynkwls.course.tableTitle", template: true },
    tableHeaders: { config: "learning", prop: "entities.course.dynkwls.course.tableHeaders", template: true },
    tableKeyNames: { config: "learning", prop: "entities.course.dynkwls.requiredcourse", template: true },
    rowDataFields: { config: "learning", prop: "entities.course.dynkwls.course.rowDataFields", template: true }
  }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.learning.ix.dynkwl.RequiredCourseIterator
 * @return {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.learning.ix.dynkwl.RequiredCourseIterator" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.learning.ix.dynkwl.RequiredCourseIterator", { focusFieldGivesValueForMap: true });
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}

