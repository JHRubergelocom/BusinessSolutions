
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 * @class sol.knowledge.ix.dynkwl.PostTypes
 *
 * Dynamic keyword list that returns a list of available knowledge post type templates
 *
 * The list is returned as a table.
 *
 * |Name|Description|Example data|
 * |:-----|:------|:------|
 * |Short Description|WF_MAP_SESSION_TEMPLATE|Template name|
 *
 * @author PB, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */
var configPath = "/knowledge/Configuration/kwl.config",
    kwlName = "Post Type Templates";
