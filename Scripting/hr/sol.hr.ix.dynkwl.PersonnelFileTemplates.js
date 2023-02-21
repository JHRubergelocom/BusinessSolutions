
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 * @class sol.hr.ix.dynkwl.PersonnelFileTemplates
 *
 * Dynamic keyword list that returns a list of available personnel file templates
 *
 * The list is returned as a table.
 *
 * |Name|Description|Example data|
 * |:-----|:------|:------|
 * |Short Description|WF_MAP_RECRUITING_FILE_TEMPLATE|Template name|
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */
var configPath = "/hr/Configuration/kwl.config",
    kwlName = "Personnel File Templates";
