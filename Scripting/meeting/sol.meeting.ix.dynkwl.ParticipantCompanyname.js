
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 *
 * Dynamic keyword list that returns the sord content of contacts selected by solution object type.
 *
 *
 *
 * @author EOe, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */
var configPath = "/meeting/Configuration/kwl.config",
    kwlName = "participantCompanyname";