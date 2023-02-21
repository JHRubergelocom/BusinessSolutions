
//@include lib_Class.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js

/**
 * Keyword list iterator used by dynamic keyword lists. This class provides an abstract layer that simplifies the usage
 * of localized keyword lists.
 *
 * The list is returned as a table.
 *
 * |Key|Value|Content|
 * |:-----|:------|:------|
 * |I|incoming|I - incoming|
 * |O|outgoing|O - outgoing|
 *
 * # Example implementation
 *
 *     //(at)config config /Administration/Business Solutions/contract/Configuration/localizedKwls.config
 *     sol.define("sol.contract.ix.localizedKwl.Relation", {
 *       extend: "sol.common.ix.LocalizedKwlIterator",
 *       kwlName: "relation",
 *       initialize: function() {
 *         var me = this;
 *         me.$super("sol.common.ix.LocalizedKwlIterator", "initialize", [config[me.kwlName]]);
 *       }
 *     });
 *
 *     function getDataIterator() {
 *       var iterator = sol.create("sol.contract.ix.localizedKwl.Relation", {});
 *       return new DynamicKeywordDataProvider(iterator);
 *     }
 *
 * # Sample configuration:
 *
 *     {
 *       "translate": true,
 *       "tableTitle": "sol.contract.localizedKwl.relation.tableTitle",
 *       "columnHeaders": ["sol.contract.localizedKwl.relation.header.key", "sol.contract.localizedKwl.relation.header.value"],
 *         "entries": [{
 *           "key": "O",
 *           "value": "sol.contract.localizedKwl.relation.entry.outgoing"
 *         }, {
 *           "key": "I",
 *           "value": "sol.contract.localizedKwl.relation.entry.incoming"
 *        }]
 *     }
 *
 * @eloix
 * @requires sol.Logger
 */
sol.define("sol.common.ix.LocalizedKwlIterator", {

  /**
   * @cfg {Boolean} translate
   * If true, the given strings will be interpreted as locale keys and will be translated by the ELOix
   * Default is true.
   */

  /**
   * @cfg {String} language
   * Language
   */

  /**
   * @cfg {String} tableTitle
   * Title of the selection table, shown in the ELO Java Client
   */

  /**
   * @cfg {Array} columnHeaders
   * Array of strings with the column headers
   */

  /**
   * @cfg {Array} entries
   * Array of objects that contains objects with a key and a value property
   */

  /**
   * @cfg {Boolean} blankLine
   * Inserts a blank line at the beginning of the keyword list
   */

  /**
   * @cfg {String} separatorString
   * String that is displayed between the key and the value
   */

  initialize: function (config) {
    var me = this;
    me.reInitialize(config);
    me.errorMessage = "";
  },

  reInitialize: function (config) {
    var me = this;
    me.terms = sol.common.TranslateTerms;

    me.log = sol.create("sol.Logger", { scope: me.$className || "sol.common.ix.LocalizedKwlIterator" });
    me.log.enter("initialize", config);

    me.config = config;

    if (!me.config) {
      throw "Configuration is empty";
    }

    if (!me.config.tableTitle) {
      throw "Property 'config.tableTitle' is empty";
    }

    if (!me.config.columnHeaders) {
      throw "Property 'config.columnHeaders' is empty";
    }

    if (!me.config.entries) {
      throw "Keyword list entries are empty";
    }

    // set caching variables
    me.localizationKeys = [];
    me.tableTitles = {};
    me.tableHeaders = {};
    me.tables = {};

    me.translate = (me.config.translate != false) ? true : false;

    if (me.translate) {

      me.localizationKeys = [config.tableTitle];

      me.config.columnHeaders.forEach(function (tableHeaderKey) {
        me.localizationKeys.push(tableHeaderKey);
      });

      me.config.entries.forEach(function (entry) {
        me.localizationKeys.push(entry.value);
      });

      me.separatorString = me.config.separatorString || " - ";
      
      if (me.foreignFilterKey) {
        me.localizationKeys.push(config.foreignKeyNoValue);
      }

      me.terms.require(me.localizationKeys);
    }

    me.log.exit("initialize");
  },

  useForeignConfig: function (filterKeyValue) {
    var me = this, foreignConfig;
    filterKeyValue = sol.common.ObjectUtils.type(filterKeyValue) === "string" ? String(filterKeyValue) : undefined;
    if (filterKeyValue && filterKeyValue !== "undefined") {
      filterKeyValue = (filterKeyValue.indexOf(me.separatorString) > -1) ? filterKeyValue.slice(0, filterKeyValue.indexOf(me.separatorString)) : filterKeyValue;
      foreignConfig = sol.common.ObjectUtils.getProp(typeof me.config === "object" ? me.config.entries : {}, filterKeyValue + ".foreignConfig", "key");
      if (!foreignConfig) {
        throw "No config defined for value `" + filterKeyValue + "` in field `" + me.foreignFilterKey;
      }
      return foreignConfig || me.config;
    } else {
      me.errorMessage = me.config.foreignKeyNoValue;
      return me.config;
    }
  },

  /**
   * Opens a connection for the ELO Java Client and non map field capable clients.
   *
   * @param {de.elo.ix.client.IXServerEventsContext} ec Execution context
   * @param {de.elo.ix.client.Sord} sord Working version of the current sord object
   * @param {java.lang.String} fieldName Name of the currently focused field
   */
  open: function (ec, sord, fieldName) {
    var me = this,
        filterValue;
    me.foreignFilterKey && me.reInitialize(me.useForeignConfig(sol.common.SordUtils.getObjKeyValue(sord, me.foreignFilterKey)));
    fieldName = String(fieldName);
    me.log.enter("open", { fieldName: fieldName });
    me.prepareCache();
    filterValue = sol.common.SordUtils.getObjKeyValue(sord, fieldName);
    me.filterTable(filterValue);
    me._keyNames = ["$KEY", "$VALUE", fieldName];
    me.log.exit("open");
  },

  /**
   * Opens a connection for ELOwf forms and map field capable components
   *
   * @param {de.elo.ix.client.IXServerEventsContext} ec Execution context
   * @param {java.util.Map} map Map of all entries passed by the client
   * @param {java.lang.String} focusName name of the currently focused field
   */
  openMap: function (ec, map, focusName) {
    var me = this,
        filterValue = "";
    me.foreignFilterKey && me.reInitialize(me.useForeignConfig(map[me.foreignFilterKey]));
    focusName = String(focusName);
    me.log.enter("openMap", { focusName: focusName });
    me.prepareCache();
    if (map && focusName && map[focusName]) {
      filterValue = String(map[focusName]);
    }
    me.filterTable(filterValue);
    me._keyNames = ["$KEY", "$VALUE", focusName];
    me.log.exit("openMap");
  },

  /**
   * Prepares the cache variables for the given language
   */
  prepareCache: function () {
    var me = this;
    me.language = me.config.language || ixConnect.loginResult.clientInfo.language;

    me.index = 0;

    if (me.tables[me.language]) {
      return;
    }

    me.tableTitles[me.language] = me.translate ? me.terms.getTerm(me.language, me.config.tableTitle) : me.config.tableTitle;

    me.tableHeaders[me.language] = me.config.columnHeaders.map(function (tableHeaderKey) {
      return me.translate ? me.terms.getTerm(me.language, tableHeaderKey) : tableHeaderKey;
    });
    me.tableHeaders[me.language].push(null);

    me.tables[me.language] = [];

    if (me.config.blankLine) {
      me.tables[me.language].push([" ", " ", ""]);
    }

    me.config.entries.forEach(function (entry) {
      var localizedValue = me.translate ? sol.common.TranslateTerms.getTerm(me.language, entry.value) : entry.value;
      me.tables[me.language].push([entry.key, localizedValue, entry.key + me.separatorString + localizedValue]);
    });
  },

  /**
   * Filters the table
   *
   * @param {String} filterValue Filter value
   */
  filterTable: function (filterValue) {
    var me = this,
        i;

    if (sol.common.StringUtils.isBlank(filterValue)) {
      me.filteredTable = me.tables[me.language];
      return;
    }

    filterValue = String(filterValue).trim().toLowerCase();
    if ((filterValue.indexOf(me.separatorString) > -1)) {
      me.filteredTable = me.tables[me.language];
      return;
    }

    me.filteredTable = [];
    // Search in keys
    for (i = 0; i < me.tables[me.language].length; i++) {
      if (String(me.tables[me.language][i][0]).toLowerCase() == filterValue) {
        me.filteredTable.push(me.tables[me.language][i]);
        break;
      }
    }
    if (me.filteredTable.length == 0) {
      // Search in values
      for (i = 0; i < me.tables[me.language].length; i++) {
        if (String(me.tables[me.language][i][1]).toLowerCase().indexOf(filterValue) > -1) {
          me.filteredTable.push(me.tables[me.language][i]);
        }
      }
    }
  },

  /**
   * Returns the next row of the table.
   *
   * @return {java.lang.String[]} table row
   */
  getNextRow: function () {
    var me = this;
    return me.filteredTable[me.index++];
  },

  /**
   * Returns the header of this table that can be displayed by the clients.
   *
   * @return {java.lang.String[]} table header
   */
  getHeader: function () {
    var me = this;
    return me.tableHeaders[me.language];
  },

  /**
   * Returns the keys of this table that can be used in order to map
   * map or group fields with columns.
   *
   * @return {java.lang.String[]} table keys
   */
  getKeyNames: function () {
    var me = this;
    return me._keyNames;
  },

  /**
   * Returns true if table has more rows.
   *
   * @return {Boolean} has more rows
   */
  hasMoreRows: function () {
    var me = this;
    return (this.index < (me.filteredTable.length));
  },

  /**
   * Returns the error message that should be displayed by the client
   * instead of the table data.
   *
   * @return {String} Error message
   */
  getMessage: function () {
    var me = this;
    return me.errorMessage;
  },

  /**
   * Returns a title for this table used by the user interface.
   *
   * @return {String} Title
   */
  getTitle: function () {
    var me = this;
    return me.tableTitles[me.language];
  }
});
