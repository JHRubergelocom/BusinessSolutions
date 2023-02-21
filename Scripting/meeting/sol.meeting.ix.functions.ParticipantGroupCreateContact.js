
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.DynKwlUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.mixins.Configuration.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.ParticipantGroupCreateContact" });

/**
 * Creates a contact if indicated
 *
 * New elements will only be created, if the map field 'MEETING_CREATE_CONTACT' has the value '1' (checkbox activated).
 * A new contact will be created, if there was no 'CONTACT_REFERENCE' found in the contact metadata.
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.Injection
 * @requires sol.common.IxUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.DynKwlUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.meeting.mixins.Configuration
 *
 */
sol.define("sol.meeting.ix.functions.ParticipantGroupCreateContact", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "mapIndex", "entries"],

  /**
   * @cfg {String} objId (required)
   */



  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    sord: { sordIdFromProp: "objId", optional: false },
    meetingParticipantCreateContact: { config: "meeting", prop: "mapFields.meetingParticipantCreateContact" },
    meetingParticipantContactReference: { config: "meeting", prop: "mapFields.meetingParticipantContactReference" }
  },

  /**
   * Creates the contact if requested.
   */
  process: function () {
    var me = this,
        contact;

    if (!me.hasContactReference()) {
      contact = me.createContact();
      me.updateContactReference(contact.reference);
      me.uncheckCreateContact();
    }
  },

  createContact: function () {
    var me = this;

    return sol.common.IxUtils.execute("RF_sol_contact_service_CreateContact", {
      contactType: me.contactType || "Default",
      data: me.entries
    });
  },


  hasContactReference: function () {
    var me = this,
      contactReferenceFieldName = me.meetingParticipantContactReference + me.mapIndex;

    return !me.isEmpty(me.sord, { type: "MAP", key: contactReferenceFieldName });
  },

  /**
   * @private
   * Checks, if a field contains a value.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} fieldConfig
   * @return {Boolean}
   */
  isEmpty: function (sord, fieldConfig) {
    var value;

    if (sord && fieldConfig) {
      value = sol.common.SordUtils.getValue(sord, fieldConfig);
      return sol.common.StringUtils.isBlank(value);
    }

    return false;
  },

  uncheckCreateContact: function () {
    var me = this,
      createContactFieldName = me.meetingParticipantCreateContact + me.mapIndex;

    me.updateMapField(createContactFieldName, "0");
  },

  /**
   * @private
   * Updates the sord with the partner reference value
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} reference
   */
  updateContactReference: function (reference) {
    var me = this,
      contactReferenceFieldName = me.meetingParticipantContactReference + me.mapIndex;

    if (reference) {
      me.updateMapField(contactReferenceFieldName, reference);
    }
  },

  updateMapField: function (fieldName, value) {
    var me = this;

    ixConnect.ix().checkinMap(
      MapDomainC.DOMAIN_SORD,
      me.sord.id,
      me.sord.id,
      [new KeyValue(fieldName, value)],
      LockC.NO
    );
  }

});

/**
 * @member sol.meeting.ix.functions.ParticipantGroupCreateContact
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_ParticipantGroupCreateContact", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
    module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.meeting.ix.functions.ParticipantGroupCreateContact", params);
  module.process();
  logger.exit("onEnterNode_ParticipantGroupCreateContact");
}


/**
 * @member sol.meeting.ix.functions.ParticipantGroupCreateContact
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_ParticipantGroupCreateContact", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
    module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.meeting.ix.functions.ParticipantGroupCreateContact", params);
  module.process();
  logger.exit("onExitNode_ParticipantGroupCreateContact");
}

/**
 * @member sol.meeting.ix.functions.ParticipantGroupCreateContact
 * @method RF_sol_meeting_function_ParticipantGroupCreateContact
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_ParticipantGroupCreateContact(context, args) {
  logger.enter("RF_sol_meeting_function_ParticipantGroupCreateContact", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args);
  params.user = ixConnect.loginResult.user.name;

  service = sol.create("sol.meeting.ix.functions.ParticipantGroupCreateContact", params);
  result = JSON.stringify(service.process());

  logger.exit("RF_sol_meeting_function_ParticipantGroupCreateContact", result);

  return result;
}