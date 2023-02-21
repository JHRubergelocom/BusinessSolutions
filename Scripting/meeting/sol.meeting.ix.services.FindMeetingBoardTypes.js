importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.meeting.ix.services.SordProvider.Base.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.FindMeetingBoardTypes" });


/**
 * Retrieve available meeting boards
 *
 * @author ELO Digital Office GmbH
 *
 * @requires sol.common.RfUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.mixins.Inject
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.meeting.ix.services.SordProvider.Base
 *
 * TODO: should rename because we use this function in action definition type selection handler
 */
sol.define("sol.meeting.ix.services.FindMeetingBoardTypes", {
  extend: "sol.meeting.ix.services.SordProvider.Base",

  _optimized: {},

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    service: { config: "meetingBoard", prop: "meetingBoards.services.GetBoardTypes.args", template: true },
    sord: { sordIdFromProp: "objId", optional: true }
  },

  /**
   * Override output function because output formatter is provided by service directly
   * @protected
   * @returns output definition for sordprovider
   */
  getOutput: function () {
    var me = this;
    return me.service.output;
  },

  preProcessing: function () {
    var me = this,
      solType = sol.common.ObjectUtils.getProp(me.sord, "objKeys.SOL_TYPE");

    me.logger.debug(["current sord selection {0}", JSON.stringify(me.sord)]);

    if (solType === "MEETING_BOARD") {
      return me.asElementService(me.sord);
    }

    //continue searching
    return true;
  },

  asElementService: function (templateSord) {
    return { sords: [templateSord] };
  }
});

/**
 * @member
 * @method
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_FindMeetingBoardTypes(iXSEContext, args) {
  var params, command, result;
  logger.enter("RF_sol_meeting_function_FindMeetingBoardTypes", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  command = sol.create("sol.meeting.ix.services.FindMeetingBoardTypes", params);

  result = sol.common.ix.RfUtils.stringify(command.process().sords);
  logger.exit("RF_sol_meeting_function_FindMeetingBoardTypes");
  return result;
}