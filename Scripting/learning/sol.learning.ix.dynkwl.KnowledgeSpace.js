
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.FileUtils.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.DynKwlSearchIterator.js

/**
 *
 * Dynamic keyword list that returns a list of all available spaces from the knowledge solution
 *
 * The list is returned as a table.
 *
 * |Name|Description|Example data|
 * |:-----|:------|:------|
 * |Board Name|-|Name of the Knowledge Board|
 * |Space Name|IX_MAP_KNOWLEDGE_SPACE_NAME|Name of the Knowledge Space|
 * |Space GUID|KNOWLEDGE_SPACE_REFERENCE|GUID of the Knowledge Space|
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.Logger
 * @requires sol.common.Config
 * @requires sol.common.ix.DynKwlSearchIterator
 */
sol.define("sol.learning.ix.dynkwl.KnowledgeSpace", {
  extend: "sol.common.ix.DynKwlSearchIterator",

  searchParams: [{ mode: 'STARTS_WITH' }],
  tableKeyNames: [null, "IX_MAP_KNOWLEDGE_SPACE_NAME", "KNOWLEDGE_SPACE_REFERENCE"],

  initialize: function (params) {
    var me = this, terms = sol.common.TranslateTerms;

    terms.require("sol.learning.dynkwl.KnowledgeSpace");
    me.tableTitle = terms.translate("sol.learning.dynkwl.KnowledgeSpace.tableTitle");
    me.tableHeaders = [
      terms.translate("sol.learning.dynkwl.KnowledgeSpace.tableHeaders.boardName"),
      terms.translate("sol.learning.dynkwl.KnowledgeSpace.tableHeaders.spaceName"),
      null
    ];

    me.$super("sol.common.ix.DynKwlSearchIterator", "initialize", [params]);
  },

  getFindInfo: function (filterList) {
    var findInfo, findByIndex, objKeys = [], objKey;

    findInfo = new FindInfo();
    findByIndex = new FindByIndex();

    if (filterList && filterList.length > 0) {
      findByIndex.name = filterList[0];
    }

    objKey = new ObjKey();
    objKey.name = "SOL_TYPE";
    objKey.data = ["KNOWLEDGE_SPACE"];
    objKeys.push(objKey);

    findByIndex.objKeys = objKeys;
    findInfo.findByIndex = findByIndex;

    return findInfo;
  },

  getRowData: function (sord) {
    var boardName, kbReference;

    kbReference = sol.common.SordUtils.getObjKeyValue(sord, "KNOWLEDGE_BOARD_REFERENCE");

    if (kbReference) {
      boardName = sol.common.RepoUtils.findSords({
        sordZ: SordC.mbAllIndex,
        objKeysObj: {
          SOL_TYPE: "KNOWLEDGE_BOARD",
          KNOWLEDGE_BOARD_REFERENCE: kbReference
        }
      })[0].name;
    }

    return [boardName || "", sord.name, sord.guid];
  }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.learning.ix.dynkwl.KnowledgeSpaces
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.learning.ix.dynkwl.KnowledgeSpace" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.learning.ix.dynkwl.KnowledgeSpace", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
