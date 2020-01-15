
//@include lib_Class.js

/**
 * Contains functions for loading exchange rates and converting amounts.
 *
 * Exchange rates refer to EUR as base currency.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.common_fx.ix.FxUtils", {
  singleton: true,

  /**
   * @private
   * @property logger
   */

  initialize: function () {
    this.logger = sol.create("sol.Logger", { scope: this.$className });
  },

  /**
   * @private
   */
  configuration: {
    baseCurrency: "EUR",
    serviceUrl: "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml",
    regex: /<Cube currency='(.*?)' rate='(.*?)'\/>/g,
    timeRegex: /<Cube time='(.*?)'>/, // optional, fall back is the date of execution
    timeFormat: "yyyy-MM-dd", // required only if 'timeRegex' is defined, format see java.text.SimpleDateFormat
    updateStatement: "UPDATE sol_common_fx SET currency_exchange_rate=?,time=? WHERE currency_code=?",
    selectStatement: "SELECT currency_code, currency_exchange_rate FROM sol_common_fx WHERE currency_code=?"
  },

  /**
   * Loads the exchange rates from an externel service.
   *
   * Result object:
   *
   *     {
   *       "USD": "1.1389",
   *       "JPY": "136.33",
   *       "BGN": "1.9558",
   *       ...
   *     }
   *
   * @param {Boolean} persist (optional) If `true`, the database will be updated
   * @return {Object} The exchange rates
   */
  loadExchangeRates: function (persist) {
    var me = this,
        currencies, serviceUrl, currencyRegex, response, time, matches, code, rate;

    currencies = {
      EUR: "1"
    };

    serviceUrl = me.configuration.serviceUrl;
    currencyRegex = me.configuration.regex;
    response = me.getExchangeRates(serviceUrl);
    time = me.parseDate(response);

    if (response && (response.length > 0)) {
      while (matches = currencyRegex.exec(response)) {
        code = matches[1];
        rate = matches[2];

        currencies[code] = rate;
      }
    } else {
      throw "empty response from '" + serviceUrl + "'";
    }

    currencies = me.convertLocalCurrency(currencies);

    if ((typeof persist !== "undefined") && (persist === true)) {
      sol.common_fx.ix.FxUtils.updateExchangeRates(currencies, time);
    }

    return currencies;
  },

  /**
   * Converts the currencies to another local currency
   * @param {Object} currencies Currencies
   * @return {Object} Converted currencies
   */
  convertLocalCurrency: function (currencies) {
    var fxConfig, currency, localCurrencyRate, localCurrency, localCurrencyDecimalRate,
        rate, rateDecimal, newRateDecimal, newRate, precision;

    fxConfig = sol.create("sol.common.Config", { compose: "/common_fx/Configuration/fx.config" }).config;

    localCurrency = fxConfig.localCurrency || "EUR";
    precision = fxConfig.precision || 7;

    if (localCurrency == "EUR") {
      return currencies;
    }

    localCurrencyRate = currencies[localCurrency];
    localCurrencyDecimalRate = new Decimal(localCurrencyRate);

    for (currency in currencies) {
      rate = currencies[currency];
      rateDecimal = new Decimal(rate);
      newRateDecimal = rateDecimal.dividedBy(localCurrencyDecimalRate);
      newRate = newRateDecimal.toPrecision(precision).toString();
      currencies[currency] = newRate;
    }

    return currencies;
  },

  /**
   * Converts an amount from one currency to another.
   *
   * Because all exchange rates refer to EUR the conversion has up to two steps: FROM_CURRENCY -> EUR ( -> TO_CURRENCY)
   *
   * Result object:
   *
   *     {
   *       amount: "47.11",
   *       from: "USD",
   *       to: "EUR",
   *       result: "42.06"
   *     }
   *
   * @param {String} amount
   * @param {String} from The currency of the amount
   * @param {String} to The currency in which the amount should be converted. If undfined 'baseCurrency' will be used (see {@link #configuration baseCurrency})
   * @return {Object}
   */
  convertAmount: function (amount, from, to) {
    var me = this,
        result;

    amount = amount || 0;

    if (!from) {
      throw "invalid arguments: from can not be undefined";
    }

    result = { amount: amount, from: from };
    result.to = to || me.configuration.baseCurrency;

    me.logger.info(["convert amount : {0} from '{1}' to '{2}'", result.amount, result.from, result.to]);

    result.result = parseFloat(result.amount) / me.getExchangeRateForCurrency(result.from);

    if (result.to !== "EUR") {
      result.result = parseFloat(result.result) * me.getExchangeRateForCurrency(result.to);
    }

    me.logger.info(["conversion result : {0} {1}", result.result, result.to]);

    return result;
  },

  /**
   * @private
   * Retrieves the exchange rates from an externel service.
   * @param {String} url The service URL
   * @return {String} The service response
   */
  getExchangeRates: function (url) {
    var responseObj,
        fxConfig, proxyHost, proxyPort;

    fxConfig = sol.create("sol.common.Config", { compose: "/common_fx/Configuration/fx.config" }).config;

    proxyHost = fxConfig.proxyHost;
    proxyPort = fxConfig.proxyPort || "8080";

    responseObj = sol.common.HttpUtils.sendRequest({
      url: url,
      proxyHost: proxyHost,
      proxyPort: proxyPort
    });

    return responseObj.content;
  },

  /**
   * @private
   * Parses the request date from a text using a regular expression (see {@link #configuration timeRegex}).
   *
   * @param {String} text
   * @return {String} ISO date
   */
  parseDate: function (text) {
    var me = this,
        sdf = new Packages.java.text.SimpleDateFormat(me.configuration.timeFormat),
        date = new Date(),
        timeMatch;

    timeMatch = me.configuration.timeRegex.exec(text);
    if (timeMatch && timeMatch.length == 2) {
      date = sdf.parse(timeMatch[1]);
    }

    return ixConnect.dateToIso(date) + "";
  },

  /**
   * @private
   * Writes updated exchange rates to the database.
   * @param {Object} currencies Currencies
   * @param {String} time Time
   */
  updateExchangeRates: function (currencies, time) {
    var me = this,
        rows = [],
        currency, dbConnection, rowCount;

    for (currency in currencies) {
      rows.push([currencies[currency], time, currency]);
    }

    dbConnection = new Packages.de.elo.ix.jscript.DBConnection(),
    rowCount = dbConnection.update(me.configuration.updateStatement, rows);

    me.logger.info(["updated exchange rates; updated rows: {0}", rowCount]);
  },

  /**
   * @private
   * Retrives the exchange rate for one currency from the database.
   * @param {String} currencyCode
   * @return {Number} The exchange rate
   */
  getExchangeRateForCurrency: function (currencyCode) {
    var me = this,
        dbConnection, ret;
    if (!currencyCode) {
      throw "no source currency defined";
    }

    dbConnection = new Packages.de.elo.ix.jscript.DBConnection(),
    ret = dbConnection.query(me.configuration.selectStatement, [currencyCode]);

    if (!ret || ret.length < 1) {
      throw "no exchange rate found for '" + currencyCode + "'";
    }

    return parseFloat(ret[0][1]);
  }
});
