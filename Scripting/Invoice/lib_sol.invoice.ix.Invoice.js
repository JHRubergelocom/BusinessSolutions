
//@include lib_Class.js

/**
 * Represents an invoice
 *
 * Uses invoice configuration object from `/Administration/Business Solutions/invoice/Configuration/sol.invoice.config`
 *
 * @author Michael Weiler, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.ix.DynKwlUtils
 * @requires sol.common.Map
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Config
 */
sol.define("sol.invoice.ix.Invoice", {

  /**
   * @cfg {de.elo.ix.client.Sord} sord
   * ELO object
   */

  initialize: function (config) {
    var me = this;
    me.logger = sol.create("sol.Logger", { scope: me.$className });
    me.sord = config.sord;
    me.config = sol.create("sol.common.Config", { compose: "/invoice/Configuration/sol.invoice.config" }).config;
    me.sordMap = sol.create("sol.common.SordMap", { objId: me.sord.id });
    me.sordMap.read();
  },

  /**
   * Sets default values of an invoice
   * @return {de.elo.ix.client.Sord} Sord
   */
  setDefaultValues: function () {
    var me = this,
        sordChanged = false,
        keyValues = [],
        chargeCodeFieldName, chargeCodeValue, chargeDescFieldName, chargeDescValue, map,
        currency, baseCurrency, exchangeRate, i, invoiceType, dataCollection,
        netAmountLocalCurrency, totalAmountLocalCurrency, cashDiscountAmountLocalCurrency,
        taxesConfig;


    // Set default mask
    if (me.sord.maskName != me.config.invoiceMaskName.value) {
      me.logger.info(["Mask is empty. Set mask to '{0}'.", me.config.invoiceMaskName.value]);
      this.sord = ixConnect.ix().changeSordMask(me.sord, me.config.invoiceMaskName.value, new EditInfoZ(0, SordC.mbAll)).sord;
      sordChanged = true;
    }

    // Set company name
    if (!sol.common.SordUtils.getObjKeyValue(me.sord, me.config.fields.COMPANY_NAME.value)) {
      sordChanged |= sol.common.ix.DynKwlUtils.fillSord(me.sord, me.config.fields.COMPANY_CODE.value);
    }

    // Set company code
    if (!sol.common.SordUtils.getObjKeyValue(me.sord, me.config.fields.COMPANY_CODE.value)) {
      sordChanged |= sol.common.ix.DynKwlUtils.fillSord(me.sord, me.config.fields.COMPANY_NAME.value);
    }

    // Set business area name
    if (!me.sordMap.getValue(me.config.mapFields.BUSINESS_AREA_NAME.value)) {
      sordChanged |= sol.common.ix.DynKwlUtils.fillMap(null, me.sord, me.config.fields.BUSINESS_AREA_CODE.value, me.config.kwlScripts.businessArea.value, { onlyIfUnique: true });
    }

    // Set company code
    if (!sol.common.SordUtils.getObjKeyValue(me.sord, me.config.fields.VENDOR_NO.value)) {
      sordChanged |= sol.common.ix.DynKwlUtils.fillSord(me.sord, me.config.fields.VENDOR_NAME.value);
    }

    // Set document type
    invoiceType = sol.common.SordUtils.getObjKeyValue(me.sord, me.config.fields.INVOICE_TYPE.value);
    if (!invoiceType) {
      me.logger.info(["Invoice type is empty. Set to '{0}'.", me.config.defaultInvoiceType.value]);
      sol.common.SordUtils.setObjKeyValue(me.sord, me.config.fields.INVOICE_TYPE.value, me.config.defaultInvoiceType.value);
      sordChanged = true;
    } else {
      me.correctCreditNoteKey(invoiceType);
    }
    sordChanged |= sol.common.ix.DynKwlUtils.fillSord(me.sord, me.config.fields.INVOICE_TYPE.value);

    // Set default currency
    if (!sol.common.SordUtils.getObjKeyValue(me.sord, me.config.fields.INVOICE_CURRENCY_CODE.value)) {
      me.logger.info(["Currency is empty. Set to '{0}'.", me.config.baseCurrency.value]);
      sol.common.SordUtils.setObjKeyValue(me.sord, me.config.fields.INVOICE_CURRENCY_CODE.value, me.config.baseCurrency.value);
      sordChanged = true;
    }

    // Set exchange rate
    sol.common.ix.DynKwlUtils.fillMap(null, me.sord, me.config.fields.INVOICE_CURRENCY_CODE.value, me.config.kwlScripts.currency.value);

    // Set default terms of payment
    sol.common.ix.DynKwlUtils.fillMap(null, me.sord, me.config.fields.VENDOR_NO.value, me.config.kwlScripts.termsOfPayment.value, { append: true });

    // Set charge codes
    for (i = 1; i < me.config.MAX_LINES.value; i++) {
      chargeCodeFieldName = me.config.mapFields.INVOICE_TRADE_CHARGE_CODE.value + i;
      chargeCodeValue = me.sordMap.getValue(chargeCodeFieldName);

      chargeDescFieldName = me.config.mapFields.INVOICE_TRADE_CHARGE_DESC.value + i;
      chargeDescValue = me.sordMap.getValue(chargeDescFieldName);

      if (!chargeDescValue) {
        break;
      }
      if (!chargeCodeValue) {
        map = {};
        map["IX_MAP_" + chargeDescFieldName] = chargeDescValue;
        sol.common.ix.DynKwlUtils.fillMap(map, me.sord, "IX_MAP_" + me.config.mapFields.INVOICE_TRADE_CHARGE_DESC.value + i, me.config.kwlScripts.tradeCharge.value);
      }
    }

    // Set local currency amounts
    currency = sol.common.SordUtils.getObjKeyValue(me.sord, me.config.fields.INVOICE_CURRENCY_CODE.value);
    baseCurrency = me.config.baseCurrency.value;
    if (!currency || (currency == baseCurrency)) {
      sol.common.SordUtils.getObjKeyValue(me.sord, me.config.fields.INVOICE_CURRENCY_CODE.value, baseCurrency);
      sol.common.SordUtils.setObjKeyValueAsNumber(me.sord, me.config.fields.INVOICE_CURRENCY_EXCHANGE_RATE.value, "1");
    }

    exchangeRate = sol.common.SordUtils.getObjKeyValueAsNumber(me.sord, me.config.fields.INVOICE_CURRENCY_EXCHANGE_RATE.value);

    netAmountLocalCurrency = sol.common.SordUtils.getObjKeyValueAsNumber(me.sord, me.config.fields.INVOICE_NET_AMOUNT.value) / exchangeRate;
    sol.common.SordUtils.setObjKeyValueAsNumber(me.sord, me.config.fields.INVOICE_NET_AMOUNT_LOCAL_CURR.value, netAmountLocalCurrency);

    totalAmountLocalCurrency = sol.common.SordUtils.getObjKeyValueAsNumber(me.sord, me.config.fields.INVOICE_TOTAL_AMOUNT.value) / exchangeRate;
    sol.common.SordUtils.setObjKeyValueAsNumber(me.sord, me.config.fields.INVOICE_TOTAL_AMOUNT_LOCAL_CURR.value, totalAmountLocalCurrency);

    cashDiscountAmountLocalCurrency = sol.common.SordUtils.getObjKeyValueAsNumber(me.sord, me.config.fields.INVOICE_CASH_DISCOUNT_AMOUNT.value) / exchangeRate;
    sol.common.SordUtils.setObjKeyValueAsNumber(me.sord, me.config.fields.INVOICE_CASH_DISCOUNT_AMOUNT_LOCAL_CURR.value, cashDiscountAmountLocalCurrency);

    // Set `calc tax` field
    taxesConfig = me.config.taxes || {};

    dataCollection = (sol.common.SordUtils.getObjKeyValue(me.sord, me.config.fields.INVOICE_DATACOLLECTION.value) || "") + "";

    if (!dataCollection || taxesConfig.calcTaxesAfterDataCollection) {
      keyValues.push(new KeyValue("INVOICE_CALC_TAXES", "1"));
    }

    if (keyValues && (keyValues.length > 0)) {
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.sord.id, me.sord.id, keyValues, LockC.NO);
    }

    return sordChanged;
  },

  /**
   * @private
   * Corrects the credit note key
   * @param {String} invoiceType Invoice type
   */
  correctCreditNoteKey: function (invoiceType) {
    var me = this,
        keyExists;
    if (invoiceType == "CR") {
      keyExists = me.localizedKwlKeyExists("/invoice/Configuration/sol.invoice.LocalizedKwls.config", "docType", "CR");
      if (!keyExists) {
        me.logger.info("Invoice type 'CR' doesn't exist. Changed to invoice type 'CN'.");
        sol.common.SordUtils.setObjKeyValue(me.sord, me.config.fields.INVOICE_TYPE.value, "CN");
      }
    }
  },

  /**
   * @private
   * Checks wether a localized keyword list key exists
   * @param {String} configPath Configuration path
   * @param {String} kwlName Keyword list name
   * @param {String} key Key
   * @return {Boolean}
   */
  localizedKwlKeyExists: function (configPath, kwlName, key) {
    var localizedKwlConfigDoc, kwl, i, entry;

    localizedKwlConfigDoc = sol.create("sol.common.Config", { compose: configPath });
    if (!localizedKwlConfigDoc) {
      throw "Localized keyword list configuration document doesn't exist: configPath=" + configPath;
    }
    kwl = localizedKwlConfigDoc.config[kwlName];
    if (!kwl) {
      throw "Localized keyword list doesn't exist: kwl=" + kwl;
    }
    for (i = 0; i < kwl.entries.length; i++) {
      entry = kwl.entries[i];
      if (entry.key == key) {
        return true;
      }
    }
    return false;
  }
});
