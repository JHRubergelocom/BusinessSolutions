importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include sol.common.ix.dynkwl.DynKwlMultiIndexIterator.js
//@include lib_sol.common.TranslateTerms.js


/**
 * Provide a dynkwl table with a filter to reach all allowed Proposal Types of a meeting board
 *
 * @author Mhe (ELO Digital Office GmbH)
 *
 * @requires sol.common.ix.dynkwl.DynKwlMultiIndexIterator
 * @requires sol.common.TranslateTerms
 *
 * @since 1.00.000
 */
sol.define("sol.meeting.ix.dynkwl.ProposalTypesMultiIndex", {
    extend: "sol.common.ix.DynKwlMultiIndexIterator",

    initialize: function (config) {
      var me = this;
      me.$super("sol.common.ix.DynKwlMultiIndexIterator", "initialize", [config]);
    }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.common.ix.dynkwl.ProposalTypesMultiIndex
 * @return {DynamicKeywordDataProvider}
 */
function getDataIterator() {
    var log = sol.create("sol.Logger", { scope: "sol.meeting.ix.dynkwl.ProposalTypesMultiIndex" }),
        iterator;
    try {
      log.info("DynamicKeywordList (");
      iterator = sol.create("sol.meeting.ix.dynkwl.ProposalTypesMultiIndex", {
        tableTitle: ["Vorschläge"],
        tableHeaders: ["Wert"],
        multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES"}
      });
      return new DynamicKeywordDataProvider(iterator);
    } finally {
      log.info(")getDataIterator");
    }
}