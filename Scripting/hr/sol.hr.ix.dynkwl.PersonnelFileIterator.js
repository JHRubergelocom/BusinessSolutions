
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.DynKwlSearchIterator.js
//@include lib_sol.hr.shared.Utils.js

/**
 * Dynamic keyword list that returns the sord content of personnelfiles selected by solution object type.
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.DynKwlSearchIterator
 * @requires sol.hr.shared.Utils
 */
sol.define("sol.hr.ix.dynkwl.PersonnelFileIterator", {
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
    { mode: "STARTS_WITH" }
  ],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.DynKwlSearchIterator", "initialize", [config]);

    me.nameTemplate = me.displayNameTemplate
      ? (sol.create("sol.common.Template", { source: me.displayNameTemplate }))
      : undefined;
  },

  getSearchResults: function () {
    var me = this, findResult, sords, conn = (me.useUserForPFList === false ? ixConnectAdmin : ixConnect);

    me.log.enter("getSearchResults", me._findInfo);

    findResult = conn.ix().findFirstSords(me._findInfo, me.searchCount, me.searchSordZ);
    sords = findResult.sords || [];

    conn.ix().findClose(findResult.searchId);
    me.log.info("found sords: " + sords.length);

    me.log.exit("getSearchResults");

    return sords;
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
    okey.data = [me.solType];
    okeys.push(okey);

    findByIndex.name = [filterList[0]];

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
      (rdf !== null && (rdf = String(rdf))
        && (
          ((rdf === "guid") && data.push(sord.guid))
          || ((rdf === "name") && data.push((me.nameTemplate && (me.nameTemplate.apply({ sord: sol.hr.shared.Utils.getSordData(sord.id, undefined, true) }).trim())) || sord.name))
          || data.push(sol.common.SordUtils.getObjKeyValue(sord, rdf))
        )
      );
    }

    return data;
  }
});

