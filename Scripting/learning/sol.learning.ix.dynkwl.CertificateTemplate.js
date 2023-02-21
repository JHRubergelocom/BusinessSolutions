
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 *
 * Dynamic keyword list that returns a list of the generator types for "Post Reference".
 *
 * The list is returned as a table.
 *
 * |Name|Description|Example data|
 * |:-----|:------|:------|
 * |Short Description|COURSE_CERTIFICATE_TEMPLATE|Name of the generator
 * |Description|-|Description of the generator (memo text)|
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.Logger
 * @requires sol.common.Config
 * @requires sol.common.ix.DynKwlFindChildrenIterator
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.dynkwl.generators.CertificateTemplate", {
  extend: "sol.common.ix.DynKwlFindChildrenIterator",

  mixins: ["sol.learning.mixins.Configuration"],

  inject: {
    _parentId: { config: "learning", prop: "entities.course.dynkwls.certificatetemplate.parentId" }
  },

  initialize: function (params) {
    var me = this, terms = sol.common.TranslateTerms;

    sol.create("sol.common.Injection").inject(me);

    me.parentId = me._parentId;

    terms.require("sol.learning.dynkwl.CertificateTemplate");
    me.tableTitle = terms.translate("sol.learning.dynkwl.CertificateTemplate.tableTitle");
    me.tableHeaders = [
      terms.translate("sol.learning.dynkwl.CertificateTemplate.tableHeaders.name"),
      terms.translate("sol.learning.dynkwl.CertificateTemplate.tableHeaders.description")
    ];

    me.$super("sol.common.ix.DynKwlFindChildrenIterator", "initialize", [params]);
  },

  /**
   * @cfg
   * @inheritdoc
   */
  tableKeyNames: ["COURSE_CERTIFICATE_TEMPLATE", null],

  /**
   * @cfg
   * defined by initialize
   */
  parentId: null
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.learning.ix.dynkwl.generators.CertificateTemplate
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.learning.ix.dynkwl.generators.CertificateTemplate" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.learning.ix.dynkwl.generators.CertificateTemplate", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
