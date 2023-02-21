
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.dev.ix.ActionUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.services.GetJSFunctionTypes" });

/**
 * Retrieves the available jsfunction types.
 *
 * @author JHR, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.dev.ix.ActionUtils
 */
sol.define("sol.dev.ix.services.GetJSFunctionTypes", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.dev.ix.ActionUtils.loadConfigDevInternal();
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {String[]} Array with jsfunction types
   */
  process: function () {
    var me = this,
        searchConfig = {},
        jsfunctionTemplates;

    searchConfig.includeFolders = true;
    searchConfig.includeDocuments = false;
    searchConfig.includeReferences = true;
    searchConfig.sordZ = SordC.mbAllIndex;

    jsfunctionTemplates = sol.common.RepoUtils.findChildren(me.config.jsfunctionTemplateFolderId, searchConfig);
    return me.convertTemplateSords(jsfunctionTemplates);
  },

  /**
   * @private
   * Converts from Sords to Objects
   * @param {de.elo.ix.client.Sord[]} reportTemplateSords
   * @returns {Object[]}
   */
  convertTemplateSords: function (reportTemplateSords) {
    var converted = [];
    if (reportTemplateSords) {
      reportTemplateSords.forEach(function (sord) {
        converted.push({
          objId: sord.id,
          name: sord.name,
          desc: sord.desc
        });
      });
    }
    return converted;
  }
});

/**
 * @member sol.dev.ix.services.GetJSFunctionTypes
 * @method RF_sol_common_service_GetJSFunctionTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_dev_service_GetJSFunctionTypes(iXSEContext, args) {
  logger.enter("RF_sol_dev_service_GetJSFunctionTypes", args);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      service, result;

  service = sol.create("sol.dev.ix.services.GetJSFunctionTypes", config);
  result = rfUtils.stringify(service.process());
  logger.exit("RF_sol_dev_service_GetJSFunctionTypes", result);
  return result;
}
