
//@include lib_Class.js
//@include lib_sol.learning.ix.configKwl.Base.js

sol.define("sol.learning.ix.configKwl.Label", {
  extend: "sol.learning.ix.configKwl.Base",

  propertyName: "entities.webapp.services.config.labels",

  tableTitle: "Labels",

  tableHeaders: ["Name", null],

  tableKeyNames: ["IX_MAP_COURSE_LABEL_NAME", "IX_MAP_COURSE_LABEL_ID"],

  rowDataFields: ["name", "id"]
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.learning.ix.configKwl.Label
 * @return {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.learning.ix.configKwl.Label" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.learning.ix.configKwl.Label", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
