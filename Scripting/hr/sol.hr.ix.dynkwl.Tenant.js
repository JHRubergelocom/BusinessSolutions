
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.DynKwlDatabaseIterator.js

/**
 * @class sol.hr.ix.dynkwl.Tenant
 *
 * Dynamic keyword list that queries the recipients database.
 *
 * The list of current fields is returned as a table.
 *
 * |Name|Key|Example data|
 * |:-----|:------|:------|
 * |Company Code|COMPANY_NO|122|
 * |Name|COMPANY_NAME|ELO Digital Office GmbH|
 * |Street|COMPANY_ADDRESS_STREET|TuebingerStr. 34|
 * |Zip code|COMPANY_ADDRESS_ZIPCODE|70178|
 * |City|COMPANY_ADDRESS_CITY|Stuttgart|
 * |Country|COMPANY_ADDRESS_COUNTRY|DE|
 *
 * Limits results to COMPANY_NO.
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.DynKwlDatabaseIterator
 */
sol.define("sol.hr.ix.dynkwl.Tenant", {
  extend: "sol.common.ix.DynKwlDatabaseIterator",

  initialize: function (config) {
    var me = this,
        terms = sol.common.TranslateTerms;

    terms.require("sol.hr.dynkwl.tenant");

    me.tableTitle = terms.translate("sol.hr.dynkwl.tenant.tableTitle");

    me.tableHeaders = [
      terms.translate("sol.hr.dynkwl.tenant.tableHeaders.no"),
      terms.translate("sol.hr.dynkwl.tenant.tableHeaders.name"),
      terms.translate("sol.hr.dynkwl.tenant.tableHeaders.street"),
      terms.translate("sol.hr.dynkwl.tenant.tableHeaders.postcode"),
      terms.translate("sol.hr.dynkwl.tenant.tableHeaders.city"),
      terms.translate("sol.hr.dynkwl.tenant.tableHeaders.country")
    ];

    me.sqlQuery = "SELECT code, name, street, zipcode, city, country_code FROM sol_company where LOWER(code) LIKE LOWER(?) OR LOWER(name) like LOWER(?) OR LOWER(gln) LIKE LOWER(?)";

    me.sqlParams = [
      { mode: "STARTS_WITH" },
      { mode: "CONTAINS" },
      { mode: "STARTS_WITH" }
    ];

    me.tableKeyNames = ["HR_PERSONNEL_TENANT", "IX_MAP_HR_PERSONNEL_TENANT_NAME", null, null, null, null];

    me.$super("sol.common.ix.DynKwlDatabaseIterator", "initialize", [config]);
  }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.hr.ix.dynkwl.Tenant
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.hr.ix.dynkwl.Tenant" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.hr.ix.dynkwl.Tenant", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
