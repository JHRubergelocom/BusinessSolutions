
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.Locale.js
//@include lib_sol.common.ix.DynKwlUtils.js

/**
 * Search Iterator used by dynamic keyword lists. This class provides an abstract layer that simplifies the usage
 * of keywording information.
 *
 * If child elements should be returned please refer to the subclass sol.common.ix.DynKwlFindChildrenIterator
 * which implements that scenario. In most cases it is recommended to implement a specific scenario by a generalized
 * subclass.
 *
 * A DynKwlSearchIterator required an Index Server FindInfo object in order to find the required sord elements.
 * Thanks to a function `getRowData` the result of one row can be defined by keywording information.
 *
 * # Example implementation
 *
 * Following example shows the implementation of an iterator that returns child elements of a given parent.
 *
 *     // script: sol.common.ix.DynKwlFindChildrenIterator.js
 *
 *     sol.define('sol.common.ix.DynKwlFindChildrenIterator', {
 *       extend: 'sol.common.ix.DynKwlSearchIterator',
 *       tableHeaders: ["Name", "Description"],
 *       parentId: null,
 *       searchParams: [{mode: 'STARTS_WITH'}],
 *
 *       initialize: function (config) {
 *         config = config || {};
 *         this.parentId = config.parentId || this.parentId;
 *
 *         this.$super('sol.common.ix.DynKwlSearchIterator', 'initialize', arguments);
 *       },
 *
 *       // implement getFindInfo.
 *       getFindInfo: function(filterList) {
 *     	   var findInfo,
 *     	     findChildren, findByIndex;
 *
 *     	   findInfo = new FindInfo();
 *     	   findChildren = new FindChildren();
 *     	   findChildren.parentId = this.parentId;
 *         findInfo.findChildren = findChildren;
 *
 *         if (filterList && filterList.length > 0) {
 *           findByIndex = new FindByIndex();
 *           findByIndex.name = filterList[0];
 *           findInfo.findByIndex = findByIndex;
 *         }
 *
 *         return findInfo;
 *       },
 *
 *       getRowData: function(sord) {
 *     	   return [sord.name, sord.desc];
 *       }
 *     });
 *
 * Implementation of an Index Server data iterator that can be used by keywording forms:
 *
 *     // script: sol.pubsec.ix.dynkwl.generators.NameFile.js
 *
 *     sol.define('sol.pubsec.ix.dynkwl.generators.NameFile', {
 *       extend: 'sol.common.ix.DynKwlFindChildrenIterator',
 *
 *       tableTitle: 'Generators - File Name',
 *       tableKeyNames: ["FILE_NAME_GEN", null],
 *       parentId: '123'
 *
 *     });
 *
 *     function getDataIterator() {
 *       var iterator;
 *       iterator = sol.create('sol.pubsec.ix.dynkwl.generators.NameFile', {  });
 *       return new DynamicKeywordDataProvider(iterator);
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
sol.define("sol.common.ix.DynKwlSearchIterator", {
  mixins: ["sol.common.ix.DynKwlMixin"],

  /**
   * @cfg {string} tableTitle
   * name of this table. The title is displayed by the client.
   */
  tableTitle: undefined,
  /**
   * @cfg {de.elo.ix.client.SordZ} sordZ
   * Defines which information to retrieve from the search. e.g. `SordC.mbAll`. Default is `SordC.mbAllIndex`.
   */
  searchSordZ: SordC.mbAllIndex,
  /**
   * @cfg {Array} searchParams
   * Filter values that can be used for creating a FindInfo search definition.
   *
   *     [{ name: 'FILING_PLAN_REFERENCE', mode: 'STARTS', message: 'field x missing' }]
   *
   * if no name is provided current focused field is used.
   * These values are passed to the `getFindInfo` function.
   */
  searchParams: null,
  /**
   * @cfg {Number} searchCount
   * Number of search results to retrieve.
   * Please mind that results should be filtered by the user input.
   * Displaying more than 100 results is not recommended.
   */
  searchCount: 100,
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

  /**
   * @private
   * created findInfo object.
   */
  _findInfo: null,

  initialize: function (config) {
    this.log = sol.create("sol.Logger", { scope: this.$className || "sol.common.ix.SearchIterator" });
    this.log.enter("initialize", config);
    config = config || {};

    if ((!this.searchParams && !config.searchParams)
      || (!this.tableKeyNames && !config.tableKeyNames)
      || (!this.tableHeaders && !config.tableHeaders)) {
      this.log.error("Dynamic keyword list: searchParams, keyNameTemplate and tableHeaders must be set.");
    }

    this.tableTitle = config.tableTitle || this.tableTitle;
    this.searchParams = config.searchParams || this.searchParams;
    this.searchSordZ = config.searchSordZ || this.searchSordZ;
    this.searchCount = config.searchCount || this.searchCount;
    this.tableKeyNames = config.tableKeyNames || this.tableKeyNames;
    this.tableHeaders = config.tableHeaders || this.tableHeaders;
    this.focusFieldGivesValueForMap = !!config.focusFieldGivesValueForMap;

    this.errorMessage = "";
    this.log.exit("initialize");
  },

  /**
   * Opens a connection for the elo java client and non map field capable clients.
   *
   * @param {de.elo.ix.scripting.ScriptExecContext} ec
   * @param {de.elo.ix.client.Sord} sord working version of the current sord object
   * @param {String} fieldName name of the currently focused field
   */
  open: function (ec, sord, fieldName) {
    this.log.enter("open", { sord: sord, fieldName: fieldName });

    this._keyNames = this.getTableKeyNames(fieldName);

    this.index = 0;
    this._findInfo = this.getFindInfo(this.createSearchFilterList(ec, fieldName, null, null, sord));
    this.resultSet = this.getSearchResults();
    this.log.exit("open");
  },

  /**
   * Opens a connection for elo wf forms and map field capable components
   *
   * @param {de.elo.ix.scripting.ScriptExecContext} ec
   * @param {Object} map Map of all entries passed by the client
   * @param {String} focusName Name of the currently focused field
   */
  openMap: function (ec, map, focusName) {
    this.log.enter("openMap", { focusName: focusName, map: map });

    var fieldIndex = this.getIndexFromName(focusName);
    this._keyNames = this.getTableKeyNames(focusName).map(function (keyName) {
      return !!keyName ? ((fieldIndex != "") ? keyName.replace("{i}", fieldIndex) : keyName) : null;
    });

    this.index = 0;
    this._findInfo = this.getFindInfo(this.createSearchFilterList(ec, focusName, fieldIndex, map, null));
    this.resultSet = this.getSearchResults();
    this.log.exit("openMap");
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
   * @abstract
   * This function must be implemented by the child class. It should return the data as string[] for one table row.
   * @param {de.elo.ix.client.Sord} sord
   * @return {String[]} Table row
   */
  getRowData: function (sord) {
    throw this.$class + ": getRowData must be implemented by child class.";
  },

  /**
   * @abstract
   * This function must be implemented by the child class. It should return an Index Server FindInfo object that is used by the search.
   *
   *     getFindInfo: function(filterList) {
   *       this.log.enter("getFindInfo");
   *       var findInfo,
   *       findChildren, findByIndex;
   *
   *       findInfo = new FindInfo();
   *       findChildren = new FindChildren();
   *       findChildren.parentId = this.parentId;
   *       findInfo.findChildren = findChildren;
   *
   *       if (filterList && filterList.length > 0) {
   *         findByIndex = new FindByIndex();
   *         findByIndex.name = filterList[0];
   *         findInfo.findByIndex = findByIndex;
   *       }
   *
   *       this.log.exit("getFindInfo");
   *       return findInfo;
   *     },
   *
   * @param {String[]} filter
   * @return {de.elo.ix.client.FindInfo}
   */
  getFindInfo: function (filter) {
    throw this.$class + ": getFindInfo must be implemented by child class.";
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
   * Retrieves a list of search results based on the given FindInfo object. Result list is limited to 100 items.
   * @return {de.elo.ix.client.Sord[]}
   */
  getSearchResults: function () {
    this.log.enter("getSearchResults", this._findInfo);
    var findResult, sords;

    findResult = ixConnect.ix().findFirstSords(this._findInfo, this.searchCount, this.searchSordZ);
    sords = findResult.sords || [];

    ixConnect.ix().findClose(findResult.searchId);
    this.log.info("found sords: " + sords.length);

    this.log.exit("getSearchResults");

    return sords;
  },

  /**
   * Internal function that utilizes the creation of filters used by the creation of findInfo objects.
   *
   * @param {de.elo.ix.scripting.ScriptExecContext} ec IX ScriptExecContext
   * @param {String} focusField Currently focused field
   * @param {String} fieldIndex
   * @param {Object} map Map of all entries passed by the client
   * @param {de.elo.ix.client.Sord} sord working version of the current sord object
   * @returns {String[]} Values for prepared statement
   */
  createSearchFilterList: function (ec, focusField, fieldIndex, map, sord) {
    this.log.enter("createSearchFilterList", { focusField: focusField, fieldIndex: fieldIndex, map: map, sord: sord });
    var list = [],
        i, param, fieldName, value, mapValueField;

    this.errorMessage = "";

    this.log.debug("defined searchParams: ", this.searchParams);

    for (i = 0; i < this.searchParams.length; i++) {
      param = this.searchParams[i];
      fieldName = param.name || focusField;


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
        mapValueField = this.focusFieldGivesValueForMap ? focusField : fieldName;
        if (fieldIndex) {
          mapValueField = String(mapValueField).replace("{i}", fieldIndex);
        }
        value = (map[mapValueField] || map["IX_GRP_" + mapValueField]) || "";
      } else {
        value = sol.common.SordUtils.getObjKeyValue(sord, fieldName) || "";
      }

      if (!value && param.message) {
        this.errorMessage = param.message;
      }

      switch (param.mode) {
        case "STARTS_WITH":
          list.push(value + "*");
          break;
        case "CONTAINS":
          list.push("*" + value + "*");
          break;
        case "ENDS_WITH":
          list.push("*" + value);
          break;
        default:
          list.push(String(value));
      }
    }
    this.log.exit("createSearchFilterList");
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
  }
});
