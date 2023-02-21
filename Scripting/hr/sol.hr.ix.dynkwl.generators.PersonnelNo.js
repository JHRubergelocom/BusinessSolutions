
//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * dynamic keyword list for personnelno generator
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Template
 * @requires sol.common.ix.DynKwlFindChildrenIterator
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.hr.ix.dynkwl.generators.PersonnelNo", {
  extend: "sol.common.ix.DynKwlFindChildrenIterator",
  
  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],
  
  inject: {
    kwl: { config: "hr", prop: "entities.file.functions.generatepersonnelno", template: true } // {}
  },

  initialize: function (config) {
    var me = this;
    sol.create("sol.common.Injection").inject(me);  // sets up config including templating ...
    me.parentId = me.kwl.generatorConfig.templatesFolder;
    me.tableTitle = me.kwl.kwlConfig.tableTitle;
    me.tableKeyNames = [me.kwl.generatorConfig.generatorTemplateField, null];
    me.$super("sol.common.ix.DynKwlFindChildrenIterator", "initialize", [config]);
  }
});

/**
 * Implements a dynamic keyword list for personnelno generator
 * @static
 * @member sol.hr.ix.dynkwl.generators.PersonnelNo
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var className = "sol.hr.ix.dynkwl.generators.PersonnelNo",
      log = sol.create("sol.Logger", { scope: className }), iterator;

  try {
    log.info("DynamicKeywordList  (");
    iterator = sol.create(className, {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
