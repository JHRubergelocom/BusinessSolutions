
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
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.checklist.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.checklist.ix.actions.Checklist" });

/**
 * Creates a new new checklist.
 *
 * @author SG, ELO Digital Office GmbH
 * @version 1.00.000
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
 * @requires sol.common.ix.functions.CopyFolderContents
 * @requires sol.common.ix.functions.CopySordData
 * @requires sol.checklist.Utils
 */
sol.define("sol.checklist.ix.actions.CreateChecklist", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["checklistTemplateId"],

  /**
   * @cfg {String} checklistTemplateId (required)
   * Object ID of the template
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
    me.config = sol.checklist.Utils.loadConfig();
  },

  getName: function () {
    return "CreateChecklist";
  },

  process: function () {
    var me = this,
        name, wfName, objId, flowId;

    if (!me.checklistTemplateId) {
      me.addErrorEvent("sol.checklist.ix.actions.CreateChecklist.error.target", null, null, me.ci);
      return;
    }

    name = me.getLocalizedString(me.ci, "sol.checklist.ix.actions.CreateChecklist.newChecklistName");
    wfName = me.getLocalizedString(me.ci, "sol.checklist.ix.actions.CreateChecklist.wfTitle");

    objId = sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      objId: me.objId,
      source: me.checklistTemplateId,
      copySourceAcl: false,
      inheritDestinationAcl: true,
      name: name
    });

    flowId = me.startWorkflow(objId, "sol.checklist.create", wfName);

    if (flowId) {
      me.addWfDialogEvent(flowId, { objId: objId, title: name, dialogId: me.getName() });

      me.addGotoIdEvent(objId, undefined, {
        type: "WF_STATUS",
        value: "CREATE",
        flowId: flowId
      });
    }
  },

  /**
   * @private
   * Creates the temporary elements and workflow name.
   * @return {String}
   */
  buildElementName: function () {
    var me = this,
        prefix;

    prefix = me.getLocalizedString(me.ci, me.config.workflows.createContract.workflowPrefixKey);
    return sol.create("sol.common.Template", { source: me.config.workflows.createContract.workflowNameTemplate }).apply({ wfPrefix: prefix, contractType: me.contractType });
  },

  /**
   * @private
   * Creates a timestamp.
   * @return {String}
   */
  getTimeStampString: function () {
    return String(Packages.org.apache.commons.lang.time.DateFormatUtils.format(new java.util.Date(), "yyyyMMddHHmmss"));
  }

});

/**
 * @member sol.contract.ix.actions.CreateChecklist
 * @method RF_sol_checklist_action_CreateChecklist
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_checklist_action_CreateChecklist(ec, configAny) {
  var config, checklist, result;

  logger.enter("RF_sol_checklist_action_CreateChecklist", configAny);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "objId", "checklistTemplateId");
  config.ci = ec.ci;

  checklist = sol.create("sol.checklist.ix.actions.CreateChecklist", config);
  result = checklist.execute();

  logger.exit("RF_sol_checklist_action_CreateChecklist", result);

  return result;
}


