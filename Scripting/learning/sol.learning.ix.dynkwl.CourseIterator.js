
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.DynKwlSearchIterator.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Dynamic keyword list that returns the sord content of Courses selected by solution object type.
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.DynKwlSearchIterator
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.dynkwl.CourseIterator", {
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
   * Array of datafields used by the search results.
   */
  rowDataFields: null,

  /**
   * @cfg
   * @inheritdoc
   */
  searchParams: [
    { name: "COURSE_NAME", mode: "STARTS_WITH" }
  ],

  mixins: ["sol.learning.mixins.Configuration"],

  inject: {
    dynkwl: { config: "learning", prop: "entities.course.dynkwls.course", template: true }, // {}
    solutiontypes: { config: "learning", prop: "entities.course.dynkwls.course.const.solutiontypes", template: true }, //
    status: { config: "learning", prop: "entities.course.dynkwls.course.const.status", template: true }, // {}
    searchParams: { config: "learning", prop: "entities.course.dynkwls.course.searchParams" } // {}
  },

  initialize: function (config) {
    var me = this;

    sol.create("sol.common.Injection").inject(me);

    me.tableTitle = me.dynkwl.tableTitle;
    me.tableHeaders = me.dynkwl.tableHeaders;
    me.tableKeyNames = me.dynkwl.tableKeyNames;
    me.rowDataFields = me.dynkwl.rowDataFields;

    me.$super("sol.common.ix.DynKwlSearchIterator", "initialize", [config]);
  },

  /**
   * Implements a find by type search that is filtered by name.
   * @param {Array} filterList [] of strings containing value from field each
   * @return {de.elo.ix.client.FindInfo}
   */
  getFindInfo: function (filterList) {
    this.log.enter("getFindInfo");
    var me = this,
        findInfo, findByIndex, okeys, okey;

    findInfo = new FindInfo();
    findByIndex = new FindByIndex();
    okeys = [];

    okey = new ObjKey();
    okey.name = "SOL_TYPE";
    okey.data = [me.solutiontypes];
    okeys.push(okey);

    okey = new ObjKey();
    okey.name = me.status.field;
    okey.data = [me.status.value];
    okeys.push(okey);

    Array.isArray(filterList) && me.searchParams.some(function (param, i) {
      if (i >= filterList.length) {
        return true;
      }
      if (filterList[i] && filterList[i] !== "*") {
        okey = new ObjKey();
        okey.name = param.name;
        okey.data = [filterList[i]];
        okeys.push(okey);
      }
    });

    findByIndex.objKeys = okeys;
    findInfo.findByIndex = findByIndex;

    this.log.exit("getFindInfo");
    return findInfo;
  },

  /**
   * Basic implementation for search results.
   * This returns the content of the sord index fields.
   * @param {de.elo.ix.client.Sord} sord
   * @return {String}
   */
  getRowData: function (sord) {
    var me = this,
        data = [],
        rdf,
        i;

    for (i = 0; i < me.rowDataFields.length; i++) {
      rdf = me.rowDataFields[i];
      (rdf !== null && (String(rdf) === "guid"))
        ? data.push(sord.guid)
        : data.push(sol.common.SordUtils.getObjKeyValue(sord, rdf));
    }

    return data;
  }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.learning.ix.dynkwl.CourseIterator
 * @return {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.learning.ix.dynkwl.CourseIterator" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.learning.ix.dynkwl.CourseIterator", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}

