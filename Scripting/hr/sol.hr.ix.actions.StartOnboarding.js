
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.FileUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js

/**
 * Creates a new onboarding process and starts the masks standard workflow on it.
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @requires sol.common.Config
 * @requires sol.common.AclUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.UserUtils
 * @requires sol.common.FileUtils
 * @requires sol.common.Template
 * @requires sol.common.Map
 * @requires sol.common.ix.ActionBase
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 */

sol.define("sol.hr.ix.actions.StartOnboarding", {
  extend: "sol.common.ix.ActionBase",

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    //configproperties
    inheritanceActiveForSoltypes: { config: "hr", prop: "entities.employeeentryrequest.actions.create.options.api.enable.soltypes", template: true }, // []
    shortDescription: { config: "hr", prop: "entities.employeeentryrequest.actions.create.const.temporaryAttributes.shortDescription", template: true }, // ""
    target: { config: "hr", prop: "entities.employeeentryrequest.actions.create.const.temporaryAttributes.targetDirectory", template: true }, // ""
    standardWfField: { config: "hr", prop: "entities.employeeentryrequest.actions.create.workflow.maskStandardWorkflow.field", template: true }, // ""
    useStandardWf: { config: "hr", prop: "entities.employeeentryrequest.actions.create.workflow.maskStandardWorkflow.start" }, // bool
    dialogTitle: { config: "hr", prop: "entities.employeeentryrequest.actions.create.workflow.dialogTitle", template: true }, // ""
    customWf: { config: "hr", prop: "entities.employeeentryrequest.actions.create.workflow.customWorkflow.name", template: true }, // ""
    addReferences: { config: "hr", prop: "entities.employeeentryrequest.actions.create.options.addReferences", template: true }, // []
    rights: { config: "hr", prop: "entities.employeeentryrequest.actions.create.options.changeRights", template: true }, // {}
    standardTargetMaskName: { config: "hr", prop: "entities.employeeentryrequest.actions.create.const.standardTargetMaskName", template: true }, // ""
    standardTargetSordTypeName: { config: "hr", prop: "entities.employeeentryrequest.actions.create.const.standardTargetSordTypeName", template: true }, // ""
    requestConfigs: { config: "hronboarding", prop: "requestConfigs", template: true }, // []
    //templating data
    params: { prop: "params", log: false },
    sord: { prop: "personnelfile", log: false },
    PERSONNELFILE: { prop: "personnelfile", log: false }
  },



  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [params]);
    me.params = params;
    me.personnelfile = sol.hr.shared.Utils.getSordData(params.selectedObjId, undefined, true);  // can't use direct sordid-inject because admin access is required
  },

  getName: function () {
    return "StartOnboarding";
  },

  process: function () {
    var me = this, newId, wfOpts, inheritDataFunction;

    newId = sol.hr.shared.Utils.prepareFolderViaTemplate({
      typeSource: me.typeSource,
      typeSourceName: me.typeSourceName,
      target: me.target,
      shortDescription: me.shortDescription,
      typeTargetMaskName: me.typeTargetMaskName || me.standardTargetMaskName,
      typeTargetSordTypeName: me.typeTargetSordTypeName || me.standardTargetSordTypeName,
      rights: me.rights
    }); // 1. Copy template to create new object

    wfOpts = {
      useStandardWf: me.useStandardWf,
      standardWfField: me.standardWfField,
      customWf: me.typeWorkflow,
      wfMessage: me.typeName,
      dialogTitle: me.dialogTitle,
      flowId: undefined,
      goto: false,
      refresh: true
    };

    inheritDataFunction = sol.hr.shared.Utils.inheritData.bind(me, { // 2. let new object inherit data. Delayed to after workflow has been created
      sourceId: me.selectedObjId,
      targetId: newId,
      apiPath: "requestConfigs." + me.typeId.trim() + ".api",
      apisBase: me,
      inheritanceActiveForSoltypes: me.inheritanceActiveForSoltypes,
      useStandardWf: me.useStandardWf,
      addReferences: me.addReferences
    }, wfOpts); //  wfOpts reference is passed to function-binding, because inherit changes data in it  // wfOpts reference is passed into inheritDataFunction

    wfOpts.inheritDataFunction = inheritDataFunction;  // inheritData will be called in startWorkflowAndEvents as soon as flowId is available

    sol.hr.shared.Utils.startWorkflowAndEvents(me, newId, wfOpts); // 3. start workflow
  }
});

/**
 * @member sol.hr.ix.actions.StartOnboarding
 * @method RF_sol_hr_personnel_action_StartOnboarding
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_hr_personnel_action_StartOnboarding(ec, args) {
  var rfParams, actionProc, result;

  rfParams = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  actionProc = sol.create("sol.hr.ix.actions.StartOnboarding", rfParams);
  result = actionProc.execute();

  return result;
}