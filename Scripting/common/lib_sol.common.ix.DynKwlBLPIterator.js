
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.Locale.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.ix.DynKwlUtils.js

/**
 * BLP Query Iterator used by dynamic keyword lists. This class provides an abstract layer that simplifies the usage
 * of keywording information.
 *
 * This iterator has to be used in combination with a BLP query. When used in a GenericDynKwl we're extracting
 * the correct BLP values (e.g. queryName, addInId, moduleId, ...) within the DynKWL configuration app.
 * When implemented via code you'll need to provide the specific properties yourself.
 *
 * # Example implementation
 *
 *
 * Implementation of an Index Server data iterator that can be used by keywording forms:
 *
 *    sol.define("sol.examples.ix.dynkwl.Customers", {
 *      extend: "sol.common.ix.DynKwlBLPIterator",
 *    
 *      tableTitle: "Customers of a ERP system",
 *      tableKeyNames: ["CUSTOMER_NO", "CUSTOMER_NAME", "IX_MAP_CUSTOMER_CATEGORY"],
 *      serverUrl: "http://10.1.2.10:30009",
 *      appToken: "HThYifwwAsdfYf400XSaiINismui3kTDOPqan8EoyfM=",
 *      projectId: "603c98f95675da5172eb84cb",
 *      queryName: "psql.navcustomers",
 *      queryModule: "OleDb",
 *      moduleId: "a7f28149-7202-43f2-b3ec-d225743b06ee",
 *      addInId: "da414d55-45b5-451a-a03a-9517727ae9c7",
 *      queryConditions: [
 *        { name: "IDX1", fieldName: "CUSTOMER_NAME" },
 *        { name: "IDX2", value: "IMPORTANT CUSTOMERS" }
 *      ]
 *    });
 *    
 *    function getDataIterator() {
 *      var iterator;
 *      iterator = sol.create("sol.examples.ix.dynkwl.Customers", {  });
 *      return new DynamicKeywordDataProvider(iterator);
 *    }
 *
 * @author ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.StringUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.Template
 * @requires sol.common.Locale
 * @requires sol.common.HttpUtils
 * @requires sol.common.ix.DynKwlUtils
 */
sol.define("sol.common.ix.DynKwlBLPIterator", {
  mixins: ["sol.common.ix.DynKwlMixin"],

  /**
   * @cfg {string} serverUrl
   * URL of BLP server (e.g. http://<IP Adress>:30009)
   */
  serverUrl: undefined,
  /**
   * @cfg {string} appToken
   * App token for BLP connection. Needs to be configured in the BLP designer within the Credential Store
   * This is the "Secret Key" within the "Access Keys"
   * (e.g. HThYifwwAsdfYf400XSaiINismui3kTDOPqan8EoyfM=)
   */
  appToken: undefined,
  /**
   * @cfg {string} projectId
   * Project Id for this BLP query. Can be the project name
   */
  projectId: undefined,
  /**
   * @cfg {string} tableTitle
   * name of this table. The title is displayed by the client.
   */
  tableTitle: undefined,
  /**
   * @cfg {string} queryName
   * Name of the BLP query to be used in this DynKWL
   */
  queryName: undefined,
  /**
   * @cfg {string} queryModule
   * Name of the BLP module (e.g.: "OleDb") to be used in this DynKWL
   */
  queryModule: undefined,
  /**
   * @cfg {string} moduleId
   * ID of the BLP module (e.g.: "a7f28149-7202-43f2-b3ec-d225743b06ee for the DataConnect module") to be used in this DynKWL
   */
  moduleId: undefined,
  /**
   * @cfg {string} addInId
   * ID of the BLP addIn (e.g.: "da414d55-45b5-451a-a03a-9517727ae9c7") to be used in this DynKWL
   */
  addInId: undefined,
  /**
   * @cfg {Array} queryConditions
   * 
   *    [{ "name": "IDX1", "value": "20000", message: 'field x missing' }]
   * 
   * Conditions to be passed to the BLP query
   * If no name is provied the current focuesd field is used.
   */
  queryConditions: [],
  /**
   * @cfg {Array} tableKeyNames (required)
   * mapping between columns and elo group or map fields. if null, value is not transferred.
   *
   *     // GRP field     map static field           map table field
   *     ['RECORD_REFERENCE', null];
   *
   * Map fields must contain IX_MAP as a prefix and can optionally use {i} as a counter value.
   */
  tableKeyNames: undefined,
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

  initialize: function (config) {
    var me = this, queryUrl;
    me.log = sol.create("sol.Logger", { scope: this.$className || "sol.common.ix.DynKwlBLPIterator" });
    me.log.enter("initialize", config);
    config = config || {};

    if ((!me.serverUrl && !config.serverUrl)
      || (!me.appToken && !config.appToken)
      || (!me.projectId && !config.projectId)
      || (!me.queryName && !config.queryName)
      || (!me.queryModule && !config.queryModule)
      || (!me.moduleId && !config.moduleId)
      || (!me.addInId && !config.addInId)
      || (!me.tableKeyNames && !config.tableKeyNames)
      || (!me.tableHeaders && !config.tableHeaders)) {
      me.log.error("Dynamic keyword list: serverUrl, queryName, queryModule, projectId, moduleId, addInId, tableKeyNames and tableHeaders must be set.");
    }

    // this is the BLP security token to authenticate with the service
    me.serverUrl = config.serverUrl || me.serverUrl;
    me.appToken = config.appToken || me.appToken;
    me.projectId = config.projectId || me.projectId;
    me.queryName = config.queryName || me.queryName;
    me.queryModule = config.queryModule || me.queryModule;
    me.moduleId = config.moduleId || me.moduleId;
    me.addInId = config.addInId || me.addInId;

    queryUrl = "{{serverUrl}}/api/v1/project/{{projectId}}/dataquery/{{moduleId}}/{{addInId}}/execute";
    
    tpl = sol.create('sol.common.Template', {
      source: queryUrl
    });

    me.blpQueryUrl = tpl.apply({
      serverUrl: me.serverUrl,
      projectId: me.projectId,
      moduleId: me.moduleId,
      addInId: me.addInId
    });

    me.tableTitle = config.tableTitle || me.tableTitle;
    me.queryConditions = config.queryConditions || me.queryConditions;
    me.tableKeyNames = config.tableKeyNames || me.tableKeyNames;
    me.tableHeaders = config.tableHeaders || me.tableHeaders;
    me.focusFieldGivesValueForMap = !!config.focusFieldGivesValueForMap;
    
    me.errorMessage = "";
    me.log.exit("initialize");
  },

  /**
   * Opens a connection for the elo java client and non map field capable clients.
   *
   * @param {de.elo.ix.scripting.ScriptExecContext} ec
   * @param {de.elo.ix.client.Sord} sord working version of the current sord object
   * @param {String} fieldName name of the currently focused field
   */
  open: function (ec, sord, fieldName) {
    var me = this;
    me.log.enter("open", { sord: sord, fieldName: fieldName });
    
    me._keyNames = me.getTableKeyNames(fieldName);

    me.index = 0;
    me.resultSet = me.getQueryResults(me.createBLPConditionFields(ec, fieldName, null, null, sord));
    me.log.exit("open");
  },

  /**
   * Opens a connection for elo wf forms and map field capable components
   *
   * @param {de.elo.ix.scripting.ScriptExecContext} ec
   * @param {Object} map Map of all entries passed by the client
   * @param {String} focusName Name of the currently focused field
   */
  openMap: function (ec, map, focusName) {
    var me = this, fieldIndex;
    me.log.enter("openMap", { focusName: focusName, map: map });

    fieldIndex = me.getIndexFromName(focusName);
    me._keyNames = me.getTableKeyNames(focusName).map(function (keyName) {
      return !!keyName ? ((fieldIndex != "") ? keyName.replace("{i}", fieldIndex) : keyName) : null;
    });

    me.index = 0;
    me.resultSet = me.getQueryResults(me.createBLPConditionFields(ec, focusName, fieldIndex, map, null));
    me.log.exit("openMap");
  },

  /**
   * Closes the connection for both map and non map capable clients.
   */
  close: function () {
    this.log.enter("close");
    this._findInfo = null;
    this.log.exit("close");
  },

  /**
   * Returns the next row of the table.
   *
   * @return {String[]} Table row
   */
  getNextRow: function () {
    var row = this.resultSet[this.index++];
    if (row) {
      row = this.getRowData(row);
      this.formatRow(row);
      return row;
    }
  },

  /**
   * Within BLP we're basically just passing our result row to our DynKwl.
   * You may overwrite this function for some fancy row preparation
   * @param {String[]} row
   * @return {String[]} Table row
   */
  getRowData: function (row) {
    return row;
  },

  /**
   * Returns the header of this table that can be displayed by the clients.
   *
   * @return {String[]} Table header
   */
  getHeader: function () {
    return this.tableHeaders;
  },

  /**
   * Returns the keys of this table that can be used in order to map
   * map or group fields with columns.
   *
   * @return {String[]} Table keys
   */
  getKeyNames: function () {
    return this._keyNames;
  },

  /**
   * Returns true if table has more rows.
   *
   * @return {Boolean} Has more rows
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
   * @return {String} Title
   */
  getTitle: function () {
    return this.tableTitle;
  },

  /**
   * @private
   * Retrieves a list of results from a BLP query.
   * @return {de.elo.ix.client.Sord[]}
   */
  getQueryResults: function (queryConditions) {
    var me = this, responseObj, dataObj, results, des, decryptedAppToken;
    me.log.enter("getSearchResults", this._findInfo);

    dataObj = {
      name: me.queryName,
      module: me.queryModule
    };

    if (queryConditions.length > 0) {
      dataObj.condition_fields = queryConditions;
    }
    
    des = new Packages.de.elo.utils.sec.DesEncryption();
    decryptedAppToken = des.decrypt(me.appToken);
    requestProperties = {
      Authorization: "Bearer " + decryptedAppToken
    };

    responseObj = sol.common.HttpUtils.sendRequest({
      url: me.blpQueryUrl,
      method: "post",
      connectTimeout: 10000,
      readTimeout: 60000,
      dataObj: dataObj,
      encodeData: false,
      requestProperties: requestProperties
    });
    
    results = JSON.parse(responseObj.content);

    if (!results.result || !results.result.rows) {
      throw new Exception("No BLP Query results returned. Content: " + responseObj.content);
    }
    me.log.exit("getQueryResults");

    return results.result.rows;
  },

  /**
   * Internal function that utilizes the creation of condition_fields passed to the BLP query.
   *
   * @param {de.elo.ix.scripting.ScriptExecContext} ec IX ScriptExecContext
   * @param {String} focusField Currently focused field
   * @param {String} fieldIndex
   * @param {Object} map Map of all entries passed by the client
   * @param {de.elo.ix.client.Sord} sord working version of the current sord object
   * @returns {String[]} Values for prepared statement
   */
  createBLPConditionFields: function (ec, focusField, fieldIndex, map, sord) {
    var me = this, queryConditions = [],
      i, param, fieldName, value, mapValueField;
    me.log.enter("createBLPConditionFields", { focusField: focusField, fieldIndex: fieldIndex, map: map, sord: sord });

    me.errorMessage = "";

    for (i = 0; i < me.queryConditions.length; i++) {
      param = me.queryConditions[i];

      if (!param.value) {
        fieldName = param.fieldName || focusField;
        if (param.valueType) {
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
          mapValueField = this.focusFieldGivesValueForMap ? focusField : fieldName;
          if (fieldIndex) {
            mapValueField = String(mapValueField).replace("{i}", fieldIndex);
          }
          value = (map[mapValueField] || map["IX_GRP_" + mapValueField]) || "";
        } else {
          value = sol.common.SordUtils.getObjKeyValue(sord, fieldName) || "";
        }
      }

      if (!param.value && param.message) {
        me.errorMessage = param.message;
      }

      if (param.value || ((!param.value || param.value == "") && param.emptyAllowed === true)) {
        queryConditions.push(param);
      }
    }
    
    me.log.exit("createBLPConditionFields");
    return queryConditions;
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
  }
});
