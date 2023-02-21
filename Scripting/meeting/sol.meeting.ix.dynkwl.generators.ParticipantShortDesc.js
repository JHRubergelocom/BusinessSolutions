
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 * @class sol.contract.ix.dynkwl.generators.ParticipantShortDesc
 *
 * Dynamic keyword list that returns a list of the generator type: Participant short desc
 *
 * The list is returned as a table.
 *
 * |Name|Description|Example data|
 * |:-----|:------|:------|
 * |Short Description|PARTICIPANT_SHORT_DESC_GEN|Name of the generator|
 * |Description|-|Description of the counter|
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */
var configPath = "/meeting/Configuration/generatorsKwls.config",
    kwlName = "participantShortDesc";
