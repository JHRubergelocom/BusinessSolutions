importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.Locale.js
//@include lib_sol.common.ix.DynKwlUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.datev.accounting.mixins.Configuration.js


sol.define("sol.datev.accounting.dynkwl.RestIteratorWLCodes", {
    mixins: [
        "sol.common.ix.DynKwlMixin",
        "sol.datev.accounting.mixins.Configuration",
        "sol.common.mixins.Inject"
    ],

    inject: {
        api: { config: "api", prop: "api", template: false }
    },

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
     * @cfg {Array} sqlParams
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
        this.log = sol.create("sol.Logger", {scope: this.$className || "sol.datev.accounting.dynkwl.RestIteratorWLCodes"});
        this.log.enter("initialize", config);
        config = config || {};


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
        me.log.enter("open", {sord: sord, fieldName: fieldName});
        me.ec = ec;
        log.info("Fielname: " + fieldName);
        me.tableHeaders = ["Code"];
        me._keyNames = [fieldName];
        me.index = 0;

        var url = me.getApiResourceUri(me.api, "Client");

        function getMapByKey(key) {
            return (map[key] || map['IX_GRP_' + key]) || '';
        }

        log.info("STRING Field value ");
        var invoiceDate = getMapByKey("IX_GRP_ACCOUNTING_DATEV_FISCALYEAR");
        var companyCode = getMapByKey("IX_GRP_COMPANY_CODE");
        log.info(invoiceDate);
        log.info(companyCode);
        url += "/" + encodeURIComponent(companyCode);
        url += "/FiscalYear/";
        url += "/" + encodeURIComponent(invoiceDate);
        url += "/WLCode";
        var config = {
            method: 'GET'
        };

        var resp = sol.common.HttpUtils.sendGet(url, config);
        if (resp.responseOk) {
            log.info("Content: " + resp.content);
            var jsonObj = JSON.parse(resp.content);

            var result = [];
            for (var i in jsonObj) {
                result.push([jsonObj[i].code]);
            }

            me.resultSet = result;
        } else {
            throw "Unable to request data from the remote host (" + url + "): " + response.responseCode + " " + response.errorMessage;
        }
        me.log.exit("open");
    },

    /**
     * Opens a connection for elo wf forms and map field capable components
     *
     * @param {de.elo.ix.client.IXServerEventsContext} ec Events context
     * @param {Object} map map of all entries passed by the client
     * @param {String} fieldName name of the currently focused field
     */
    openMap: function (ec, map, fieldName) {
        var me = this,
            fieldIndex, dbParams;
        log.info("open Map");
        log.info("Fielname: " + fieldName);
        me.tableHeaders = ["Code"];
        me._keyNames = [fieldName];
        me.index = 0;

        var url = me.getApiResourceUri(me.api, "Client");

        function getMapByKey(key) {
            return (map[key] || map['IX_GRP_' + key]) || '';
        }

        log.info("STRING Field value ");
        var invoiceDate = getMapByKey("IX_GRP_ACCOUNTING_DATEV_FISCALYEAR");
        var companyCode = getMapByKey("IX_GRP_COMPANY_CODE");
        log.info(invoiceDate);
        log.info(companyCode);
        url += "/" + encodeURIComponent(companyCode);
        url += "/FiscalYear";
        url += "/" + encodeURIComponent(invoiceDate);
        url += "/WLCode";

        var config = {
            method: 'GET'
        };
        log.info("url: " + url);
        var resp = sol.common.HttpUtils.sendGet(url, config);
        if (resp.responseOk) {
            var jsonObj = JSON.parse(resp.content);
            log.info("content" + resp.content);
            var result = [];
            for (var i in jsonObj) {
                result.push([jsonObj[i].code]);
            }

            me.resultSet = result;
        } else {
            throw "Unable to request data from the remote host (" + url + "): " + resp.responseCode + " " + resp.errorMessage;
        }
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
                        me.locale = sol.create("sol.common.Locale", {ec: me.ec});
                        me.locale.read();
                    }
                    value = me.locale.formatDecimal(value, def);
                    row[columnIndex] = value;
                }
            }
        }
    }

});


function getDataIterator() {
    var log = sol.create("sol.Logger", {scope: "sol.datev.accounting.dynkwl.RestIteratorWLCodes"}),
        provider;

    try {
        log.info("DynamicKeywordList (");
        provider = sol.create("sol.datev.accounting.dynkwl.RestIteratorWLCodes");
        return new DynamicKeywordDataProvider(provider);
    } finally {
        log.info(")getDataIterator");
    }
}
