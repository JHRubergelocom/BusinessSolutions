
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.DynKwlUserNameIterator.js

/**
 * @class sol.common.ix.dynkwl.UserNames
 *
 * Dynamic keyword list that provides user names and IDs
 *
 * The list of current fields is returned as a table.
 *
 * |ID|Name|
 * |:-----|:------|
 * |0|Administrator|
 * |1|Michael Jackson|
 * |2|Donald Duck|
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.1
 *
 * @requires sol.common.ix.DynKwlUserNameIterator
 * @requires sol.common.StringUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.UserUtils
 */
sol.define("sol.common.ix.dynkwl.UserNames", {
  extend: "sol.common.ix.DynKwlUserNameIterator",

  initialize: function (config) {
    var me = this;
    me.excludeLockedUsers = true,
    me.visible = true;

    me.$super("sol.common.ix.DynKwlUserNameIterator", "initialize", [config]);
  }
});

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
    iterator = sol.create("sol.common.ix.dynkwl.UserNames", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
