
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.FileUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.GetTemplates" });

/**
 * Retrieves the templates from all custom folders and has to be used as dynamic register.
 *
 * The folder description has to be the following text:
 *
 *     !? RF_sol_common_service_GetTemplates
 *
 * This uses the same algorithm as {@link sol.common.ix.services.GetConfig GetConfig} to determine the folders from where the templates will be loaded.
 *
 * E.g. if this is used on the folder
 *
 *     "ARCPATH:/Administration/Business Solutions/contract/Configuration/Contract types"
 *
 * it will load the templates from
 *
 *     "ARCPATH:/Administration/Business Solutions Custom/contract/Configuration/Contract types"
 *
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 * @requires  sol.common.IxUtils
 * @requires  sol.common.ix.ServiceBase
 * @requires  sol.common.ix.services.GetTemplates.Provider
 */
sol.define("sol.common.ix.services.GetTemplates", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;

    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Retrieves the objIds for templates from all custom folders.
   * @return {Object[]}
   */
  process: function () {
    var me = this,
        result = null,
        parentIdString, dbConnection;

    parentIdString = sol.common.ix.services.GetTemplates.Provider.getRelatedFolderIds(me.sord.id);

    if (parentIdString && (parentIdString.length > 0)) {
      dbConnection = new Packages.de.elo.ix.jscript.DBConnection();
      result = dbConnection.query("SELECT rel.objectid FROM relation rel JOIN objekte obj ON rel.objectid = obj.objid WHERE rel.parentid IN (" + parentIdString + ") AND rel.relstatus = 0 ORDER BY obj.objshort");
    }

    return result;
  }

});

/**
 * @protected
 * Internal cache for the folder IDs used to determine related templates.
 *
 * Uses the merge hierarchy like the configuration does.
 *
 * This should be uses only by {@link sol.common.ix.services.GetTemplates GetTemplates}.
 *
 * @requires sol.common.IxUtils
 */
sol.define("sol.common.ix.services.GetTemplates.Provider", {
  singleton: true,

  cache: [],

  /**
   * Read the folder IDs of all folders belonging to a specified one.
   * @param {String} originObjId
   * @return {String} A comma separated list of all related objIds
   */
  getRelatedFolderIds: function (originObjId) {
    var me = this,
        msg;

    if (!me.cache[originObjId]) {
      me.cache[originObjId] = me.idsToString(me.retrieveFolderIds(originObjId));
      msg = "Init cache for '{0}' -> {1}";
    } else {
      msg = "Cache hit for '{0}' -> {1}";
    }

    me.logger.debug([msg, originObjId, me.cache[originObjId]]);
    return me.cache[originObjId];
  },

  /**
   * @private
   * Retrieves the folder IDs.
   * @param {String} originObjId
   * @return {String[]} A comma list of all related objIds
   */
  retrieveFolderIds: function (originObjId) {
    var me = this,
        parentIds = [],
        mergehierarchy, defaultSord;

    mergehierarchy = me.getConfigHierarchy(originObjId);

    if (mergehierarchy) {

      if (mergehierarchy.defaultConfig) {
        defaultSord = ixConnectAdmin.ix().checkoutSord(mergehierarchy.defaultConfig.guid, SordC.mbOnlyId, LockC.NO);
        if (defaultSord) {
          parentIds.push(defaultSord.id);
        }
      }

      if (mergehierarchy.customConfigs && (mergehierarchy.customConfigs.length > 0)) {
        mergehierarchy.customConfigs.forEach(function (customCfg) {
          var customSord;
          if (customCfg && customCfg.guid) {
            customSord = ixConnectAdmin.ix().checkoutSord(customCfg.guid, SordC.mbOnlyId, LockC.NO);
            if (customSord) {
              parentIds.push(customSord.id);
            }
          }
        });
      }
    }
    return parentIds;
  },

  getConfigHierarchy: function (originObjId) {
    var anyParam, anyResult, jsonResult;

    anyParam = new Any();

    anyParam.type = ixConnect.CONST.ANY.TYPE_STRING;
    anyParam.stringValue = JSON.stringify({ compose: originObjId });

    anyResult = ixConnectAdmin.ix().executeRegisteredFunction("RF_sol_common_service_GetConfigHierarchy", anyParam);
    jsonResult = (anyResult && anyResult.stringValue) ? String(anyResult.stringValue) : "{}";

    return JSON.parse(jsonResult);
  },

  /**
   * @private
   * Converts an Array of objIds to an String for the SQL query.
   * @param {String[]} parentIds
   * @return {String}
   */
  idsToString: function (parentIds) {
    return parentIds.map(function (id) {
      return "'" + id + "'";
    }).join(",");
  }

});

/**
 * @member sol.common.ix.services.GetTemplates
 * @method RF_sol_common_service_GetTemplates
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_GetTemplates(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_common_service_GetTemplates", args);
  params = {};
  if (args.length > 0) {
    params.sord = args[0];
  }
  service = sol.create("sol.common.ix.services.GetTemplates", params);
  result = service.process();
  logger.exit("RF_sol_common_service_GetTemplates", result);
  return result;
}
