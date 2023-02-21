importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.Locale.js
//@include lib_sol.common.ix.DynKwlUtils.js

/**
 * @class sol.common.ix.DynKwlDatabaseIterator
 *
 * Database Iterator used by dynamic keyword lists.
 * This class provides an abstract layer that simplifies the usage of database connections.
 *
 * Dynamic keyword lists simplify the use of gathering data from external services.
 * This implementation helps in querying database tables. Each query is returned as a table
 * which contains a title and a specific table configuration.
 *
 * Queries are defined by sql statements that can contain placeholders ?.
 * Each placeholder must be defined in the sqlParams array. If no name is given, the given filter value will be used.
 * In case the field is empty, a message can be set, which is displayed by the client.
 * Thanks to a mode type filters can be applied in different ways.
 *
 *     {mode: 'STARTS_WITH'},
 *     {name: 'COMPANY_CODE', message: 'please select a company.'},
 *
 * Following modes are supported. Please mind that the modes ENDS_WITH and CONTAINS might lead to expansive queries.
 *
 *  - <b>STARTS_WITH</b>: String starts with the given value. e.g. COMPA%.
 *  - <b>ENDS_WITH</b>: String ends with the given value. e.g. %COMPA.
 *  - <b>CONTAINS</b>: String contains the given value. e.g. %COMPA%.
 *  - <b>No type name given</b>: String equals the given value. e.g. "COMPA".
 *
 *
 * # Localization
 *
 * SQL Queries can be localized by passing the locale key as a parameter. Therefore the valueType 'LANGUAGE' can be used.
 *
 *     sqlQuery: "select code, description from sol_invoice_trade_charge where language = ? order by description",
 *     sqlParams: [{ valueType: 'LANGUAGE' }],
 *
 *
 * # Examples
 *
 * Example implementation as instance
 *
 *     sol.create('sol.common.ix.DynKwlDatabaseIterator', {
 *       tableTitle: 'Company',
 *       sqlQuery: "select CODE, NAME, STREET, ZIPCODE, CITY, COUNTRY_CODE from sol_invoice_company where CODE like ? OR NAME like ?",
 *       sqlParams: [
 *         {mode: 'STARTS_WITH'},
 *         {mode: 'CONTAINS'}
 *       ],
 *       tableKeyNames: ["COMPANY_CODE", "COMPANY_NAME", null, null, null, null],
 *       tableHeaders: ["No.", "Name", "Street", "Zip", "City", "Country"]
 *     });
 *
 *
 * Example implementation as a custom class.
 *
 *     sol.define('sol.invoice.ix.dynkwl.Company', {
 *       extend: 'sol.common.ix.DynKwlDatabaseIterator',
 *       tableTitle: 'Company',
 *       sqlQuery: "select CODE, NAME, STREET, ZIPCODE, CITY, COUNTRY_CODE from sol_invoice_company where CODE like ? OR NAME like ?",
 *       sqlParams: [
 *         {mode: 'STARTS_WITH'},
 *         {mode: 'CONTAINS'}
 *       ],
 *       tableKeyNames: ["COMPANY_CODE", "COMPANY_NAME", null, null, null, null],
 *       tableHeaders: ["No.", "Name", "Street", "Zip", "City", "Country"]
 *     });
 *
 * Example usage in ix dynkwl-script:
 *
 *     function getDataIterator() {
 *       var iterator;
 *       try {
 *         iterator = sol.create('sol.invoice.ix.dynkwl.Company', {
 *           dbName: 'customers',
 *           jdbc: 'testconn'
 *         });
 *         return new DynamicKeywordDataProvider(iterator);
 *       } finally {
 *         log.info(")getDataIterator");
 *       }
 *     }
 *
 * @author NM, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 * @requires sol.common.StringUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.UserProfile
 * @requires sol.common.Locale
 * @requires sol.common.ix.DynKwlUtils
 */
sol.define("sol.common.ix.DynKwlDatabaseIterator", {
  mixins: ["sol.common.ix.DynKwlMixin"],

  /**
   * @cfg {string} tableTitle
   * name of this table. The title is displayed by the client.
   */
  tableTitle: undefined,
  /**
   * @cfg {string} sqlQuery (required)
   * sql-query that can contain placeholders ? used by prepared statements.
   *
   *     "select CODE, NAME, STREET, ZIPCODE, CITY, COUNTRY_CODE from sol_invoice_company where CODE like ? OR NAME like ?"
   */
  sqlQuery: undefined,
  /**
   * @cfg {Array} sqlParams (required)
   * fields that are used by the prepared statements. (Array of config options).
   *
   *     [{ name: 'IX_MAP_NUMBER', mode: 'STARTS', message: 'field x missing' }]
   *
   * if no name is provided current focused field is used.
   */
  sqlParams: undefined,
  /**
   * @cfg {Array} tableKeyNames (required)
   * mapping between columns and elo group or map fields. if null, value is not transferred.
   *
   *     // GRP field     map static field           map table field
   *     ['INVOICE_NO', 'IX_MAP_INVOICE_DUE_DATE', 'IX_MAP_ACCDESC{i}'];
   *
   * Map fields must contain IX_MAP as a prefix and can optionally use {i} as a counter value.
   */
  tableKeyNames: undefined,
  /**
   * @cfg {Array} tableHeaders (required)
   * column header names. if null column is hidden in the client.
   *
   *     ["No.", "Name", "Street", "Zip", "City", "Country"]
   */
  tableHeaders: undefined,
  /**
   * @cfg {string} dbName
   * JDBC: Database name for the jdbc connection. Should not be defined if table is part of the current archive database.
   */
  dbName: undefined,
  /**
   * @cfg {string} jdbc
   * JDBC: Name of the jdbc connection. Should not be defined if table is part of the current archive database.
   */
  jdbc: undefined,
  /**
   * @property
   * Error message that is passed to the client if value is missing.
   */
  errorMessage: "",

  initialize: function (config) {
    this.log = sol.create("sol.Logger", { scope: this.$className || "sol.common.ix.DynKwlDatabaseIterator" });
    this.log.enter("initialize", config);
    config = config || {};

    if ((!this.sqlQuery && !config.sqlQuery)
      || (!this.tableKeyNames && !config.tableKeyNames)
      || (!this.tableHeaders && !config.tableHeaders)) {
      this.log.error("Dynamic keyword list: sqlQuery, keyNameTemplate, header must be set.");
    }

    this.tableTitle = config.tableTitle || this.tableTitle;
    this.sqlQuery = config.sqlQuery || this.sqlQuery;
    this.sqlParams = config.sqlParams || this.sqlParams;
    this.tableKeyNames = config.tableKeyNames || this.tableKeyNames;
    this.tableHeaders = config.tableHeaders || this.tableHeaders;

    /* jdbc database settings. only pass if table is not part of the archive database */
    this.dbName = config.dbName || this.dbName;
    this.jdbc = config.jdbc || this.jdbc;

    this.errorMessage = "";
    this.log.exit("initialize");
  },

  /**
   * Opens a connection for the elo java client and non map field capable clients.
   *
   * @param {de.elo.ix.client.IXServerEventsContext} ec Events context
   * @param {Object} sord working version of the current sord object
   * @param {String} fieldName name of the currently focused field
   */
  open: function (ec, sord, fieldName) {
    var me = this,
        dbParams;
    me.log.enter("open", { sord: sord, fieldName: fieldName });
    me.ec = ec;

    me.initOpen(ec, sord, fieldName);

    if (!me.database) {
      me.database = me.openDbConnection();
    }

    me._keyNames = me.getTableKeyNames(fieldName);
    me.index = 0;

    dbParams = this.createDbParameterList(ec, fieldName, null, null, sord);

    me.resultSet = me.database.query(this.sqlQuery, dbParams);
    me.log.exit("open");
  },

  /**
   * Opens a connection for elo wf forms and map field capable components
   *
   * @param {de.elo.ix.client.IXServerEventsContext} ec Events context
   * @param {Object} map map of all entries passed by the client
   * @param {String} focusName name of the currently focused field
   */
  openMap: function (ec, map, focusName) {
    var me = this,
        fieldIndex, dbParams;

    me.log.enter("openMap", { focusName: focusName, map: map });
    me.ec = ec;

    me.initOpenMap(ec, map, focusName);

    if (!me.database) {
      me.database = me.openDbConnection();
    }

    fieldIndex = me.getIndexFromName(focusName);
    me._keyNames = me.getTableKeyNames(focusName).map(function (keyName) {
      return !!keyName ? ((fieldIndex != "") ? keyName.replace("{i}", fieldIndex) : keyName) : null;
    });

    me.index = 0;

    dbParams = this.createDbParameterList(ec, focusName, fieldIndex, map, null);

    me.resultSet = this.database.query(this.sqlQuery, dbParams);
    me.log.exit("openMap");
  },

  /**
   * Closes the connection for both map and non map capable clients.
   */
  close: function () {
    this.log.enter("close");
    this.database = null;
    this.log.exit("close");
  },

  /**
   * Returns the next row of the table.
   * @param {de.elo.ix.client.IXServerEventsContext} ec Events context
   * @return {String[]} table row
   */
  getNextRow: function () {
    var me = this,
        row;

    row = this.resultSet[this.index++];
    if (row) {
      me.prepareRow(row);
      row = row.map(function (value) {
        return value ? value : "";
      });
      return row;
    }
  },

  /**
   * Initializes the list for an `open` call
   *
   * @param {de.elo.ix.client.IXServerEventsContext} ec Events context
   * @param {Object} sord working version of the current sord object
   * @param {String} fieldName name of the currently focused field
   */
  initOpen: function (ec, sord, fieldName) {
  },

  /**
   * Initializes the list for an `openMap` call
   *
   * @param {de.elo.ix.client.IXServerEventsContext} ec Events context
   * @param {Object} map map of all entries passed by the client
   * @param {String} focusName name of the currently focused field
   */
  initOpenMap: function (ec, map, focusName) {
  },

  /**
   * Initializes the list
   * @param {Array} row Row
   */
  prepareRow: function (row) {
    var me = this;
    me.formatRow(row);
  },

  /**
   * Returns the header of this table that can be displayed by the clients.
   *
   * @return {String[]} table header
   */
  getHeader: function () {
    return this.tableHeaders;
  },

  /**
   * Returns the keys of this table that can be used in order to map
   * map or group fields with columns.
   *
   * @return {String[]} table keys
   */
  getKeyNames: function () {
    return this._keyNames;
  },

  /**
   * Returns true if table has more rows.
   *
   * @return {Boolean} has more rows
   */
  hasMoreRows: function () {
    return (this.index < (this.resultSet.length));
  },

  /**
   * Returns the error message that should be displayed by the client
   * instead of the table data.
   *
   * @return {String} error message
   */
  getMessage: function () {
    return this.errorMessage;
  },

  /**
   * Returns a title for this table used by the user interface.
   *
   * @return {String} title
   */
  getTitle: function () {
    return this.tableTitle || "Database query";
  },

  /**
   * Internal function that opens a database connection for map and non map
   * capable clients. Via default the archive database is used but can be changed
   * to a custom database connection if jdbc and dbName has been set.
   *
   * @returns {de.elo.ix.jscript.DBConnection} database connection
   */
  openDbConnection: function () {
    if (this.jdbc && this.dbName) {
      return new Packages.de.elo.ix.jscript.DBConnection(this.jdbc, this.dbName);
    } else if (this.jdbc) {
      return new Packages.de.elo.ix.jscript.DBConnection(this.jdbc);
    } else {
      return new Packages.de.elo.ix.jscript.DBConnection();
    }
  },

  /**
   * Internal function that utilizes the creation of database parameter lists used by
   * prepared statements.
   *
   * configuration as defined by sqlParams is used to identify fields and the query type.
   *
   * @param {Object} ec IX ScriptExecContext
   * @param {String} focusField currently focused field
   * @param {String} fieldIndex index field
   * @param {Object} map map of all entries passed by the client
   * @param {Object} sord working version of the current sord object
   * @returns {String[]} values for prepared statement
   */
  createDbParameterList: function (ec, focusField, fieldIndex, map, sord) {
    var me = this,
        list = [],
        i, param, fieldName, value;

    me.log.enter("createDbParameterList", { focusField: focusField, fieldIndex: fieldIndex, map: map, sord: sord });

    me.errorMessage = "";

    me.sqlParams = me.sqlParams || [];

    for (i = 0; i < me.sqlParams.length; i++) {
      param = me.sqlParams[i];
      fieldName = param.name || focusField;
      if (fieldIndex) {
        fieldName = String(fieldName).replace("{i}", fieldIndex);
      }

      if (param.value) {
        value = param.value;
      } else if (param.valueType) {
        switch (param.valueType) {
          case "LANGUAGE":
            value = ec.ci.language;
            break;
          default:
            value = "";
        }
      } else if (map) {
        // WF currently passes IX_GRP for group fields.
        // This must be fixed so SQL-Queries can be used in mixed mode.
        value = (map[fieldName] || map["IX_GRP_" + fieldName]) || "";
      } else {
        value = sol.common.SordUtils.getObjKeyValue(sord, fieldName) || "";
      }

      if (sol.common.StringUtils.isEmpty(value) && param.message) {
        me.errorMessage = param.message;
      }

      switch (param.mode) {
        case "STARTS_WITH":
          list.push(value + "%");
          break;
        case "CONTAINS":
          list.push("%" + value + "%");
          break;
        case "ENDS_WITH":
          list.push("%" + value);
          break;
        default:
          list.push(String(value));
      }
    }

    me.log.exit("createDbParameterList");
    return list;
  },

  getIndexFromName: function (name) {
    name = String(name);
    if (!name) {
      return "";
    }
    var pos = name.search(/\d+$/);
    if (pos > 0) {
      return name.substring(pos);
    }
    return "";
  },

  /**
   * @deprecated Use {@link sol.common.ix.DynKwlMixin#formatRow} instead
   * Formats decimal numbers
   * @param {Array} row Row
   * @param {Array} defs definitions
   * @param {String} defs[].params.columnNames Column names
   * @param {Array} defs[].params.columnIndexes Column indexes
   * @param {Number} params.decimalPlaces Decimal places
   */
  formatDecimals: function (row, defs) {
    var me = this,
        columnIndexes = [],
        i, j, def, columnNames, columnName, columnIndex, value;

    defs = defs || [];

    for (i = 0; i < defs.length; i++) {
      def = defs[i];
      def.groupingSeparator = (def.groupingSeparator == false) ? false : true;

      columnNames = def.columnNames || [];
      columnIndexes = def.columnIndexes || [];

      for (j = 0; j < columnNames.length; j++) {
        columnName = columnNames[j];
        columnIndex = me.tableKeyNames.indexOf(columnName);
        if (columnIndex > -1) {
          columnIndexes.push(columnIndex);
        }
      }

      for (j = 0; j < columnIndexes.length; j++) {
        columnIndex = columnIndexes[j];
        value = row[columnIndex] + "";
        if (value == "null") {
          value == "";
        } else {
          if (!me.locale) {
            me.locale = sol.create("sol.common.Locale", { ec: me.ec });
            me.locale.read();
          }
          value = me.locale.formatDecimal(value, def);
          row[columnIndex] = value;
        }
      }
    }
  }

});
