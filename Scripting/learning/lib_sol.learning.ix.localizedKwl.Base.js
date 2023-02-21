
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.LocalizedKwlIterator.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js


/**
 * Localized keyword list base class.
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.ix.LocalizedKwlIterator
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.localizedKwl.Base", {
  extend: "sol.common.ix.LocalizedKwlIterator",

  /**
   * @cfg {String} kwlName
   * Name of the keyword list. The name corresponds to the configuration
   * property that contains the configuration keyword list
   * Have to be defined in subclass.
   */
  kwlName: null,

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    config: { config: "localizedKwls", prop: null }
  },

  initialize: function () {
    var me = this;

    if (me.kwlName) {
      me.inject.config.prop = me.kwlName;
      sol.create("sol.common.Injection").inject(me);
      me.$super("sol.common.ix.LocalizedKwlIterator", "initialize", [me.config]);
    } else {
      throw "kwlName is not defined in subclass";
    }
  }
});
