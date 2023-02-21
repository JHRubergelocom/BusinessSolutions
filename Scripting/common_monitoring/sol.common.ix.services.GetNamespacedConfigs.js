
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.GetNamespacedConfigs" });

/**
 * Returns merged Timed Event Configuration Files which are stored in Business Solutions configuration Folders
 *
 *
 * @author ELO Digital Office GmbH
 * @version 1.05.000
 *
 * @eloix
 * @requires  sol.common.Config
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.Template
 * @requires  sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.GetNamespacedConfigs", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @since 1.05.000
   * @cfg {String[]} paths (optional) an array of relative paths inside the 'Business Solutions' (or its 'Custom') folders or even an objId. The configs will be loaded composed.
   */

  /**
   * @cfg {Boolean} [allSolutions=false] (optional) If `true` all configurations with path /Business Solutions/{{solution}}/Configuration/timedEvent.config will be added
   */

  utils: {
    removeDuplicats: function (arr) {
      return Object.keys(
        arr.reduce(function (acc, path) {
          acc[path] = true;
          return acc;
        }, {})
      );
    }
  },

  initialize: function (config) {
    var me = this;
    if (!config.paths && !config.allSolutions) {
      throw new Error("InitializationException: either 'paths' has to be defined or allSolutions has to be true");
    }
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  getBusinessSolutionBasePath: function () {
    return sol.common.RepoUtils.resolveSpecialFolder("{{bsFolderPath}}");
  },

  getBusinessSolutionBaseFolder: function () {
    var me = this;

    return sol.common.RepoUtils.findChildren(
      sol.common.RepoUtils.getObjId(me.getBusinessSolutionBasePath()),
      {
        includeFolders: true,
        includeDocuments: false
      },
      ixConnectAdmin
    );
  },

  getBusinessSolutionBaseFolderNames: function () {
    var me = this;

    return (me.getBusinessSolutionBaseFolder() || [])
      .map(function (sord) {
        return sord.name;
      })
      .filter(function (name) {
        return !!name;
      });
  },

  getAllSolutionsPaths: function () {
    var me = this;

    return (me.getBusinessSolutionBaseFolderNames() || [])
      .map(function (name) {
        return "/" + name + "/Configuration/timedevent.config";
      });
  },

  filterInvalidPaths: function (path) {
    return path.indexOf("[") === -1;
  },

  getComposedConfig: function (path) {
    return { path: path, config: sol.create("sol.common.Config", { compose: path }).config };
  },

  isEmpty: function (configContainer) {
    return !sol.common.ObjectUtils.isEmpty(configContainer.config);
  },

  getConfigs: function (configContainer) {
    return {
      path: configContainer.path,
      namespace: (configContainer.config || {}).namespace,
      configs: (configContainer.config || {}).configs
    };
  },

  checkNamespace: function (config) {
    return !!(config || {}).namespace;
  },

  groupByIdAndNamespace: function (acc, config) {
    var configs = (config || {}).configs || {},
        key,
        element;
    for (key in configs) {
      if (configs.hasOwnProperty(key)) {
        element = configs[key];
        if (element.id) {
          element.namespace = element.namespace || config.namespace;
          element.path = element.path || config.path;
          acc[element.namespace] = acc[element.namespace] || {};
          acc[element.namespace][element.id] = acc[element.namespace][element.id]
            ? sol.common.ObjectUtils.mergeObjects(acc[config[key]], config)
            : element;
        }
      }
    }
    return acc;
  },

  /**
   * Downloads the given file content as string
   * @return {Object}
   */
  process: function () {
    var me = this,
        paths,
        addSolutions,
        preparedPaths;

    // prepare
    paths = me.paths
      ? Array.isArray(me.paths)
        ? me.paths
        : [me.paths]
      : [];
    addSolutions = me.allSolutions || false;

    preparedPaths = me.utils.removeDuplicats(
      addSolutions
        ? paths.concat(me.getAllSolutionsPaths())
        : paths
    );

    return preparedPaths
      .filter(me.filterInvalidPaths)
      .map(me.getComposedConfig)
      .filter(me.isEmpty)
      .map(me.getConfigs)
      .filter(me.checkNamespace)
      .reduce(me.groupByIdAndNamespace, {});
  }
});

/**
 * @member sol.common.ix.services.GetNamespacedConfigs
 * @method RF_sol_common_service_GetNamespacedConfigs
 * @since 1.05.000
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_GetNamespacedConfigs(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_common_service_GetNamespacedConfigs", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  service = sol.create("sol.common.ix.services.GetNamespacedConfigs", params);

  result = service.process();

  logger.exit("RF_sol_common_service_GetNamespacedConfigs", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
