
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.LocalizedKwlIterator.js

/**
 * Localized keyword list for meeting status.
 *
 * @author JK, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.ix.LocalizedKwlIterator
 * @requires sol.meeting.mixins.Configuration
 *
 * TODO: Refactor to localizedKwl.Base when the BaseFunction is done
 */
sol.define("sol.meeting.voting.ix.localizedKwl.QuorumType", {
  extend: "sol.common.ix.LocalizedKwlIterator",

  /**
   * @cfg {String} kwlName
   * Name of the keyword list. The name corresponds to the configuration
   * property that contains the configuration keyword list
   */
  kwlName: "quorumType",

  initialize: function () {
    var me = this,
      config;

    config = sol.create("sol.common.Config", { compose: "/meeting_voting/Configuration/localizedKwls.config" }).config;
    me.$super("sol.common.ix.LocalizedKwlIterator", "initialize", [config[me.kwlName]]);
  }
});

/**
 * Implements a localized keyword list for votings
 * @static
 * @member sol.meeting.ix.localizedKwl.QuorumType
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.meeting.voting.ix.localizedKwl.QuorumType" }),
      iterator;

  try {
    log.info("LocalizedKeywordList (");

    iterator = sol.create("sol.meeting.voting.ix.localizedKwl.QuorumType", {});

    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
