
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.FileUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js


var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.services.DownloadIxPlugin" });

/**
 * Transfers an IX plug-in
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute("sol.dev.ix.services.DownloadIxPlugin", {
 *       name: "bs.common"
 *     });
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires  sol.common.RepoUtils
 */
sol.define("sol.dev.ix.services.DownloadIxPlugin", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {String} objId (required)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Transfers an IX plug-in
   * @returns {String} IX plug-in path
   */
  process: function () {
    var me = this,
        osgiPluginDirectoriesString, pluginFilePath, fileData, kiloBytes;

    osgiPluginDirectoriesString = sol.common.RepoUtils.getIxOption("osgiPluginDirectories");
    me.osgiPluginDirectories = osgiPluginDirectoriesString.split(";");

    if (!me.osgiPluginDirectories || (me.osgiPluginDirectories.length == 0)) {
      throw "OSGI plug-in directory not set";
    }

    pluginFilePath = me.findPlugin(me.name);

    fileData = sol.common.FileUtils.loadToFileData(pluginFilePath, "application/java-archive");

    kiloBytes = Math.round(fileData.data.length / 1024);

    logger.debug(["Transfer IX plug-in '{0}: {1} kB", me.name, kiloBytes]);

    return fileData;
  },

  findPlugin: function (pluginName) {
    var me = this,
        i, osgiPluginDirectory, pluginFilePath, pluginFile;

    for (i = 0; i < me.osgiPluginDirectories.length; i++) {
      osgiPluginDirectory = me.osgiPluginDirectories[i];
      pluginFilePath = osgiPluginDirectory + java.io.File.separator + pluginName;
      pluginFile = new java.io.File(pluginFilePath);
      if (pluginFile.exists()) {
        return pluginFilePath;
      }
    }

    throw "Can't find IX plug-in '" + pluginName + "'";
  }
});

/**
 * @member sol.dev.ix.services.DownloadIxPlugin
 * @method RF_sol_dev_service_DownloadIxPlugin
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_dev_service_DownloadIxPlugin(ec, args) {
  var params, download, fileData;

  logger.enter("RF_sol_dev_service_DownloadIxPlugin", args);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "name"),

  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);

  download = sol.create("sol.dev.ix.services.DownloadIxPlugin", params);
  fileData = download.process();

  logger.exit("RF_sol_dev_service_DownloadIxPlugin");

  return fileData;
}
