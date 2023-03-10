
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.DynKwlSearchIterator.js

/**
 * Child Search Iterator used by dynamic keyword lists. This class provides an abstract layer that simplifies the usage
 * of keywording information from all children of a given parent.
 *
 * This is used for example if a folder in ELO contains several templates that should be selected in keywording forms or
 * ELOwf forms.
 *
 * # Example implementation
 *
 *     sol.define('sol.pubsec.ix.dynkwl.generators.NameFile', {
 *       extend: 'sol.common.ix.DynKwlFindChildrenIterator',
 *
 *       tableTitle: 'Generators - File Name',
 *       tableKeyNames: ["FILE_NAME_GEN", null],
 *       parentId: '123'
 *     });
 *
 *     function getDataIterator() {
 *       var iterator;
 *       iterator = sol.create('sol.pubsec.ix.dynkwl.generators.NameFile', {  });
 *       return new DynamicKeywordDataProvider(iterator);
 *     }
 *
 * @author Nils Mosbach, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.Logger
 * @requires sol.common.ix.DynKwlSearchIterator
 */
sol.define("sol.common.ix.DynKwlFindChildrenIterator", {
  extend: "sol.common.ix.DynKwlSearchIterator",

  /**
   * @cfg
   * @inheritdoc
   */
  tableHeaders: ["Name", "Description"],
  /**
   * @cfg
   * Parent id that is used by the FindChildren search.
   */
  parentId: null,
  /**
   * @cfg
   * @inheritdoc
   */
  searchParams: [{ mode: "STARTS_WITH" }],

  initialize: function (config) {
    this.log = sol.create("sol.Logger", { scope: this.$className || "sol.common.ix.SearchIterator" });
    this.log.enter("initialize", config);
    config = config || {};

    if ((!this.parentId && !config.parentId)) {
      this.log.error("Dynamic keyword list: parentId must be set.");
    }

    this.parentId = config.parentId || this.parentId;

    this.$super("sol.common.ix.DynKwlSearchIterator", "initialize", arguments);

    this.log.exit("initialize");
  },

  /**
   * Implements a find children search that is filtered by name.
   * @param {Array} filterList
   * @return {de.elo.ix.client.FindInfo}
   */
  getFindInfo: function (filterList) {
    this.log.enter("getFindInfo");
    var findInfo,
        findChildren, findByIndex;

    findInfo = new FindInfo();
    findChildren = new FindChildren();
    findChildren.parentId = this.parentId;
    findInfo.findChildren = findChildren;

    if (filterList && filterList.length > 0) {
      findByIndex = new FindByIndex();
      findByIndex.name = filterList[0];
      findInfo.findByIndex = findByIndex;
    }

    this.log.exit("getFindInfo");
    return findInfo;
  },

  /**
   * Basic implementation for search results.
   * This returns the sord name and sord description (notes).
   * @param {de.elo.ix.client.Sord} sord
   * @return {Object}
   */
  getRowData: function (sord) {
    return [sord.name, sord.desc];
  }
});
