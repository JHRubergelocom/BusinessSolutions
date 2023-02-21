importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.DynKwlDatabaseIterator.js
//@include lib_sol.common.ix.DynKwlSearchIterator.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.common.ix.DynKwlBLPIterator.js

var kwlConfigString,  // has priority over config file, has to be valid JSON
    configPath,       // used together with 'kwlName' to determine the kwl config from a file
    kwlName,          // used together with 'configPath' to determine the kwl config from a file
    __ctx = (function () {
      return this;
    }());

/**
 * This implements generic keywordlist functionality.
 *
 * # Supported keywordlist types
 *
 * |Type|Used Iterator|
 * |:-----|:------|
 * |DB|Database iterator|
 * |SEARCH|Search iterator|
 * |CHILDREN|Children iterator|
 *
 * # Configuration
 * It is highly recommended to use the provided app to create/edit the configurations.
 *
 * Each configuration (regardless of the used iterator) has to contain the following properties:
 *
 * |Property|Property type|Description|Note|
 * |:-----|:-----|:------|:------|
 * |type|String|The type used. See `Supported keywordlist types`.||
 * |translate|Boolean|Determines, if translation should be applied on the `header`, the `output` and `searchParams.message`|Has to be `true`, if any of those contain translation keys.|
 * |title|String|The title of the returned table. Could be a fixed string or a translation key.||
 * |header|String[]|An array with the table headers. Could be a fixed strings or a translation keys.|Currently not supported in children iterator.|
 * |output|String[]|An array containing the output fields.|No prefix for index fields. `IX_MAP_` prefix for map fields. `IX_MAP_` prefix and `{i}` suffix for map fields inside a form table.|
 * |searchParams|Object[]|An array containing configuration for the search.|This uses the old syntax of the iterators. For better understanding the app should be used to create the configuration. Currently not supported in children iterator.|
 *
 * There are additional configuration properties for each iterator type.
 *
 * ## DB
 * |Property|Property type|Description|Note|
 * |:-----|:-----|:------|:------|
 * |sqlQuery|String|The SQL query for the database.|Number of selected columns has to be the same as the number of `headers` and `output`. If the query contains `?` they will be replaced by evaluating the `searchParams`.|
 * |jdbc|String|The name of a ressource defined in the Tomcat `META-INF/context.xml`.|Optional. If not set, the query will be executed against the ELO database.|
 * |dbName|String|To use a devian schema.|Optional|
 *
 * ## SEARCH
 * |Property|Property type|Description|Note|
 * |:-----|:-----|:------|:------|
 * |dataFields|String[]|The fields from the found Sord objects which will be mapped to the output fields.|Has to be of the same size as the `output` array. Only index fields are supported.|
 *
 * ## CHILDREN
 * |Property|Property type|Description|Note|
 * |:-----|:-----|:------|:------|
 * |parantId|String|The start point for the children search.|Could be an arcpath, an objId or a guid.|
 *
 * # How to
 * To implement a keywordlist using this generic class two things are necessary: a script and a configuration.
 * The script needs to be implemented, because the only way to configure a field with a dynamic keyword list, is the name of a script file.
 * The configuration will tell the generic class how to performe the queries and how the data should be returned.
 *
 * The script file has to contain the include for the `lib_Class` as well as the include for the `lib_sol.common.ix.GenericDynKwl`.
 *
 * The easiest way to include the configuration is directly as a JSON string in the script as a global variable `kwlConfigString`:
 *
 *     var kwlConfigString = '{ ... }'
 *
 * A more convinient way to include the configuration is in a separate configuration file:
 *
 *     var configPath = "/contract/Configuration/kwl.config",
 *         kwlName = "Companies";
 *
 * The `kwl.config` has to be JSON containing the property `Companies` which holds the configuration for this keyword list.
 * For even more convinience there is an app to edit those configuration file.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloix
 * @requires sol.common.ix.DynKwlDatabaseIterator
 * @requires sol.common.ix.DynKwlSearchIterator
 * @requires sol.common.ix.DynKwlFindChildrenIterator
 */
sol.define("sol.common.ix.GenericDynKwl", {

  initialize: function (config) {
    var me = this,
        cfg, providerCfg, prepare;

    cfg = me.loadConfig(config);
    if (!cfg) {
      throw "No configuration found. Configuration has to be provided by kwlConfigString, configPath/kwlName or contructor parameter.";
    }
    providerCfg = me.prepareConfig(cfg);

    prepare = me.prepareFunctions[cfg.type];
    if (!sol.common.ObjectUtils.isFunction(prepare)) {
      throw "IllegalConfigurationException: type '" + cfg.type + "' is not supported";
    }

    me._provider = prepare.call(me, providerCfg, cfg);

    if (cfg.columnProperties) {
      if (cfg.columnProperties.length !== cfg.output.length) {
        throw "IllegalConfigurationException: number of columnProperties has to match the number of columns.";
      }

      me._provider.getColumnProperties = function () {
        return cfg.columnProperties;
      };
    }

  },

  /**
   * Retrieves the kwl provider which was created during initialization.
   * @return {Object}
   */
  getProvider: function () {
    var me = this;
    return me._provider;
  },

  /**
   * @private
   * Initializes the configuration. Either from `kwlConfigString`, a config file or the contructor parameter.
   * @param {Object} initConfigParam
   * @return {Object}
   */
  loadConfig: function (initConfigParam) {
    var config;
    if (kwlConfigString) {
      config = JSON.parse(kwlConfigString);
    } else if (configPath && kwlName) {
      config = sol.create("sol.common.Config", { compose: configPath }).config;
      if (!config.hasOwnProperty(kwlName)) {
        throw "No configuration found for '" + kwlName + "' (path='" + configPath + "')";
      }
      config = config[kwlName];
    } else {
      config = initConfigParam;
    }

    return config;
  },

  /**
   * @private
   * Initializes the provider config for all provider types.
   * @param {Object} config
   * @return {Object}
   */
  prepareConfig: function (config) {
    var me = this,
        providerConfig;

    me.translate(config);

    providerConfig = {
      tableTitle: config.title,
      tableHeaders: config.header,
      tableKeyNames: __ctx.output || config.output,  // override default from configuration
      formatting: config.formatting
    };

    if (typeof __ctx.output === "function") {  // if output is overriden by a function instead of a property, this to properties are used by the mixin to determine the correct output fields
      providerConfig.tableKeyNames_default = config.output;
      providerConfig.tableKeyNames_configOverride = config.output_;
    }

    return providerConfig;
  },

  /**
   * @private
   * Performs the translation if `translate` is set to `true`.
   * @param {Object} config
   */
  translate: function (config) {
    var required;

    if (config.translate === true) {
      required = [config.title];

      if (config.header) { // filter null/undefined values
        config.header.forEach(function (headerEntry) {
          headerEntry && required.push(headerEntry);
        });
      }

      if (config.searchParams) { // only add key, if there is a search param with a 'message' property
        config.searchParams.forEach(function (param) {
          param && param.message && required.push(param.message);
        });
      }

      sol.common.TranslateTerms.require(required);

      config.title = sol.common.TranslateTerms.translate(config.title);
      if (config.header) {
        config.header.forEach(function (column, idx) {
          if (column) {
            config.header[idx] = sol.common.TranslateTerms.translate(column);
          }
        });
      }
      if (config.searchParams) {
        config.searchParams.forEach(function (param) {
          if (param && param.message) {
            param.message = sol.common.TranslateTerms.translate(param.message);
          }
        });
      }
    }
  },

  /**
   * @private
   * @property {Object}
   * Lookup object for the prepare functions for all supported iterators.
   * These function prepare the iterator specific configuration and create the provider.
   */
  prepareFunctions: {

    DB: function (providerConfig, config) {

      providerConfig.sqlQuery = config.sqlQuery;
      providerConfig.sqlParams = config.searchParams;
      providerConfig.dbName = config.dbName;
      providerConfig.jdbc = config.jdbc;

      return sol.create("sol.common.ix.DynKwlDatabaseIterator", providerConfig);
    },

    CHILDREN: function (providerConfig, config) {

      providerConfig.searchParams = config.searchParams;
      providerConfig.parentId = config.parentId;

      return sol.create("sol.common.ix.DynKwlFindChildrenIterator", providerConfig);
    },

    SEARCH: function (providerConfig, config) {
      var me = this,
          provider;

      providerConfig.searchParams = config.searchParams;

      provider = sol.create("sol.common.ix.DynKwlSearchIterator", providerConfig);
      provider.dataFields = config.dataFields;
      provider.getFindInfo = me.getFindInfo;
      provider.getRowData = me.getRowData;

      return provider;
    },

    BLP: function (providerConfig, config) {
      var me = this,
          provider;

      providerConfig.queryConditions = config.searchParams;
      providerConfig.queryName = config.blpQueryName;
      providerConfig.queryModule = config.blpQueryModule;
      providerConfig.addInId = config.blpAddInId;
      providerConfig.projectId = config.blpProjectId;
      providerConfig.moduleId = config.blpModuleId;
      providerConfig.appToken = config.blpAppToken;
      providerConfig.serverUrl = config.blpServerUrl;

      provider = sol.create("sol.common.ix.DynKwlBLPIterator", providerConfig);

      return provider;
    }

  },

  /**
   * @private
   * Implements a find by type search that is filtered by ObjKeys.
   * Used for the 'DynKwlSearchIterator'.
   * @param {String[]} filterList
   * @return {de.elo.ix.client.FindInfo}
   */
  getFindInfo: function (filterList) {
    var me = this,
        findInfo, findByIndex, okeys, okey, i, param, filter;

    this.log.enter("getFindInfo");

    findInfo = new FindInfo();
    findByIndex = new FindByIndex();
    okeys = [];

    if (filterList && filterList.length > 0) {
      for (i = 0; i < filterList.length; i++) {
        param = me.searchParams[i];
        filter = filterList[i];
        if (param.name && filter && (filter != "")) {
          okey = new ObjKey();
          okey.name = param.searchName || param.name;
          okey.data = [filter];
          okeys.push(okey);
        }
      }
    }

    findByIndex.objKeys = okeys;
    findInfo.findByIndex = findByIndex;

    this.log.exit("getFindInfo");
    return findInfo;
  },

  /**
   * @private
   * Basic implementation for search results.
   * This returns the content of the sord index fields.
   * Used for the 'DynKwlSearchIterator'.
   * @param {de.elo.ix.client.Sord} sord
   * @return {String[]}
   */
   getRowData: function (sord) {
    var me = this,
        data = [],
        i;

    for (i = 0; i < me.dataFields.length; i++) {
      data.push(sol.common.SordUtils.getObjKeyValue(sord, me.dataFields[i]));
    }

    return data;
  }

});

function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.common.ix.GenericDynKwl#" + kwlName }),
      provider;

  try {
    log.info("DynamicKeywordList (");
    provider = sol.create("sol.common.ix.GenericDynKwl").getProvider();
    return new DynamicKeywordDataProvider(provider);
  } finally {
    log.info(")getDataIterator");
  }
}
