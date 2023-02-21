
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 * @class sol.learning.ix.dynkwl.SessionTemplates
 *
 * Dynamic keyword list that returns a list of available personnel file templates
 *
 * The list is returned as a table.
 *
 * |Name|Description|Example data|
 * |:-----|:------|:------|
 * |Short Description|WF_MAP_SESSION_TEMPLATE|Template name|
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */
var configPath = "/learning/Configuration/kwl.config",
    kwlName = "Session Templates";
