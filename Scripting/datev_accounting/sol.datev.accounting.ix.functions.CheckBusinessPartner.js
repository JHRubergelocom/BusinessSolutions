
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectFormatter.js

//@include lib_sol.datev.accounting.mixins.ApiRequest.js
//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.datev.accounting.mixins.LocalizedKwlList.js

//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.DynKwlUtils.js

// noinspection ES6ConvertVarToLetConst
var logger = sol.create("sol.Logger", { scope: "sol.datev.accounting.ix.functions.CheckBusinessPartner" });

/**
 *
 * Retrieve and Check business partner entity if it exists in DATEV connect.
 *
 * If the business partner exists on the foreign system, some information will be filled into the given sord object to complete the data set within elo. 
 * 
 * To Retrieve the correct data, it's important that we pass the debitor or creditor indicator to the API.
 * Example Request which is calling: http://server:8080/elo.integration.datev/Client/:COMPANY_CODE/BusinessPartner/:VENDOR_NAME?businessPartnerTypeKey=(K|D)
 * If BUSINESSPARTNER_TYPE is empty, the API select creditor as a default type.
 * In case of the business partner is not existing MISSING_BUSINESSPARTER flag is set to '1'
 * The following information will be filled if the business partner exists:
 *
 *     TERMOFPAYMENT_CODE
 *     TERMOFPAYMENT_DESC
 *     INVOICE_CASH_DISCOUNT_DAYS
 *     INVOICE_CASH_DISCOUNT_RATE
 *     MISSING_BUSINESSPARTNER
 *
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.common.Config
 * @requires  sol.common.SordUtils
 * @requires  sol.common.Map
 * @requires  sol.common.WfUtils
 * @requires  sol.common.IxUtils
 * @requires  sol.common.ObjectFormatter
 * @requires  sol.common.ix.FunctionBase
 * @requires  sol.common.ix.DynKwlUtils
 * @requires  sol.datev.accounting.mixins.ApiRequest
 * @requires  sol.datev.accounting.mixins.Configuration
 * @requires  sol.datev.accounting.mixins.LocalizedKwlList
 *
 */
sol.define("sol.datev.accounting.ix.functions.CheckBusinessPartner", {
  extend: "sol.common.ix.FunctionBase",

  mixins: [
      "sol.datev.accounting.mixins.ApiRequest",
      "sol.datev.accounting.mixins.Configuration",
      "sol.datev.accounting.mixins.LocalizedKwlList"
  ],

  inject: {
    api: { config: "api", prop: "api", template: false }
  },

  // objKey and mapKey config - which fields should be load for render handlebarstrings
  mapKeys: ["MISSING_BUSINESSPARTNER" , "BUSINESSPARTNER_TYPE"],
  objKeys: ["VENDOR_NO", "COMPANY_CODE" , "INVOICE_DATE", "ACCOUNTING_DATEV_FISCALYEAR"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);

    me.fields = {
      MISSING_BUSINESSPARTNER: "MISSING_BUSINESSPARTNER",
      BUSINESSPARTNER_TYPE : "BUSINESSPARTNER_TYPE",
      INVOICE_DATE: "INVOICE_DATE",
      FISCAL_YEAR: "ACCOUNTING_DATEV_FISCALYEAR",
      VENDOR_NO: "VENDOR_NO",
      CLIENT_ID: "COMPANY_CODE",
      TERMOFPAYMENT_CODE: "INVI_TERMSOFPAYMENT_CODE",
      TERMOFPAYMENT_DESC: "INVI_TERMSOFPAYMENT_DESC",
      INVOICE_CASH_DISCOUNT_DAYS: "INVOICE_CASH_DISCOUNT_DAYS",
      INVOICE_CASH_DISCOUNT_RATE : "INVOICE_CASH_DISCOUNT_RATE",
      VENDOR_ID: "VENDOR_ID"
    };

  },

  /**
   */
  process: function () {
    var me = this, resolvedRequestUrl, sordData, resp,  config = [],
        queryParams = {};

    sordData = me.getTemplateSord().sord;

    resolvedRequestUrl = me.resolveUrl(
        me.getApiResourceUri(me.api, me.endpoints.businessPartner),
        {sord: sordData}
    );

    if (!sordData || !sordData.mapKeys || !sordData.mapKeys[me.fields.BUSINESSPARTNER_TYPE]) {
       me.logger.error(["mapField {0} is not set in objId={1}. Could not check if businesspartner exists", me.fields.BUSINESSPARTNER_TYPE, me.objId]);
       throw new Error("Couldn't resolve mapField " + me.fields.BUSINESSPARTNER_TYPE + "in objId=" + me.objId);
    }

    queryParams = {
      businessPartnerTypeKey: me.getLocalizedKey(sordData.mapKeys[me.fields.BUSINESSPARTNER_TYPE]),
      invoiceDate: sordData.objKeys[me.fields.FISCAL_YEAR]
    };

    me.logger.info(["requesting {0}... , params={1}" , resolvedRequestUrl, queryParams]);

    resp = me.getResourceByUrl(resolvedRequestUrl, {
      params: queryParams
    });

    if (!resp) {
      me.logger.error(["response is undefined, url={0}", resolvedRequestUrl]);
      return;
    }

    if (resp.responseOk) {
      me.logger.info(["Found Business Partner. Request Url={0}", resolvedRequestUrl]);

      /** We should only disabled missing business partner flag if it already exists as mapField
       * Otherwise we can ignore it
       *
       * Maybe we should delete the flag from mapdata database at all
       */

      if (sordData.mapKeys[me.fields.MISSING_BUSINESSPARTNER]){
        config = me.provideBusinessPartnerFlag(false, config);
      }
      me.logger.info(["termOfPayment Code={0}", resp.content.termOfPaymentId]);

      config = me.provideTermOfPaymentCode(resp.content.termOfPaymentId, config);
      config = me.provideBusinessPartnerNoLong(resp.content.vendorNoLong, config);
      config = me.provideTermOfPayments(resp.content.termOfPayment, config);

      me.executeSetFunction(config);

      return {
        message: "Business Partner was found",
        queryParam: queryParams,
        data: sordData,
        resp: resp
      };

    }

    // Here we know that business partner doesn't exist in datev
    if (resp.responseCode === 404) {
      me.logger.info(["Business Partner(id={0}) not found in datev. Activate flag in field {1}  ", sordData.objKeys[me.fields.VENDOR_NO] , me.fields.MISSING_BUSINESSPARTNER]);

      me.executeSetFunction(me.provideBusinessPartnerFlag(true, config));

      return {
        message: "Business Partner wasn't found",
        queryParam: queryParams,
        data: sordData,
        resp: resp
      };
    } else {
      me.logger.warn(["response of {0}, responseCode={1}, errorMessage={2}", resolvedRequestUrl, resp.responseCode, resp.errorMessage]);
    }
  },

  provideBusinessPartnerFlag: function(isMissing, config){
    var me = this;
    config.push( {type: "MAP", key: me.fields.MISSING_BUSINESSPARTNER, value: isMissing ? 1 : 0});
    return config;
  },

  /**
   * This is no longer supported and it should be examined whether this can be deleted.
   * @deprecated
   */
  provideBusinessPartnerNoLong: function(vendorNoLong, config){
      var me  = this;
      config.push({type: "MAP", key: me.fields.VENDOR_ID, value: vendorNoLong });
      return config;
  },

  provideTermOfPaymentCode: function(code, config){
     var me = this;
     config.push({type: "MAP", key: me.fields.TERMOFPAYMENT_CODE, value: code});
     return config;
  },

  provideTermOfPayments: function(termOfPayment, config){
    var me = this,
        index = 1,
        cashDiscountFields = ["cash_discount1_days", "cash_discount2_days", "due_in_days"],
        cashPercentageFields = ["cash_discount1_percentage", "cash_discount2_percentage"]

    if (!termOfPayment){
      me.logger.info("no termOfPayment provided");
      return config;
    }

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

  /**
   *
   * @param {Array<Object>} config
   */
  executeSetFunction: function(config){
    var me = this, setConfig;

    setConfig = {
      objId: me.objId,
      entries: config
    };

    sol.common.IxUtils.execute("RF_sol_function_Set", setConfig);

  },

  getTemplateSord: function () {
     var me = this, sord, data;

     try {
       sord = sol.common.RepoUtils.getSord(me.objId);
       data = sol.common.ObjectFormatter.format({
         sord: {
           formatter: 'sol.common.ObjectFormatter.TemplateSord',
           data: sord,
           config: {
             mapKeys: me.mapKeys,
             objKeys: me.objKeys
           }
         },
       });

       return data;
     } catch (ex){
       me.logger.error(["Couldn't checkout sord objId={0}", me.objId], ex);
       throw ex;
     }
  }
});


/**
 * @member
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_CheckBusinessPartner", { flowId: wFDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  module = sol.create("sol.datev.accounting.ix.functions.CheckBusinessPartner", params);
  module.process();
  logger.exit("onEnterNode_CheckBusinessPartner");
}


/**
 * @member sol.invoice.ix.functions.ChangeUser
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_CheckBusinessPartner", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;

  module = sol.create("sol.datev.accounting.ix.functions.CheckBusinessPartner", params);

  module.process();

  logger.exit("onExitNode_CheckBusinessPartner");
}

/**
 * @member
 * @method
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_datev_accounting_function_CheckBusinessPartner(ec, args) {
  var params, returnObj, result;
  logger.enter("RF_datev_accounting_function_CheckBusinessPartner", args);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  returnObj = sol.create("sol.datev.accounting.ix.functions.CheckBusinessPartner", params);
  result = returnObj.process();
  logger.exit("RF_datev_accounting_function_CheckBusinessPartner", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
