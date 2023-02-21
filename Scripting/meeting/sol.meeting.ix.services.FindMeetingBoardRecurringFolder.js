importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.meeting.ix.services.SordProvider.Base.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.FindMeetingItemListFolder" });


/**
 * Retrieves Meeting Board recurring sord object.
 *
 * @author ELO Digital Office GmbH
 *
 * @requires sol.common.RfUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.mixins.Inject
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.meeting.ix.services.SordProvider.Base
 */
sol.define("sol.meeting.ix.services.FindMeetingBoardRecurringItemFolder", {
  extend: "sol.meeting.ix.services.SordProvider.Base",

  _optimized: {},

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],
  inject: {
    service: { config: "meetingBoard", prop: "meetingBoards.services.GetBoardRecurringItemFolder", template: true },
    output: { config: "meetingBoard", prop: "meetingBoards.outputs.minSord", template: false },
    sord: { sordIdFromProp: "objId", optional: false }
  }
});

/**
 * @member
 * @method
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
 function RF_sol_meeting_function_FindMeetingBoardRecurringItemFolder(iXSEContext, args) {
  var params, command, result;
  logger.enter("RF_sol_meeting_function_FindMeetingBoardRecurringItemFolder", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  command = sol.create("sol.meeting.ix.services.FindMeetingBoardRecurringItemFolder", params);

  result = command.process();
  logger.exit("RF_sol_meeting_function_FindMeetingBoardRecurringItemFolder");
  return sol.common.JsonUtils.stringifyAll(result);
}
