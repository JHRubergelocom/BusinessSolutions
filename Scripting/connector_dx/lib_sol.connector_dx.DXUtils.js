
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * Helper class for the DX connector.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.Template
 * @requires sol.common.RepoUtils
 */
sol.define("sol.connector_dx.DXUtils", {
  singleton: true,

  pilcrow: "\u00b6",

  /**
   * @private
   * @property {String} configPathPattern
   */
  configPathPattern: "{{bsFolderPath}}/connector_dx/Configuration/{{subsystem}}/sol.connector_dx.Config",

  /**
   * @private
   * @property {String} mappingPathPattern
   */
  mappingPathPattern: "{{bsFolderPath}}/connector_dx/Configuration/{{subsystem}}/ELO field mappings/{{docClass}}",

  /**
   * Loads the DX configuration for a specified subsystem from a JSON file.
   *
   * The configuration will be loaded from the Business Solutions folder:
   *
   *     {{bsFolderPath}}/connector_dx/Configuration/{{subsystem}}/sol.connector_dx.Config
   *
   * @param {String} subsystem
   * @return {Object} The configuration object
   */
  getDxConfig: function (subsystem) {
    var relativeConfigRepoPath, dxConfig;

    relativeConfigRepoPath = "/connector_dx/Configuration/" + subsystem + "/sol.connector_dx.Config";

    dxConfig = sol.create("sol.common.Config", { compose: relativeConfigRepoPath }).config;

    if (!dxConfig) {
      throw "Can't load DX config: relativeConfigRepoPath=" + relativeConfigRepoPath;
    }

    return dxConfig;
  },

  /**
   * Retrieves the objId for the DX export template, defined by subsystem and template name.
   *
   * @param {String} subsystem
   * @param {String} tplName
   * @return {String}
   */
  getDxExportTemplateId: function (subsystem, tplName) {
    var me = this,
        basePaths, i, basePath, checkPath, tplFolderRelativePath, tplFolderPath, tplObjId;

    basePaths = sol.create("sol.common.Config", {}).getBasePaths();

    tplFolderRelativePath = me.pilcrow + "connector_dx" + me.pilcrow + "Configuration" + me.pilcrow + subsystem + me.pilcrow + "DX exchange templates";

    for (i = basePaths.length - 1; i >= 0; i--) {
      basePath = basePaths[i];
      checkPath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:" + me.pilcrow + basePath + tplFolderRelativePath;
      if (sol.common.RepoUtils.exists(checkPath)) {
        tplFolderPath = checkPath;
        break;
      }
    }

    if (!tplFolderPath) {
      throw "Template folder paths don't exist: " + tplFolderRelativePath;
    }

    tplObjId = sol.common.RepoUtils.getObjIdFromRelativePath(tplFolderPath, me.pilcrow + tplName);

    return tplObjId;
  },

  /**
   * Retrieves the import configuration from a JSON file, defined by subsystem and docClass name.
   *
   * The import configuration has to be present in the folloeing path:
   *
   *     /connector_dx/Configuration/{{subsystem}}/ELO field mappings/{{docClass}}
   *
   * @param {String} subsystem
   * @param {String} docClass
   * @return {Object}
   */
  getDxImportMapping: function (subsystem, docClass) {
    var me = this,
        mappingRelativePath;

    mappingRelativePath = me.pilcrow + "connector_dx" + me.pilcrow + "Configuration" + me.pilcrow + subsystem + me.pilcrow + "ELO field mappings" + me.pilcrow + docClass;

    return sol.create("sol.common.Config", { compose: mappingRelativePath }).config;
  }
});
