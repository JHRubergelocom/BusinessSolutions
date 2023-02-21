
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.contract.mixins.Configuration.js
//@include lib_sol.common.SordProvider.js
//@include lib_sol.common.Injection.js

/**
 * Dynamic keyword list that returns the contract categories.
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.DynKwlSearchIterator
 * @requires sol.contract.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.contract.ix.dynkwl.ContractCategories", {

  mixins: ["sol.contract.mixins.Configuration"],

  inject: {
    dynkwl: { config: "contract", prop: "clauses.dynkwls.contractCategories", template: true }
  },

  initialize: function (config) {
    var me = this;

    sol.create("sol.common.Injection").inject(me);

    me.tableTitle = me.dynkwl.tableTitle;
    me.tableHeaders = me.dynkwl.tableHeaders;
    me.tableKeyNames = me.dynkwl.tableKeyNames;
  },

  openMap: function (ec, map, focusName) {
    var me = this,
        categoriesObj = {},
        categories = [],
        contractTplSords, fieldIndex, focusValue;

    fieldIndex = me.getIndexFromName(focusName);
    me.tableKeyNames = me.tableKeyNames.map(function (keyName) {
      return !!keyName ? ((fieldIndex != "") ? keyName.replace("{i}", fieldIndex) : keyName) : null;
    });

    focusValue = map[focusName] || "";

    me.index = 0;

    contractTplSords = sol.common.IxUtils.execute("RF_sol_common_service_SordProvider", {
      masks: ["Contract"],
      search: [{
        key: "SOL_TYPE",
        value: "CONTRACT_TEMPLATE"
      }],
      output: [{
        source: {
          type: "GRP",
          key: "CONTRACT_CATEGORY"
        },
        target: {
          prop: "CONTRACT_CATEGORY"
        }
      }],
      options: {
        formatAsTemplateSord: true
      }
    });

    contractTplSords && contractTplSords.sords && contractTplSords.sords.forEach(function (tplSord) {
      var category;
      category = tplSord.objKeys.CONTRACT_CATEGORY;

      // filter categories by entered string
      if (!focusValue || (category.toLowerCase().indexOf(focusValue.toLowerCase()) > -1)) {
        categoriesObj[category] = true;
      }
    });

    categories = Object.keys(categoriesObj).map(function (category) {
      return category;
    });

    categories.sort();

    me.resultSet = categories.map(function (category) {
      return [category];
    });
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
  },

  getHeader: function () {
    var me = this;
    return me.tableHeaders;
  },

  getKeyNames: function () {
    var me = this;
    return me.tableKeyNames;
  },

  hasMoreRows: function () {
    var me = this;
    return (me.index < me.resultSet.length);
  },

  getMessage: function () {
    return "";
  },

  getTitle: function () {
    var me = this;
    return me.tableTitle;
  },

  getNextRow: function () {
    var me = this,
        row;

    row = me.resultSet[me.index++];

    return row;
  }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.contract.ix.dynkwl.PoolIterator
 * @return {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.contract.ix.dynkwl.ContractCategories" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.contract.ix.dynkwl.ContractCategories", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}

