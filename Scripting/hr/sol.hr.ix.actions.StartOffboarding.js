
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);

//@include lib_Class.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.hr.ix.actions.sol.hr.ix.actions.StartOffboarding" });

/**
 * Starts the workflow sol.hr.personnel.StartOffboarding on the selected personnel file.
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @requires sol.common.ix.ActionBase
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 */

sol.define("sol.hr.ix.actions.StartOffboarding", {
  extend: "sol.common.ix.ActionBase",

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    standardWfField: { config: "hr", prop: "entities.file.actions.terminate.workflow.maskStandardWorkflow.field", template: true }, // ""
    useStandardWf: { config: "hr", prop: "entities.file.actions.terminate.workflow.maskStandardWorkflow.start", template: true }, // bool
    customWf: { config: "hr", prop: "entities.file.actions.terminate.workflow.customWorkflow.name", template: true }, // ""
    wfMessage: { config: "hr", prop: "entities.file.actions.terminate.workflow.message", template: true }, // ""
    dialogTitle: { config: "hr", prop: "entities.file.actions.terminate.workflow.dialogTitle", template: true } // ""
  },

  getName: function () {
    return "StartOffboarding";
  },

  process: function () {
    var me = this;

    sol.hr.shared.Utils.startWorkflowAndEvents(me, me.selectedObjId, {
      useStandardWf: me.useStandardWf,
      standardWfField: me.standardWfField,
      customWf: me.customWf,
      wfMessage: me.wfMessage,
      dialogTitle: me.dialogTitle
    }); // start workflow
  }
});

/**
 * @member sol.hr.ix.actions.StartOffboarding
 * @method RF_sol_hr_personnel_action_StartOffboarding
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_hr_personnel_action_StartOffboarding(ec, args) {
  var rfParams, actionProc, result;

  rfParams = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  actionProc = sol.create("sol.hr.ix.actions.StartOffboarding", rfParams);
  result = actionProc.execute();

  return result;
}
