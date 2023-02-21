
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.datev.accounting.mixins.Configuration.js


var logger = sol.create("sol.Logger", { scope: "sol.datev.accounting.ix.services.GetDocumentTypes" });

/**
 * Retrieves the available document types.
 *
 * @author MHe, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.datev.accounting.ix.services.GetDocumentTypes", {
    extend: "sol.common.ix.ServiceBase",

    mixins: ["sol.datev.accounting.mixins.Configuration", "sol.common.mixins.Inject"],

    inject: {
        documentTypes: { config: "accounting", prop: "documentTypes", template: false }
    },

    initialize: function (config) {
        var me = this;
        me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    },

    /**
     * @returns {Object[]} Array with document types
     */
    process: function () {
        var me = this, documentTypes;
        me.logger.info(["Found {0} Document Types. documentType={1}" , me.documentTypes.length , JSON.stringify(me.documentTypes)]);
        documentTypes = me.getDocumentTypes(me.documentTypes || []);
        me.logger.info(["Found {0} Document Types. documentType={1}" , documentTypes.length , documentTypes]);
        return documentTypes;
    },

    /**
     * @private
     * @returns {Object[]}
     */
    getDocumentTypes: function (documentTypes) {
        var me = this,
            documentType, documentTypeKey,
            converted = [];

        try {

            if (!sol.common.ObjectUtils.isArray(documentTypes)){
                throw "documentTypes isn't an array";
            }

            sol.common.ObjectUtils.forEach(documentTypes, function (type) {
                converted.push({
                    key: type.key,
                    name: type.name,
                    desc: type.desc,
                    docType: type.docType,
                    form: type.form
                });
            })

        } catch (ex){
            me.logger.warn(["Could not convert documentTypes"], ex);
            // Either all documentTypes are configured correctly or we will return an empty list.
            converted = [];
        }

        return converted;
    }
});

/**
 * @member sol.datev.accounting.ix.services.GetDocumentTypes
 * @method RF_sol_datev_accounting_service_GetDocumentTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_datev_accounting_service_GetDocumentTypes(iXSEContext, args) {
    logger.enter("RF_sol_datev_accounting_service_GetDocumentTypes", args);
    var rfUtils = sol.common.ix.RfUtils,
        config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        service, result;

    service = sol.create("sol.datev.accounting.ix.services.GetDocumentTypes", config);
    result = rfUtils.stringify(service.process());
    logger.exit("RF_sol_datev_accounting_service_GetDocumentTypes", result);
    return result;
}


importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.datev.accounting.mixins.Configuration.js


var logger = sol.create("sol.Logger", { scope: "sol.datev.accounting.ix.services.GetDocumentTypes" });

/**
 * Retrieves the available document types.
 *
 * @author MHe, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.datev.accounting.ix.services.GetDocumentTypes", {
    extend: "sol.common.ix.ServiceBase",

    mixins: ["sol.datev.accounting.mixins.Configuration", "sol.common.mixins.Inject"],

    inject: {
        documentTypes: { config: "accounting", prop: "documentTypes", template: false }
    },

    initialize: function (config) {
        var me = this;
        me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    },

    /**
     * @returns {Object[]} Array with document types
     */
    process: function () {
        var me = this, documentTypes;
        me.logger.info(["Found {0} Document Types. documentType={1}" , me.documentTypes.length , JSON.stringify(me.documentTypes)]);
        documentTypes = me.getDocumentTypes(me.documentTypes || []);
        me.logger.info(["Found {0} Document Types. documentType={1}" , documentTypes.length , documentTypes]);
        return documentTypes;
    },

    /**
     * @private
     * @returns {Object[]}
     */
    getDocumentTypes: function (documentTypes) {
        var me = this,
            documentType, documentTypeKey,
            converted = [];

        try {

            if (!sol.common.ObjectUtils.isArray(documentTypes)){
                throw "documentTypes isn't an array";
            }

            sol.common.ObjectUtils.forEach(documentTypes, function (type) {
                converted.push({
                    key: type.key,
                    name: type.name,
                    desc: type.desc,
                    docType: type.docType,
                    form: type.form
                });
            })

        } catch (ex){
            me.logger.warn(["Could not convert documentTypes"], ex);
            // Either all documentTypes are configured correctly or we will return an empty list.
            converted = [];
        }

        return converted;
    }
});

/**
 * @member sol.datev.accounting.ix.services.GetDocumentTypes
 * @method RF_sol_datev_accounting_service_GetDocumentTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_datev_accounting_service_GetDocumentTypes(iXSEContext, args) {
    logger.enter("RF_sol_datev_accounting_service_GetDocumentTypes", args);
    var rfUtils = sol.common.ix.RfUtils,
        config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        service, result;

    service = sol.create("sol.datev.accounting.ix.services.GetDocumentTypes", config);
    result = rfUtils.stringify(service.process());
    logger.exit("RF_sol_datev_accounting_service_GetDocumentTypes", result);
    return result;
}


/**
 * 
 * @param {*} iXSEContext 
 * @param {*} args 
 */
function RF_sol_datev_accounting_service_GetDocumentTypeByTypeKey(iXSEContext, args) {
    logger.enter("RF_sol_datev_accounting_service_GetDocumentTypes", args);
    var rfUtils = sol.common.ix.RfUtils, result, type, documentType = null,
        config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "documentTypeKey"),
        service;

    service = sol.create("sol.datev.accounting.ix.services.GetDocumentTypes", config);
    var documentTypes = service.process();

    config.documentTypeKey = config.documentTypeKey || "";

    for (var i = 0; i < documentTypes.length; i++){
        type = documentTypes[i];
        if (config.documentTypeKey === type.key){
            documentType = type;
        }
    }

    result = rfUtils.stringify(documentType);
    logger.exit("RF_sol_datev_accounting_service_GetDocumentTypes", result);
    return result;
}


