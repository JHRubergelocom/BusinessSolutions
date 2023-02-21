importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.KwlDataCollector" });

/**
 * Collects dynamic keyword list and/or keyword list entries
 * and delivers the data as compact JSON objects
 * e.g. for dashboards
 *
 * # Example
 *
 *     var result = sol.common.IxUtils.execute("RF_sol_common_services_KwlDataCollector", {
 *       kwlConfig: [
 *         {
 *           id: "INVOICE_STATUS"
 *         }
 *       ],
 *       dynKwlConfig: [
 *         {
 *           scriptName: "sol.invoice.ix.dynkwl.Currency",
 *           focusFieldName: "INVOICE_CURRENCY_CODE",
 *           keyFieldName: "INVOICE_CURRENCY_CODE",
 *           valueFieldName: "IX_MAP_INVOICE_CURRENCY_SYMBOL"
 *         }
 *       ]
 *     });
 *
 * # Result
 *
 *     {
 *       "version": "1",
 *       "kwls": {
 *         "INVOICE_STATUS": {
 *           "formatter": "sol.common.ix.services.KwlDataCollector.FlatKwl",
 *           "values": ["1 Erfassung",
 *           "2 Formelle Prüfung",
 *           "3 Fachliche Prüfung"]
 *         }
 *       },
 *       "dynKwls": {
 *         "sol.invoice.ix.dynkwl.Currency": {
 *           "formatter": "sol.common.ix.services.KwlDataCollector.SimpleKeyMapDynKwl",
 *           "values": {
 *             "EUR": "€",
 *             "USD": "$",
 *           }
 *         }
 *       }
 *     }
 *
 * # Example for a localized keyword list
 *
 *     result = sol.common.IxUtils.execute("RF_sol_common_services_KwlDataCollector", {
 *       dynKwlConfig: [
 *         {
 *           scriptName: "sol.contract.ix.localizedKwl.Status",
 *           focusFieldName: "CONTRACT_STATUS",
 *           keyFieldName: "$KEY",
 *           valueFieldName: "$VALUE"
 *          }
 *     });
 *
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.KwlDataCollector", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.ec = config.ec;

    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.kwlConfig = config.kwlConfig;
    me.dynKwlConfig = config.dynKwlConfig;

    me.data = {
      version: "1.00.000"
    };
  },

  /**
   * Starts the collection of the desired data
   * @return {String}
   */
  execute: function () {
    var me = this;
    me.rfUtils = sol.common.ix.RfUtils;

    if (me.kwlConfig) {
      me.addKeywordListData();
    }
    if (me.dynKwlConfig) {
      me.addDynKeywordListData();
    }

    return me.rfUtils.stringify(me.data);
  },


  /**
   * @private
   */
  addKeywordListData: function () {
    var me = this,
        kwl;
    me.data.kwls = {};
    me.kwlConfig.forEach(function (config) {
      kwl = sol.create("sol.common.ix.services.KwlDataCollector.FlatKwl", {
        data: "",
        config: config
      });
      me.data.kwls[config.id] = kwl.build();
    });
  },


  /**
   * @private
   */
  addDynKeywordListData: function () {
    var me = this,
        dynKwl;
    me.data.dynKwls = {};
    me.dynKwlConfig.forEach(function (config) {
      var propertyName = config.scriptName;
      dynKwl = sol.create("sol.common.ix.services.KwlDataCollector.SimpleKeyMapDynKwl", {
        data: "",
        config: config
      });
      if (config.foreignKeyValue) {
        propertyName += ("_" + config.foreignKeyValue);
      }
      me.data.dynKwls[propertyName] = dynKwl.build();
    });
  }
});

/**
 * @private
 * Retrieves data which is provided by keyword list
 *
 * @author Michael Weiler, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @elojc
 * @eloas
 */
sol.define("sol.common.ix.services.KwlDataCollector.BaseKwl", {

  /**
   * @cfg {String} scriptName
   * Script name of the dynamic keyword list
   */

  /**
   * @cfg {String} formatter
   * Class name of the task formatter
   */

  /**
   * @private
   * Retrieves data from a dynamic keyword list by the ELO index server
   */
  getValues: function () {
    var me = this,
        rootKeyword;
    me.result = {
      formatter: me.config.formatter
    };

    me.keywordLists = {};

    rootKeyword = ixConnect.ix().checkoutKeywords([me.config.id], KeywordC.mbEdit, -1, LockC.NO)[0];
    if (rootKeyword) {
      me.processChildren(rootKeyword, me.keywordLists, rootKeyword.id);
    }
  },

  /**
   * @private
   * @param {de.elo.ix.client.Keyword} keyword
   * @param {Object} parentDataRef
   * @param {String} keywordName
   */
  processChildren: function (keyword, parentDataRef, keywordName) {
    var me = this,
        dataRef;
    parentDataRef[String(keywordName)] = {};
    dataRef = parentDataRef[keywordName];
    if (keyword.children) {
      keyword.children.forEach(function (word) {
        me.processChildren(word, dataRef, word.text);
      });
    }
  }
});


/**
 * @private
 * Formats the result of a dynamic keyword list processing to
 * a simple key-value list
 *
 * @author Michael Weiler, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @elojc
 * @eloas
 *
 * # Sample result
 *
 *    "kwls": {
 *      "INVOICE_STATUS": {
 *        "formatter": "sol.common.ix.services.JsonDataCollector.FlatKwl",
 *        "values": ["1 Erfassung",
 *          "2 Formelle Prüfung",
 *          "3 Fachliche Prüfung]
 *        }
 *     }
 */
sol.define("sol.common.ix.services.KwlDataCollector.FlatKwl", {

  extend: "sol.common.ix.services.KwlDataCollector.BaseKwl",

  /**
   * @cfg {Array} keyFieldName
   * Name of the field that should be used as key.
   */

  /**
   * @cfg {Array} valueFieldName
   * Name of the field that should be used as value.
   */

  /**
   * @private
   * @return {Object} result
   */
  build: function () {
    var me = this,
        listKey, listObj, entryKey;
    me.getValues();

    for (listKey in me.keywordLists) {
      me.result.values = [];
      listObj = me.keywordLists[listKey];
      for (entryKey in listObj) {
        me.result.values.push(entryKey);
      }
      break;
    }

    return me.result;
  }
});


/**
 * @private
 * Retrieves data which is provided by dynamic keyword list
 *
 * @author Michael Weiler, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @elojc
 * @eloas
 */
sol.define("sol.common.ix.services.KwlDataCollector.BaseDynKwl", {

  /**
   * @cfg {String} scriptName
   * Script name of the dynamic keyword list
   */

  /**
   * @cfg {String} formatter
   * Class name of the task formatter
   */

  /**
   * @private
   * Retrieves data from a dynamic keyword list by the ELO index server
   */
  getValues: function () {
    var me = this,
        keywordsDynamicInfo, keywordsDynamicResult, linesIterator;
    me.result = {
      formatter: me.config.formatter,
      values: {}
    };

    keywordsDynamicInfo = new KeywordsDynamicInfo();
    keywordsDynamicInfo.mapScriptName = me.config.scriptName;
    keywordsDynamicInfo.mapLineFocus = me.config.focusFieldName;
    keywordsDynamicInfo.mapData = {};
    if (me.config.foreignKey && me.config.foreignKeyValue) {
      keywordsDynamicInfo.mapData[me.config.foreignKey] = me.config.foreignKeyValue;
    }
    keywordsDynamicResult = ixConnect.ix().checkoutKeywordsDynamic(keywordsDynamicInfo);
    me.keyNames = me.listToJsArray(keywordsDynamicResult.keyNames);
    me.lines = [];
    linesIterator = keywordsDynamicResult.table.iterator();
    while (linesIterator.hasNext()) {
      me.lines.push(me.listToJsArray(linesIterator.next()));
    }
  },

  /**
   * @private
   * Converts a Java list to a JavaScript array
   * @param {java.util.List} list
   * @return {Array}
   */
  listToJsArray: function (list) {
    var arr = [],
        iterator = list.iterator();
    while (iterator.hasNext()) {
      arr.push(String(iterator.next()));
    }
    return arr;
  }
});


/**
 * @private
 *
 * Formats the result of a dynamic keyword list processing to
 * a simple key-value list
 *
 * @author Michael Weiler, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @elojc
 * @eloas
 *
 * # Sample result
 *
 *    "dynKwls": {
 *      "sol.invoice.ix.dynkwl.Currency": {
 *        "formatter": "sol.common.ix.services.JsonDataCollector.SimpleKeyMapDynKwl",
 *        "values": {
 *          "EUR": "€",
 *          "USD": "$"
 *        }
 *      }
 *    }
 */
sol.define("sol.common.ix.services.KwlDataCollector.SimpleKeyMapDynKwl", {

  extend: "sol.common.ix.services.KwlDataCollector.BaseDynKwl",

  /**
   * @cfg {Array} keyFieldName
   * Name of the field that should be used as key.
   */

  /**
   * @cfg {Array} valueFieldName
   * Name of the field that should be used as value.
   */

  build: function () {
    var me = this,
        keyColumnIndex, valueColumnIndex, i, line, key, value;

    me.config = me.config || {};
    me.config.keyFieldName = me.config.keyFieldName || "$KEY";
    me.config.valueFieldName = me.config.valueFieldName || "$VALUE";

    me.getValues();

    keyColumnIndex = me.keyNames.indexOf(me.config.keyFieldName);
    valueColumnIndex = me.keyNames.indexOf(me.config.valueFieldName);
    me.result.orderedEntries = [];

    for (i = 0; i < me.lines.length; i++) {
      line = me.lines[i];

      key = line[keyColumnIndex];
      value = line[valueColumnIndex];

      me.result.values[key] = value;
      me.result.orderedEntries.push({ key: key, value: value });
    }
    return me.result;
  }
});

/**
 * @member sol.common.ix.services.KwlDataCollector
 * @method RF_sol_common_services_KwlDataCollector
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_services_KwlDataCollector(ec, configAny) {
  var rfUtils = sol.common.ix.RfUtils,
      config, jsonDataCollector, result;

  logger.enter("RF_sol_common_services_KwlDataCollector", configAny);

  config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);

  config.ec = ec;
  jsonDataCollector = sol.create("sol.common.ix.services.KwlDataCollector", config);
  result = jsonDataCollector.execute();

  logger.exit("RF_sol_common_services_KwlDataCollector", result);

  return result;
}