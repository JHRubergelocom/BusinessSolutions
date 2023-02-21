
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include sol.hr.ix.dynkwl.PersonnelFileIterator.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Dynamic keyword list that returns the sord content of authorities selected by solution object type.
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.hr.ix.dynkwl.PersonnelFileIterator
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.hr.ix.dynkwl.SuperiorNewIterator", {
  extend: "sol.hr.ix.dynkwl.PersonnelFileIterator",

  mixins: ["sol.hr.mixins.Configuration"],

  inject: {
    dynkwl: { config: "hr", prop: "entities.file.dynkwls.superiornew", template: true }, // {}
    useUserForPFList: { config: "hr", prop: "entities.file.dynkwls.personnelfile.useUserForPFList", template: false } // Bool
  },

  initialize: function (config) {
    var me = this;

    sol.create("sol.common.Injection").inject(me);

    me.tableTitle = me.dynkwl.tableTitle;
    me.tableHeaders = me.dynkwl.tableHeaders;
    me.tableKeyNames = me.dynkwl.tableKeyNames;
    me.rowDataFields = me.dynkwl.rowDataFields;
    me.solType = me.dynkwl.solType;
    me.displayNameTemplate = me.dynkwl.displayNameTemplate;
    me.useUserForPFList = me.useUserForPFList;

    me.$super("sol.hr.ix.dynkwl.PersonnelFileIterator", "initialize", [config]);
  }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.hr.ix.dynkwl.SuperiorNewIterator
 * @return {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.hr.ix.dynkwl.SuperiorNewIterator" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.hr.ix.dynkwl.SuperiorNewIterator", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}

