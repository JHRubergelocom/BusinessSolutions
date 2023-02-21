
//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Config.js
//@include lib_sol.common_fx.ix.FxUtils.js

/**
 * Contains different converter functions used by the ELOinvoice solution
 *
 * Interface for converter functions:
 *
 *     function(valueToConvert, sord) : String
 *
 * The Sord can be used to read dependend fields or additional parameters needed by the converter.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Config
 * @requires sol.common_fx.ix.FxUtils
 *
 */
sol.define("sol.invoice.Converter", {
  singleton: true,

  /**
   * @private
   * @property {Object} _config Invoice configuration object from `/Administration/Business Solutions/invoice/Configuration/sol.invoice.config`
   */

  /**
   * Converts an amount from one currency to another using the currency from the sol.invoice.config.fields.INVOICE_CURRENCY_CODE field to the base currency (sol.invoice.config.baseCurrency).
   * It uses {@link sol.invoice.Currency#convertAmount}.
   * @param {String} value
   * @param {de.elo.ix.client.Sord} sord Sord to read configuration from
   * @return {String} The converted value
   */
  currency: function (value, sord) {
    var config = sol.invoice.Converter.loadConfig(),
        currency = sol.common.SordUtils.getObjKeyValue(sord, config.fields.INVOICE_CURRENCY_CODE.value);

    return sol.common_fx.ix.FxUtils.convertAmount(value, currency).result;
  },

  /**
   * @private
   * @return {Object}
   */
  loadConfig: function () {
    return sol.create("sol.common.Config", { compose: "/invoice/Configuration/sol.invoice.config" }).config;
  }

});
