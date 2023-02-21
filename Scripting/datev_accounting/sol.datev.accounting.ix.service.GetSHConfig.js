importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

//@include lib_sol.common.Injection.js
//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.Template.js

//@include lib_sol.datev.accounting.mixins.LocalizedKwlList.js

var logger = sol.create("sol.Logger", {scope: "sol.datev.accounting.ix.services.GetDebitCreditConfig"});

/**
 *
 * Get the current debit credit config by given document type of the current sord object, if an objId passed.
 *
 * @author Mhe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Injection
 * @requires sol.common.Config
 * @requires sol.common.WfUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.ix.ServiceBase
 *
 * @requires sol.datev.accounting.mixins.Configuration
 * @requires sol.datev.accounting.mixins.LocalizedKwlList
 *
 */
sol.define("sol.datev.accounting.ix.services.GetDebitCreditConfig", {
    extend: "sol.common.ix.ServiceBase",

    mixins: [
        "sol.datev.accounting.mixins.Configuration",
        "sol.common.mixins.Inject",
        "sol.datev.accounting.mixins.LocalizedKwlList"
    ],

    inject: {
        useConfigResolver: { config: "accounting", prop: "useConfigResolver", template: false },
        workflowSets: { config: "accounting" , prop: "workflowSets"},
        documentTypes: { config: "accounting" , prop: "documentTypes"}

    },

    required: ["objId"],

    initialize: function (config) {
        var me = this;
        me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    },

    /**
     *
     */
    process: function () {
        var me = this, conn,  debitCreditConfig, documentType, invoiceTypeValue;

        if (!sol.common.ObjectUtils.isArray(me.documentTypes)) {
            throw "configuration error - documentTypes isn't an array in accounting.config";
        }

        conn = me.getIxConnection();
        me.sord = conn.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

        try {
            invoiceTypeValue = sol.common.SordUtils.getObjKeyValue(me.sord, "INVOICE_TYPE");
            me.logger.info(["retrieve debitCredit config for documentType {0}", invoiceTypeValue]);
            documentType = me.findDocumentType(me.getLocalizedKey(invoiceTypeValue));
            debitCreditConfig =  me.prepareDebitCreditConfig(documentType);
            me.logger.info(["use debitCredit config = {0}, documentType={1}", JSON.stringify(debitCreditConfig), invoiceTypeValue]);
            return debitCreditConfig;
        } catch (ex) {
            me.logger.error(ex);
            throw ex;
        }
    },

    /**
     * @private
     * @return documentType by {@param documentTypeKey}
     * @throws exception if documentType doesn't exist in system
     */
    findDocumentType: function(documentTypeKey){
        var me = this, indicatorProp = "key", type;
        if (!documentTypeKey) throw "document type was not set on objId=" + me.objId;

        type = sol.common.ObjectUtils.findObjInArray(me.documentTypes, documentTypeKey, indicatorProp);
        if (!type) throw "document type" + documentTypeKey + " doesn't exist in config";
        return type;
    },

    /**
     * @private
     * @param documentType
     */
    prepareDebitCreditConfig: function(documentType){
        var me = this, debitCreditConfig = {};

        if (!documentType.sh){
            throw "debitCredit config is missing on documentType "
                + documentType.key + " - " + documentType.name
                + ". Please add this config to documentType, otherwise document can't pass to datev";
        }

        if (!documentType.docType) {
            throw "docType OUTGOING or INCOMING is not specified for documentType "
                    + documentType.key + " - " + documentType.name
                    + ". Please add this config to documentType, otherwise document can't pass to datev";
        }
        debitCreditConfig = documentType.sh;
        if (!debitCreditConfig.docType){
            debitCreditConfig.docType = documentType.docType
        }
        return debitCreditConfig;
    },

    /**
     * @private
     */
    getIxConnection: function () {
        return (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;
    }
});


/**
 * TODO: we should rename the function to GetDebitCreditConfig or something else
 * @param ec
 * @param args
 * @return {*}
 */
function RF_datev_accounting_function_GetSHConfig(ec, args) {
    var params, returnObj, result;
    logger.enter("RF_datev_function_GetSHConfig", result);
    params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
    returnObj = sol.create("sol.datev.accounting.ix.services.GetDebitCreditConfig", params);
    result = returnObj.process();
    logger.exit("RF_datev_function_GetSHConfig", result);
    return sol.common.JsonUtils.stringifyAll(result);
}
