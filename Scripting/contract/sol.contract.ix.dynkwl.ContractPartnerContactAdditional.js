
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 * @class sol.contract.ix.dynkwl.ContractPartnerContactAdditional
 *
 * Dynamic keyword list that returns the sord content of contacts selected by solution object type.
 *
 * This list can be used if additional partners should be added to the contract.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */

var configPath = "/contract/Configuration/kwl.config",
    kwlName = "Additional contract partner contacts";
