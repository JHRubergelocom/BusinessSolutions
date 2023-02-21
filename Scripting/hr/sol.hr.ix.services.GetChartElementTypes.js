
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.hrorgchart.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js 

/**
 * Retrieves the available organizational chart element types
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.hrorgchart.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 */
sol.define("sol.hr.ix.services.GetChartElementTypes", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.hrorgchart.mixins.Configuration", "sol.common.mixins.Inject"],
  
  inject: {
    contextTypes: { config: "hrorgchart", prop: "entities.chartelement.services.chartelementtypes.contextTypes", template: true } // {}
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {String[]} Array with hr types
   */
  process: function () {
    var me = this, selectedId = me.targetId, selectedSord, selectedSoltype, result = {};

    if (selectedId) {
      selectedSord = ixConnect.ix().checkoutSord(selectedId, SordC.mbAllIndex, LockC.NO);
      selectedSoltype = String(sol.common.SordUtils.getValue(selectedSord, { key: "SOL_TYPE", type: "GRP" }) || "");
      
      result.types = sol.hr.shared.Utils.getTypesByContext(selectedSoltype, me.contextTypes)
        .map(function (type) {  // ... enhance requests by container reference
          type.selectedGuid = selectedSord.guid;
          return type;
        });

      result.valid = result.types.length > 0;
      if (!result.valid) {
        result.msg = sol.hr.shared.Utils.translate("sol.hr.orgchart.createchartelement.notpossible");
      }
    }
    
    return result;
  }
});

/**
 * @member sol.hr.ix.services.GetChartElementTypes
 * @method RF_sol_common_service_GetChartElementTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_GetChartElementTypes(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;
  
  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  serviceProc = sol.create("sol.hr.ix.services.GetChartElementTypes", rfParams);
  result = rfUtils.stringify(serviceProc.process());
  return result;
}
