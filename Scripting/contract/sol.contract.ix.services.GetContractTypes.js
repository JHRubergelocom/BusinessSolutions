
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.contract.ix.ContractUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.contract.ix.services.GetContractTypes" });

/**
 * Retrieves the available contract types.
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
 * @requires sol.contract.ix.ContractUtils
 */
sol.define("sol.contract.ix.services.GetContractTypes", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.contract.ix.ContractUtils.loadConfig();
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {String[]} Array with contract types
   */
  process: function () {
    var me = this,
        searchConfig = {},
        contractTemplates;

    searchConfig.includeFolders = true;
    searchConfig.includeDocuments = false;
    searchConfig.includeReferences = true;
    searchConfig.sordZ = SordC.mbAllIndex;

    contractTemplates = sol.common.RepoUtils.findChildren(me.config.templateFolderId, searchConfig);
    return me.convertTemplateSords(contractTemplates);
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
          type: sol.common.SordUtils.getObjKeyValue(sord, "CONTRACT_TYPE"),
          desc: sol.common.SordUtils.getObjKeyValue(sord, "CONTRACT_CATEGORY")
        });
      });
    }
    return converted;
  }
});

/**
 * @member sol.contract.ix.services.GetContractTypes
 * @method RF_sol_contract_service_GetContractTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_contract_service_GetContractTypes(iXSEContext, args) {
  logger.enter("RF_sol_contract_service_GetContractTypes", args);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      service, result;

  service = sol.create("sol.contract.ix.services.GetContractTypes", config);
  result = rfUtils.stringify(service.process());
  logger.exit("RF_sol_contract_service_GetContractTypes", result);
  return result;
}
