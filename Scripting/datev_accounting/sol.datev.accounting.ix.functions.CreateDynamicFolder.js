importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ObjectFormatter.js

//@include lib_sol.datev.accounting.mixins.ApiRequest.js
//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.datev.accounting.mixins.LocalizedKwlList.js


/**
 * Creates a dynamic folder.
 *
 * @author GB, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.datev.accounting.mixins.ApiRequest
 * @requires sol.datev.accounting.mixins.Configuration
 * @requires sol.datev.accounting.mixins.LocalizedKwlList
 */

var logger = sol.create("sol.Logger", {
    scope: "sol.datev.accounting.ix.functions.CreateDynamicFolder"
});


sol.define("sol.datev.accounting.ix.functions.CreateDynamicFolder", {
    extend: "sol.common.ix.FunctionBase",

    mixins: [
        "sol.common.mixins.Inject",
        "sol.datev.accounting.mixins.ApiRequest",
        "sol.datev.accounting.mixins.Configuration",
        "sol.datev.accounting.mixins.LocalizedKwlList"

    ],

    inject: {
        fields: {
            config: "invoice",
            prop: "fields",
            template: false
        },
        invoiceMaskName: {
            config: "invoice",
            prop: "invoiceMaskName",
            template: false
        }

    },


    initialize: function (config) {
        var me = this;
        me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    },

    /**
     * Gets the find result object based on the search filters.
     * @param {Object} params Parameters
     * @param {Object} params.objKeysObj Map that contains key-value pairs
     * @param {String} params.maskId (optional) If set, find objects related to this mask ID or name
     * @param {String[]} params.maskIds (optional) If set, find objects related to these mask IDs or names
     * @param {de.elo.ix.client.SordZ} [params.sordZ=SordC.mbAll] (optional) `SordC.mbOnlyId` and `SordC.mbOnlyGuid` are not working
     * @param {de.elo.ix.client.IXConnection} params.ixConn (optional) This will be used instead of `ìxConnect` (usfull when the search should run in a different user context)
     * @param {Number} params.resultCount (optional) The number of results that will be returned
     * @returns {de.elo.ix.client.FindResult} findResult
     */
    getFindResult: function (params) {
        var me = this,
            objKeys = [],
            sords = [],
            findInfo, sordZ, key, findResult, ixConn, resultCount;

        me.logger.enter("findSords", params);
        params = params || {};
        ixConn = params.ixConn || ixConnect;
        sordZ = params.sordZ || SordC.mbAll;
        resultCount = params.resultCount || 1000;
        findInfo = new FindInfo();
        if (params.objKeysObj || params.maskId || params.maskIds) {
            findInfo.findByIndex = new FindByIndex();
            if (params.objKeysObj) {
                for (key in params.objKeysObj) {
                    if (params.objKeysObj.hasOwnProperty(key)) {
						log.warn("KEY|VALUE: " + key + "|" + params.objKeysObj[key]);
                        objKeys.push(sol.common.RepoUtils.createObjKey("", key, params.objKeysObj[key]));
                    }
                }
                findInfo.findByIndex.objKeys = objKeys;
            }
            if (params.maskId != undefined) {
                findInfo.findByIndex.maskId = params.maskId;
            }
            if (params.maskIds != undefined) {
                findInfo.findByIndex.maskIds = params.maskIds;
            }
        }
        findResult = ixConn.ix().findFirstSords(findInfo, resultCount, sordZ);
        me.logger.exit("findSords", sords);

        return findResult;
    },
    /**
     * Gets the search filters that will be used in the search.
     * @param {Object} data The data set on the folder that will be used in the search, uses sol.common.ObjectFormatter.TemplateSord as template
     * @returns {Object} searchData The search filter which will be used in the search
     */

    getSearchCriteria: function (data) {
        var me = this,
            maskId, keys;
        var keys = me.keys || [me.fields.COMPANY_CODE.value, me.fields.INVOICE_STATUS.value];
        var maskId = me.maskId || me.invoiceMaskName.value;
        var searchData = {};
        searchData.maskId = maskId;
        searchData.objKeysObj = {};
        for (var index = 0; index < keys.length; index++) {
            searchData.objKeysObj[keys[index]] = data.objKeys[keys[index]];
        }
        return searchData;
    },

    /**
     * Uses the data to modify the existing folder into a dynamic folder based on the properties used in the configuration node.
     * 
     */
    process: function () {
        var me = this,
            searchCriteria, data, findResult, result;
        var sord = sol.common.RepoUtils.getSord(me.objId);
        data = sol.common.ObjectFormatter.format({
            sord: {
                formatter: 'sol.common.ObjectFormatter.TemplateSord',
                data: sord,
                config: {
                    allMapFields: true
                }
            }
        });
        searchCriteria = me.getSearchCriteria(data.sord);
        findResult = me.getFindResult(searchCriteria);
        if (findResult) {
            sord.setDesc(findResult.getDynamicFolder());
            ixConnect.ix().checkinSord(sord, SordC.mbAll, LockC.NO);
            ixConnect.ix().findClose(findResult.searchId);

        }
    }

});

/**
 * @member
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
    // noinspection ES6ConvertVarToLetConst
    var params, module;

    logger.enter("onExitNode_CreateDynamicFolder", {
        flowId: wFDiagram.id,
        nodeId: nodeId
    });

    params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
    params.objId = wFDiagram.objId;
    params.flowId = wFDiagram.id;

    module = sol.create("sol.datev.accounting.ix.functions.CreateDynamicFolder", params);

    module.process();

    logger.exit("onExitNode_CreateDynamicFolder");
}




/**
 * @member
 * @method
 * @static
 */
function RF_sol_accounting_functions_CreateDynamicFolder(ec, args) {
    var params, returnObj, result;
    logger.enter("RF_sol_accounting_functions_CreateDynamicFolder", args);
    params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
    returnObj = sol.create("sol.datev.accounting.ix.functions.CreateDynamicFolder", params);
    result = returnObj.process();
    logger.exit("RF_sol_accounting_functions_CreateDynamicFolder", result);
    return sol.common.JsonUtils.stringifyAll(result);
}