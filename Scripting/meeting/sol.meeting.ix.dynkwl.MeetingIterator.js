importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.DynKwlSearchIterator.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.Template.js

/**
 * Dynamic keyword list that returns the sord content of Courses selected by solution object type.
 *
 * @author SDi, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.DynKwlSearchIterator
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.meeting.ix.dynkwl.MeetingIterator", {
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
   * searchParams are located in the meeting config (entities.meeting.dynkwls.meeting.searchParams)
   */
  searchParams: [],

  mixins: ["sol.meeting.mixins.Configuration"],

  inject: {
    dynkwl: { config: "meeting", prop: "entities.meeting.dynkwls.meeting", template: true }, // {}
    solutiontypes: { config: "meeting", prop: "entities.meeting.dynkwls.meeting.const.solutiontypes", template: true }, //
    status: { config: "meeting", prop: "entities.meeting.dynkwls.meeting.const.status", template: true }, // {}
    start: { config: "meeting", prop: "entities.meeting.dynkwls.meeting.const.start", template: true }, // {}
    searchParams: { config: "meeting", prop: "entities.meeting.dynkwls.meeting.searchParams" }, // {}
    columnFormatter: { config: "meeting", prop: "entities.meeting.dynkwls.meeting.columnFormatter" } // []
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

    okey = new ObjKey();
    okey.name = me.start.field;
    okey.data = [me.start.value];
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
    var me = this, templateData = {},
        data = [],
        rdf, value,
        i;

    for (i = 0; i < me.rowDataFields.length; i++) {
      rdf = me.rowDataFields[i];
      if (rdf !== null && String(rdf) === "guid") {
        value = sord.guid;
      } else {
        value = sol.common.SordUtils.getObjKeyValue(sord, rdf);
      }

      templateData[rdf] = value;
      data.push(value);
    }

    sol.common.ObjectUtils.forEach(me.columnFormatter, function (colFormatter, index) {
      if (colFormatter) {
        data[index] = sol.common.TemplateUtils.render(colFormatter, templateData);
      }
    });

    return data;
  }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.meeting.ix.dynkwl.MeetingIterator
 * @return {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.meeting.ix.dynkwl.MeetingIterator" }),
      iterator;

  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.meeting.ix.dynkwl.MeetingIterator", { focusFieldGivesValueForMap: false });

    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
