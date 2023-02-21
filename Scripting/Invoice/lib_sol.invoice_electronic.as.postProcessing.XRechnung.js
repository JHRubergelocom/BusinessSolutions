
//@include lib_Class.js

/**
 * Post processing for `XRechung` invoices
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.invoice_electronic.as.postProcessing.XRechnung", {
  singleton: true,

  process: function (sord) {
    var me = this,
        keyValues = [],
        tplSord;

    tplSord = sol.common.SordUtils.getTemplateSord(sord).sord;

    me.setPaymentTerms(tplSord, keyValues);

    if (keyValues.length > 0) {
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, sord.id, sord.id, keyValues, LockC.NO);
    }
  },

  setPaymentTerms: function (tplSord, keyValues) {
    var me = this,
        index = 1,
        paymentTerms, regex, match, days, rate;

    paymentTerms = tplSord.mapKeys.PAYMENT_TERMS;

    if (!paymentTerms) {
      return;
    }

    me.logger.debug(["setPaymentTerms: {0}", paymentTerms]);

    regex = /SKONTO#TAGE=(\d+)#PROZENT=([\d.]+)/g;

    match = regex.exec(paymentTerms);

    while (match) {
      days = match[1];
      rate = match[2].replace(".", ",");
      keyValues.push(new KeyValue("INVOICE_CASH_DISCOUNT_DAYS" + index, days));
      keyValues.push(new KeyValue("INVOICE_CASH_DISCOUNT_RATE" + index, rate));
      me.logger.debug(["PaymentTerms {0}: days={1}, rate={2}", index, days, rate]);
      match = regex.exec(paymentTerms);
      index++;
    }
  }
});
