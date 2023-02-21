
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 * @class sol.contract.ix.dynkwl.Currency
 *
 * Dynamic keyword list that queries the currency database including exchange rates.
 * The list of current fields is returned as a table.
 *
 * |Name|Key|Example data|
 * |:-----|:------|:------|
 * |Currency code|CONTRACT_CURRENY_CODE|USD|
 * |Currency symbol|CONTRACT_CURRENY_SYMBOL|€|
 * |Exchange rate (USD to EUR)|CONTRACT_FX_RATE|1.1|
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */
var configPath = "/contract/Configuration/kwl.config",
    kwlName = "Currencies";
