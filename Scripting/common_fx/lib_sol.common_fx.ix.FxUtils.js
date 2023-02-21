
//@include lib_Class.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.HttpUtils.js

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
    serviceUrlHistory: "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist.xml",
    regex: /<Cube currency='(.*?)' rate='(.*?)'\/>/g,
    timeRegex: /<Cube time='(.*?)'>/, // optional, fall back is the date of execution
    timeFormat: "yyyy-MM-dd", // required only if 'timeRegex' is defined, format see java.text.SimpleDateFormat,
    isoDateTimeFormat: "YYYYMMDDHHmmss",
    updateStatement: "UPDATE sol_common_fx SET currency_exchange_rate=?,time=? WHERE currency_code=?",
    selectStatement: "SELECT currency_code, currency_exchange_rate FROM sol_common_fx WHERE currency_code=?",
    selectHistoryCountStatement: "SELECT COUNT(*) FROM sol_common_fx_history",
    selectCurrencyCodesStatement: "SELECT currency_code FROM sol_common_fx",
    truncateHistoryTable: "TRUNCATE TABLE sol_common_fx_history",
    selectHistoryStatement: "SELECT currency_code, currency_exchange_rate, time FROM sol_common_fx_history WHERE currency_code=? AND time=?",
    updateHistoryStatement: "UPDATE sol_common_fx_history SET currency_exchange_rate=? WHERE currency_code=? AND time=?",
    insertHistoryStatement: "INSERT INTO sol_common_fx_history (currency_code, currency_exchange_rate, time, base_currency_code) VALUES ( ?, ?, ?, ?)",
    selectByDateAndCodeStatement: "SELECT currency_exchange_rate, time FROM sol_common_fx_history WHERE currency_code=? AND time >=? AND time <=? ORDER BY time",
    selectOldestEntryByCodeStatement: "SELECT currency_exchange_rate, time FROM sol_common_fx_history WHERE currency_code=? AND time=(SELECT MIN(time) FROM sol_common_fx_history WHERE currency_code=?)",
    selectYoungestBaseCurrencyEntryStatement: "SELECT time FROM sol_common_fx_history WHERE currency_code=? AND time=(SELECT MAX(time) FROM sol_common_fx_history WHERE currency_code =?)"
  },

  /**
   * Loads the exchange rates from an external service.
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

    me.fxConfig = sol.create("sol.common.Config", { compose: "/common_fx/Configuration/fx.config" }).config;
    
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
      if (!me.historicDataFilled(time)) {
        try {
          me.fillHistoricData(me.configuration.serviceUrlHistory);
        } catch (e) {
          me.logger.warn("Error writing historical exchange rates", e);
        }
      }
      sol.common_fx.ix.FxUtils.updateExchangeRates(currencies, time);
      try {
        sol.common_fx.ix.FxUtils.recordExchangeRateHistory(currencies, time, true);
      } catch (error) {
        me.logger.warn("Error writing historical exchange rates", error);
      }
    }

    return currencies;
  },
  /**
   * @private
   * checks data count and latest entry in history table
   * @param {String} isoDateStr 
   * @returns {Boolean} 
   */
  historicDataFilled: function (isoDateStr) {
    var me = this, result = true;
    try {
      result = me.historyTableHasEntries();
      if (result === false) {
        return result;
      }
      result = me.latestHistoryDateIsCurrent(isoDateStr);
      if (result === false) {
        return result;
      }
    } catch (error) {
      me.logger.warn("Error reading historical exchange rate", error);
    }
    return result;
  },

  /**
   * checks if the history table has entries
   * @returns {Boolean}
   */
  historyTableHasEntries: function () {
    var me = this, dbConnection, count;
    dbConnection = new Packages.de.elo.ix.jscript.DBConnection();
    count = dbConnection.query(me.configuration.selectHistoryCountStatement);
    return !(!count || count.length < 1 || count[0][0] < 1);
  },
  /**
   * @private
   * checks if latest date for the base currency 
   * in the history table is older than the
   * two days before the given isodate string
   * @param {String} isoDateStr 
   * @returns {Boolean}
   */
  latestHistoryDateIsCurrent: function (isoDateStr) {
    var me = this, isoDateTimeFormat, fxConfig, localCurrency, dbConnection, ret, youngestISOString, dailyIso, twoDaysAgo;
    
    isoDateTimeFormat = me.configuration.isoDateTimeFormat || "YYYYMMDDHHmmss";

    if (!isoDateStr || !sol.common.DateUtils.parse(isoDateStr, isoDateTimeFormat)) {
      throw "ISO String is missing or has an unexpected format";
    }

    fxConfig = me.fxConfig || sol.create("sol.common.Config", { compose: "/common_fx/Configuration/fx.config" }).config;
    localCurrency = fxConfig.localCurrency || "EUR";
    dbConnection = new Packages.de.elo.ix.jscript.DBConnection();

    ret = dbConnection.query(me.configuration.selectYoungestBaseCurrencyEntryStatement, [localCurrency, localCurrency]);
    
    if (!ret || ret.length < 1) {
      throw "Could not determine latest timestamp for base currency";
    }

    youngestISOString = String(ret[0][0]);

    if (!sol.common.DateUtils.parse(youngestISOString, isoDateTimeFormat)) {
      throw "ISO string is not correctly formatted";
    }

    dailyIso = sol.common.DateUtils.isoToMoment(isoDateStr, { startOfDay: true });
    twoDaysAgo = dailyIso.clone().subtract("2", "days").format(isoDateTimeFormat);
    return !(sol.common.DateUtils.parse(twoDaysAgo, isoDateTimeFormat) && (youngestISOString < twoDaysAgo));
  },
  /**
   * @private
   * requests and parses an xml file containing historical 
   * foreign exchange rates
   * and writes these entries to the history table
   * @param {String} serviceUrl 
   */
  fillHistoricData: function (serviceUrl) {
    var me = this, response, xmlDoc, documentBuilder, xmlRates,
        sdf = new Packages.java.text.SimpleDateFormat(me.configuration.timeFormat),
        historicData = {}, i, time, xmlRate, code, rate, dbConnection;
    
    
    dbConnection = new Packages.de.elo.ix.jscript.DBConnection();
    dbConnection.update(me.configuration.truncateHistoryTable);
    
    response = me.getExchangeRates(serviceUrl);
    documentBuilder = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance().newDocumentBuilder();
    xmlDoc = documentBuilder.parse(new Packages.org.xml.sax.InputSource(new java.io.StringReader(response)));

    xmlRates = xmlDoc.getElementsByTagName("Cube");

    for (i = 0; i < xmlRates.length; i++) {
      xmlRate = xmlRates.item(i);
      time = xmlRate.parentNode.getAttribute("time") + "";
      if (time) {
        time = sdf.parse(time);
        time = ixConnect.dateToIso(time) + "";

        if (!historicData[time]) {
          historicData[time] = {
            EUR: 1
          };
        }

        code = xmlRate.getAttribute("currency");
        rate = xmlRate.getAttribute("rate");

        historicData[time][code] = rate;
      }
    }

    Object.keys(historicData).map(function (key, index) {
      var currencies = me.convertLocalCurrency(historicData[key]);
      sol.common_fx.ix.FxUtils.recordExchangeRateHistory(currencies, key, false);
    });

  },

  /**
   * Converts the currencies to another local currency
   * @param {Object} currencies Currencies
   * @return {Object} Converted currencies
   */
  convertLocalCurrency: function (currencies) {
    var me = this, fxConfig, currency, localCurrencyRate, localCurrency, localCurrencyDecimalRate,
        rate, rateDecimal, newRateDecimal, newRate, precision;

    fxConfig = me.fxConfig || sol.create("sol.common.Config", { compose: "/common_fx/Configuration/fx.config" }).config;

    localCurrency = fxConfig.localCurrency || "EUR";
    precision = fxConfig.precision || 6;

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
   * Retrieves the exchange rates from an external service.
   * @param {String} url The service URL
   * @return {String} The service response
   */
  getExchangeRates: function (url) {
    var me = this, responseObj,
        fxConfig, proxyHost, proxyPort;

    fxConfig = me.fxConfig || sol.create("sol.common.Config", { compose: "/common_fx/Configuration/fx.config" }).config;

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

    dbConnection = new Packages.de.elo.ix.jscript.DBConnection();
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

    dbConnection = new Packages.de.elo.ix.jscript.DBConnection();
    ret = dbConnection.query(me.configuration.selectStatement, [currencyCode]);

    if (!ret || ret.length < 1) {
      throw "no exchange rate found for '" + currencyCode + "'";
    }

    return parseFloat(ret[0][1]);
  },
  /**
   * @private
   * Records exchange rates to the history table in the database.
   * @param {Object} currencies Currencies
   * @param {String} time Time
   * @param {Boolean} checkExisting checkExisting
   */
  recordExchangeRateHistory: function (currencies, time, checkExisting) {
    var me = this, sortResults;
    sortResults = me.sortExchangeRateEntries(currencies, time, checkExisting);
    me.addExchangeRateHistory(sortResults.newEntries);
    me.updateExchangeRateHistory(sortResults.existingEntries);
  },
  /**
   * @private
   * Sorts exchange rates into new entries and
   * existing entries with rates that need updating.
   * @param {Object} currencies Currencies
   * @param {String} time Time
   * @param {Boolean} checkExisting checkExisting
   * @returns {Object} result
   */
  sortExchangeRateEntries: function (currencies, time, checkExisting) {
    var me = this,
        rows = [], result,
        currency, dbConnection, args, ret, startOfDay, fxConfig, localCurrency, currencyCodes;

    fxConfig = me.fxConfig || sol.create("sol.common.Config", { compose: "/common_fx/Configuration/fx.config" }).config;

    localCurrency = fxConfig.localCurrency || "EUR";
    startOfDay = sol.common.DateUtils.isoToMoment(time, { startOfDay: true });
    time = sol.common.DateUtils.dateToIso(startOfDay);

    currencyCodes = me.collectCurrentCurrencyCodes();

    for (currency in currencies) {
      if (currencyCodes.indexOf(currency) !== -1) {
        rows.push([currency, currencies[currency], time, localCurrency]);
      }
    }

    if ((typeof checkExisting !== "undefined") && (checkExisting === false)) {
      result = {};
      result.newEntries = rows;
      result.existingEntries = [];
    } else {
      
      dbConnection = new Packages.de.elo.ix.jscript.DBConnection();
      result = rows.reduce(function (collector, entry) {
        args = [entry[0], time];
        ret = dbConnection.query(me.configuration.selectHistoryStatement, args);
        if (!ret || ret.length < 1) {
          collector.newEntries.push(entry);
        } else {
          if (ret[0][1] !== entry[1]) {
            args.unshift(entry[1]);
            collector.existingEntries.push(args);
          }
        }
        return collector;
      }, { newEntries: [], existingEntries: [] });
    }
    return result;
  },
  /**
   * gets currency codes form sol_common_fx table
   * @returns {Array} result
   */
  collectCurrentCurrencyCodes: function () {
    var me = this, dbConnection, ret, result = [], i;
    dbConnection = new Packages.de.elo.ix.jscript.DBConnection();
    ret = dbConnection.query(me.configuration.selectCurrencyCodesStatement);
    if (!ret || ret.length < 1) {
      throw "No currency codes could be read from the database";
    }
    for (i = 0; i < ret.length; i++) {
      result.push(String(ret[i][0]));
    }
    return result;
  },
  /**
   * Inserts new entries into the history table
   * @param {Array} results results 
   */
  addExchangeRateHistory: function (results) {
    var me = this, dbConnection, rowCount;
    dbConnection = new Packages.de.elo.ix.jscript.DBConnection();
    if (!results || !results.length) {
      return;
    }
    rowCount = dbConnection.update(me.configuration.insertHistoryStatement, results);
    me.logger.debug(["inserted rows in history table: {0}", rowCount]);
  },
  /**
   * Updates existing entries into the history table
   * @param {Array} results results 
   */
  updateExchangeRateHistory: function (results) {
    var me = this, dbConnection, rowCount;
    dbConnection = new Packages.de.elo.ix.jscript.DBConnection();
    if (!results || !results.length) {
      return;
    }
    rowCount = dbConnection.update(me.configuration.updateHistoryStatement, results);
    me.logger.debug(["updated rows in history table: {0}", rowCount]);
  },
  /**
   * @private
   * Reads exchange rate by date and code from history table
   * @param {String} currencyCode currencyCode
   *  @param {String} isoDate isoDate, ELO iso date string
   * @returns {Object} object with or without exchange rate
   */
  getHistoricalExchangeRate: function (currencyCode, isoDate) {
    var me = this, result = {}, dates, firstEntryForCurrency, isoDateIsPriorToFirstEntry, isoDateIsInFuture;
    if (!currencyCode) {
      throw "no currency code defined";
    }

    dates = me.calcIsoDates(isoDate);

    if (!dates.isoDate) {
      throw "Error processing iso date";
    }

    isoDateIsInFuture = (dates.isoNow && (dates.isoDate > dates.isoNow));
    if (isoDateIsInFuture) {
      return result;
    }

    firstEntryForCurrency = me.getOldestEntryForCurrency(currencyCode);
    isoDateIsPriorToFirstEntry = (firstEntryForCurrency && firstEntryForCurrency.isoDate && dates.isoDate <= firstEntryForCurrency.isoDate);
    if (isoDateIsPriorToFirstEntry && firstEntryForCurrency.exchangeRate) {
      result.exchangeRate = firstEntryForCurrency.exchangeRate;
      return result;
    }

    result = me.queryHistoricalExchangeRateByPeriod(currencyCode, dates);
    return result;
  },
  /**
   * @private
   * Calculates ISO Date Strings
   * @param {String} isoDate isoDate, ELO iso date string
   * @returns {Object} dates
   */
  calcIsoDates: function (isoDate) {
    if (!isoDate) {
      throw "isoDate is missing";
    }
    var me = this, dates = {},
        isoDateTimeFormat = me.configuration.isoDateTimeFormat || "YYYYMMDDHHmmss",
        fxConfig = sol.create("sol.common.Config", { compose: "/common_fx/Configuration/fx.config" }).config,
        daysInPast = fxConfig.daysInPast || 7,
        daysInFuture = fxConfig.daysInFuture || 7,
        lowerTimeLimit, upperTimeLimit, startOfDay;

    if (!sol.common.DateUtils.parse(isoDate, isoDateTimeFormat)) {
      throw "isoDate is not correctly formatted";
    }

    startOfDay = sol.common.DateUtils.isoToMoment(isoDate, { startOfDay: true });
    dates.isoDate = sol.common.DateUtils.dateToIso(startOfDay);

    lowerTimeLimit = startOfDay.clone().subtract(daysInPast, "days");
    dates.isoLowerTimeLimit = sol.common.DateUtils.dateToIso(lowerTimeLimit);

    upperTimeLimit = startOfDay.clone().add(daysInFuture, "days");
    dates.isoUpperTimeLimit = sol.common.DateUtils.dateToIso(upperTimeLimit);

    dates.isoNow = sol.common.DateUtils.nowIso({ startOfDay: true });

    return dates;

  },
  /**
   * selects row in historical database by currency code
   * and minimum isodate
   * @param {String} currencyCode currencyCode
   * @returns {Object} result
   */
  getOldestEntryForCurrency: function (currencyCode) {
    var me = this, dbConnection, ret, result = {};
    if (!currencyCode) {
      throw "no currency code defined";
    }
    dbConnection = new Packages.de.elo.ix.jscript.DBConnection();
    ret = dbConnection.query(me.configuration.selectOldestEntryByCodeStatement, [currencyCode, currencyCode]);


    if (!ret || ret.length < 1) {
      return result;
    }
    result.exchangeRate = parseFloat(ret[0][0]);
    result.isoDate = String(ret[0][1]);
    return result;
  },
  /**
   * Checks history table for currency by code and date
   * within a configurable time frame
   * @param {String} currencyCode
   * @param {Object} dates
   * @params {String} dates.isoDate, ELO iso date string
   * @params {String} dates.isoLowerTimeLimit, ELO iso date string
   * @params {String} dates.isoUpperTimeLimit, ELO iso date string
   *
   * @returns {Object} result
   */
  queryHistoricalExchangeRateByPeriod: function (currencyCode, dates) {
    var me = this, dbConnection, ret, result = {};
    dates = dates || {};
    if (!currencyCode) {
      throw "No currency code defined";
    }
    if (!dates.isoDate || !dates.isoLowerTimeLimit || !dates.isoUpperTimeLimit) {
      throw "Missing time configuration";
    }
    dbConnection = new Packages.de.elo.ix.jscript.DBConnection();
    ret = dbConnection.query(me.configuration.selectByDateAndCodeStatement + " DESC", [currencyCode, dates.isoLowerTimeLimit, dates.isoDate]);
    if (!ret || ret.length < 1) {
      ret = dbConnection.query(me.configuration.selectByDateAndCodeStatement, [currencyCode, dates.isoDate, dates.isoUpperTimeLimit]);
      if (!ret || ret.length < 1) {
        return result;
      }

    }
    result.exchangeRate = parseFloat(ret[0][0]);
    return result;
  },

  /**
   * gets exchange rate from history table if available
   * Otherwise the current rate is returned
   * @param {String} currencyCode currency code
   * @param {String} isoDate ELO iso date string
   * @returns {Object}  result object with or without exchange rate
   */
  getExchangeRateByCodeAndDate: function (currencyCode, isoDate) {
    var me = this, result, errorMsg;

    try {
      result = me.getHistoricalExchangeRate(currencyCode, isoDate);
    } catch (e) {
      errorMsg = e;
      me.logger.warn("Error reading historical exchange rate", errorMsg);
    }

    result = result || {};

    if (!result.hasOwnProperty("exchangeRate")) {
      try {
        result.exchangeRate = me.getExchangeRateForCurrency(currencyCode);
      } catch (e) {
        errorMsg = e;
        me.logger.warn("Error reading daily exchange rate", errorMsg);
      }
    }
    return result;
  }
});