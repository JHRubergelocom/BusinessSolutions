
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.pubsec.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.pubsec.ix.actions.Open" });

/**
 * Opens a record (currently supports file and process) by starting an opening workflow.
 *
 * The class determines, which kind of record it was called for and then loads the correct workflow template and name template.
 * After that, it starts the workflow and adds the events:
 *
 * - workflow dialog event
 * - refresh event
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |workflows.openRequest.workflowNameTemplate|The template to generate the workflow name|
 * |workflows.openRequest.workflowTemplate|The workflow which should be started|
 * |requests.open.folderId|Target path for the request elements|
 * |requests.open.maskName|Mask for the request folder (if not set, system default will be used)|
 * |requests.open.childrenTableMapping|Mapping configuration to write the metadata of the children elements to the map of the request element for displaying|
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Map
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ActionBase
 * @requires sol.pubsec.Utils
 */
sol.define("sol.pubsec.ix.actions.Open", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "objIds"],

  /**
   * @cfg {de.elo.ix.client.ClientInfo} ci (required)
   */

  /**
   * @cfg {String[]} objIds (required)
   * Object ID of the record
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
    me.config = sol.pubsec.Utils.loadConfig();
  },

  getName: function () {
    return "Open";
  },

  /**
   * Starts an opening request.
   */
  process: function () {
    var me = this,
        requestFolderObjId, flowId;

    requestFolderObjId = me.createRequestFolder();

    flowId = me.startRequestWorkflow(requestFolderObjId);

    me.addEvents(flowId, requestFolderObjId);
  },

  /**
   * @private
   * Creates a temporary folder and references all elements, which should be opened.
   * @return {String}
   */
  createRequestFolder: function () {
    var me = this,
        name, mask, requestFolderId;

    name = me.createElementName();
    mask = me.getRequestFolderMask();
    requestFolderId = sol.pubsec.Utils.createFolder(me.config.requests.open.folderId, mask, name, { grantAccesToOwner: true, conn: ixConnectAdmin });

    sol.pubsec.Utils.referenceElements(requestFolderId, me.objIds);

    me.copyChildrenMetadataToMap(requestFolderId);

    return requestFolderId;
  },

  /**
   * @private
   * Copies the metadata of all children to the parent objects map fields so they can be displayed in the workflow from.
   * Uses {@link sol.pubsec.Utils#copyMetadataToMap}.
   * @param {String} requestObjId
   */
  copyChildrenMetadataToMap: function (requestObjId) {
    var me = this;
    sol.pubsec.Utils.copyMetadataToMap(requestObjId, me.objIds, me.config.requests.open.childrenTableMapping);
  },

  /**
   * @private
   * Starts the open workflow.
   * @param {String} objId
   * @return {String} The workflow ID
   */
  startRequestWorkflow: function (objId) {
    var me = this,
        wfName, wfTemplate, flowId;

    wfName = me.createWorkflowName();
    wfTemplate = me.config.workflows.openRequest.workflowTemplate;
    flowId = ixConnect.ix().startWorkFlow(wfTemplate, wfName, objId);

    return flowId;
  },

  /**
   * @private
   * Retrieves the mask for the temporary folder. Uses {@link sol.pubsec.Utils#retrieveRequestMask}.
   * @return {String}
   */
  getRequestFolderMask: function () {
    return sol.pubsec.Utils.retrieveRequestMask("open");
  },

  /**
   * @private
   * Creates the name for the request element. Currently this uses {{@link #createWorkflowName}} internally.
   * @return {String}
   */
  createElementName: function () {
    var me = this;
    if (!me.name) {
      me.name = me.createWorkflowName();
    }
    return me.name;
  },

  /**
   * @private
   * Creates a workflow name by using the 'workflows.openRequest.workflowNameTemplate' property from the 'pubsec.config' by applying `wfDate` and `wfNumber` with handlebars.
   * @return {String}
   */
  createWorkflowName: function () {
    var me = this;
    if (!me.name) {
      me.name = sol.create("sol.common.Template", { source: me.config.workflows.openRequest.workflowNameTemplate }).apply({ wfDate: new Date(), wfNumber: me.actionId });
    }
    return me.name;
  },

  /**
   * @private
   * Adds the events of the action.
   * @param {String} flowId
   * @param {String} requestFolderObjId
   */
  addEvents: function (flowId, requestFolderObjId) {
    var me = this;
    if (flowId) {
      me.addWfDialogEvent(flowId, { objId: requestFolderObjId, dialogId: me.getName() });
      me.objIds.forEach(function (objId) {
        me.addRefreshEvent(objId, {
          type: "WF_STATUS",
          value: "CHANGE",
          flowId: flowId
        });
      });
    }
  }

});

/**
 * @member sol.pubsec.ix.actions.Open
 * @method RF_sol_pubsec_action_Open
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_pubsec_action_Open(ec, args) {
  logger.enter("RF_sol_pubsec_action_Open", args);
  var rfUtils = sol.common.ix.RfUtils,
      config, action, result;

  config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objIds");
  config.ci = ec.ci;

  action = sol.create("sol.pubsec.ix.actions.Open", config);
  result = action.execute();
  logger.exit("RF_sol_pubsec_action_Open", result);
  return result;
}

