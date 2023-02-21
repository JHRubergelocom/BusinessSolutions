
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

/**
 *
 * Dynamic keyword list that returns a list of the generator types for "Post Reference".
 *
 * The list is returned as a table.
 *
 * |Name|Description|Example data|
 * |:-----|:------|:------|
 * |Short Description|KNOWLEDGE_POST_REFERENCE_GEN|Name of the generator
 * |Description|-|Description of the generator (memo text)|
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.Logger
 * @requires sol.common.Config
 * @requires sol.common.ix.DynKwlFindChildrenIterator
 */
sol.define("sol.knowledge.ix.dynkwl.generators.PostReference", {
  extend: "sol.common.ix.DynKwlFindChildrenIterator",

  initialize: function (params) {
    var me = this,
        terms = sol.common.TranslateTerms;

    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
    me.parentId = me.knowledgeConfig.generators.templateFolderIds.postReference;

    terms.require("sol.knowledge.dynkwl.postReference");
    me.tableTitle = terms.translate("sol.knowledge.dynkwl.postReference.tableTitle");
    me.tableHeaders = [
      terms.translate("sol.knowledge.dynkwl.postReference.tableHeaders.name"),
      terms.translate("sol.knowledge.dynkwl.postReference.tableHeaders.description")
    ];

    me.$super("sol.common.ix.DynKwlFindChildrenIterator", "initialize", [params]);
  },

  /**
   * @cfg
   * @inheritdoc
   */
  tableKeyNames: ["KNOWLEDGE_POST_REFERENCE_GEN", null],

  /**
   * @cfg
   * defined by initialize
   */
  parentId: null
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.knowledge.ix.dynkwl.generators.PostReference
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.knowledge.ix.dynkwl.generators.PostReference" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.knowledge.ix.dynkwl.generators.PostReference", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
