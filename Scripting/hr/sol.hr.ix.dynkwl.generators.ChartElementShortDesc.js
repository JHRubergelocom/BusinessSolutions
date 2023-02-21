
//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.hrorgchart.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * dynamic keyword list for chart element short description generator
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Template
 * @requires sol.common.ix.DynKwlFindChildrenIterator
 * @requires sol.hrorgchart.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.hr.ix.dynkwl.generators.ChartElementShortDesc", {
  extend: "sol.common.ix.DynKwlFindChildrenIterator",
  
  mixins: ["sol.hrorgchart.mixins.Configuration"],
  
  inject: {
    kwl: { config: "hrorgchart", prop: "entities.chartelement.functions.generatechartelementshortdescription", template: true } // {}
  },

  initialize: function (config) {
    var me = this;
    sol.create("sol.common.Injection").inject(me);
    me.parentId = me.kwl.generatorConfig.templatesFolder;
    me.tableTitle = me.kwl.kwlConfig.tableTitle;
    me.tableKeyNames = [me.kwl.generatorConfig.generatorTemplateField, null];
    me.$super("sol.common.ix.DynKwlFindChildrenIterator", "initialize", [config]);
  }
});

/**
 * Implements a dynamic keyword list for personnelno generator
 * @static
 * @member sol.hr.ix.dynkwl.generators.ChartElementShortDesc
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var className = "sol.hr.ix.dynkwl.generators.ChartElementShortDesc",
      log = sol.create("sol.Logger", { scope: className }), iterator;

  try {
    log.info("DynamicKeywordList  (");
    iterator = sol.create(className, {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
