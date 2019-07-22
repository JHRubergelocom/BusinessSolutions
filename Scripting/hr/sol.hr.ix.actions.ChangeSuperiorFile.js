
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);

//@include lib_Class.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.hr.ix.actions.sol.hr.ix.actions.ChangeSuperiorFile" });

/**
 * Starts the workflow sol.hr.personnel.ChangeSuperiorFile on the selected personnel file.
 *
 * @author JHR, ELO Digital Office GmbH
 *
 * @requires sol.common.ix.ActionBase
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 */

sol.define("sol.hr.ix.actions.ChangeSuperiorFile", {
  extend: "sol.common.ix.ActionBase",

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    standardWfField: { config: "hr", prop: "entities.file.actions.changesuperior.workflow.maskStandardWorkflow.field", template: true }, // ""
    useStandardWf: { config: "hr", prop: "entities.file.actions.changesuperior.workflow.maskStandardWorkflow.start", template: true }, // bool
    customWf: { config: "hr", prop: "entities.file.actions.changesuperior.workflow.customWorkflow.name", template: true }, // ""
    wfMessage: { config: "hr", prop: "entities.file.actions.changesuperior.workflow.message", template: true } // ""
  },

  getName: function () {
    return "ChangeSuperiorFile";
  },

  process: function () {
    var me = this;

    sol.hr.shared.Utils.startWorkflowAndEvents(me, me.selectedObjId, {
      useStandardWf: me.useStandardWf,
      standardWfField: me.standardWfField,
      customWf: me.customWf,
      wfMessage: me.wfMessage
    }); // start workflow
  }
});

/**
 * @member sol.hr.ix.actions.ChangeSuperiorFile
 * @method RF_sol_hr_personnel_action_ChangeSuperiorFile
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_hr_personnel_action_ChangeSuperiorFile(ec, args) {
  var rfParams, actionProc, result;

  rfParams = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  actionProc = sol.create("sol.hr.ix.actions.ChangeSuperiorFile", rfParams);
  result = actionProc.execute();

  return result;
}
