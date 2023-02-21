
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 * @class sol.contract.ix.dynkwl.generators.ContractShortDescription
 *
 * Dynamic keyword list that returns a list of the generator type: Contract Short description.
 *
 * The list is returned as a table.
 *
 * |Name|Description|Example data|
 * |:-----|:------|:------|
 * |Short Description|CONTRACT_SHORT_DESC_GEN|Name of the generator|
 * |Description|-|Description of the generator|
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */
var configPath = "/contract/Configuration/kwl.config",
    kwlName = "Contract shortdescription generators";
