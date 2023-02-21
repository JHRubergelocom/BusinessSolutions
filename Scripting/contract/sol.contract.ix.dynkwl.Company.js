
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 * @class sol.contract.ix.dynkwl.Company
 *
 * Dynamic keyword list that queries the recipients (company) database.
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
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */

var configPath = "/contract/Configuration/kwl.config",
    kwlName = "Companies";
