
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
//@include lib_sol.datev.accounting.mixins.ApiRequest.js
//@include lib_sol.datev.accounting.mixins.Configuration.js



var logger = sol.create("sol.Logger", { scope: "sol.datev.accounting.ix.services.GetTermOfPayments" });

/**
 * Retrieves all termOfPayments of a specific datev business partner
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
sol.define("sol.datev.accounting.ix.services.GetTermOfPayments", {
    extend: "sol.common.ix.ServiceBase",

    mixins: [
        "sol.datev.accounting.mixins.ApiRequest",
        "sol.datev.accounting.mixins.Configuration"
    ],

    inject: {
        api: { config: "api", prop: "api", template: false }
    },

    initialize: function (config) {
        var me = this, resp;
        me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
        me.fields = {
            TERMOFPAYMENT_CODE: "INVI_TERMSOFPAYMENT_CODE",
            TERMOFPAYMENT_DESC: "INVI_TERMSOFPAYMENT_DESC",
            INVOICE_CASH_DISCOUNT_DAYS: "INVOICE_CASH_DISCOUNT_DAYS",
            INVOICE_CASH_DISCOUNT_RATE : "INVOICE_CASH_DISCOUNT_RATE",
        };
    },

    /**
     * @returns {{termOfPayments: []}} Array with document types
     */
    process: function () {
        var me = this;

        try {
            resolvedRequestUrl = me.resolveUrl(
                me.getApiResourceUri(me.api, me.endpoints.termOfPayment), {
                    clientCode: me.clientCode,
                    invoiceDate: me.invoiceDate,
                    termOfPaymentId: me.termOfPaymentId
                }
            );

            me.logger.info(["request url {0}", resolvedRequestUrl]);

            var resp = me.getResourceByUrl(resolvedRequestUrl);

            if (resp.responseOk){
                var config = [];
                me.provideTermOfPayments(resp.content, config);
    
                me.logger.info(["provide termOfPayment {0}", JSON.stringify(config)]);
    
                return {
                    termOfPayments: config
                };
            } else {
                me.logger.warn(["response of request url {0} is not ok, responseStatus = {1}", resolvedRequestUrl, resp.responseCode]);
                return {
                    responseCode: resp.responseCode,
                    errorMessage: resp.errorMessage
                }
            }

        } catch (ex) {
            me.logger.warn(["Couldn't get termOfPayment code = {0}", me.termOfPaymentId], ex);
            throw ex;
        }
    },

    provideTermOfPayments: function(termOfPayment, config){
        var me = this,
            index = 1,
            cashDiscountFields = ["cash_discount1_days", "cash_discount2_days", "due_in_days"],
            cashPercentageFields = ["cash_discount1_percentage", "cash_discount2_percentage"];

        if (!termOfPayment){
            me.logger.info("no termOfPayment provided");
            return config;
        }

        config.push({type: "MAP", key: me.fields.TERMOFPAYMENT_CODE, value: termOfPayment.id})

        config.push({type: "MAP", key: me.fields.TERMOFPAYMENT_DESC, value: termOfPayment.caption || ''})
        cashDiscountFields.forEach(function (fieldname) {
            if (termOfPayment.due_in_days[fieldname]){
                config.push({type: "MAP", key: me.fields.INVOICE_CASH_DISCOUNT_DAYS + index, value: termOfPayment.due_in_days[fieldname]});
                index++;
            }
        });

        index = 1;
        cashPercentageFields.forEach(function (fieldname) {
            if (termOfPayment[fieldname]){
                config.push({type: "MAP", key: me.fields.INVOICE_CASH_DISCOUNT_RATE + index, value: termOfPayment[fieldname]});
                index++;
            }
        });

        config.push({type: "MAP", key: me.fields.INVOICE_CASH_DISCOUNT_RATE + index, value: 0});
        return config;
    },

});

/**
 * @member sol.datev.accounting.ix.services.GetTermOfPayments
 * @method RF_sol_datev_accounting_service_GetTermOfPayments
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_datev_accounting_service_GetTermOfPayments(iXSEContext, args) {
    logger.enter("RF_sol_datev_accounting_service_GetTermOfPayments", args);
    var rfUtils = sol.common.ix.RfUtils,
        config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        service, result;

    service = sol.create("sol.datev.accounting.ix.services.GetTermOfPayments", config);
    result = rfUtils.stringify(service.process());
    logger.exit("RF_sol_datev_accounting_service_GetTermOfPayments", result);
    return result;
}
