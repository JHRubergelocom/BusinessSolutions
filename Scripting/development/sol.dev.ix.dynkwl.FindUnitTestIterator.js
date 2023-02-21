
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.DynKwlSearchIterator.js

/**
 * Dynamic keyword list that returns the sord content of unittests selected by typeNames
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.Logger
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.DynKwlSearchIterator
 */
sol.define("sol.dev.ix.dynkwl.FindUnitTestIterator", {
  extend: "sol.common.ix.DynKwlSearchIterator",

  /**
   * @cfg
   * @inheritdoc
   */
  tableHeaders: null,

  /**
   * @cfg
   * @inheritdoc
   */
  tableTitle: null,

  /**
   * @cfg
   * @inheritdoc
   */
  tableKeyNames: null,

  /**
   * @cfg
   * Array of typeNames that are used by the FindByType search.
   */
  typeNames: null,

  /**
   * @cfg
   * Array of datafields used by the search results.
   */
  rowDataFields: null,

  /**
   * @cfg
   * @inheritdoc
   */
  searchParams: [{ mode: "STARTS_WITH" }],

  initialize: function (config) {
    var me = this,
        i;

    /*
    me.devConfig = sol.create("sol.common.Config", {load: "ARCPATH:/Administration/Business Solutions/development/Configuration/sol.dev.Config"}).config;
    me.tableTitle = me.devConfig.dynkwl.contact.tableTitle;
    me.tableHeaders = me.devConfig.dynkwl.contact.tableHeaders;
    me.tableKeyNames = me.devConfig.dynkwl.contact.tableKeyNames;
    me.typeNames = me.devConfig.dynkwl.contact.typeNames;
    me.maskId = me.devConfig.dynkwl.contact.maskId;
    me.rowDataFields = me.devConfig.dynkwl.contact.rowDataFields;
    */
    me.tableTitle = "FindUnitTest";
    me.tableHeaders = ["Status3", "Status4"];
    me.tableKeyNames = ["UNITTEST_STATUS3", "UNITTEST_STATUS4"];
    me.typeNames = ["UnitTest"];
    me.maskId = "UnitTest";
    me.rowDataFields = ["UNITTEST_STATUS3", "UNITTEST_STATUS4"];

    for (i = 0; i < me.tableHeaders.length; i++) {
      me.tableHeaders[i] = sol.common.TranslateTerms.translate(me.tableHeaders[i]);
    }
    me.tableTitle = sol.common.TranslateTerms.translate(me.tableTitle);

    me.$super("sol.common.ix.DynKwlSearchIterator", "initialize", [config]);
  },

  /**
   * Implements a find by type search that is filtered by name.
   * @param {String[]} filterList
   * @return {Object} findInfo
   */
  getFindInfo: function (filterList) {
    this.log.enter("getFindInfo");
    var findInfo,
        findByType, findByIndex, typeNames;

    findInfo = new FindInfo();
    findByType = new FindByType();
    typeNames = this.typeNames;
    findByType.typeNames = typeNames;
    findInfo.findByType = findByType;

    if (filterList && filterList.length > 0) {
      findByIndex = new FindByIndex();
      findByIndex.maskId = this.maskId;
      findByIndex.name = filterList[0];
      findInfo.findByIndex = findByIndex;
    }

    this.log.exit("getFindInfo");
    return findInfo;
  },

  /**
   * Basic implementation for search results.
   * This returns the content of the sord index fields.
   * @param {Object} sord
   * @return {Object[]}
   */
  getRowData: function (sord) {
    var me = this,
        data = [],
        i;

    for (i = 0; i < me.rowDataFields.length; i++) {
      data.push(sol.common.SordUtils.getObjKeyValue(sord, me.rowDataFields[i]));
    }

    return data;
  }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.dev.ix.dynkwl.FindUnitTestIterator
 * @return {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.dev.ix.dynkwl.FindUnitTestIterator" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.dev.ix.dynkwl.FindUnitTestIterator", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}

