
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.LocalizedKwlIterator.js

/**
 * Localized keyword list for payment types
 *
 * @requires sol.common.Config
 * @requires sol.common.ix.LocalizedKwlIterator
 */
sol.define("sol.contract.ix.localizedKwl.PaymentType", {
  extend: "sol.common.ix.LocalizedKwlIterator",

  /**
   * @cfg {String} kwlName
   * Name of the keyword list. The name corresponds to the configuration
   * property that contains the configuration keyword list
   */
  kwlName: "paymentType",

  initialize: function () {
    var me = this,
        config;
    config = sol.create("sol.common.Config", { compose: "/contract/Configuration/localizedKwls.config" }).config;
    me.$super("sol.common.ix.LocalizedKwlIterator", "initialize", [config[me.kwlName]]);
  }
});

/**
 * Implements a localized keyword list for payment types
 * @static
 * @member sol.contract.ix.localizedKwl.PaymentType
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.contract.ix.localizedKwl.PaymentDirection" }),
      iterator;
  try {
    log.info("LocalizedKeywordList (");
    iterator = sol.create("sol.contract.ix.localizedKwl.PaymentType", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
