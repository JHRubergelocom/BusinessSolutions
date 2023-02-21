
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.DynKwlUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.CreateContact" });

/**
 * Creates a contact if indicated
 *
 * New elements will only be created, if the map field 'MEETING_CREATE_CONTACT' has the value '1' (checkbox activated).
 * A new contact will be created, if there was no 'CONTACT_REFERENCE' found in the contact metadata.
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.IxUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.DynKwlUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.meeting.ix.functions.CreateContact", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */

 
  /**
   * @private
   * @property {Object} MAPPINGS
   * This defines the mapping from the participant to the contact fields for the element creation.
   */
  MAPPINGS: {
    contact: [
      { from: { type: "GRP", key: "MEETING_PERSON_FORM_OF_ADDRESS" }, to: { type: "GRP", key: "CONTACT_FORM_OF_ADDRESS" } },
      { from: { type: "GRP", key: "MEETING_PERSON_TITLE" }, to: { type: "GRP", key: "CONTACT_TITLE" } },
      { from: { type: "GRP", key: "MEETING_PERSON_FIRSTNAME" }, to: { type: "GRP", key: "CONTACT_FIRSTNAME" } },
      { from: { type: "GRP", key: "MEETING_PERSON_LASTNAME" }, to: { type: "GRP", key: "CONTACT_LASTNAME" } },
      { from: { type: "GRP", key: "MEETING_PERSON_EMAIL" }, to: { type: "GRP", key: "CONTACT_EMAIL" } },
      { from: { type: "GRP", key: "MEETING_PERSON_COMPANYNAME" }, to: { type: "GRP", key: "COMPANY_NAME" } },
      { from: { type: "GRP", key: "MEETING_PERSON_CONTACTLIST_NAME" }, to: { type: "GRP", key: "CONTACTLIST_NAME" } },
      { from: { type: "GRP", key: "MEETING_PERSON_CONTACTLIST_REFERENCE" }, to: { type: "GRP", key: "CONTACTLIST_REFERENCE" } }
    ]
  },

  initialize: function (config) {
    var me = this;
    me.meetingConfig = sol.create("sol.common.Config", { compose: "/meeting/Configuration/meeting.config" }).config;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Creates the contact if requested.
   */
  process: function () {
    var me = this,
        sord, 
        contactResult;

    if (me.checkAutomaticCreation()) {

      sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

      // if no contact reference is defined a new one will be created
      if (me.isEmpty(sord, { type: "GRP", key: me.meetingConfig.fields.meetingPersonContactReference })) {
        contactResult = sol.common.IxUtils.execute("RF_sol_contact_service_CreateContact", {
          contactType: "Default",
          data: me.buildData(sord, me.MAPPINGS.contact)
        });
        me.logger.info("created new contact", contactResult);

        me.updateContactRef(sord, contactResult);

      }

      ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
    }
  },

  /**
   * @private
   * Checks, if automatic creation is activated
   * @return {Boolean}
   */
  checkAutomaticCreation: function () {
    var me = this,
      passed = false,
      fieldName, mapitems;

    fieldName = me.meetingConfig.mapFields.createContact;
    mapitems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, me.objId, [fieldName], LockC.NO).items;

    if (mapitems && (mapitems.length === 1)) {
      passed = (String(mapitems[0].value) === "1"); // checkbox checked
    }

    return passed;
  },

  /**
   * @private
   * Checks, if a field contains a value.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} fieldCfg
   * @return {Boolean}
   */
  isEmpty: function (sord, fieldCfg) {
    var passed = true,
      value;

    if (sord && fieldCfg) {
      value = sol.common.SordUtils.getValue(sord, fieldCfg);
      passed = sol.common.StringUtils.isBlank(value);
    }

    return passed;
  },

  /**
   * @private
   * Creates the data for the RF_sol_contact_service_CreateCompany function.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object[]} mappings
   * @return {Object[]}
   */
  buildData: function (sord, mappings) {
    var data = [];

    mappings.forEach(function (mapping) {
      var value = sol.common.SordUtils.getValue(sord, mapping.from);
      if (value) {
        mapping.to.value = String(value);
        data.push(mapping.to);
      }
    });

    return data;
  },

  /**
   * @private
   * Updates the sord with the partner reference value
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} createResult
   */
  updateContactRef: function (sord, createResult) {
    var me = this,
      objKey;
    if (createResult.reference) {
      objKey = sol.common.SordUtils.setObjKeyValue(sord, me.meetingConfig.fields.meetingPersonContactReference, createResult.reference);
    }
  }

});

/**
 * @member sol.meeting.ix.functions.CreateContact
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_CreateContact", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
    module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.meeting.ix.functions.CreateContact", params);
  module.process();
  logger.exit("onEnterNode_CreateContact");
}


/**
 * @member sol.meeting.ix.functions.CreateContact
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_CreateContact", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
    module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.meeting.ix.functions.CreateContact", params);
  module.process();
  logger.exit("onExitNode_CreateContact");
}

/**
 * @member sol.meeting.ix.functions.CreateContact
 * @method RF_sol_meeting_function_CreateContact
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_CreateContact(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  rfArgs.user = ixConnect.loginResult.user.name;

  fun = sol.create("sol.meeting.ix.functions.CreateContact", rfArgs);

  return JSON.stringify(fun.process());
}