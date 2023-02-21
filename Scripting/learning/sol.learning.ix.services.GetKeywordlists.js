
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Retrieves all keywordlists defined in the configuration.
 *
 * Keywordlists are translated to english (en) or the language passed as `language` parameter.
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.UserUtils
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.services.GetKeywordlists", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  kwlCache: {},

  inject: {
    exportkeywordlists: { config: "learning", prop: "entities.localizedkwls.services.getkeywordlists.exportkeywordlists" },
    localizedKwls: { config: "localizedKwls", prop: "" } // {}
  },

  isAllowedKwl: function (kwl) {
    return ~this.indexOf(kwl);
  },

  addKwlToCache: function (localizedKwls, language, cache, kwlName) {
    function toTranslatedEntry(entry) {
      return {
        key: String(entry.key),
        value: String(sol.common.TranslateTerms.getTerm(language, entry.value))
      };
    }

    cache[kwlName] = (localizedKwls[kwlName].entries || [])
      .map(toTranslatedEntry);
    return cache;
  },

  convertKwls: function (kwls) {
    return Object.keys(kwls)
      .reduce(function (res, kwl) {
        return kwls[kwl]
          .reduce(function (resKwl, kv) {
            return (resKwl[kv.key] = kv.value), resKwl;
          }, (res[kwl] = {})), res;
      }, {});
  },

  process: function () {
    var me = this, language = me.language || "en", kwls;
    kwls = me.kwlCache[language]
    || Object.keys(me.localizedKwls)
      .filter(me.isAllowedKwl.bind(me.exportkeywordlists))
      .reduce(me.addKwlToCache.bind(me, me.localizedKwls, language), (me.kwlCache[language] = {}));

    return me.convenient ? me.convertKwls(kwls) : kwls;
  }
});

/**
 * @member sol.learning.ix.services.GetKeywordlists
 * @method RF_sol_learning_service_GetKeywordlists
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_GetKeywordlists(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfParams._optimize;

  serviceProc = sol.create("sol.learning.ix.services.GetKeywordlists", rfParams);
  result = JSON.stringify(serviceProc.process());
  return result;
}