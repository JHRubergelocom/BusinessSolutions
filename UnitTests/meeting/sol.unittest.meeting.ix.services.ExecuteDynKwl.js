
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.DynKwlDatabaseIterator.js
//@include lib_sol.common.ix.DynKwlSearchIterator.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.common.ix.GenericDynKwl.js
//@include sol.common.ix.dynkwl.DynKwlMultiIndexIterator.js
//@include lib_sol.meeting.ix.dynkwl.Contact.Base.js
//@include lib_sol.meeting.ix.dynkwl.DynKwlFindChildrenSordNameIterator.Base.js
//@include sol.meeting.ix.dynkwl.PersonFormOfAddressTemplate.js
//@include sol.meeting.ix.dynkwl.PersonFormOfAddressTemplateBoardMember.js
//@include sol.meeting.ix.dynkwl.PersonFormOfAddressTemplateWorkflowMap.js
//@include sol.meeting.ix.dynkwl.notification.meeting.template.js
//@include sol.meeting.ix.dynkwl.notification.meetingBoard.template.js
//@include sol.meeting.ix.dynkwl.MeetingBoards.js
//@include sol.meeting.ix.dynkwl.MeetingContact.js
//@include sol.meeting.ix.dynkwl.MeetingContactTypeMember.js
//@include sol.meeting.ix.dynkwl.MeetingContactWorkflowMap.js
//@include sol.meeting.ix.dynkwl.MoveToMeeting.js
//@include sol.meeting.ix.dynkwl.ProposalTypesMultiIndex.js
//@include sol.meeting.ix.dynkwl.MeetingIterator.js
//@include sol.meeting.ix.dynkwl.ResponsibleUserNames.js
//@include sol.meeting.ix.dynkwl.SpeakerUserNames.js
//@include sol.meeting.ix.dynkwl.TargetMeeting.js
//@include sol.meeting.ix.localizedKwl.Base.js
//@include sol.meeting.ix.localizedKwl.CalendarUnit.js
//@include sol.meeting.ix.localizedKwl.CalendarUnitDeadline.js
//@include sol.meeting.ix.localizedKwl.MeetingInvitationStatus.js
//@include sol.meeting.ix.localizedKwl.MeetingItemStatus.js
//@include sol.meeting.ix.localizedKwl.MeetingPersonRole.js
//@include sol.meeting.ix.localizedKwl.MeetingStatus.js
//@include sol.meeting.ix.localizedKwl.MemberStatus.js
//@include sol.meeting.ix.localizedKwl.notification.ParticipantSearchTemplates.js
//@include sol.meeting.ix.localizedKwl.ParticipantPresence.js
//@include sol.meeting.ix.localizedKwl.PlusMinusSign.js
//@include sol.meeting.ix.localizedKwl.ProposalStatus.js
//@include sol.meeting.ix.localizedKwl.ReferenceDates.js
//@include sol.meeting.ix.localizedKwl.ResolutionStatus.js
//@include sol.meeting.note.ix.localizedKwl.Status.js
//@include sol.meeting.note.ix.localizedKwl.Visibility.js
//@include sol.meeting.task.ix.localizedKwl.TaskStatus.js
//@include sol.meeting.voting.ix.localizedKwl.Implementation.js
//@include sol.meeting.voting.ix.localizedKwl.QuorumType.js
//@include sol.meeting.voting.ix.localizedKwl.Status.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.meeting.ix.services.ExecuteDynKwl" });

/**
 * Unittests of dynamic keyword list.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_meeting_service_ExecuteDynKwl', {
 *       objId: 5201,
 *       dynKwl: 'sol.unittest.ix.dynkwl.UserNames',
 *       providerConfig: {
 *          tableTitle :'Benutzerinfos',
 *          tableHeaders: ['ID', 'Name'],
 *          userIdFieldName:"Benutzer-ID"
 *       },
 *       "inputFieldName": "UNITTEST_FIELD2"
 *     });
 *
 * *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.meeting.ix.services.ExecuteDynKwl", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId", "dynKwl", "providerConfig", "inputFieldName"],

  /**
   * @cfg {String} objId Sord objId.
   */

  /**
   * @cfg {String} dynKwl Dnynamic Keyword list script name.
   */

  /**
   * @cfg {Object} providerConfig Provider Configuration.
   */

  /**
   * @cfg {Object} inputFieldName Input field.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Call the dynamic keyword list and returns the result
   * @return {String|Object} result of dynamic keyword list
   */
  process: function () {
    var me = this,
        result = {},
        resultData = [],
        provider, sord;

    switch (me.dynKwl) {
      case "sol.meeting.ix.dynkwl.Contact.Base":
      case "sol.meeting.ix.dynkwl.DynKwlFindChildrenSordNameIterator.Base":
        return { keynames: [], header: [], title: "", data: [] };
      default:
    }

    try {

      if (me.dynKwl == "sol.common.ix.GenericDynKwl") {
        provider = sol.create("sol.common.ix.GenericDynKwl", me.providerConfig).getProvider();
      } else {
        provider = sol.create(me.dynKwl, me.providerConfig);
      }

      sord = ixConnect.ix().checkoutSord(me.objId, new SordZ(SordC.mbAll), LockC.NO);

      provider.open(me.ec, sord, me.inputFieldName);

      if (provider.getMessage()) {
        result.message = provider.getMessage();
        return result;
      }

      while (provider.hasMoreRows()) {
        resultData.push(provider.getNextRow());
      }

      result.keynames = provider.getKeyNames();
      result.header = provider.getHeader();
      result.title = provider.getTitle();
      result.data = resultData;

    } catch (ex) {
      result.error = String(ex);
    } finally {
      if (provider && (sol.common.ObjectUtils.isFunction(provider.close))) {
        provider.close();
      }
    }

    return result;
  }
});


/**
 * @member sol.unittest.meeting.ix.services.ExecuteDynKwl
 * @method RF_sol_unittest_meeting_service_ExecuteDynKwl
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_meeting_service_ExecuteDynKwl(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_meeting_service_ExecuteDynKwl", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "dynKwl", "providerConfig", "inputFieldName");
  params.ec = ec;
  service = sol.create("sol.unittest.meeting.ix.services.ExecuteDynKwl", params);
  result = service.process();
  logger.exit("RF_sol_unittest_meeting_service_ExecuteDynKwl", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
