
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

var logger = sol.create("sol.Logger", { scope: "sol.dev_internal.ix.actions.ActionTest" });

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
 * @requires sol.dev_internal.ix.ContractUtils
 */
sol.define("sol.dev_internal.ix.actions.ActionTest", {
  extend: "sol.common.ix.ActionBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
  },

  getName: function () {
    return "ActionTest";
  },

  process: function () {
    var result = {},
        resultString;

    resultString = JSON.stringify(result);

    return resultString;
  }
});

/**
 * @member sol.dev_internal.ix.actions.ActionTest
 * @method RF_sol_dev_internal_actions_ActionTest
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_dev_internal_actions_ActionTest(ec, configAny) {
  var me = this,
      config, actionTest, result;

  logger.enter("RF_sol_dev_internal_actions_ActionTest", configAny);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);

  me.logger.info(["config={0}", JSON.stringify(config)]);

  actionTest = sol.create("sol.dev_internal.ix.actions.ActionTest", config);
  result = actionTest.execute();

  logger.exit("RF_sol_dev_internal_actions_ActionTest", result);

  return result;
}
