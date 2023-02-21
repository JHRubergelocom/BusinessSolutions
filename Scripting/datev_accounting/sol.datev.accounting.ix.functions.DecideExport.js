importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

//@include lib_sol.common.Injection.js
//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.datev.accounting.mixins.LocalizedKwlList.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js

var logger = sol.create("sol.Logger", {
    scope: "sol.datev.accounting.ix.functions.DecideExport"
});

/**
 *
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.common.Config
 * @requires  sol.common.ix.FunctionBase
 *
 *
 *
 */
sol.define("sol.datev.accounting.ix.functions.DecideExport", {
    extend: "sol.common.ix.FunctionBase",

    mixins: [
        "sol.datev.accounting.mixins.Configuration",
        "sol.common.mixins.Inject",
        "sol.datev.accounting.mixins.LocalizedKwlList"
    ],

    inject: {
        documentTypes: {config: "accounting", prop: "documentTypes", template: false}
    },

    required: ["wFDiagram", "documentTypeKey", "statusEnabled", "statusDisabled"],


    initialize: function (config) {
        var me = this;
        me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    },

    /**
     *
     */
    process: function () {
        var me = this, sord, documentType;
        
        
        sord = sol.common.RepoUtils.getSord(me.wFDiagram.objId);
        documentType = me.getLocalizedKey(sol.common.SordUtils.getObjKeyValue(sord, me.documentTypeKey));

        if (me.isExportEnabled(documentType, me.documentTypes)) {
            me.logger.info(["Export is enabled for document type {0}", documentType]);
            sol.common.WfUtils.setWorkflowStatus(me.wFDiagram, me.statusEnabled);
        } else {
            me.logger.info(["Export is disabled for document type {0}", documentType]);
            sol.common.WfUtils.setWorkflowStatus(me.wFDiagram, me.statusDisabled);
        }
    },

    isExportEnabled: function (currentDocumentType, documentTypes) {
        var me = this;
        var exportIsEnabled = false;

        try {
            for (var index = 0; index < documentTypes.length; index++) {
                var type = documentTypes[index];
                me.logger.info(["check documenttyp {0} === {1}", currentDocumentType, type.key ]);
                if (currentDocumentType == type.key) {
                    if (typeof type.export.value == "string") {
                        exportIsEnabled = JSON.parse(type.export.value);
                    } else {
                        exportIsEnabled = type.export.value
                    }
                    break; // we found the current documenttype, so we can leave the forloop to skip processing...
                }
            }
        } catch (ex){
            me.logger.warn("cannot check decision, export will be disabled" , ex);
        }

        return exportIsEnabled
    }
});


/**
 *
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
    // noinspection ES6ConvertVarToLetConst
    var params, module;

    logger.enter("onExitNode_DecideExport", {
        flowId: wFDiagram.id,
        nodeId: nodeId
    });

    params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
    params.wFDiagram = wFDiagram;


    module = sol.create("sol.datev.accounting.ix.functions.DecideExport", params);
    module.process();

    logger.exit("onExitNode_DecideExport");
}

function RF_datev_function_DecideExport(ec, args) {
    var params, returnObj, result;
    logger.enter("RF_datev_function_DecideExport", result);
    params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
    returnObj = sol.create("sol.datev.accounting.ix.functions.DecideExport", params);
    result = returnObj.process();
    logger.exit("RF_datev_function_DecideExport", result);
    return sol.common.JsonUtils.stringifyAll(result);
}
