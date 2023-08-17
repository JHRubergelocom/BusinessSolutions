
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.meeting.note.ix.Note.js
//@include lib_sol.meeting.task.ix.Task.js
//@include lib_sol.meeting.voting.ix.Voting.js
//@include lib_sol.meeting.ix.dynkwl.Contact.Base.js
//@include lib_sol.meeting.ix.dynkwl.DynKwlFindChildrenSordNameIterator.Base.js
//@include lib_sol.meeting.ix.localizedKwl.Base.js
//@include lib_sol.meeting.ix.Meeting.js
//@include lib_sol.meeting.ix.services.SordProvider.Base.js
//@include sol.meeting.ix.services.GetLocalizedKeywordListValues.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.meeting.ix.services.ExecuteLib1" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_meeting_service_ExecuteLib1', {
 *       className: 'sol.meeting.Utils',
 *       classConfig: {}
 *       method: 'getPathOfUsersPersonnelFile',
 *       params: [["Administrator", {}]]
 *     });
 *
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.meeting.ix.services.ExecuteLib1", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["className", "classConfig", "method", "params"],

  /**
   * @cfg {String} className Class name.
   */

  /**
   * @cfg {Object} classConfig configuration for class initialization.
   */

  /**
   * @cfg {String} method Method name.
   */

  /**
   * @cfg {Object[]} params Method parameters array.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this,
        result = {},
        cls, func;

    switch (me.className) {
      case "sol.meeting.ix.actions.EndMeeting":
      case "sol.meeting.ix.actions.FinalizeAgenda":
      case "sol.meeting.ix.actions.StartMeeting":
      case "sol.meeting.ix.actions.MoveItem":
      case "sol.meeting.ix.actions.ProposalRecord":
      case "sol.meeting.ix.actions.RecordDecision":
      case "sol.meeting.ix.actions.RecordMinutes":
      case "sol.common.ix.DynKwlMultiIndexIterator":
      case "sol.meeting.ix.dynkwl.MeetingBoards":
      case "sol.meeting.ix.dynkwl.MeetingIterator":
      case "sol.meeting.ix.dynkwl.MoveToMeeting":
      case "sol.meeting.ix.dynkwl.notification.meetingBoard.templates":
      case "sol.meeting.ix.dynkwl.notification.meeting.template":
      case "sol.meeting.ix.dynkwl.ProposalTypesMultiIndex":
      case "sol.meeting.ix.dynkwl.TargetMeeting":
      case "sol.meeting.voting.ix.localizedKwl.Implementation":
      case "sol.meeting.ix.localizedKwl.MeetingInvitationStatus":
      case "sol.meeting.ix.localizedKwl.MeetingItemStatus":
      case "sol.meeting.ix.localizedKwl.MeetingPersonRole":
      case "sol.meeting.ix.localizedKwl.MeetingStatus":
      case "sol.meeting.ix.localizedKwl.MemberStatus":
      case "sol.meeting.ix.localizedKwl.ProposalStatus":
      case "sol.meeting.voting.ix.localizedKwl.QuorumType":
      case "sol.meeting.ix.localizedKwl.ResolutionStatus":
      case "sol.meeting.note.ix.localizedKwl.Status":
      case "sol.meeting.note.ix.localizedKwl.Visibility":
      case "sol.meeting.voting.ix.localizedKwl.Status":
      case "sol.meeting.task.ix.localizedKwl.TaskStatus":
      case "sol.meeting.ix.functions.RuleEngineProcessor":
      case "sol.meeting.ix.functions.CreateContact":
      case "sol.meeting.ix.functions.CreateInvitationHeadless":
      case "sol.meeting.ix.functions.CreateMeetingHeadless":
      case "sol.meeting.ix.functions.CreateShellItem":
      case "sol.meeting.ix.functions.DeleteItem":
      case "sol.meeting.ix.functions.DeleteShellItem":
      case "sol.meeting.ix.functions.FeedComment":
      case "sol.meeting_groupware.ix.functions.ProcessEvent":
      case "sol.meeting.ix.function.FillItem":
      case "sol.meeting.ix.functions.CalcNextRecurringItemNo":
      case "sol.meeting.ix.functions.generators.MeetingItemNo":
      case "sol.meeting.ix.functions.generators.MeetingItemPoolNo":
      case "sol.meeting.ix.functions.generators.MeetingItemShortDesc":
      case "sol.meeting.ix.functions.generators.MeetingNo":
      case "sol.meeting.ix.functions.generators.MeetingShortDesc":
      case "sol.meeting.ix.functions.generators.GenerateNoteReference":
      case "sol.meeting.ix.functions.generators.PersonShortDesc":
      case "sol.meeting.ix.functions.generators.ProposalShortGen":
      case "sol.meeting.ix.functions.generators.ResolutionNo":
      case "sol.meeting.ix.functions.MeetingBoardPostCondition":
      case "sol.meeting.ix.functions.MoveAgendaItem":
      case "sol.meeting.ix.functions.MoveToNotifications":
      case "sol.meeting.ix.functions.Notify":
      case "sol.meeting.ix.functions.PostponeMeetingItem":
      case "sol.meeting.ix.functions.PrepareItemsToMove":
      case "sol.meeting.ix.functions.PrepareMeeting":
      case "sol.meeting.ix.functions.PrepareMessage":
      case "sol.meeting.ix.functions.RemoveItemAcl":
      case "sol.meeting.ix.functions.RemoveNotification":
      case "sol.meeting.ix.functions.RemoveParticipants":
      case "sol.meeting.ix.functions.ResetTimedEvents":
      case "sol.meeting.ix.functions.ScheduleMeeting":
      case "sol.meeting.ix.functions.SyncAgenda":
      case "sol.meeting.ix.functions.UpdateLinkedItem":
      case "sol.meeting.ix.functions.UpdateShellItem":
      case "sol.meeting.ix.services.ActionCheck":
      case "sol.meeting.ix.services.AgendaPool":
      case "sol.meeting.ix.services.CollectNotificationData":
      case "sol.meeting.ix.services.CreateMeetingMinutesPrecondition":
      case "sol.meeting.note.ix.functions.CreateNote":
      case "sol.meeting.note.ix.functions.EditNote":
      case "sol.meeting.task.ix.functions.CheckUser":
      case "sol.meeting.task.ix.functions.TerminateAssignTask":
      case "sol.meeting.task.ix.functions.SetFlowId":
      case "sol.meeting.task.ix.services.CreateTask":
      case "sol.meeting.task.ix.services.DeleteTask":
      case "sol.meeting.voting.ix.services.CreateVoting":
      case "sol.meeting.voting.ix.services.DeleteVoting":
      case "sol.meeting.ix.services.FindMeetingBoardTypes":
      case "sol.meeting.ix.services.GetClips":
      case "sol.meeting.ix.services.GetMeetingDocumentData":
      case "sol.meeting.ix.services.GetMeetingItemTypes":
      case "sol.meeting.ix.services.GetMeetingOrganizerData":
      case "sol.meeting.ix.services.GetMeetings":
      case "sol.meeting.ix.services.GetMembers":
      case "sol.meeting.ix.services.GetParticipants":
      case "sol.meeting.ix.services.GetProposal":
      case "sol.meeting.ix.services.GetProposalTypes":
      case "sol.meeting.ix.services.GetResolutionActionTypes":
      case "sol.common.GetUserIds":
      case "sol.meeting.ix.services.ItemContainer":
      case "sol.meeting.ix.services.ItemStructural":
      case "sol.meeting.ix.services.Meeting":
      case "sol.meeting.ix.services.MeetingItem":
      case "sol.meeting.ix.services.OrganizerPrecondition":
      case "sol.meeting.ix.services.WithdrawMeetingItem":
      case "sol.meeting.services.CancelMeetingPreCondition":
      case "sol.meeting.services.CreateProposalPreCondition":
      case "sol.meeting.services.GetLocalizedKeywordListValues":
      case "sol.meeting.services.MeetingBoardPrecondition":
      case "sol.meeting.services.MeetingDocumentPrecondition":
      case "sol.meeting.services.MeetingItemPoolPrecondition":
      case "sol.meeting.services.MeetingItemPrecondition":
      case "sol.meeting.services.MeetingPrecondition":
      case "sol.meeting.services.PostponeMeetingPreCondition":
      case "sol.meeting.services.WithdrawMeetingItemPrecondition":
      case "sol.meeting.note.ix.services.DeleteNote":
      case "sol.meeting.note.ix.services.GetNoteById":
      case "sol.meeting.voting.services.UpdateVoting":
      case "sol.meeting.voting.ix.functions.VotingEdit":
      case "sol.meeting_premium.services.MeetingFilePrecondition":
        return result;
      default:
    }

    me.classConfig.ec = me.ec;

    switch (me.className) {
      case "sol.meeting.note.ix.Note":
      case "sol.meeting.task.ix.Task":
      case "sol.meeting.voting.ix.Voting":
        switch (me.method) {
          case "initialize":
          case "validateAndGet":
          case "checkPermissions":
            return result;
          default:
        }
        break;
      case "sol.meeting.task.ix.Tasks":
      case "sol.meeting.voting.ix.Votings":
        switch (me.method) {
          case "get":
          case "updateDesc":
            return result;
          default:
        }
        break;
      case "sol.meeting.ix.actions.ProposalRecord":
        switch (me.method) {
          case "process":
            return result;
          default:
        }
        break;
      case "sol.common.ix.DynKwlMultiIndexIterator":
        switch (me.method) {
          case "getNextRow":
          case "hasMoreRows":
            return result;
          default:
        }
        break;
      case "sol.meeting.ix.dynkwl.Contact.Base":
      case "sol.meeting.ix.dynkwl.DynKwlFindChildrenSordNameIterator.Base":
      case "sol.meeting.ix.localizedKwl.Base":
      case "sol.meeting.ix.functions.ChangeRights":
      case "sol.meeting.ix.functions.ChangeSubWorkflow":
      case "sol.meeting.ix.functions.CopyFolderContentsElementServiceAdapter":
      case "sol.meeting.ix.services.InjectConfig":
        return result;
      case "sol.meeting.ix.dynkwl.notification.meeting.template":
      case "sol.meeting.ix.dynkwl.notification.meetingBoard.templates":
        switch (me.method) {
          case "open":
          case "openMap":
            return result;
          default:
        }
        break;
      case "sol.meeting.ix.functions.CreateInvitationHeadless":
        switch (me.method) {
          case "persist":
          case "setMetaData":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.meeting.ix.functions.RuleEngineProcessor":
        switch (me.method) {
          case "execute":
            return result;
          default:
        }
        break;
      case "sol.meeting.ix.services.SordProvider.Base":
        switch (me.method) {
          case "process":
          case "search":
            return result;
          default:
        }
        break;
      case "sol.meeting.task.ix.services.CreateTask":
        switch (me.method) {
          case "createTask":
          case "updateTaskStatus":
            return result;
          default:
        }
        break;
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.meeting.ix.services.ActionCheck":
        switch (me.method) {
          case "CONTAINS":
          case "EQUALS":
          case "NOT_CONTAINS":
          case "NOT_EQUALS":
          case "NOT_STARTSWITH":
          case "STARTSWITH":
            func = cls.fct[me.method];
            break;
          default:
        }
        break;
      case "sol.meeting.ix.services.CollectNotificationData":
        switch (me.method) {
          case "equals":
          case "getFirstResult":
            func = cls.utils[me.method];
            break;
          case "getNotificationTemplate":
          case "getRecipients":
            me.params[0] = cls.getParameters();
            break;
          default:
        }
        break;
      case "sol.meeting.ix.services.Meeting":
        switch (me.method) {
          case "findItems":
            me.params[0] = sol.create("sol.meeting.ix.Meeting", me.classConfig.objId);
            break;
          default:
        }
        break;
      case "sol.meeting.voting.services.UpdateVoting":
        switch (me.method) {
          case "calculateVotes":
          case "updateVoting":
            return result;
          default:
        }
        break;
      default:
    }

    if (sol.common.ObjectUtils.isFunction(func)) {
      result = func.apply(cls, me.params);
    } else {
      throw "IllegalMethodException: Method '" + me.method + "' not supported in Class '" + me.className + "'";
    }

    return result;
  }
});

/**
 * @member sol.unittest.meeting.ix.services.ExecuteLib1
 * @method RF_sol_unittest_meeting_service_ExecuteLib1
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_meeting_service_ExecuteLib1(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_meeting_service_ExecuteLib1", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.meeting.ix.services.ExecuteLib1", params);
  result = service.process();
  logger.exit("RF_sol_unittest_meeting_service_ExecuteLib1", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

function RF_sol_unittest_meeting_service_Test(ec, args) {
  return "{}";
}