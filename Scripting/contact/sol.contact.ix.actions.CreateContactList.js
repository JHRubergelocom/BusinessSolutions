
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

var logger = sol.create("sol.Logger", { scope: "sol.contact.ix.actions.CreateContactList" });

/**
 * Creates a new contactlist.
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
 * |contactlist.templateFolderId|Path or ID to the contactlist template folder|
 * |contactlist.createWorkflowNameTemplate|The template for the workflow name (in Handlebars syntax)|
 *
 * # Workflow name template
 * Usable variables in the template for the workflow name
 *
 * - wfPrefix {String}
 * - contactlistType {String}
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
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
sol.define("sol.contact.ix.actions.CreateContactList", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "user", "contactlistType"],

  /**
   * @cfg {de.elo.ix.client.ClientInfo} ci (required)
   */

  /**
   * @cfg {de.elo.ix.client.UserInfo} user (required)
   */

  /**
   * @cfg {String} contactlistType (required)
   * The contactlist template which should be copied
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
    me.config = sol.contact.Utils.loadConfig();
  },

  getName: function () {
    return "CreateContactList";
  },

  process: function () {
    var me = this,
        name, objId, flowId;

    if (!me.parentId) {
      me.addErrorEvent("sol.contact.ix.actions.CreateContactList.error.target", null, null, me.ci);
      return;
    }
    name = me.buildElementName();
    objId = sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      objId: me.parentId,
      source: me.getTemplateArcPath(me.contactlistType),
      copySourceAcl: false,
      inheritDestinationAcl: true,
      name: name,
      asAdmin: true,
      useQuickCopy: true,
      acl: {
        mode: "ADD",
        entries: [
          { userName: me.user.name, rights: { r: true, w: true, d: true, e: true, l: true } }
        ]
      }
    });

    flowId = me.startMaskStandardWorkflow(objId, { name: name, field: "STANDARD_WORKFLOW" });
    if (flowId) {
      me.addWfDialogEvent(flowId, { objId: objId, title: name, dialogId: me.getName() });

      me.addGotoIdEvent(objId, null, {
        type: "WF_STATUS",
        value: "CREATE",
        flowId: flowId
      });
    } else {
      me.addGotoIdEvent(objId);
    }
  },

  /**
   * @private
   * Retrieves the path of the contact list template.
   * @param {String} contactlistType
   * @return {String}
   */
  getTemplateArcPath: function (contactlistType) {
    return sol.common.RepoUtils.getObjIdFromRelativePath(this.config.contactlist.templateFolderId, "/" + contactlistType);
  },

  /**
   * @private
   * Creates the new contact list (temporary) name.
   * @return {String}
   */
  buildElementName: function () {
    var me = this;
    return sol.create("sol.common.Template", { source: me.config.contactlist.createWorkflowNameTemplate }).apply({ contactlistType: me.contactlistType });
  }

});

/**
 * @member sol.contact.ix.actions.CreateContactList
 * @method RF_sol_contact_action_CreateContactList
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_contact_action_CreateContactList(ec, configAny) {
  logger.enter("RF_sol_contact_action_CreateContactList", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "contactlistType"),
      createContactList, result;

  config.ci = ec.ci;
  config.user = ec.user;

  createContactList = sol.create("sol.contact.ix.actions.CreateContactList", config);
  result = createContactList.execute();
  logger.exit("RF_sol_contact_action_CreateContactList", result);
  return result;
}
