importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.AsUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.RepoUtils.js

//@include lib_sol.datev.accounting.mixins.ApiRequest.js
//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.datev.accounting.mixins.LocalizedKwlList.js

var logger = sol.create("sol.Logger", {
    scope: "sol.datev.accounting.ix.services.CheckDynamicFolder"
});



/**
 * Retrieves the available document types.
 *
 * @author Grigorescu Bogdan Stefan, ELO Digital Office GmbH
 *
 */
sol.define("sol.datev.accounting.ix.services.CheckDynamicFolder", {
    extend: "sol.common.ix.ServiceBase",
    requiredConfig: ["keys","mask"],

    initialize: function (config) {
        var me = this;
        me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    },

    process: function () {
		var me = this;
		var result = false;
		var searchCriteria = {
			objKeysObj:me.keys,
			maskId:me.mask
		}
		
		var sords = sol.common.RepoUtils.findSords(searchCriteria);
		if(sords.length > 0){
			result = true;
		}
		return {dynamicFolderExists:result};
    },


});

/**
 * @member sol.datev.accounting.ix.services.CheckDynamicFolder
 * @method RF_sol_datev_accounting_service_CheckDynamicFolder
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_datev_accounting_service_CheckDynamicFolder(iXSEContext, args) {
    logger.enter("RF_sol_datev_accounting_service_CheckDynamicFolder", args);
    var rfUtils = sol.common.ix.RfUtils,
        config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        service, result;

    service = sol.create("sol.datev.accounting.ix.services.CheckDynamicFolder", config);
    result = rfUtils.stringify(service.process());
    logger.exit("RF_sol_datev_accounting_service_CheckDynamicFolder", result);
    return result;
}