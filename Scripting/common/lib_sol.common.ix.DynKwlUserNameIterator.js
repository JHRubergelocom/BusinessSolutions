
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js

/**
 * Base class for a dynamic keyword list that provides user names and IDs
 *
 * The list of current fields is returned as a table.
 *
 * |ID|Name|
 * |:-----|:------|
 * |0|Administrator|
 * |1|Michael Jackson|
 * |2|Donald Duck|
 *
 * # Example implementation
 *
 * Following example shows the implementation of an iterator that returns user names and IDs:
 *
 *     // script: sol.common.ix.DynKwlUserNameIterator.js
 *     sol.define("sol.common.ix.dynkwl.UserNames", {
 *       extend: "sol.common.ix.DynKwlUserNameIterator",
 *       initialize: function (config) {
 *         var me = this;
 *         me.$super("sol.common.ix.DynKwlUserNameIterator", "initialize", [config]);
 *       }
 *     });
 *
 *     function getDataIterator () {
 *       var log = sol.create("sol.Logger", { scope: "sol.common.ix.DynKwlUserNameIterator" }),
 *           iterator;
 *       try {
 *         log.info("DynamicKeywordList (");
 *         iterator = sol.create("sol.common.ix.dynkwl.UserNames", {});
 *         return new DynamicKeywordDataProvider(iterator);
 *       } finally {
 *         log.info(")getDataIterator");
 *       }
 *     }
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloix
 *
 * @requires sol.common.SordUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.UserUtils
 */
sol.define("sol.common.ix.DynKwlUserNameIterator", {

  /**
   * @cfg {string} tableTitle
   * name of this table. The title is displayed by the client.
   */
  tableTitle: undefined,

  /**
   * @cfg {Array} tableHeaders (required)
   * column header names. if null column is hidden in the client.
   *
   *     ["Name", "Description"]
   */
  tableHeaders: undefined,

  /**
   * @property
   * @private
   * Error message that is passed to the client if value is missing.
   */
  errorMessage: "",

  /**
   * @cfg {String} userIdFieldName (optional)
   * Name of the user ID field. If this field name is not provided then it will be {{currentFieldName}} + _ID + {{index}}.
   */

  initialize: function (config) {
    var me = this,
        terms = sol.common.TranslateTerms;

    me.log = sol.create("sol.Logger", { scope: this.$className || "sol.common.ix.DynKwlUserNameIterator" });
    me.log.enter("initialize", config);
    config = config || {};

    terms.require("sol.common.dynkwl.userNames");

    me.tableTitle = config.tableTitle || me.tableTitle || terms.translate("sol.common.dynkwl.userNames.tableTitle");
    me.tableHeaders = config.tableHeaders || me.tableHeaders || [null, terms.translate("sol.common.dynkwl.userNames.header.name")];
    me.userIdFieldName = config.userIdFieldName;

    me.errorMessage = "";
    me.log.exit("initialize");
  },

  /**
   * Opens a connection for the elo java client and non map field capable clients.
   *
   * @param {de.elo.ix.client.IXServerEventsContext} ec
   * @param {de.elo.ix.client.Sord} sord Working version of the current sord object
   * @param {String} fieldName Name of the currently focused field
   */
  open: function (ec, sord, fieldName) {
    var me = this,
        value;
    me.log.enter("open", { sord: sord, fieldName: fieldName });

    value = sol.common.SordUtils.getObjKeyValue(sord, fieldName);
    me.buildKeyNames(fieldName);

    me.index = 0;
    me.resultSet = me.getUserTable(value);
    me.log.exit("open");
  },

  /**
   * Opens a connection for elo wf forms and map field capable components
   *
   * @param {de.elo.ix.client.IXServerEventsContext} ec
   * @param {java.util.HashMap} map Map of all entries passed by the client
   * @param {String} focusName Name of the currently focused field
   */
  openMap: function (ec, map, focusName) {
    var me = this,
        value;

    me.log.enter("openMap", { focusName: focusName, map: map });

    value = map[focusName];
    me.buildKeyNames(focusName);

    me.index = 0;
    me.resultSet = me.getUserTable(value);
    me.log.exit("openMap");
  },

  /**
   * Builds the table key names
   * @param {String} fieldName Field name
   */
  buildKeyNames: function (fieldName) {
    var me = this,
        userFieldName, fieldIndex;
    userFieldName = String(fieldName);
    fieldIndex = sol.common.StringUtils.getTrailingNumber(userFieldName) || "";
    if (!me.userIdFieldName) {
      me.userIdFieldName = sol.common.StringUtils.removeTrailingNumber(userFieldName) + "_ID" + fieldIndex;
    }
    me._keyNames = [me.userIdFieldName, userFieldName];
  },

  /**
   * Returns the next row of the table.
   *
   * @return {Array} table row
   */
  getNextRow: function () {
    var me = this,
        row;
    me.log.debug("getNextRow");
    row = me.resultSet[me.index++];
    return row;
  },

  /**
   * Returns the header of this table that can be displayed by the clients.
   *
   * @return {Array} table header
   */
  getHeader: function () {
    var me = this;
    me.log.debug("getHeader");
    return me.tableHeaders;
  },

  /**
   * Returns the keys of this table that can be used in order to map
   * map or group fields with columns.
   *
   * @return {Array} Table keys
   */
  getKeyNames: function () {
    var me = this;
    me.log.debug("getKeyNames");
    return me._keyNames;
  },

  /**
   * Returns true if table has more rows.
   *
   * @return {Boolean} Has more rows
   */
  hasMoreRows: function () {
    var me = this;
    me.log.debug("hasMoreRows");
    return (this.index < (this.resultSet.length));
  },

  /**
   * Returns the error message that should be displayed by the client
   * instead of the table data.
   *
   * @return {String} Error message
   */
  getMessage: function () {
    var me = this;
    me.log.debug("getMessage");
    return this.errorMessage;
  },

  /**
   * Returns a title for this table used by the user interface.
   *
   * @return {String} title
   */
  getTitle: function () {
    var me = this;
    me.log.debug("getTitle");
    return this.tableTitle;
  },

  /**
   * Returns the user name and ID table
   * @private
   * @param {String} value Current value
   * @return {Array}
   */
  getUserTable: function (value) {
    var userNames,
        userNameTable = [],
        i, userName;

    value = (value == undefined) ? "" : String(value);
    userNames = sol.common.UserUtils.getUserNames({ namePart: value });

    for (i = 0; i < userNames.length; i++) {
      userName = userNames[i];
      userNameTable.push([String(userName.id), String(userName.name)]);
    }

    userNameTable = sol.common.ObjectUtils.sortTableByColumn(userNameTable, 1);

    return userNameTable;
  }
});
