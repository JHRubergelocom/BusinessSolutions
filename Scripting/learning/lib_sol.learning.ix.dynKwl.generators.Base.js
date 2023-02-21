
//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js


/**
 * Localized keyword list base class.
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.ix.DynKwlFindChildrenIterator
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.dynKwl.generators.Base", {
  extend: "sol.common.ix.DynKwlFindChildrenIterator",

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  kwlPath: null,

  inject: {
    kwl: {
      config: "learning",
      prop: null,
      template: true
    }
  },

  initialize: function (config) {
    var me = this;

    if (me.kwlPath) {
      me.setKwlPath();
      sol.create("sol.common.Injection").inject(me);
      me.setIteratorFields();
      me.$super("sol.common.ix.DynKwlFindChildrenIterator", "initialize", [config]);
    } else {
      throw "kwlPath is not defined in subclass";
    }
  },

  setKwlPath: function () {
    var me = this;

    me.inject.kwl.prop = me.kwlPath;
  },

  setIteratorFields: function () {
    var me = this;

    me.parentId = me.kwl.generatorConfig.templatesFolder;
    me.tableKeyNames = [me.kwl.generatorConfig.generatorTemplateField, null];
    me.tableTitle = me.kwl.kwlConfig.tableTitle;
  }
});
