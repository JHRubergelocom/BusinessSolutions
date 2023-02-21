
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.DynKwlDatabaseIterator.js

/**
 * @class sol.hr.ix.dynkwl.CostCenter
 *
 * Dynamic keyword list that queries the cost center database.
 * The list of current fields is returned as a table.
 *
 * |Name|Key|Example data|
 * |:-----|:------|:------|
 * |Cost center id|IX_MAP_INVI_COSTCENTER_NO|122|
 * |Cost center name|IX_MAP_INVI_COSTCENTER_NAME|Materials store|
 *
 * Limits results to COMPANY_CODE.
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.DynKwlDatabaseIterator
 */
sol.define("sol.hr.ix.dynkwl.CostCenter", {
  extend: "sol.common.ix.DynKwlDatabaseIterator",

  initialize: function (config) {
    var me = this,
        terms = sol.common.TranslateTerms;

    terms.require("sol.hr.dynkwl.costcenter");
    terms.require("sol.hr.dynkwl.message");

    me.tableTitle = terms.translate("sol.hr.dynkwl.costcenter.tableTitle");

    me.tableHeaders = [
      terms.translate("sol.hr.dynkwl.costcenter.tableHeaders.no"),
      terms.translate("sol.hr.dynkwl.costcenter.tableHeaders.name")
    ];

    me.sqlQuery = "SELECT no, name from sol_accounting_costcenter WHERE LOWER(company_code) = LOWER(?) AND (LOWER(no) LIKE LOWER(?) OR LOWER(name) LIKE LOWER(?)) ORDER BY name";

    me.sqlParams = [
      { name: "HR_PERSONNEL_TENANT", message: terms.translate("sol.hr.dynkwl.message.selectcompany") },
      { mode: "STARTS_WITH" },
      { mode: "CONTAINS" }
    ];

    me.tableKeyNames = ["IX_GRP_HR_PERSONNEL_COSTCENTER", "IX_MAP_HR_PERSONNEL_COSTCENTER_NAME"];

    me.$super("sol.common.ix.DynKwlDatabaseIterator", "initialize", [config]);
  }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.hr.ix.dynkwl.Company
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.hr.ix.dynkwl.CostCenter" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.hr.ix.dynkwl.CostCenter", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
