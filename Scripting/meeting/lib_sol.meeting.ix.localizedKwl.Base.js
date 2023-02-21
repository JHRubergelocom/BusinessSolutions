
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.LocalizedKwlIterator.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js


/**
 * Base keyword list for localized keyword lists
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.ix.LocalizedKwlIterator
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.meeting.ix.localizedKwl.Base", {
  extend: "sol.common.ix.LocalizedKwlIterator",

  /**
   * @cfg {String} kwlName
   * Name of the keyword list. The name corresponds to the configuration
   * property that contains the configuration keyword list
   */

  mixins: ["sol.common.mixins.Inject"],

  $configRelation: {
    localizedKwls: "/meeting/Configuration/localizedKwls.config"
  },

  inject: {
    kwlConfig: { config: "localizedKwls", prop: "MeetingBoardRecepients" }
  },

  initialize: function () {
    var me = this;

    if (me.kwlName) {
      me.inject.kwlConfig.prop = me.kwlName;
      sol.create("sol.common.Injection").inject(me);
      me.$super("sol.common.ix.LocalizedKwlIterator", "initialize", [me.kwlConfig]);
    } else {
      throw "kwlName is not defined";
    }
  }
});