
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
 * Base library class of Course Iterator.
 * Do not use this directly. Default implementation is sol.learning.ix.dynkwl.CourseIterator
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.DynKwlSearchIterator
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.dynkwl.courseIterator.Base", {
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
    { name: "COURSE_NAME", mode: "CONTAINS" }
  ],

  mixins: [
    "sol.learning.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    solutiontypes: { config: "learning", prop: "entities.course.dynkwls.course.const.solutiontypes", template: true },
    status: { config: "learning", prop: "entities.course.dynkwls.course.const.status", template: true },
    searchParams: { config: "learning", prop: "entities.course.dynkwls.course.searchParams" },
    tableTitle: { config: "learning", prop: "entities.course.dynkwls.course.tableTitle", template: true },
    tableHeaders: { config: "learning", prop: "entities.course.dynkwls.course.tableHeaders", template: true },
    tableKeyNames: { config: "learning", prop: "entities.course.dynkwls.course.tableKeyNames", template: true },
    rowDataFields: { config: "learning", prop: "entities.course.dynkwls.course.rowDataFields", template: true }
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
      (rdf !== null && (String(rdf) === "name"))
        ? data.push(sord.name)
        : data.push(sol.common.SordUtils.getObjKeyValue(sord, rdf));
    }

    return data;
  }
});

