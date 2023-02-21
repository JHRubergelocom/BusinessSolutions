
//@include lib_Class.js
//@include lib_sol.learning.ix.configKwl.Base.js

sol.define("sol.learning.ix.configKwl.InteractionElements", {
  extend: "sol.learning.ix.configKwl.Base",

  propertyName: "entities.webapp.services.config.modal.interactionElements",

  tableTitle: null,

  tableHeaders: null,

  tableKeyNames: null,

  rowDataFields: null,

  inject: {
    rawDataset: { config: "learning", prop: null },
    tableTitle: { config: "learning", prop: "entities.course.dynkwls.interactionElements.tableTitle", template: true },
    tableHeaders: { config: "learning", prop: "entities.course.dynkwls.interactionElements.tableHeaders", template: true },
    tableKeyNames: { config: "learning", prop: "entities.course.dynkwls.interactionElements.tableKeyNames", template: true },
    rowDataFields: { config: "learning", prop: "entities.course.dynkwls.interactionElements.rowDataFields", template: true }
  }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.learning.ix.configKwl.InteractionElements
 * @return {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.learning.ix.configKwl.InteractionElements" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.learning.ix.configKwl.InteractionElements", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
