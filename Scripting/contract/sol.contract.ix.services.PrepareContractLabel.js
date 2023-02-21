﻿
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.contract.ix.ContractUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.contract.ix.services.PrepareContractLabel" });

/**
 * Checks the preconditions for the creation of a contract label and retrieves the available contract label templates.
 *
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
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
sol.define("sol.contract.ix.services.PrepareContractLabel", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {String} targetId The target for the label to check, if it is a valid target
   */
  
  /**
   * @cfg {de.elo.ix.client.ClientInfo} ci The ClientInfo to determine the response message language
   */
  
  /** 
   * @cfg {Object} filter (optional) Additional filters which can be applied to the results
   * @cfg {Boolean} filter.ignorePermissions (optional) If set, all available contract label templates will be returned ignoring the user permissions (will only work in ELOix and ELOas)
   */

  requiredConfig: ["ci", "targetId"],
   
  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.contractConfig = sol.contract.ix.ContractUtils.loadConfig();
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {String[]} Array with contract label templates
   */
  process: function () {
    var me = this,
        result = me.checkPreconditions();

    if (result.valid === true) {
      result.types = me.getAllTemplates();
    }

    return result;
  },
  
  /**
   * @private
   * Checks the preconditions for creating a contract label.
   * @returns {Object}
   */
  checkPreconditions: function () {
    var me = this,
        result = { valid: false },
        sord;

    try {
      sord = ixConnect.ix().checkoutSord(me.targetId, SordC.mbAllIndex, LockC.NO);
    } catch (ex) {
      me.logger.warn("invalid location for contract label", ex);
      result.msg = sol.common.TranslateTerms.getTerm(me.ci, "sol.contract.service.contractLabel.errorNoElement");
      return result;
    }

    if (me.isValidTarget(sord)) {
      result.valid = true;
    } else {
      result.msg = sol.common.TranslateTerms.getTerm(me.ci, "sol.contract.service.contractLabel.errorInvalidLocation");
    }

    return result;
  },

  /**
   * @private
   * @param {Object} sord
   * @return {Boolean} valid target
   */
  isValidTarget: function (sord) {
    return sol.common.SordUtils.isFolder(sord);
  },

  /**
   * @private
   * Retrieves all template Sord objects.
   * @returns {de.elo.ix.client.Sord[]}
   */
  getAllTemplates: function () {
    var me = this,
        conn = (me.filter && (me.filter.ignorePermissions === true) && ixConnectAdmin) ? ixConnectAdmin : ixConnect,
        path = me.contractConfig.contractLabel.templateFolderId,
        searchConf = {};

    searchConf.includeFolders = false;
    searchConf.includeDocuments = true;
    searchConf.includeReferences = true;
    searchConf.sordZ = SordC.mbAllIndex;

    return me.convert(sol.common.RepoUtils.findChildren(path, searchConf, conn));
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
 * @member sol.contract.ix.services.PrepareContractLabel
 * @method RF_sol_contract_service_PrepareContractLabel
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_contract_service_PrepareContractLabel(iXSEContext, args) {
  logger.enter("RF_sol_contract_service_PrepareContractLabel", args);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "targetId"),
      service, result;

  config.ci = iXSEContext.ci;
  
  service = sol.create("sol.contract.ix.services.PrepareContractLabel", config);
  result = rfUtils.stringify(service.process());
  logger.exit("RF_sol_contract_service_PrepareContractLabel", result);
  return result;
}
