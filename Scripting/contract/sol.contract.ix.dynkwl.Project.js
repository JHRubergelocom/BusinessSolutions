
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 * @class sol.contract.ix.dynkwl.Project
 *
 * Dynamic keyword list that queries the projects database.
 * The list of current fields is returned as a table.
 *
 * |Name|Key|Example data|
 * |:-----|:------|:------|
 * |Project no|PROJECT_NO|13322|
 * |Project name|PROJECT_NAME|Accounting process improvements|
 *
 * Limits results to RECIPIENT_NO.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */
var configPath = "/contract/Configuration/kwl.config",
    kwlName = "Projects";
