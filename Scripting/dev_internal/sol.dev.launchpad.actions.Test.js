
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
//@include lib_sol.common.Map.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.dev.ix.ActionUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.launchpad.actions.Test" });

/**
 * Creates a new new package.
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.Map
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ActionBase
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.ActionUtils
 */
sol.define("sol.dev.launchpad.actions.Test", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["ci", "user"],

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
    me.config = sol.dev.ix.ActionUtils.loadConfigDevInternal();
  },

  getName: function () {
    return "CreatePackage";
  },

  process: function () {
    var me = this;

    //me.addWfDialogEvent(flowId, { objId: objId, title: name, dialogId: me.getName() });
    if (me.command === "GOTO") {
      me.addGotoIdEvent(28875);
      //me.addErrorEvent("GOTO");
      me.addFeedbackEvent("Goto Feedback");
    } else
    if (me.command === "ERROR") {
      //me.addErrorEvent("ERROR");
    } else
    if (me.command === "ACTION") {
      //me.addErrorEvent("ACTION");
      me.addFeedbackEvent("Action 1 Feedback");
      me.addActionEvent("RF_sol_dev_launchpad_action_Test", { command: "ACTION_FINISHED" });
    } else if (me.command === "ACTION_FINISHED") {
      //me.addErrorEvent("Action chain executed");
      me.addFeedbackEvent("Action 2 Feedback");
      return;
    } else {
      me.addFeedbackEvent("Else Feedback");
    }
  }
});

/**
 * @member sol.dev.ix.actions.CreatePackage
 * @method RF_sol_dev_action_CreatePackage
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_dev_launchpad_action_Test(ec, configAny) {
  logger.enter("RF_sol_dev_launchpad_action_Test", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny),
      createPackage, result;

  config.ci = ec.ci;
  config.user = ec.user;

  createPackage = sol.create("sol.dev.launchpad.actions.Test", config);
  result = createPackage.execute();
  logger.exit("RF_sol_dev_launchpad_action_Test", result);
  return result;
}

function RF_sol_dev_launchpad_action_TestType(ec, configAny) {
  logger.enter("RF_sol_dev_launchpad_action_TestType", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = {}, result;

  config.ci = ec.ci;
  config.user = ec.user;

  result = rfUtils.stringify([
    {
      desc: "Goto Event",
      name: "GOTO",
      objId: "1"
    },
    {
      desc: "View Event",
      name: "VIEW",
      objId: "2"
    },
    {
      desc: "Error event",
      name: "ERROR",
      objId: "3"
    },
    {
      desc: "Action event",
      name: "ACTION",
      objId: "3"
    },
    {
      desc: "Action event",
      name: "ACTION_FINISHED",
      objId: "5"
    }
  ]);
  logger.exit("RF_sol_dev_launchpad_action_TestType", result);
  return result;
}








