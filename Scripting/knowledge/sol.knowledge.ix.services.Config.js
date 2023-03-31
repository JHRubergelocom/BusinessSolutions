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
        userInbox, boards, editorOptions;

    me._lang = ixConnect.loginResult.clientInfo.language;
    if (me.lang && (me.lang.length === 2)) {
      ixConnect.loginResult.clientInfo.language = me.lang;
    }

    sol.common.TranslateTerms.require("sol.knowledge");

    try {
      environment = me.getEnvironment();

      path = me.knowledgeConfig.postTypeTemplateFolderId;
      sords = me.getAllTemplates(path);
      postTypes = me.convert(sords, {
        locitems: true,
        setitems: true
      });

      path = me.knowledgeConfig.replyTypeTemplateFolderId;
      sords = me.getAllTemplates(path);
      replyTypes = me.convert(sords, {
        locitems: true
      });

      sords = me.getAllSolTypes("KNOWLEDGE_SPACE");
      spaces = me.convert(sords, {
        accessRights: true
      });

      boards = me.getBoards();

      labels = me.getLabels();

      postLocales = me.getPostLocales();

      cleanedConfig = me.getCleanedConfig();

      editorOptions = me.getEditorOptions();

      pageStyle = me.getPageStyle();
    } finally {
      ixConnect.loginResult.clientInfo.language = me._lang;
    }

    try {
      userInbox = sol.common.RepoUtils.getSord("OKEY:ELOINDEX=/users/inbox#" + ixConnect.loginResult.user.guid);
    } catch (e) { }

    return {
      environment: environment,
      postTypes: postTypes,
      replyTypes: replyTypes,
      spaces: spaces,
      boards: boards,
      labels: labels,
      postLocales: postLocales,
      config: cleanedConfig,
      pageStyle: pageStyle,
      editorOptions: editorOptions,
      user: {
        userGuid: ixConnect.loginResult.user.guid,
        inboxGuid: userInbox ? userInbox.guid : ""
      }
    };

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

    env.notify = {
      installed: notifyInstalled
    };

    return env;
  },

  getBoards: function (options) {
    var me = this, sords;

    options = options || {
      accessRights: true
    };

    sords = me.getAllSolTypes("KNOWLEDGE_BOARD");
    return me.convert(sords, options);

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
        searchConf = {};

    searchConf.includeFolders = true;
    searchConf.includeDocuments = false;
    searchConf.includeReferences = true;
    searchConf.sordZ = SordC.mbAllIndex;

    return sol.common.RepoUtils.findChildren(path, searchConf, conn);
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
      idx += findResult.sords.length;
      findResult = conn.ix().findNextSords(findResult.searchId, idx, 100, sordZ);
    }
    conn.ix().findClose(findResult.searchId);

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

    return pageStyle;
  },

  getEditorOptions: function () {
    var me = this;
    
    return me.knowledgeConfig.editorOptions;
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
              objKeys: [
                "KNOWLEDGE_SPACE_REFERENCE",
                "KNOWLEDGE_SPACE_PREVIEW_IMAGE",
                "KNOWLEDGE_BOARD_REFERENCE",
                "KNOWLEDGE_CATEGORY",
                "KNOWLEDGE_CONTENT_TYPE",
                "KNOWLEDGE_DEFAULT_POSTTYPE",
                "KNOWLEDGE_BOARD_TYPE",
                "KNOWLEDGE_PROVIDED_POSTTYPES",
                "KNOWLEDGE_PINNED"
              ],
              mapKeys: [
                "SETTING_*",
                "LOCALE_*"
              ]
            }
          }
        });
        tplSord = tplSord.sord;
        params.sord = sord;
        me.enrichTplSord(tplSord, params);
        converted.push(tplSord);
      });
    }

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
      if (params.accessRights) {
        tplSord.rights = sol.knowledge.ix.KnowledgeUtils.getAccessRights(params.sord);
      }
    }
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
