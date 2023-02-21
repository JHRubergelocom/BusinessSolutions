
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.DynKwlUserNameIterator.js
//@include sol.common.ix.dynkwl.UserNames.js

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.common.ix.dynkwl.UserNames
 * @return {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.common.ix.DynKwlUserNameIterator" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.common.ix.dynkwl.UserNames", {
      userIdFieldName: "IX_MAP_MEETING_ITEM_RESPONSIBLE_PERSON_ID",
      onlyUsers: true
    });
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
