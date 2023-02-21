
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.learning.ix.dynkwl.notification.template.base.js

/**
 * @class sol.learning.ix.dynkwl.notification.template
 *
 * Dynamic keyword list that returns a list of available notification templates
 *
 * The list is returned as a table.
 *
 *
 * @author ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.Injection
 * @requires sol.learning.ix.dynkwl.notification.template.base
 */
sol.define("sol.learning.ix.dynkwl.NotifyTemplate", {
  extend: "sol.learning.ix.dynkwl.notification.template.base",

  $configRelation: {
    kwl: "/learning/Configuration/kwl.config"
  },

  inject: {
    config: { config: "kwl", prop: "notifytemplate" },
    tableTitle: { config: "kwl", prop: "notifytemplate.title" },
    tableHeaders: { config: "kwl", prop: "notifytemplate.header" },
    tableKeyNames: { config: "kwl", prop: "notifytemplate.output" },
    dataFields: { config: "kwl", prop: "notifytemplate.dataFields" },
    parentId: { config: "kwl", prop: "notifytemplate.parentId" },
    parentFieldKey: { config: "kwl", prop: "notifytemplate.parent.fieldKey" },
    parentFromService: { config: "kwl", prop: "notifytemplate.parent.fromService" }
  }
});

/**
 * Implements a localized keyword list for NotifyTemplate
 * @static
 * @member sol.learning.ix.dynkwl.NotifyTemplate
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.learning.ix.dynkwl.NotifyTemplate" }),
      iterator;
  try {
    log.info("LocalizedKeywordList (");
    iterator = sol.create("sol.learning.ix.dynkwl.NotifyTemplate", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
