
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.contract.ix.ContractUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.contract.ix.services.ReportTemplates" });

/**
 * Retrieves information about available report templates.
 *
 * The result can be filtered by the different reporting types (see `Configuration`).
 *
 * # Return value
 * This service returns an Array of Objects with informations about the found report templates:
 *
 *     {
 *       objId: "123",
 *       name: "My Report Template",
 *       desc: "Some description."
 *     }
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |reporting.templateFolderId|Path or ID to the report template folder|
 * |reporting.types.%TYPE%.subfolder|Subfolder for report type|
 *
 * `types` object has to contain one Object for every report type.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.contract.ix.ContractUtils
 */
sol.define("sol.contract.ix.services.ReportTemplates", {
  extend: "sol.common.ix.ServiceBase",
  
  /** 
   * @cfg {Object} filter (optional) Additional filters which can be applied to the results
   * @cfg {String} filter.type (optional) If set, the available file types will be filtered, regarding the permisson of the filing plan location
   */
  
  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.contractConfig = sol.contract.ix.ContractUtils.loadConfig();
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {Object[]} Array with file types
   */
  process: function () {
    var me = this,
        reportTemplateSords, reportTemplates;
    
    reportTemplateSords = me.getTemplates();
    reportTemplates = me.convert(reportTemplateSords);
    
    return reportTemplates;
  },
  
  /**
   * @private
   * Retrieves all template Sord objects.
   * @param {String} type
   * @returns {de.elo.ix.client.Sord[]}
   */
  getTemplates: function () {
    var me = this,
        path = me.contractConfig.reporting.templateFolderId,
        searchConf = {},
        type;
    
    searchConf.includeFolders = false;
    searchConf.includeDocuments = true;
    searchConf.includeReferences = true;
    searchConf.sordZ = SordC.mbAllIndex;
    
    if (me.filter && me.filter.type) {
      type = me.filter.type;
      if (!me.contractConfig.reporting.types[type]) {
        throw "[" + me.$className + "] report type '" + type + "' is not supported/configured";
      }
      path += "/" + me.contractConfig.reporting.types[type].subfolder;
    } else {
      searchConf.recursive = true;
      searchConf.level = 2;
    }
    
    return sol.common.RepoUtils.findChildren(path, searchConf);
  },
  
  /**
   * @private
   * Converts from Sords to Objects
   * @param {de.elo.ix.client.Sord[]} reportTemplateSords
   * @returns {Object[]}
   */
  convert: function (reportTemplateSords) {
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
 * @member sol.contract.ix.services.ReportTemplates
 * @method RF_sol_contract_service_ReportTemplates
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_contract_service_ReportTemplates(iXSEContext, args) {
  logger.enter("RF_sol_contract_service_ReportTemplates", args);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      service, result;

  service = sol.create("sol.contract.ix.services.ReportTemplates", config);
  result = rfUtils.stringify(service.process());
  logger.exit("RF_sol_contract_service_ReportTemplates", result);
  return result;
}
