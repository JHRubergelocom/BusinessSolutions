
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ix.GenericDynKwl.js

/**
 * @class sol.meeting.ix.dynkwl.generators.MeetingNo
 *
 * Dynamic keyword list that returns a list of the generator type: Meeting number
 *
 * The list is returned as a table.
 *
 * |Name|Description|Example data|
 * |:-----|:------|:------|
 * |Short Description|MEETING_NO_GEN|Name of the generator|
 * |Description|-|Description of the counter|
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @requires sol.common.ix.GenericDynKwl
 */
var configPath = "/meeting/Configuration/generatorsKwls.config",
    kwlName = "meetingNo";
