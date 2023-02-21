
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 * @class sol.contract.ix.dynkwl.CostCenter
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
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */

var configPath = "/contract/Configuration/kwl.config",
    kwlName = "Cost centers";
