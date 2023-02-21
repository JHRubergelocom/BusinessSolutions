
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.contract.ix.ContractUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.contract.ix.actions.ConcludeContract" });

/**
 * Conclude a contract
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
 * @requires sol.contract.ix.ContractUtils
 */
sol.define("sol.contract.ix.actions.ConcludeContract", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "user", "objId"],

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
  },

  getName: function () {
    return "ConcludeContract";
  },

  process: function () {
    var me = this,
        contractSord, contractConfig, contractObjId,
        wfNumber, wfName, flowId, dialogTitle;

    contractConfig = sol.contract.ix.ContractUtils.loadConfig();
    contractSord = sol.common.RepoUtils.findObjectTypeInHierarchy(me.objId, contractConfig.objectTypes);
    if (!contractSord) {
      me.addErrorEvent("sol.contract.client.contract.msg.noContractFoundInHierarchy", "", "", me.ci.language);
      return;
    }

    me.requireUserRights(contractSord, { rights: "RW", language: me.ci });

    contractObjId = contractSord.id;

    wfNumber = me.actionId;
    wfName = sol.create("sol.common.Template", { source: contractConfig.workflows.concludeContract.workflowNameTemplate }).apply({ wfDate: new Date(), wfNumber: wfNumber });

    flowId = me.startWorkflow(contractObjId, contractConfig.workflows.concludeContract.workflowTemplateName, wfName);

    dialogTitle = sol.common.TranslateTerms.translate("sol.contract.client.ribbon.btnConcludeContract");

    me.addWfDialogEvent(flowId, { objId: contractObjId, dialogId: me.getName(), title: dialogTitle });
    me.addRefreshEvent(contractObjId, {
      type: "WF_STATUS",
      value: "CONCLUDE",
      flowId: flowId
    });
  }
});

/**
 * @member sol.contract.ix.actions.ConcludeContract
 * @method RF_sol_contract_action_ConcludeContract
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_contract_action_ConcludeContract(ec, configAny) {
  logger.enter("RF_sol_contract_action_ConcludeContract", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "objId"),
      concludeContract, result;

  config.ci = ec.ci;
  config.user = ec.user;

  concludeContract = sol.create("sol.contract.ix.actions.ConcludeContract", config);
  result = concludeContract.execute();
  logger.exit("RF_sol_contract_action_ConcludeContract", result);
  return result;
}
