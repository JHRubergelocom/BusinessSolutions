
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.DynKwlUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.contract.ix.functions.CreatePartner" });

/**
 * Creates a new company and contact if indicated by the contract metadata.
 *
 * New elements will only be created, if the map field 'CONTRACT_CREATE_PARTNER' has the value '1' (checkbox activated).
 * A new company will be created, if there was no 'PARTNER_NO' found in the contract metadata.
 * A new contact will be created, if there was no 'CONTACT_REFERENCE' found in the contract metadata.
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
sol.define("sol.contract.ix.functions.CreatePartner", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */

  /**
   * @private
   * @property {String} CONTACTLIST_REF_FIELD
   * This defines the field, where the contact list reference will be written to.
   */
  CONTACTLIST_REF_FIELD: "CONTACTLIST_REFERENCE",

  /**
   * @private
   * @property {Object} MAPPINGS
   * This defines the mapping from the contract to the contact fields for the element creation.
   */
  MAPPINGS: {
    company: [
      { from: { type: "GRP", key: "PARTNER_NAME" }, to: { type: "GRP", key: "COMPANY_NAME" } },
      { from: { type: "MAP", key: "ADDRESS_STREET" }, to: { type: "GRP", key: "ADDRESS_STREET" } },
      { from: { type: "MAP", key: "ADDRESS_ADDITION" }, to: { type: "GRP", key: "ADDRESS_ADDITION" } },
      { from: { type: "MAP", key: "ADDRESS_ZIP_CODE" }, to: { type: "GRP", key: "ADDRESS_ZIP_CODE" } },
      { from: { type: "MAP", key: "ADDRESS_CITY" }, to: { type: "GRP", key: "ADDRESS_CITY" } },
      { from: { type: "MAP", key: "ADDRESS_STATE" }, to: { type: "GRP", key: "ADDRESS_STATE" } },
      { from: { type: "MAP", key: "ADDRESS_COUNTRY" }, to: { type: "GRP", key: "ADDRESS_COUNTRY" } }
    ],
    contact: [
      { from: { type: "GRP", key: "PARTNER_NO" }, to: { type: "GRP", key: "COMPANY_REFERENCE" } },
      { from: { type: "GRP", key: "CONTACT_FIRSTNAME" }, to: { type: "GRP", key: "CONTACT_FIRSTNAME" } },
      { from: { type: "GRP", key: "CONTACT_LASTNAME" }, to: { type: "GRP", key: "CONTACT_LASTNAME" } },
      { from: { type: "MAP", key: "PARTNER_PHONE" }, to: { type: "GRP", key: "CONTACT_TELEPHONE" } },
      { from: { type: "MAP", key: "PARTNER_EMAIL" }, to: { type: "GRP", key: "CONTACT_EMAIL" } },
      { from: { type: "MAP", key: "ADDRESS_STREET" }, to: { type: "GRP", key: "ADDRESS_STREET" } },
      { from: { type: "MAP", key: "ADDRESS_ADDITION" }, to: { type: "GRP", key: "ADDRESS_ADDITION" } },
      { from: { type: "MAP", key: "ADDRESS_ZIP_CODE" }, to: { type: "GRP", key: "ADDRESS_ZIP_CODE" } },
      { from: { type: "MAP", key: "ADDRESS_CITY" }, to: { type: "GRP", key: "ADDRESS_CITY" } },
      { from: { type: "MAP", key: "ADDRESS_STATE" }, to: { type: "GRP", key: "ADDRESS_STATE" } },
      { from: { type: "MAP", key: "ADDRESS_COUNTRY" }, to: { type: "GRP", key: "ADDRESS_COUNTRY" } }
    ]
  },

  initialize: function (config) {
    var me = this;
    me.contractConfig = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);

    me.contactlistReference = me.contractConfig.contactIntegration.defaultContactlistReference;
  },

  /**
   * Creates the contract partner if requested.
   */
  process: function () {
    var me = this,
        sord, clRefCfg, clRefValue, companyResult, contactResult;

    if (me.checkAutomaticCreation()) {

      sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

      // if a contact list reference is set, it overrides the default contact list initialized from config
      clRefCfg = { type: "MAP", key: me.contractConfig.mapFields.contactlistRef };
      if (!me.isEmpty(sord, clRefCfg)) {
        clRefValue = sol.common.SordUtils.getValue(sord, clRefCfg);
        if (clRefValue) {
          me.contactlistReference = String(clRefValue);
        }
      }

      if (me.checkCreateCompany(sord)) {
        companyResult = sol.common.IxUtils.execute("RF_sol_contact_service_CreateCompany", {
          companyType: "Default", // TODO -> from config (node or json?)
          data: me.buildData(sord, me.MAPPINGS.company)
        });
        me.logger.info("created new company", companyResult);

        me.updatePartnerNo(sord, companyResult);
      }

      if (me.checkCreateContact(sord)) {
        contactResult = sol.common.IxUtils.execute("RF_sol_contact_service_CreateContact", {
          contactType: "Default", // TODO -> from config (node or json?)
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
   * Checks, if automatic cretion is activated
   * @return {Boolean}
   */
  checkAutomaticCreation: function () {
    var me = this,
        passed = false,
        fieldName, mapitems;

    fieldName = me.contractConfig.mapFields.createPartnerContact;
    mapitems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, me.objId, [fieldName], LockC.NO).items;

    if (mapitems && (mapitems.length === 1)) {
      passed = (String(mapitems[0].value) === "1"); // checkbox checked
    }

    return passed;
  },

  /**
   * @private
   * Checks, if a new company should be created.
   *
   * If no company reference is defined (i.e. was not selected from the list) and a name was provided a new one will be created.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  checkCreateCompany: function (sord) {
    var me = this;
    return me.isEmpty(sord, { type: "GRP", key: me.contractConfig.fields.partnerNo })
      && !me.isEmpty(sord, { type: "GRP", key: me.contractConfig.fields.partnerName });
  },

  /**
   * @private
   * Checks, if a new contact should be created.
   *
   * If no contact reference is defined (i.e. was not selected from the list) as well as a first and lastname are provided a new one will be created.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  checkCreateContact: function (sord) {
    var me = this;
    return me.isEmpty(sord, { type: "MAP", key: me.contractConfig.mapFields.contactRef })
      && !me.isEmpty(sord, { type: "GRP", key: me.contractConfig.fields.contactFirstName })
      && !me.isEmpty(sord, { type: "GRP", key: me.contractConfig.fields.contactLastName });
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
    var me = this,
        data = [];

    data.push({ type: "GRP", key: me.CONTACTLIST_REF_FIELD, value: me.contactlistReference });

    mappings.forEach(function (mapping) {
      var value;
      value = sol.common.SordUtils.getValue(sord, mapping.from);
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
  updatePartnerNo: function (sord, createResult) {
    var me = this;
    if (createResult.reference) {
      sol.common.SordUtils.setObjKeyValue(sord, me.contractConfig.fields.partnerNo, createResult.reference);
    }
  },

  /**
   * @private
   * Updates the sord with the partner reference value
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} createResult
   */
  updateContactRef: function (sord, createResult) {
    var me = this,
        mapitem;
    if (createResult.reference) {
      mapitem = new KeyValue(me.contractConfig.mapFields.contactRef, createResult.reference);
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, sord.id, sord.id, [mapitem], LockC.NO);
    }
  }

});

/**
 * @member sol.contract.ix.functions.CreatePartner
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_CreatePartner", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.contract.ix.functions.CreatePartner", params);

  module.process();

  logger.exit("onEnterNode_CreatePartner");
}


/**
 * @member sol.contract.ix.functions.CreatePartner
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_CreatePartner", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.contract.ix.functions.CreatePartner", params);

  module.process();

  logger.exit("onExitNode_CreatePartner");
}
