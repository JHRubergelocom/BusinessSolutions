
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.checklist.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.checklist.ix.services.GetChecklistTypes" });

/**
 * Retrieves a list of available checklist types.
 *
 * @author SG, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.checklist.Utils.js
 */
sol.define("sol.checklist.ix.services.GetChecklistTypes", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.checklist.Utils.loadConfig();
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {String[]} Array with checklist types
   */
  process: function () {
    var me = this,
        searchConfig = {},
        checklistTypes;

    searchConfig.includeFolders = true;
    searchConfig.includeDocuments = false;
    searchConfig.includeReferences = true;
    searchConfig.sordZ = SordC.mbAllIndex;

    checklistTypes = sol.common.RepoUtils.findChildren(me.config.templateFolderId, searchConfig);
    return me.convertTemplateSords(checklistTypes);
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
          desc: ""
        });
      });
    }
    return converted;
  }
});

/**
 * @member sol.checklist.ix.services.GetChecklistTypes
 * @method RF_sol_checklist_service_GetChecklistTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_checklist_service_GetChecklistTypes(iXSEContext, args) {
  var config, service, result;

  logger.enter("RF_sol_checklist_service_GetChecklistTypes", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  service = sol.create("sol.checklist.ix.services.GetChecklistTypes", config);
  result = sol.common.ix.RfUtils.stringify(service.process());

  logger.exit("RF_sol_checklist_service_GetChecklistTypes", result);

  return result;
}
