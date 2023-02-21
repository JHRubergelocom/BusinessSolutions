
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Creates a participant based on the passed templateSord or by defining user, course and optionally a status.
 * Returns the created enrollment's objId.
 *
 *
 * ### Example
 *
 * #### Arguments
 *     {
 *       "participantData": {
 *          "MEETING_PARTICPANT_FIRSTNAME": "Bodo",
 *          "MEETING_PARTICPANT_LASTNAME": "Kraft"
 *       },
 *        "MEETING_REFERENCE": "0001",
 *        "MEETING_GUID": "(E10E1000-E100-E100-E100-E10E10E10E16)",
 *        "workflowTemplate" : "sol.meeting.Invite"
 *     }
 *
 * #### Returns
 *
 *     { code: "success", data: {objId: 4011, flowId: 43, metaData: metaData}, info: "Invitation created" }
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.WfUtils
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.meeting.ix.functions.CreateInvitationHeadless", {
  extend: "sol.common.ix.FunctionBase",

  _optimize: {},

  mixins: ["sol.meeting.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _newSordDef: { config: "meeting", prop: "entities.invitation.actions.createheadless.const.newSordDef" },
    _userField: { config: "meeting", prop: "entities.invitation.actions.createheadless.const.userField" },
    _mailField: { config: "meeting", prop: "entities.invitation.actions.createheadless.const.mailField" },
    _standardWorkflow: { config: "meeting", prop: "entities.invitation.actions.createheadless.const.standardWorkflow" },
    _workflowMessage: { config: "meeting", prop: "entities.invitation.actions.createheadless.const.workflowMessage", template: true },
    _invitationStatusField: { config: "meeting", prop: "entities.invitation.actions.createheadless.const.invitationStatusField" },
    _meetingReferenceField: { config: "meeting", prop: "entities.invitation.actions.createheadless.const.meetingReferenceField" },
    _meetingGuidField: { config: "meeting", prop: "entities.invitation.actions.createheadless.const.meetingGuid" },
    _findMeeting: { config: "meeting", prop: "entities.invitation.actions.createheadless.findMeeting" }, 
    _findParticipant: { config: "meeting", prop: "entities.invitation.actions.createheadless.findParticipant" },
    _personShortDesc: { config: "meeting", prop: "entities.participant.fields.MEETING_PERSON_SHORT_DESC_GEN.defaultValue" },
    _invitationStatus: { config: "meeting", prop: "entities.participant.fields.MEETING_INVITATION_STATUS.defaultValue" },
    _solType: { config: "meeting", prop: "entities.participant.fields.SOL_TYPE.defaultValue" },
    _userFieldsToCopy: { config: "meeting", prop: "entities.participant.const.fieldsFromUser" }

  },

  process: function () {
    var me = this, metaData, invitationId, meeting, standardWorkflow,
        participantId, mail, throws = true, flowId, meetingGuid;

    try {
      meeting = me.determineCriterion(me._meetingReferenceField, me._meetingReferenceField, "meeting reference", throws);
      meetingGuid = me.determineCriterion(me._meetingGuidField, me._meetingGuidField, "meeting guid", throws);
      mail = me.determineCriterion("mail", me._mailField, "mail address", throws);
      standardWorkflow = me.determineCriterion("workflowTemplate", "workflowTemplate", "workflowTemplate", false);
      me.logger.info(["determine workflow template {0}", standardWorkflow]);
      standardWorkflow = standardWorkflow || me._standardWorkflow;

      // Find participant to check if the participant already invited to the current meeting
      participantId = me.getParticipant(mail, meeting);

      if (participantId) { //participant already exists
        me.logger.info("participantId:" + participantId);
        return { code: "duplicate", data: { objId: participantId }, info: "Participant not created: already existed." };
      }


      metaData = me.prepareMetaData({
        MEETING_REFERENCE: meeting,
        MEETING_PERSON_SHORT_DESC_GEN: me._personShortDesc,
        MEETING_INVITATION_STATUS: me._invitationStatus,
        SOL_TYPE: me._solType
      });

      invitationId = me.createInvitationFromScratch(me._newSordDef, metaData);

      // attach the guid of the given meeting to simplify search and move operation foreach participant
      me.attachMapMetaData(invitationId, [{
        key: me._meetingGuidField, value: meetingGuid
      }]);

      me.logger.info(["Start Workflow template={0}, name={1}, invitationId={2}", standardWorkflow, me._workflowMessage, invitationId]);
      flowId = sol.common.WfUtils.startWorkflow(standardWorkflow, me._workflowMessage, invitationId);

      if (!flowId) {
        throw "Workflow couln't start templFlowId=" + standardWorkflow + ", flowName=" + me._workflowMessage + ", objId=" + invitationId;
      }

      return { code: "success", data: { objId: invitationId, flowId: flowId, metaData: JSON.stringify(metaData) }, info: "Invitation created" };
    } catch (e) {
      return { code: "error", message: JSON.stringify(e), data: me.participantData };
    }

 
  },

  getParticipant: function (mail, meeting) {
    var me = this;

    me._findParticipant.search.push(
      { key: me._meetingReferenceField, value: meeting },
      { key: me._mailField, value: mail }
    );

    me.logger.info("findParticipant:", me._findParticipant.search);

    return sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._findParticipant, me._optimize, "findExistingParticipant", ["output"]).sords[0];
  },

  determineCriterion: function (param, key, desc, throws) {
    var me = this, criterionMapping, criterion;
    if (me[param]) {
      criterion = me[param];
    } else if (me.participantData && me.participantData.objKeys) {
      criterion = me.participantData.objKeys[key];
    } else if (me.metadataMapping) {
      me.metadataMapping
        .some(function (mapping) {
          return (mapping.target && (mapping.target.id === key)) && (criterionMapping = mapping);
        });
      if (criterionMapping) {
        criterion = criterionMapping.target.value;
      }
    }

    if (throws && !criterion) {
      throw "Call did not contain a " + desc + "! (`" + param + "` parameter)";
    }

    return criterion;
  },


  createInvitationFromScratch: function (cfg, metaData) {
    var me = this, sord;
    me.logger.debug("Trying to create invitation from scratch using configuration ", cfg);

    sord = me.createSord(cfg.mask);
    me.setSordType(sord, cfg.type);
    me.setMetaData(sord, metaData);
    return me.persist(sord);
  },

  createSord: function (mask) {
    var me = this;
    try {
      // FIXME parentId should not be possible, only for development
      me.logger.info("create sord with mask " + mask);
      return ixConnectAdmin.ix().createSord(me.parentId || "0", mask, EditInfoC.mbSord).sord;
    } catch (e) {
      me.logger.debug("could not create enrollment sord", e);
      throw "CreateParticipantHeadless: could not create sord in chaos cabinet. Mask not available or insufficient permissions? mask:`" + mask + "`";
    }
  },

  setSordType: function (sord, type) {
    var me = this;
    if (type) {
      try {
        sord.type = sol.common.SordTypeUtils.getSordTypeId(type);
      } catch (e) {
        me.logger.debug("could not retrieve sordtype via id", e);
        throw "CreateInvitationHeadless: could not retrieve sordtype via id `" + type + "`";
      }
    }
  },

  persist: function (sord) {
    var me = this;
    try {
      return String(ixConnectAdmin.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO));
    } catch (e) {
      me.logger.debug("creating the sord failed during checkin", e);
      throw "CreateInvitationHeadless: creating the sord failed during checkin.";
    }
  },


  setMetaData: function (sord, metaData) {
    metaData.forEach(function (entry) {
      sol.common.SordUtils.setObjKeyValue(sord, entry.key, entry.value);
    });
  },

  attachMapMetaData: function (sordId, metaData) {
    var me = this, wfMap;

    wfMap = sol.create("sol.common.SordMap", {
      objId: sordId
    });

    wfMap.read();

    if (sol.common.ObjectUtils.isArray(metaData)) {
      metaData.forEach(function (data) {
        me.logger.info(["write to map {0} = {1}", data.key, data.value]);
        wfMap.setValue(data.key, data.value);
      });
    }

    wfMap.write();
  },

  prepareMetaData: function (criteria) {
    var me = this, metaData;
    metaData = Object.keys(criteria)
      .map(function (key) {
        return { type: "GRP", key: key, value: criteria[key] };
      });

    metaData = me.addParticipantData(metaData, me.participantData.objKeys, me._userFieldsToCopy);

    me.logger.info(["prepared metadata {0}", JSON.stringify(metaData)]);
    return metaData;
  },

  addParticipantData: function (metaData, objKeys, fields) {
    fields.forEach(function (fieldKey) {
      metaData.push({ type: "GRP", key: fieldKey, value: objKeys[fieldKey] });
    });

    return metaData;
  },

  rfAsAdm: function (fct, params) {
    var any = new (typeof Any !== "undefined" ? Any : de.elo.ix.client.Any);
    any.type = ixConnect.CONST.ANY.TYPE_STRING;
    any.stringValue = sol.common.JsonUtils.stringifyAll(params);
    any = ((ixConnectAdmin === "undefined") ? ixConnect : ixConnectAdmin).ix().executeRegisteredFunction(fct, any);
    return JSON.parse((any && any.stringValue) ? String(any.stringValue) : "{}");
  }
});


/**
 * @member sol.meeting.ix.functions.CreateInvitationHeadless
 * @method RF_sol_meeting_function_CreateInvitationHeadless
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_CreateInvitationHeadless(iXSEContext, args) {
  var rfArgs, fun, logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.CreateInvitationHeadless" });
  logger.enter("RF_sol_meeting_function_CreateInvitationHeadless");

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);

  fun = sol.create("sol.meeting.ix.functions.CreateInvitationHeadless", rfArgs);

  logger.exit("RF_sol_meeting_function_CreateInvitationHeadless");
  return JSON.stringify(fun.process());
}

/**
 * @member sol.meeting.ix.functions.CreateInvitationHeadlessStrict
 * @method RF_sol_learning_function_CreateInvitationHeadlessStrict
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_CreateInvitationHeadlessStrict(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  rfArgs.user = ixConnect.loginResult.user.name;

  fun = sol.create("sol.meeting.ix.functions.CreateInvitationHeadless", rfArgs);

  return JSON.stringify(fun.process());
}
