
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.GetConfig" });

/**
 * Returns content of a configuration json file that is stored in ELO.
 *
 * This service is useful if information should be retrieved within external web applications.
 *
 * # Simple configuration
 * This loads a configuration from a single JSON configuration file.
 *
 * As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_GetConfig', {
 *       objId: "ARCPATH:/Administration/Business Solutions/pubsec/Configuration/pubsec.Config",
 *       forceReload: true  // optional, if true, the cache will be refreshed
 *     });
 *
 * Returns content of the configuration as followed:
 *
 *     {
 *       config: {
 *         // config content
 *         version: '9.00.001',
 *         ruleSetName: "MY_RULE",
 *         ...
 *       }
 *     }
 *
 * # Merged configuration
 * This loads a merged configuration from a hierarchy of JSON configuration files.
 *
 * As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_GetMergedConfig', {
 *       compose: "ARCPATH:/Administration/Business Solutions/pubsec/Configuration/pubsec.Config"
 *       forceReload: true  // optional, if true, the cache will be refreshed
 *     });
 *
 * Returns content of the configuration as followed:
 *
 *     {
 *       config: {
 *         // config content
 *         version: '9.00.001',
 *         ruleSetName: "MY_CUSTOM_RULE",
 *         ...
 *       }
 *     }
 *
 * # Configuration hierarchy
 * This loads all JSON configuration files from the merge hierarchy, without performing the merge.
 * By default, this just returns the GUIDs.
 *
 * As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_GetConfigHierarchy', {
 *       compose: "/pubsec/Configuration/pubsec.Config",
 *       content: true  //optional, if not set, or none `true` value, only GUIDs will be returned
 *       forceReload: true  // optional, if true, the cache will be refreshed
 *     });
 *
 * Returns the hierarchy of the configuration as followed:
 *
 *     {
 *       defaultConfig: {
 *         guid: "(3A348D43-2C82-CA21-4812-1A10AB368125)",
 *         content: { ... } // opional, only returned, if content parameter was `true`
 *       },
 *       customConfigs: [
 *         { guid: "(BA8C4F65-7DFA-5F02-23C1-3680A4E8A94E)", content: { ... } },
 *         ...
 *       ]
 *     }
 *
 * @author NM, ELO Digital Office GmbH
 * @version 1.05.000
 *
 * @eloix
 * @requires  sol.common.Config
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.GetConfig", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {String} objId (optional) The object id of the configuration (also guid and arcpath allowed). The config will be loaded plain.
   */

  /**
   * @cfg {String} compose (optional) A relative path inside the 'Business Solutions' (or its 'Custom') folders or even an objId. The config will be loaded composed.
   */

  /**
   * @since 1.05.000
   * @cfg {String[]} paths (optional) an array of relative paths inside the 'Business Solutions' (or its 'Custom') folders or even an objId. The configs will be loaded composed.
   */

  /**
   * @cfg {Boolean} [hierarchical=false] (optional) If `true` the result will contain all GUIDs of configurations which would be part of the merging. Only works with {@link #compose}.
   */

  /**
   * @cfg {Boolean} [content=false] (optional) If `true` the hierarchical result will contain the configs themself. Only works with {@link #compose} and {@link #hierarchical}.
   */

  /**
   * @cfg {Boolean} [forceReload=false] (optional) If `true` cache will be refreshed.
   */

  /**
   * @cfg {Boolean} [exceptionOnBrokenConfig=false] (optional)
   * If `true` there will be an exception, if one of the merged configs has errors.
   * The function {@link #RF_sol_common_service_GetMergedConfig} overrides the default value always with `true`, except the call specifies the parameter as `false`.
   */

  initialize: function (config) {
    var me = this;
    if (!config.objId && !config.compose && !config.paths) {
      throw "InitializationException: either 'objId', 'compose' or 'paths' has to be defined";
    }
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Downloads the given file content as string
   * @return {Object}
   */
  process: function () {
    var me = this,
        mode, result;

    mode = me.determineMode();

    switch (mode) {
      case "SIMPLE":
        result = me.getSimpleConfig();
        break;
      case "MERGED":
        result = me.getMergedConfig();
        break;
      case "HIERARCHICAL":
        result = me.getExplodedConfig(me.compose);
        break;
      case "MULTI_HIERARCHICAL":
        result = me.getMultipleExplodedConfigs();
        break;
      default:
        throw "IllegalStateException: can not determine result mode";
    }

    return result;
  },

  /**
   * @private
   * Determines in which mode the class is executed ("SIMPLE"|"MERGED"|"HIERARCHICAL").
   * @return {String}
   */
  determineMode: function () {
    var me = this;
    if (me.objId) {
      return "SIMPLE";
    }
    if (me.compose && (me.hierarchical === true)) {
      return "HIERARCHICAL";
    }
    if (me.paths && (me.hierarchical === true)) {
      return "MULTI_HIERARCHICAL";
    }
    if (me.compose) {
      return "MERGED";
    }
  },

  /**
   * @private
   * Retrieves a simple configuration from an objId
   * @return {Object}
   */
  getSimpleConfig: function () {
    var me = this,
        config;

    config = sol.create("sol.common.Config", { load: me.objId, forceReload: me.forceReload }).config;
    return { config: config };
  },

  /**
   * @private
   * Retrieves a merged configuration from an objId or a path
   * @return {Object}
   */
  getMergedConfig: function () {
    var me = this,
        config;
    config = sol.create("sol.common.Config", { compose: me.compose, forceReload: me.forceReload, exceptionOnBrokenConfig: me.exceptionOnBrokenConfig }).config;
    return { config: config };
  },

  /**
   * @private
   * Retrieves multiple simple configuration from an objId.
   * @return {Object}
   */
  getMultipleExplodedConfigs: function () {
    var me = this,
        result = {};

    me.paths.forEach(function (path) {
      if (path) {
        result[path] = me.getExplodedConfig(path);
      }
    });

    return result;
  },

  /**
   * @private
   * Retrieves a simple configuration from an objId
   * @param {String} compose
   * @return {Object}
   */
  getExplodedConfig: function (compose) {
    var me = this,
        result = {},
        cfg, hierarchyObjs;

    cfg = sol.create("sol.common.Config", { compose: compose });

    if (cfg.validForMergeing()) { // config is in merge hierarchy
      hierarchyObjs = cfg.retrieveMergeHierarchy(true);

      result.defaultConfig = hierarchyObjs.shift();
      if (me.content === true && result.defaultConfig && result.defaultConfig.guid) {
        result.defaultConfig.content = sol.create("sol.common.Config", { load: result.defaultConfig.guid, forceReload: me.forceReload }).config;
      }

    } else { // config is not in merge hierarchy
      hierarchyObjs = [{ guid: compose }];
    }

    if (hierarchyObjs.length > 0) {
      result.customConfigs = [];
      hierarchyObjs.forEach(function (customObj) {
        if (me.content === true && customObj && customObj.guid) {
          customObj.content = sol.create("sol.common.Config", { load: customObj.guid, forceReload: me.forceReload }).config;
        }
        result.customConfigs.push(customObj);
      });
    }

    return result;
  }

});

/**
 * @member sol.common.ix.services.GetConfig
 * @method RF_sol_common_service_GetConfig
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_GetConfig(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_common_service_GetConfig", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.common.ix.services.GetConfig", params);
  result = service.process();
  logger.exit("RF_sol_common_service_GetConfig", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

/**
 * @member sol.common.ix.services.GetConfig
 * @method RF_sol_common_service_GetMergedConfig
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_GetMergedConfig(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_common_service_GetMergedConfig", args);

  if (!args) {
    throw "Args are empty";
  }

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "compose");
  params.exceptionOnBrokenConfig = (params.exceptionOnBrokenConfig === false) ? false : true;
  service = sol.create("sol.common.ix.services.GetConfig", params);
  result = service.process();
  logger.exit("RF_sol_common_service_GetMergedConfig", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

/**
 * @member sol.common.ix.services.GetConfig
 * @method RF_sol_common_service_GetConfigHierarchy
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_GetConfigHierarchy(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_common_service_GetConfigHierarchy", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "compose");
  params.hierarchical = true;
  service = sol.create("sol.common.ix.services.GetConfig", params);
  result = service.process();
  logger.exit("RF_sol_common_service_GetConfigHierarchy", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

/**
 * @member sol.common.ix.services.GetConfig
 * @method RF_sol_common_service_GetConfigHierarchies
 * @since 1.05.000
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_GetConfigHierarchies(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_common_service_GetConfigHierarchies", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "paths");
  params.hierarchical = true;
  service = sol.create("sol.common.ix.services.GetConfig", params);
  result = service.process();
  logger.exit("RF_sol_common_service_GetConfigHierarchies", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
