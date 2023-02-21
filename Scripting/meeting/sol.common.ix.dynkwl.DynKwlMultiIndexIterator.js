importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.DynKwlMultiIndexIterator" });

//@include lib_Class.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectUtils.js


/**
 *
 * @author Mhe (ELO Digital Office GmbH)
 *
 * @requires sol.common.StringUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.ObjectUtils
 *
 *
 * @since 1.11.000
 */
sol.define("sol.common.ix.DynKwlMultiIndexIterator", {

    required: ["multiIndexField"],
    /**
     * @cfg {string} tableTitle
     */
    // TODO:
    tableTitle: "Vorschläge",

    /**
     * @cfg {Array<String>} tableHeaders (required)
     */
    tableHeaders: undefined,

    /**
     * Constant pilcrow sign
     * @private
     */
    pilcrow: "\u00b6",

    /**
     * @property
     * @private
     * Error messsage that is passed to the client if value is missing
     */
    errorMessage: "",

    initialize: function(config) {
        var me = this;

        me.tableTitle = config.tableTitle || me.tableTitle;

        // TODO: use default common value
        me.tableHeaders = config.tableHeaders;
        me.multiIndexField = config.multiIndexField;
    },

    /**
   * Opens a connection for the elo java client and non map field capable clients.
   *
   * @param {de.elo.ix.client.IXServerEventsContext} ec
   * @param {de.elo.ix.client.Sord} sord Working version of the current sord object
   * @param {String} fieldName Name of the currently focused field
   */
  open: function (ec, sord, focusName) {
    var me = this, multiIndexValue,
        focusFieldValue;

    logger.enter("open", { sord: sord, fieldName: focusName });
    
      focusFieldValue = sol.common.SordUtils.getObjKeyValue(sord, focusName);
      multiIndexValue = sol.common.SordUtils.getValues(sord, me.multiIndexField)
  
      me.buildKeyNames(focusName);
      me.index = 0;
      me.resultSet = me.getData(focusFieldValue, multiIndexValue);


    logger.exit("open");
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
        currentInput;

    logger.enter("openMap", { focusName: focusName, map: map });
    
      /** read the current input of the focus fieldname */
      currentInput = map[focusName];
      me.buildKeyNames(focusName);
      me.index = 0;
      me.resultSet = me.getData(currentInput, map[me.getFullFieldName(me.multiIndexField)]);
    
    logger.exit("openMap");
  },

  getFullFieldName: function(fieldConfig) {
    var fullFieldName;

    if (typeof fieldConfig === "object") {
      fullFieldName = "IX_" + fieldConfig.type + "_" + fieldConfig.key;
    } else if (typeof fieldConfig === "string") {
      fullFieldName = fieldConfig
    } else {
      throw Error("wrong multiIndexField configuration");
    }

    return fullFieldName;
  },

  getData: function(currentInput, multiIndexValue) {
      var me = this, values = [],
        value = currentInput == undefined ? "" : String(currentInput);

      if (typeof me.provider === "function") {
        throw Error("not yet implemented")
      } else {
          // FIXME: template sord not available
          logger.info(["multiIndexValue {0}", multiIndexValue]);
        values = me.getMultiIndexAsTable(multiIndexValue);

        logger.info(["table content {0}", values]);
      }
      return values;
  },

  /**
   *
   * @param {*} grpFieldValue
   * @return {String[]} multiIndex field values as one column table
   */
  getMultiIndexAsTable: function(grpFieldValue) {
    var me = this, multiIndexTable = [], multiIndexValues;

    // Either we get an array of each MultiIndex entry or we have to
    // split values manually
    multiIndexValues = sol.common.ObjectUtils.isArray(grpFieldValue)
      ? grpFieldValue
      : me.splitMultiIndexField(grpFieldValue)

    sol.common.ObjectUtils.forEach(multiIndexValues, function(entry) {
        multiIndexTable.push([entry]);
    });

    return multiIndexTable;
  },

  /**
     * @param {*} sord
     * @return {String[]}
     */
    splitMultiIndexField : function(grpFieldValue){
        var me = this, splittedValues = [];

        if (!sol.common.StringUtils.isEmpty(grpFieldValue)) {
            splittedValues = grpFieldValue.split(me.pilcrow);
        } else {
            logger.warn(["no proposal types supported - field {0} might be empty", grpFieldValue])
        }

        return splittedValues;
    },
 /**
   * Builds the table key names
   * @param {String} fieldName Field name
   */
  buildKeyNames: function (fieldName) {
    var me = this;
    me._keyNames = [String(fieldName)];
  },

     /**
   * Returns the next row of the table.
   *
   * @return {Array} table row
   */
  getNextRow: function () {
    var me = this,
        row;
    logger.debug("getNextRow");
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
    logger.debug("getHeader");
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
    logger.debug("getKeyNames");
    return me._keyNames;
  },
    /**
   * Returns true if table has more rows.
   *
   * @return {Boolean} Has more rows
   */
  hasMoreRows: function () {
    var me = this;
    logger.debug("hasMoreRows");
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
    return this.tableTitle;
  },
});

