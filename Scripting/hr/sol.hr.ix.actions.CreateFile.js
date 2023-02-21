
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);

//@include lib_Class.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js

/**
 * Creates a new personnel file and starts the masks standard workflow on it.
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @requires sol.common.ix.ActionBase
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 */

sol.define("sol.hr.ix.actions.CreateFile", {
  extend: "sol.common.ix.ActionBase",

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    inheritanceActiveForSoltypes: { config: "hr", prop: "entities.file.actions.create.options.api.enable.soltypes", template: true }, // []
    shortDescription: { config: "hr", prop: "entities.file.actions.create.const.temporaryAttributes.shortDescription", template: true }, // ""
    target: { config: "hr", prop: "entities.file.actions.create.const.temporaryAttributes.targetDirectory", template: true }, // ""
    standardWfField: { config: "hr", prop: "entities.file.actions.create.workflow.maskStandardWorkflow.field", template: true }, // ""
    useStandardWf: { config: "hr", prop: "entities.file.actions.create.workflow.maskStandardWorkflow.start" }, // bool
    customWf: { config: "hr", prop: "entities.file.actions.create.workflow.customWorkflow.name", template: true }, // ""
    wfMessage: { config: "hr", prop: "entities.file.actions.create.workflow.message", template: true }, // ""
    dialogTitle: { config: "hr", prop: "entities.file.actions.create.workflow.dialogTitle", template: true }, // ""
    typeSource: { config: "hr", prop: "entities.file.services.personnelfiletypes.const.templateFolders" } // []
  },

  getName: function () {
    return "CreateFile";
  },

  process: function () {
    var me = this, newId, wfOpts, inheritDataFunction;

    me.logger.debug(["temporaryTarget={0}, currentUser={1}", me.target, me.currentUserName]);

    newId = sol.hr.shared.Utils.prepareFolderViaTemplate({
      typeSource: me.typeSource,
      typeSourceName: me.typeName,
      target: me.target,
      shortDescription: me.shortDescription,
      typeTargetMaskName: me.typeTargetMaskName,
      rights: { mode: "SET", users: [me.currentUserName], rights: { r: true, w: true, d: true, e: true, l: true, p: true } }
    }); // 1. Copy template to create new object

    wfOpts = {
      useStandardWf: me.useStandardWf,
      standardWfField: me.standardWfField,
      customWf: me.customWf,
      wfMessage: me.wfMessage,
      flowId: undefined
    };

    inheritDataFunction = sol.hr.shared.Utils.inheritData.bind(me, { // 2. let new object inherit data. Delayed to after workflow has been created
      sourceId: me.selectedObjId,
      targetId: newId,
      inheritanceActiveForSoltypes: me.inheritanceActiveForSoltypes,
      useStandardWf: me.useStandardWf,
      addReferences: undefined
    }, wfOpts); //  wfOpts reference is passed to function-binding, because inherit changes data in it  // wfOpts reference is passed into inheritDataFunction

    wfOpts.inheritDataFunction = inheritDataFunction; // inheritData will be called in startWorkflowAndEvents as soon as flowId is available

    sol.hr.shared.Utils.startWorkflowAndEvents(me, newId, wfOpts); // 3. start workflow
  }
});

/**
 * @member sol.hr.ix.actions.CreateFile
 * @method RF_sol_hr_personnel_action_CreateFile
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_hr_personnel_action_CreateFile(ec, args) {
  var config, actionProc, result;

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  config.currentUserName = String(ec.user.name);

  actionProc = sol.create("sol.hr.ix.actions.CreateFile", config);
  result = actionProc.execute();

  return result;
}