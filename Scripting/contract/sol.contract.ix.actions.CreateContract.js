
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
//@include lib_sol.contract.ix.ContractUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.contract.ix.actions.CreateContract" });

/**
 * Creates a new contract.
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
 * @requires sol.contract.ix.ContractUtils
 */
sol.define("sol.contract.ix.actions.CreateContract", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "user", "contractType"],

  /**
   * @cfg {de.elo.ix.client.ClientInfo} ci (required)
   */

  /**
   * @cfg {de.elo.ix.client.UserInfo} user (required)
   */

  /**
   * @cfg {String} templateId (required)
   * Object ID of the template
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
    me.config = sol.contract.ix.ContractUtils.loadConfig();
  },

  getName: function () {
    return "CreateContract";
  },

  process: function () {
    var me = this,
        name, objectType, objId, flowId;

    if (!me.templateId) {
      me.addErrorEvent("sol.contract.ix.actions.CreateContract.error.target", null, null, me.ci);
      return;
    }

    name = me.buildElementName();
    objectType = me.config.objectTypes[0];

    objId = sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      objId: "0",
      source: me.templateId,
      copySourceAcl: false,
      inheritDestinationAcl: false,
      name: me.contractType + " - " + me.getTimeStampString(),
      asAdmin: true,
      useQuickCopy: true,
      acl: {
        mode: "SET",
        entries: [
          { userName: me.user.name, rights: { r: true, w: true, d: true, e: true, l: true, p: true } }
        ]
      },
      metadata: [
        { type: "GRP", key: me.config.fields.objectType, value: objectType },
        { type: "GRP", key: me.config.fields.contractType, value: me.contractType }
      ]
    });

    flowId = me.startMaskStandardWorkflow(objId, { name: name, field: me.config.fields.defaultWorkflow });

    if (flowId) {
      me.addWfDialogEvent(flowId, { objId: objId, title: name, dialogId: me.getName() });
    }

    me.addGotoIdEvent(objId, undefined, {
      type: "WF_STATUS",
      value: "CREATE",
      flowId: flowId
    });
  },

  /**
   * @private
   * Creates the temporary elements and workflow name.
   * @return {String}
   */
  buildElementName: function () {
    var me = this;

    return sol.create("sol.common.Template", { source: me.config.workflows.createContract.workflowNameTemplate }).apply({ contractType: me.contractType });
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
 * @member sol.contract.ix.actions.CreateContract
 * @method RF_sol_contract_action_CreateContract
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_contract_action_CreateContract(ec, configAny) {
  logger.enter("RF_sol_contract_action_CreateContract", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "contractType", "templateId"),
      createContract, result;

  config.ci = ec.ci;
  config.user = ec.user;

  createContract = sol.create("sol.contract.ix.actions.CreateContract", config);
  result = createContract.execute();
  logger.exit("RF_sol_contract_action_CreateContract", result);
  return result;
}


