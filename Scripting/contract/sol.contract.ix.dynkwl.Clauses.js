
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.contract.mixins.Configuration.js
//@include lib_sol.common.Injection.js

sol.define("sol.contract.ix.dynkwl.Clauses", {
  extend: "sol.common.ix.DynKwlSearchIterator",
  mixins: ["sol.contract.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    clausesConfig: { config: "contract", prop: "clauses" }
  },

  tableTitle: "Contract clauses",
  tableHeaders: ["Name", null],
  tableKeyNames: ["IX_MAP_CLAUSE_NAME{i}", "IX_MAP_CLAUSE_ID{i}"],
  searchParams: [{ name: "IX_MAP_CLAUSE_NAME{i}", searchName: "NAME" }, { name: "CONTRACT_CATEGORY", searchName: "CONTRACT_CATEGORIES" }, { name: "CONTRACT_TYPE", searchName: "CONTRACT_TYPES" }],

  initialize: function (config) {
    var me = this;
    sol.create("sol.common.Injection").inject(me);
    me.$super("sol.common.ix.DynKwlSearchIterator", "initialize", [config]);
  },

  getRowData: function (sord) {
    var clauseId;
    clauseId = sol.common.SordUtils.getObjKeyValue(sord, "CLAUSE_ID");
    return [sord.name, clauseId];
  },

  /**
   * @private
   * Implements a find by type search that is filtered by ObjKeys.
   * Used for the 'DynKwlSearchIterator'.
   * @param {String[]} filterList
   * @return {de.elo.ix.client.FindInfo}
   */
  getFindInfo: function (filterList) {
    var me = this,
        findInfo, findByIndex, okeys, okey, i, param, filter;

    me.log.enter("getFindInfo");

    findInfo = new FindInfo();
    findByIndex = new FindByIndex();
    okeys = [];

    if (filterList && filterList.length > 0) {
      for (i = 0; i < filterList.length; i++) {
        param = me.searchParams[i];
        filter = filterList[i];
        if (param.name) {
          if (param.searchName == "NAME") {
            findByIndex.name = filter;
          } else {
            okey = new ObjKey();
            okey.name = param.searchName || param.name;
            filter = (filter) ? "\"" + filter + "\" or \"ALL\"" : "ALL";
            okey.data = [filter];
            okeys.push(okey);
          }
        }
      }
    }

    findByIndex.maskId = me.clausesConfig.maskName;
    findByIndex.objKeys = okeys;
    findInfo.findByIndex = findByIndex;

    me.log.exit("getFindInfo");
    return findInfo;
  }
});

function getDataIterator() {
  var iterator;
  iterator = sol.create("sol.contract.ix.dynkwl.Clauses", {});
  return new DynamicKeywordDataProvider(iterator);
}
