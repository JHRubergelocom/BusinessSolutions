
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 * @class sol.meeting.ix.dynkwl.ProposalTypes
 *
 * Dynamic keyword list that returns a list of available proposal type templates
 *
 * The list is returned as a table.
 *
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */
var configPath = "/meeting/Configuration/kwl.config",
    kwlName = "proposalTypeTemplates";