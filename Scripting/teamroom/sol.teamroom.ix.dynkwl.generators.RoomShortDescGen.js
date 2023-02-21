
//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.teamroom.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * dynamic keyword list for room short description generator
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Template
 * @requires sol.common.ix.DynKwlFindChildrenIterator
 * @requires sol.teamroom.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.teamroom.ix.dynkwl.generators.RoomShortDescGen", {
  extend: "sol.common.ix.DynKwlFindChildrenIterator",

  mixins: ["sol.teamroom.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    kwl: { config: "teamroom", prop: "entities.room.functions.generateroomshortdescription", template: true } // {}
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
 * Implements a dynamic keyword list for room short description generator
 * @static
 * @member sol.teamroom.ix.dynkwl.generators.RoomShortDescGen
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var className = "sol.teamroom.ix.dynkwl.generators.RoomShortDescGen",
      log = sol.create("sol.Logger", { scope: className }), iterator;

  try {
    log.info("DynamicKeywordList  (");
    iterator = sol.create(className, {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
