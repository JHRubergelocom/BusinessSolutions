importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.SubscriptionUtils.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js
//@include lib_sol.knowledge.ix.LabelUtils.js

var logger = sol.create("sol.Logger", {
  scope: "sol.knowledge.ix.services.Config"
});

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
 * @version 1.00.000
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
 * @requires sol.knowledge.ix.KnowledgeUtils
 * @requires sol.knowledge.ix.LabelUtils
 */
sol.define("sol.knowledge.ix.services.GetConfig", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {Object} filter (optional) Additional filters which can be applied to the results
   * @cfg {Boolean} filter.ignorePermissions (optional) If set, all available Config types will be returned ignoring the user permissions (will only work in ELOix and ELOas)
   */

  /**
   * @cfg {String[]} requiredConfigProperties (optional)
   * If set, only the specified properties from the `knowledge.config` will be returned (only first level properties are supported), else an empty configuration will be returned.
   */

  /**
   * @cfg {String} pageStyle (optional)
   * If set, the spezified page style will be retrieved from the `pageStyles` property in `knowledge.config`, else no style will be returned.
   */

  /**
   * @cfg {String} lang (opional)
   * If set with a language abbreviation, that language will be used. The login language is the default.
   * The length has to be 2.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
    me.labelConfig = sol.knowledge.ix.LabelUtils.loadLabelConfig();
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {Object} JSON-Object with Post/Reply types
   */
  process: function () {
    var me = this,
        environment, path, sords, postTypes, replyTypes, spaces, labels, postLocales, cleanedConfig, pageStyle,
        userInbox, boards, retValue;

    me._lang = ixConnect.loginResult.clientInfo.language;
    if (me.lang && (me.lang.length === 2)) {
      ixConnect.loginResult.clientInfo.language = me.lang;
    }
    logger.info(["process: me._lang '{0}'", me._lang]);    

    sol.common.TranslateTerms.require("sol.knowledge");
    logger.info(["process: sol.common.TranslateTerms '{0}'", "sol.knowledge"]);    

    try {
      environment = me.getEnvironment();
      logger.info(["process: environment '{0}'", environment]);    

      path = me.knowledgeConfig.postTypeTemplateFolderId;
      logger.info(["process: path '{0}'", path]);    

      sords = me.getAllTemplates(path);
      logger.info(["process: sords '{0}'", sords]);    

      postTypes = me.convert(sords, {
        locitems: true,
        setitems: true
      });
      logger.info(["process: postTypes '{0}'", postTypes]);    

      path = me.knowledgeConfig.replyTypeTemplateFolderId;
      logger.info(["process: path '{0}'", path]);    

      sords = me.getAllTemplates(path);
      logger.info(["process: sords '{0}'", sords]);    

      replyTypes = me.convert(sords, {
        locitems: true
      });
      logger.info(["process: replyTypes '{0}'", replyTypes]);    

      sords = me.getAllSolTypes("KNOWLEDGE_SPACE");
      logger.info(["process: sords '{0}'", sords]);    

      spaces = me.convert(sords, {
        subscriptionInfo: true
      });
      logger.info(["process: spaces '{0}'", spaces]);    

      sords = me.getAllSolTypes("KNOWLEDGE_BOARD");
      logger.info(["process: sords '{0}'", sords]);    

      boards = me.convert(sords, {
        subscriptionInfo: true
      });
      logger.info(["process: boards '{0}'", boards]);    

      labels = me.getLabels();
      logger.info(["process: labels '{0}'", labels]);    

      postLocales = me.getPostLocales();
      logger.info(["process: postLocales '{0}'", postLocales]);    

      cleanedConfig = me.getCleanedConfig();
      logger.info(["process: cleanedConfig '{0}'", cleanedConfig]);    

      pageStyle = me.getPageStyle();
      logger.info(["process: pageStyle '{0}'", pageStyle]);    

    } finally {
      ixConnect.loginResult.clientInfo.language = me._lang;
      logger.info(["process: ixConnect.loginResult.clientInfo.language '{0}'", me._lang]);    

    }

    try {
      userInbox = sol.common.RepoUtils.getSord("OKEY:ELOINDEX=/users/inbox#" + ixConnect.loginResult.user.guid);
      logger.info(["process: userInbox '{0}'", userInbox]);    

    } catch (e) {
      logger.info(["process: catch (e) '{0}'", e]);    
    }

    retValue = {
      environment: environment,
      postTypes: postTypes,
      replyTypes: replyTypes,
      spaces: spaces,
      boards: boards,
      labels: labels,
      postLocales: postLocales,
      config: cleanedConfig,
      pageStyle: pageStyle,
      user: {
        userGuid: ixConnect.loginResult.user.guid,
        inboxGuid: userInbox ? userInbox.guid : ""
      }
    };
    logger.info(["process: return '{0}'", retValue]);    
    return retValue;

  },

  /**
   * @private
   * Retrieves environment information.
   * @return {Object}
   */
  getEnvironment: function () {
    var me = this,
        env = {},
        notifyInstalled;

    notifyInstalled = me.isPackageInstalled("notify");
    logger.info(["getEnvironment: notifyInstalled '{0}'", notifyInstalled]);    


    env.notify = {
      installed: notifyInstalled
    };
    logger.info(["getEnvironment: return '{0}'", env]);    
    return env;
  },

  /**
   * @private
   * Retrieves all template Sord objects.
   * @param {String} path
   * @returns {de.elo.ix.client.Sord[]}
   */
  getAllTemplates: function (path) {
    var me = this,
        conn = (me.filter && (me.filter.ignorePermissions === true) && ixConnectAdmin) ? ixConnectAdmin : ixConnect,
        searchConf = {},
        retValue;

    searchConf.includeFolders = true;
    searchConf.includeDocuments = false;
    searchConf.includeReferences = true;
    searchConf.sordZ = SordC.mbAllIndex;

    retValue = sol.common.RepoUtils.findChildren(path, searchConf, conn);
    logger.info(["getAllTemplates: return '{0}'", retValue]);    
    return retValue;
  },

  /**
   * @private
   * Retrieves all Sord objects of sol type.
   * @param {String} solType
   * @returns {de.elo.ix.client.Sord[]}
   */
  getAllSolTypes: function (solType) {
    var me = this,
        conn = (me.filter && (me.filter.ignorePermissions === true) && ixConnectAdmin) ? ixConnectAdmin : ixConnect,
        sordZ = SordC.mbAllIndex,
        findInfo, findByIndex, objKey, objKeys,
        idx, findResult, sords, i;

    findInfo = new FindInfo();
    findByIndex = new FindByIndex();

    objKey = new ObjKey();
    objKey.id = 0;
    objKey.name = "SOL_TYPE";
    objKey.data = [solType];

    objKeys = [];
    objKeys.push(objKey);

    findByIndex.objKeys = objKeys;
    findInfo.findByIndex = findByIndex;

    idx = 0;
    findResult = conn.ix().findFirstSords(findInfo, 100, sordZ);

    sords = [];

    while (true) {
      for (i = 0; i < findResult.sords.length; i++) {
        sords.push(findResult.sords[i]);
      }
      if (!findResult.moreResults) {
        break;
      }
      idx += findResult.sords.Length;
      findResult = conn.ix().findNextSords(findResult.searchId, idx, 100, sordZ);
    }
    conn.ix().findClose(findResult.searchId);

    logger.info(["getAllSolTypes: return '{0}'", sords]);    
    return sords;
  },

  /**
   * @private
   * Retrieves labels from 'label.config'.
   * @param {String} path
   * @returns {de.elo.ix.client.Sord[]}
   */
  getLabels: function () {
    var me = this,
        i, label, labels;

    if (me.labelConfig.labels) {
      sol.common.TranslateTerms.require("sol.knowledge");
      labels = sol.common.ObjectUtils.clone(me.labelConfig.labels);
      if (sol.common.ObjectUtils.isArray(labels)) {
        for (i = 0; i < labels.length; i++) {
          label = labels[i];
          if (label.locale) {
            label.locale = sol.create("sol.common.Template", {
              source: label.locale
            }).apply();
          }
        }
      }
    }
    logger.info(["getLabels: return '{0}'", labels]);    
    return labels;
  },

  /**
   * @private
   * Retrieves the post locales from `knowledge.config`.
   * @return {Object}
   */
  getPostLocales: function () {
    var me = this,
        postLocales, allowedLocales, al, i;

    if (me.knowledgeConfig.postLocales && me.knowledgeConfig.postLocales.allowedLocales) {
      sol.common.TranslateTerms.require("sol.knowledge");
      postLocales = sol.common.ObjectUtils.clone(me.knowledgeConfig.postLocales);
      allowedLocales = postLocales.allowedLocales;
      if (sol.common.ObjectUtils.isArray(allowedLocales)) {
        for (i = 0; i < allowedLocales.length; i++) {
          al = allowedLocales[i];
          if (al.text) {
            al.text = sol.create("sol.common.Template", {
              source: al.text
            }).apply();
          }
        }
      }
    }
    logger.info(["getPostLocales: return '{0}'", postLocales]);    
    return postLocales;
  },

  /**
   * @private
   * Retrieves a striped down version of the configuration based on {@link #requiredConfigProperties}
   * @return {Object}
   */
  getCleanedConfig: function () {
    var me = this,
        cleanedConfig = {};

    if (me.requiredConfigProperties && (me.requiredConfigProperties.length > 0)) {
      me.requiredConfigProperties.forEach(function (propertyName) {
        if (me.knowledgeConfig.hasOwnProperty(propertyName)) {
          cleanedConfig[propertyName] = me.knowledgeConfig[propertyName];
        }
      });
    }
    logger.info(["getCleanedConfig: return '{0}'", cleanedConfig]);    
    return cleanedConfig;
  },

  /**
   * @private
   * Retrieves the page style from the `pageStyles` in `knowledge.config` as specifed by {@link #pageStyle}.
   * @return {Object}
   */
  getPageStyle: function () {
    var me = this,
        pageStyle;

    if (me.pageStyle && me.knowledgeConfig.pageStyles && me.knowledgeConfig.pageStyles[me.pageStyle]) {
      sol.common.TranslateTerms.require("sol.knowledge");
      pageStyle = sol.common.ObjectUtils.clone(me.knowledgeConfig.pageStyles[me.pageStyle]);
      if (pageStyle.htmlHeader) {
        pageStyle.htmlHeader = sol.create("sol.common.Template", {
          source: pageStyle.htmlHeader
        }).apply();
      }
      if (pageStyle.htmlFooter) {
        pageStyle.htmlFooter = sol.create("sol.common.Template", {
          source: pageStyle.htmlFooter
        }).apply();
      }
    }
    logger.info(["getPageStyle: return '{0}'", pageStyle]);    
    return pageStyle;
  },

  /**
   * @private
   * Converts from Sords to Objects
   * @param {de.elo.ix.client.Sord[]} reportTemplateSords
   * @param {Object} params
   * @returns {Object[]}
   */
  convert: function (reportTemplateSords, params) {
    var me = this,
        converted = [],
        tplSord;
    if (reportTemplateSords) {
      reportTemplateSords.forEach(function (sord) {
        tplSord = sol.common.ObjectFormatter.format({
          sord: {
            formatter: "sol.common.ObjectFormatter.StatisticSord",
            // instance of de.elo.ix.client.Sord
            data: sord,
            config: {
              sordKeys: ["name", "id", "guid", "maskName", "desc"],
              objKeys: ["KNOWLEDGE_SPACE_REFERENCE", "KNOWLEDGE_BOARD_REFERENCE", "KNOWLEDGE_CONTENT_TYPE", "KNOWLEDGE_DEFAULT_POSTTYPE", "KNOWLEDGE_PROVIDED_POSTTYPES"]
            }
          }
        });
        tplSord = tplSord.sord;
        me.enrichTplSord(tplSord, params);
        converted.push(tplSord);
      });
    }
    logger.info(["convert: return '{0}'", converted]);    
    return converted;
  },

  /**
   * @private
   * Enriches a template sord with further information.
   * @param {Object} tplSord
   * @param {Object} params
   */
  enrichTplSord: function (tplSord, params) {
    var locItems, setItems;
    if (tplSord && params) {
      if (params.locitems) {
        locItems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, tplSord.id, ["LOCALE_*"], LockC.NO).items;
        tplSord.locales = {};
        locItems.forEach(function (lentry) {
          var transValue = sol.common.TranslateTerms.translate(lentry.value);
          tplSord.locales[lentry.key] = transValue;
        }, this);
      }
      if (params.setitems) {
        setItems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, tplSord.id, ["SETTING_*"], LockC.NO).items;
        tplSord.settings = {};
        setItems.forEach(function (sentry) {
          var setValue = sentry.value;
          tplSord.settings[sentry.key] = setValue;
        }, this);
      }
      if (params.subscriptionInfo) {
        tplSord.subscription = {
          subscribed: sol.common.ix.SubscriptionUtils.hasSubscription(tplSord.guid)
        };
      }
    }
    logger.info(["enrichTplSord: return tplSord '{0}', params '{1}'", tplSord, params]);    
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
    logger.info(["isPackageInstalled: return '{0}'", !!packageObjId]);    
    return !!packageObjId;
  }

});

/**
 * @member sol.knowledge.ix.services.GetConfig
 * @method RF_sol_knowledge_service_GetConfig
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_GetConfig(iXSEContext, args) {
  var rfUtils, config, service, result;

  logger.enter("RF_sol_knowledge_service_GetConfig", args);

  rfUtils = sol.common.ix.RfUtils;
  config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  service = sol.create("sol.knowledge.ix.services.GetConfig", config);
  result = rfUtils.stringify(service.process());

  logger.exit("RF_sol_knowledge_service_GetConfig", result);

  return result;
}
