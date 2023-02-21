
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

/**
 *
 * Dynamic keyword list that returns a list of the generator types for "Reply Reference".
 *
 * The list is returned as a table.
 *
 * |Name|Description|Example data|
 * |:-----|:------|:------|
 * |Short Description|KNOWLEDGE_REPLY_REFERENCE_GEN|Name of the generator
 * |Description|-|Description of the generator (memo text)|
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.Logger
 * @requires sol.common.Config
 * @requires sol.common.ix.DynKwlFindChildrenIterator
 */
sol.define("sol.knowledge.ix.dynkwl.generators.ReplyReference", {
  extend: "sol.common.ix.DynKwlFindChildrenIterator",

  initialize: function (params) {
    var me = this,
        terms = sol.common.TranslateTerms;

    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
    me.parentId = me.knowledgeConfig.generators.templateFolderIds.replyReference;

    terms.require("sol.knowledge.dynkwl.replyReference");
    me.tableTitle = terms.translate("sol.knowledge.dynkwl.replyReference.tableTitle");
    me.tableHeaders = [
      terms.translate("sol.knowledge.dynkwl.replyReference.tableHeaders.name"),
      terms.translate("sol.knowledge.dynkwl.replyReference.tableHeaders.description")
    ];

    me.$super("sol.common.ix.DynKwlFindChildrenIterator", "initialize", [params]);
  },

  /**
   * @cfg
   * @inheritdoc
   */
  tableKeyNames: ["KNOWLEDGE_REPLY_REFERENCE_GEN", null],

  /**
   * @cfg
   * defined by initialize
   */
  parentId: null

});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.knowledge.ix.dynkwl.generators.ReplyReference
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.knowledge.ix.dynkwl.generators.ReplyReference" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.knowledge.ix.dynkwl.generators.ReplyReference", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
