importPackage(Packages.java.util);

//@include lib_Class.js

/**
 *  @author MHe, ELO Digital Office GmbH
 *  @version 1.0
 *
 *  Configuration mixin to inject configuration from config files
 *  Provides some useful functions to easily access the configuration values
 */
sol.define("sol.datev.accounting.mixins.Configuration", {
  mixin: true,

  $configRelation: {
     api: "/sol.datev.accounting/Configuration/datev-connector.service.config",
     accounting: "/sol.datev.accounting/Configuration/accounting.config",
     docx: "/sol.datev.accounting/Configuration/sol.datev.accounting.docx-basic-entry.config",
     localizedKwl: '/sol.datev.accounting/Configuration/sol.datev.accounting.LocalizedKwls.config',
	 invoice: '/sol.datev.accounting/Configuration/sol.invoice.config',
  },

  endpoints: {
    dueDate : "getDueDate",
    health: "actuator/health",
    businessPartner: "Client/{{sord.objKeys.COMPANY_CODE}}/BusinessPartner/{{sord.objKeys.VENDOR_NO}}",
    termOfPayment: "Client/{{clientCode}}/InvoiceDate/{{invoiceDate}}/TermOfPayment/{{termOfPaymentId}}",
    fiscalYear: "Client/{{sord.objKeys.COMPANY_CODE}}/FiscalYear/{{sord.objKeys.INVOICE_DATE}}",
    postingProposal: "posting-proposal"
  },

  /**
   *
   * @param {*} api
   */
  getApiBaseUri: function(api) {
    var url = api.protocol + "://" + api.serverName + ":" + api.port + "/" + api.serviceName + "/";
    return url;
  },

  /**
   *
   * @param {*} api
   * @param {*} resource
   */
  getApiResourceUri: function(api, resource){
    var me = this;
    return me.getApiBaseUri(api) + resource;
  }

});
