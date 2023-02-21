
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.contact.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.contact.ix.actions.CreateContact" });

/**
 * Creates a new contact.
 *
 * # Sequence
 *
 * - Copy the template structure
 * - Start the workflow defined by the mask
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |contactlist.referenceField|Reference field to the contact list|
 * |company.referenceField|Reference field to the company|
 * |contact.templateFolderId|Path or ID to the contact template folder|
 * |contact.createWorkflowNameTemplate|The template for the workflow name (in Handlebars syntax)|
 *
 * # Workflow name template
 * Usable variables in the template for the workflow name
 *
 * - contactType {String}
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ActionBase
 * @requires sol.common.ix.FunctionBase
 * @requires sol.contact.Utils
 */
sol.define("sol.contact.ix.actions.CreateContact", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "user", "contactType"],

  /**
   * @cfg {de.elo.ix.client.ClientInfo} ci (required)
   */

  /**
   * @cfg {de.elo.ix.client.UserInfo} user (required)
   */

  /**
   * @cfg {String} contactType (required)
   * The contact template which should be copied
   */

  /**
   * @cfg {String} targetId (optional)
   * If configured, this will be used to determine if a target inside a contact list or company was selected.
   * If that's the case, the contact list (and/or company) reference will be pre-filled.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
    me.config = sol.contact.Utils.loadConfig();
  },

  /**
   * @inheritdoc sol.common.ix.ActionBase#getName
   */
  getName: function () {
    return "CreateContact";
  },

  /**
   * Creates a new contact in the chaos cabinet and starts the standard workflow.
   */
  process: function () {
    var me = this,
        result, flowId;

    result = sol.contact.Utils.createContact(me.contactType, { owner: me.user });

    me.prefillMetadata(result.objId);

    flowId = me.startMaskStandardWorkflow(result.objId, { name: result.name, field: "STANDARD_WORKFLOW" });
    if (flowId) {
      me.addWfDialogEvent(flowId, { objId: result.objId, title: result.name, dialogId: me.getName() });

      me.addGotoIdEvent(result.objId, null, {
        type: "WF_STATUS",
        value: "CREATE",
        flowId: flowId
      });
    } else {
      me.addGotoIdEvent(result.objId);
    }
  },

  prefillMetadata: function (objId) {
    var me = this,
        sord = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO),
        dirty = false,
        contactlist, company, contactlistRef, companyRef;

    if (!me.targetId) {
      return;
    }

    contactlist = sol.contact.Utils.getParentContactList(me.targetId);
    if (contactlist) {
      contactlistRef = sol.common.SordUtils.getObjKeyValue(contactlist, me.config.contactlist.referenceField);
      if (contactlistRef) {
        sol.common.SordUtils.setObjKeyValue(sord, me.config.contactlist.referenceField, contactlistRef);
        dirty = true;
      }
    }

    company = sol.contact.Utils.getParentCompany(me.targetId);
    if (company) {
      companyRef = sol.common.SordUtils.getObjKeyValue(company, me.config.company.referenceField);
      if (companyRef) {
        sol.common.SordUtils.setObjKeyValue(sord, me.config.company.referenceField, companyRef);
        dirty = true;
      }
    }

    if (dirty) {
      ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
    }
  }

});

/**
 * @member sol.contact.ix.actions.CreateContact
 * @method RF_sol_contact_action_CreateContact
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_contact_action_CreateContact(ec, configAny) {
  logger.enter("RF_sol_contact_action_CreateContact", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "contactType"),
      createContact, result;

  config.ci = ec.ci;
  config.user = ec.user;

  createContact = sol.create("sol.contact.ix.actions.CreateContact", config);
  result = createContact.execute();
  logger.exit("RF_sol_contact_action_CreateContact", result);
  return result;
}
