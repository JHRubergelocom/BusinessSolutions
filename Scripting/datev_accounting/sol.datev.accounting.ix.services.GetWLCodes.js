importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.AsUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.HttpUtils.js


var logger = sol.create("sol.Logger", {
    scope: "sol.datev.accounting.ix.services.GetWLCodes"
});

/**
 * Retrieves the available document types.
 *
 * @author Grigorescu Bogdan Stefan, ELO Digital Office GmbH
 *
 */
sol.define("sol.datev.accounting.ix.services.GetWLCodes", {
    extend: "sol.common.ix.ServiceBase",
    requiredConfig: ["path"],

    initialize: function (config) {
        var me = this;
        me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    },

    process: function () {
        var me = this;
	    var url = me.buildAndReturnUrl();
        
        me.logger.info(["retreive wlcodes by service: {0}", url])
        var response = sol.common.HttpUtils.sendRequest({
            url: url,
            method: "get",
            connectTimeout: 10000,
            readTimeout: 60000,
            contentType: "application/json;charset=UTF-8",
        });
        //var responseObj = me.getTestData();
        
        var responseObj = JSON.parse(response.content);
	
        var cfg = sol.create("sol.common.Config", {
            load: me.path,
            writable: true
        });
        var clients = me.getClients(responseObj.clients, cfg.config.clients);
        cfg.config = {
            clients: clients
        };
        cfg.save();
        return responseObj;
    },

    getClients: function (newClients, oldClients) {
        var me = this;
        var clients = [];
        for (var index = 0; index < newClients.length; index++) {
            var newClient = newClients[index];
            for (var count = 0; count < oldClients.length; count++) {
                oldClient = oldClients[count];
                if (newClient.id === oldClient.id) {
                    newClient.wlCodes = me.getWLCodes(newClient.wlCodes, oldClient.wlCodes);
                }
            }
            clients.push(newClient);
        }
        return clients;
    },
    //Function to check and get WLCodes from current configuration and server response
    getWLCodes: function (newWLCodes, oldWLCodes) {
        var codes = [];
        for (var index = 0; index < newWLCodes.length; index++) {
            var newWLCode = newWLCodes[index];
            newWLCode.hints = [];
            for (var count = 0; count < oldWLCodes.length; count++) {
                var oldWLCode = oldWLCodes[count];
                if (newWLCode.code === oldWLCode.code) {
                    newWLCode.hints = oldWLCode.hints;
                }
            }
            codes.push(newWLCode);
        }
        return codes;
    },

    //Function for testing
    getTestData: function () {
        var cfg = sol.create("sol.common.Config", {
            load: "ARCPATH:/Administration/Business Solutions/sol.datev.accounting/Configuration/sol.datev.accounting.wlcode.test.config"
        }).config;
        return cfg
    },

    //Function for getting url from connector configuration
    buildAndReturnUrl: function () {
        var url = "";
        var cfg = sol.create("sol.common.Config", {
            compose: "/sol.datev.accounting/Configuration/datev-connector.service.config"
        }).config.api;
        url = cfg.protocol + "://" + cfg.serverName + ":" + cfg.port + "/" + cfg.serviceName + "/" + "WLCodesExtended"
        return url;
    }

});

/**
 * @member sol.datev.accounting.ix.services.GetWLCodes
 * @method RF_sol_datev_accounting_service_GetWLCodes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_datev_accounting_service_GetWLCodes(iXSEContext, args) {
    logger.enter("RF_sol_datev_accounting_service_GetWLCodes", args);
    var rfUtils = sol.common.ix.RfUtils,
        config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        service, result;

    service = sol.create("sol.datev.accounting.ix.services.GetWLCodes", config);
    result = rfUtils.stringify(service.process());
    logger.exit("RF_sol_datev_accounting_service_GetWLCodes", result);
    return result;
}