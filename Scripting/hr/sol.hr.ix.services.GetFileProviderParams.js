importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js

/**
 * Retrieves parameters for the providepersonnelfileaccess AS rule.
 *
 * 
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.ObjectUtils
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 */
sol.define("sol.hr.ix.services.GetFileProviderParams", {
  extend: "sol.common.ix.ServiceBase",
  
  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],
  
  inject: {
    //configproperties
    securityClassificationField: { config: "hr", prop: "entities.file.services.fileproviderparams.const.securityClassificationField", template: true }, // ""
    securityLevelMapField: { config: "hr", prop: "entities.file.services.fileproviderparams.const.securityLevelMapField", template: true }, // ""
    reviewerUserIdField: { config: "hr", prop: "entities.file.services.fileproviderparams.const.reviewerUserIdField", template: true }, // ""
    originGUIDField: { config: "hr", prop: "entities.file.services.fileproviderparams.const.originGUIDField", template: true }, // ""
    reviewPathField: { config: "hr", prop: "entities.file.services.fileproviderparams.const.reviewPathField", template: true }, // ""
    mainFolderName: { config: "hr", prop: "entities.file.services.fileproviderparams.const.mainFolderName", template: true }, // ""
    inquirerRights: { config: "hr", prop: "entities.file.services.fileproviderparams.const.inquirerRights", template: true }, // ""
    reviewerRights: { config: "hr", prop: "entities.file.services.fileproviderparams.const.reviewerRights", template: true }, // ""
    inquiryConfigs: { config: "hrsecurityroles", prop: "requestConfigs", template: true, log: false }, // []
    //templating data
    params: { prop: "params", log: false },
    sord: { prop: "currentSord", log: false }
  },

  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [params]);
    me.params = params;
    me.currentSord = sol.hr.shared.Utils.getSordData(me.objId, me.flowId, true);
  },
  
  /**
   * Retrieves the data as specified in the constructor configuration.
   * @returns {String[]} Array with types
   */
  process: function () {
    var me = this, accessConfig, securityLevels, personnelFileId, reviewerUserId, reviewPathId;

    me.inquiryConfigs.some(function (cfg) {
      accessConfig = cfg.workflow === me.wfTemplateName && cfg;
      return accessConfig;
    });

    if (!accessConfig) {
      throw "no request definition found for workflow " + me.wfTemplateName;
    }

    // read data stored in sord  
    securityLevels = sol.common.ObjectUtils.getProp(me.currentSord, me.securityLevelMapField);
    reviewerUserId = sol.common.ObjectUtils.getProp(me.currentSord, me.reviewerUserIdField);
    reviewPathId = sol.common.ObjectUtils.getProp(me.currentSord, me.reviewPathField);
    
    personnelFileId = sol.common.ObjectUtils.getProp(me.currentSord, me.originGUIDField);

    return {
      flowId: me.wfFlowId,
      objId: me.wfObjId,
      accessConfig: accessConfig,
      securityLevels: securityLevels,
      personnelFileId: reviewPathId ? "" : personnelFileId, // if reviewPath has a value, we do not want to create a new file, but move the reviewed file to the inquirer
      inquirerUserId: me.wfOwnerName,
      inquirerRights: me.inquirerRights,
      reviewerUserId: reviewerUserId,
      reviewerRights: me.reviewerRights,
      securityClassificationField: me.securityClassificationField,
      mainFolderName: me.mainFolderName,
      reviewPathId: reviewPathId,  // will only be filled, if the reviewPathField had a value and cause AS-rule to move file from review to inquirer instead of creating new file
      reviewPathField: me.reviewPathField && me.reviewPathField.slice(me.reviewPathField.indexOf(".") + 1)
    };
  }
});

/**
 * @member sol.hr.ix.services.GetFileProviderParams
 * @method RF_sol_common_service_GetFileProviderParams
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_GetFileProviderParams(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;
  
  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  serviceProc = sol.create("sol.hr.ix.services.GetFileProviderParams", rfParams);
  result = rfUtils.stringify(serviceProc.process());
  return result;
}