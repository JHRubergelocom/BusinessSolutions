
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_decimal-light.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common_fx.ix.FxUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.common_fx.ix.services.ForeignExchangeRates" });

/**
 * @class sol.common_fx.ix.services.ForeignExchangeRates
 * @extends sol.common.ix.FunctionBase
 * Functions for loading exchange rates or convert amounts.
 *
 * # Load exchange rates
 * Loads the exchange rates from an external service and updates the database if persist is true.
 *
 *     sol.common.IxUtils.execute('RF_sol_common_fx_service_LoadExchangeRates', {
 *       persist: true
 *     });
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
 * # Convert currencies
 * Converts an amount from one currency to another.
 * 'to' parameter is optional, if it's empty, the base currency will be used.
 *
 *     sol.common.IxUtils.execute('RF_sol_common_fx_service_ConvertCurrencies', {
 *       amount: "47.11",
 *       from: "USD",
 *       to: "GBP"
 *     });
 *
 * Result object:
 *
 *     {
 *       amount: "47.11",
 *       from: "USD",
 *       to: "GBP",
 *       result: "30.0719"
 *     }
 * 
 * # Get exchange rate by code and date
 * Gets historical exchange rate from database. Searches for the closest date in the past, 
 * followed by the nearest date in the future or returns current date if none is found
 * 
 *
 *     sol.common.IxUtils.execute('RF_sol_common_fx_service_getExchangeRateByCodeAndDate', {
 *       currencyCode: "AUD",
 *       isoDate: "20220118000000"
 *     });
 * 
 * Result object:
 *
 *     {
 *       exchangeRate: 1.5811
 *     }
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common_fx.ix.FxUtils
 *
 */

/**
 * @member sol.common_fx.ix.services.ForeignExchangeRates
 * @method RF_sol_common_fx_service_LoadExchangeRates
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_common_fx_service_LoadExchangeRates(ec, jsonParams) {
  logger.enter("RF_sol_common_fx_service_LoadExchangeRates", jsonParams);
  var params, result, errorMsg;

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, jsonParams, "persist");

  logger.info("load exchange rates");

  try {
    result = sol.common_fx.ix.FxUtils.loadExchangeRates(params.persist);
  } catch (e) {
    errorMsg = "error loading exchange rates: " + e;
    logger.warn(errorMsg);
    result = result || {};
    result.error = errorMsg;
  }
  result = sol.common.ix.RfUtils.stringify(result);
  logger.exit("RF_sol_common_fx_service_LoadExchangeRates", result);
  return result;
}

/**
 * @member sol.common_fx.ix.services.ForeignExchangeRates
 * @method RF_sol_common_fx_service_ConvertCurrencies
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_common_fx_service_ConvertCurrencies(ec, jsonParams) {
  logger.enter("RF_sol_common_fx_service_ConvertCurrencies", jsonParams);

  var result = {},
      params, errorMsg;

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, jsonParams, "amount", "from");

  logger.info("convert amount");

  try {
    result = sol.common_fx.ix.FxUtils.convertAmount(params.amount, params.from, params.to);
  } catch (e) {
    errorMsg = "error converting amount: " + e;
    logger.error(errorMsg);
    result = result || {};
    result.error = errorMsg;
  }
  result = sol.common.ix.RfUtils.stringify(result);
  logger.exit("RF_sol_common_fx_service_ConvertCurrencies", result);
  return result;
}

/**
 * @member sol.common_fx.ix.services.ForeignExchangeRates
 * @method RF_sol_common_fx_service_getExchangeRateByCodeAndDate
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_common_fx_service_getExchangeRateByCodeAndDate(ec, jsonParams) {
  logger.enter("RF_sol_common_fx_service_getExchangeRateByCodeAndDate", jsonParams);
  var params, result, errorMsg;

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, jsonParams, "currencyCode", "isoDate");

  logger.info("finding historical exchange rate");

  try {
    result = sol.common_fx.ix.FxUtils.getExchangeRateByCodeAndDate(params.currencyCode, params.isoDate);
  } catch (e) {
    errorMsg = "error finding historical exchange rate: " + e;
    logger.warn(errorMsg);
    result = result || {};
    result.error = errorMsg;
  }
  result = sol.common.ix.RfUtils.stringify(result);
  logger.exit("RF_sol_common_fx_service_getExchangeRateByCodeAndDate", result);
  return result;
}