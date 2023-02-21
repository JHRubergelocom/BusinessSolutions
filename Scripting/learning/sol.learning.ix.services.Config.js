
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.SubscriptionUtils.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

var logger = sol.create("sol.Logger", { scope: "sol.learning.ix.services.Config" });

/**
 * Retrieves available Config types.
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |||
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 0.01.000
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.IxUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.ServiceBase
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.services.GetConfig", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {Object} filter (optional) Additional filters which can be applied to the results
   * @cfg {Boolean} filter.ignorePermissions (optional) If set, all available Config types will be returned ignoring the user permissions (will only work in ELOix and ELOas)
   */

  /**
   * @cfg {String[]} requiredConfigProperties (optional)
   * If set, only the specified properties from the `learning.config` will be returned (only first level properties are supported), else an empty configuration will be returned.
   */

  /**
   * @cfg {String} pageStyle (optional)
   * If set, the spezified page style will be retrieved from the `pageStyles` property in `learning.config`, else no style will be returned.
   */

  /**
   * @cfg {String} lang (opional)
   * If set with a language abbreviation, that language will be used. The login language is the default.
   * The length has to be 2.
   */

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _learningServiceConfig: { config: "learning", prop: "entities.webapp.services.config" },
    _courseLocales: { config: "learning", prop: "entities.webapp.services.config.courseLocales", template: true },
    _pageStyles: { config: "learning", prop: "entities.webapp.services.config.pageStyles", template: true },
    _enabledFeatures: { config: "learning", prop: "entities.webapp.services.config.enabledFeatures" },
    _labels: { config: "learning", prop: "entities.webapp.services.config.labels" }
  },

  _optimize: {}, // enables optimized retrieval of type data

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me._lang = ixConnect.loginResult.clientInfo.language;
    if (me.lang && (me.lang.length === 2)) {
      ixConnect.loginResult.clientInfo.language = me.lang;
    }
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {Object} JSON-Object with Course types
   */
  process: function () {
    var me = this;

    return {
      kwls: me.getKwls(String(ixConnect.loginResult.clientInfo.language)),
      environment: me.getEnvironment(),
      courseTypes: me.getTypes(),
      courseLocales: me.prepareCourseLocales(me._courseLocales),
      labels: me._labels,
      config: (me.requiredConfigProperties && me.getCleanedConfig(me.learningServiceConfig, me.requiredConfigProperties)),
      pageStyle: (me.pageStyle && sol.common.ObjectUtils.getProp(me._pageStyles, me.pageStyle)),
      enabledFeatures: me._enabledFeatures
    };

  },

  getKwls: function (lang) {
    return sol.common.IxUtils.execute("RF_sol_learning_service_GetKeywordlists", { language: lang });
  },

  extendSelectedLanguagesOptions: function (lang, options) {
    options.startImage = sol.common.RepoUtils.getGuid(options.startImage);
  },

  prepareCourseLocales: function (locales, fallback) {
    var me = this, langFound, lang = String(ixConnect.loginResult.clientInfo.language);
    if (!fallback) {
      me._localeBackup = JSON.parse(sol.common.JsonUtils.stringifyQuick(locales, locales.defaultLocale));
    } else {
      lang = fallback;
    }

    locales.supportedLocales
      .forEach(function (locale) {
        ((locale.locale === lang) && (langFound = true))
          ? me.extendSelectedLanguagesOptions(lang, locale.options)
          : locale.options = undefined;
      });

    if (fallback && !langFound) {
      throw "Fallback language `" + fallback + "` not defined in supportedLocales config.";
    }
    return langFound ? locales : me.prepareCourseLocales(me._localeBackup, locales.defaultLocale);
  },

  /**
   * @private
   * Retrieves environment information.
   * @return {Object}
   */
  getEnvironment: function () {
    var me = this,
        env = {},
        notifyInstalled, knowledgeInstalled;

    notifyInstalled = me.isPackageInstalled("notify");
    knowledgeInstalled = me.isPackageInstalled("knowledge");

    env.notify = {
      installed: notifyInstalled
    };
    env.knowledge = {
      installed: knowledgeInstalled
    };
    return env;
  },

  /**
   * @private
   * Checks if a specific package is installed.
   * @param {String} packageName
   * @return {Boolean}
   */
  isPackageInstalled: function (packageName) {
    var packagePath, packageObjId;
    packagePath = sol.common.RepoUtils.resolveSpecialFolder("{{bsFolderPath}}/" + packageName);
    packageObjId = sol.common.RepoUtils.getObjId(packagePath);
    return !!packageObjId;
  },

  getTypes: function () {
    return sol.common.IxUtils.execute("RF_sol_learning_service_GetCourseTypeInfos", {});
  },

  /**
   * @private
   * Retrieves a striped down version of the configuration based on {@link #requiredConfigProperties}
   * @param {Object} config
   * @param {String[]} requiredProps
   * @return {Object}
   */
  getCleanedConfig: function (config, requiredProps) {
    return (Array.isArray(requiredProps) ? requiredProps : [])
      .reduce(function (cleanedConfig, reqProp) {
        return (cleanedConfig[reqProp] = config[reqProp], cleanedConfig);
      }, {});
  }
});

/**
 * @member sol.learning.ix.services.GetConfig
 * @method RF_sol_learning_service_GetConfig
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_GetConfig(iXSEContext, args) {
  var rfUtils, config, service, result;

  logger.enter("RF_sol_learning_service_GetConfig", args);

  rfUtils = sol.common.ix.RfUtils;
  config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  service = sol.create("sol.learning.ix.services.GetConfig", config);
  result = rfUtils.stringify(service.process());

  logger.exit("RF_sol_learning_service_GetConfig", result);

  return result;
}
