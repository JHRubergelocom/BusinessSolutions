importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.meeting.ix.MeetingBoardUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.MeetingBoardPostCondition" });


/**
* Checks several postconditions after a meeting board was created.
*
*
* @author EOe, ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.Injection
* @requires sol.common.ix.FunctionBase
* @requires sol.common.TranslateTerms
* @requires sol.meeting.mixins.Configuration
* @requires sol.meeting.ix.MeetingBoardUtils

*/
sol.define("sol.meeting.ix.functions.MeetingBoardPostCondition", {
  extend: "sol.common.ix.FunctionBase",

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    boardService: { config: "meetingBoard", prop: "meetingBoards.services.GetBoard", template: true },
    boardOutput: { config: "meetingBoard", prop: "meetingBoards.outputs.meetingBoard" },
    sord: { sordIdFromProp: "objId" }
  },

  process: function () {
    var me = this, passedCondition, meetingBoardResult;

    meetingBoardResult = sol.meeting.ix.MeetingBoardUtils.findAllMeetingBoards(me.boardService, me.boardOutput, {
      optimizationName: "meetingBoardCode"
    });

    // Board code should be unique
    passedCondition = me.boardCodeIsUnique(meetingBoardResult);

    if (!passedCondition) {
      throw Error(sol.common.TranslateTerms.translate('sol.meeting.error.meetingBoard.postCondition.boardCode.alreadyExists'));
    }

    return passedCondition;
  },

  /**
  * @param {*} meetingBoardResult
  * @return {Boolean}
  */
  boardCodeIsUnique: function (meetingBoardResult) {
    var me = this,
      isUnique;
    // Since this is a postcondition, the respective meeting board is already created and therefore always included in the search result
    isUnique = meetingBoardResult.length <= 1 && meetingBoardResult[0].id == me.sord.id;

    return isUnique;
  }



});

/**
 * @member sol.meeting.ix.functions.MeetingBoardPostCondition
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(client, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_MeetingBoardPostCondition", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
    module;

  params.objId = String(wFDiagram.objId);
  params.flowId = wFDiagram.id;
  module = sol.create("sol.meeting.ix.functions.MeetingBoardPostCondition", params);
  module.process();

  logger.exit("onEnterNode_MeetingBoardPostCondition");
}

/**
 * @member sol.meeting.ix.functions.MeetingBoardPostCondition
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_MeetingBoardPostCondition", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
    module;

  params.objId = String(wFDiagram.objId);
  params.flowId = wFDiagram.id;
  module = sol.create("sol.meeting.ix.functions.MeetingBoardPostCondition", params);
  module.process();

  logger.exit("onExitNode_MeetingBoardPostCondition");
}

/**
* @member sol.meeting.ix.functions.MeetingBoardPostCondition
* @method RF_sol_meeting_function_MeetingBoardPostCondition
* @static
* @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
*/
function RF_sol_meeting_function_MeetingBoardPostCondition(context, args) {
  logger.enter("RF_sol_meeting_function_MeetingBoardPostCondition", args);
  var params, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args);
  params.user = ixConnect.loginResult.user.name;

  result = sol.create("sol.meeting.ix.functions.MeetingBoardPostCondition", params).process();

  logger.exit("RF_sol_meeting_function_MeetingBoardPostCondition", result);

  return result;
}