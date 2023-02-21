
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.LocalizedKwlIterator.js

/**
 * Localized keyword list for religiousdenominations
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.LocalizedKwlIterator
 */
sol.define("sol.hr.ix.localizedKwl.ReligiousDenomination", {
  extend: "sol.common.ix.LocalizedKwlIterator",
  
  /**
   * @cfg {String} kwlName
   * Name of the keyword list. The name corresponds to the configuration
   * property that contains the configuration keyword list
   */
  kwlName: "religiousdenomination",
    
  initialize: function () {
    var me = this,
        config;
    config = sol.create("sol.common.Config", { compose: "/hr/Configuration/localizedKwls.config" }).config;
    me.$super("sol.common.ix.LocalizedKwlIterator", "initialize", [config[me.kwlName]]);
  }
});

/**
 * Implements a localized keyword list for religiousdenomination
 * @static
 * @member sol.hr.ix.localizedKwl.ReligiousDenomination
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.hr.ix.localizedKwl.ReligiousDenomination" }),
      iterator;
  try {
    log.info("LocalizedKeywordList (");
    iterator = sol.create("sol.hr.ix.localizedKwl.ReligiousDenomination", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
