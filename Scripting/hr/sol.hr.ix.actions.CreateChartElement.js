
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
//@include lib_sol.hrorgchart.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js

/**
 * Creates a new organizational chart element
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
 * @requires sol.hrorgchart.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 */

sol.define("sol.hr.ix.actions.CreateChartElement", {
  extend: "sol.common.ix.ActionBase",

  mixins: ["sol.hrorgchart.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    inheritanceActiveForSoltypes: { config: "hrorgchart", prop: "entities.chartelement.actions.create.options.api.enable.soltypes", template: true }, // []
    shortDescription: { config: "hrorgchart", prop: "entities.chartelement.actions.create.const.temporaryAttributes.shortDescription", template: true }, // ""
    target: { config: "hrorgchart", prop: "entities.chartelement.actions.create.const.temporaryAttributes.targetDirectory", template: true }, // ""
    standardWfField: { config: "hrorgchart", prop: "entities.chartelement.actions.create.workflow.maskStandardWorkflow.field", template: true }, // ""
    useStandardWf: { config: "hrorgchart", prop: "entities.chartelement.actions.create.workflow.maskStandardWorkflow.start", template: true }, // bool
    dialogTitle: { config: "hrorgchart", prop: "entities.chartelement.actions.create.workflow.dialogTitle", template: true }, // ""
    customWf: { config: "hrorgchart", prop: "entities.chartelement.actions.create.workflow.customWorkflow.name", template: true }, // ""
    addReferences: { config: "hrorgchart", prop: "entities.chartelement.actions.create.options.addReferences", template: true, emptyNonRendered: true }, // []
    rights: { config: "hrorgchart", prop: "entities.chartelement.actions.create.options.changeRights", template: true }, // {}
    // templating data
    params: { prop: "params" }
  },

  initialize: function (params) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [params]);
    me.params = params;
  },

  getName: function () {
    return "CreateChartElement";
  },

  process: function () {
    var me = this, newId, wfOpts, inheritDataFunction;

    newId = sol.hr.shared.Utils.prepareFolderViaTemplate({
      target: me.target,
      shortDescription: me.shortDescription,
      typeTargetMaskName: me.typeTargetMaskName,
      typeTargetSordTypeName: me.typeTargetSordTypeName,
      rights: me.rights
    }); // 1. Copy template to create new object

    wfOpts = {
      useStandardWf: me.useStandardWf,
      standardWfField: me.standardWfField,
      customWf: me.typeWorkflow,
      wfMessage: me.typeName,
      dialogTitle: me.dialogTitle,
      flowId: undefined
    };

    inheritDataFunction = sol.hr.shared.Utils.inheritData.bind(me, { // 2. let new object inherit data. Delayed to after workflow has been created
      sourceId: me.typeSelectedGuid,
      targetId: newId,
      apiPath: "",
      apisBase: undefined,
      inheritanceActiveForSoltypes: me.inheritanceActiveForSoltypes,
      useStandardWf: me.useStandardWf,
      addReferences: me.addReferences
    }, wfOpts); //  wfOpts reference is passed to function-binding, because inherit changes data in it  // wfOpts reference is passed into inheritDataFunction

    inheritDataFunction();

    sol.hr.shared.Utils.startWorkflowAndEvents(me, newId, wfOpts); // 3. start workflow
  }
});

/**
 * @member sol.hr.ix.actions.CreateChartElement
 * @method RF_sol_hr_personnel_action_CreateChartElement
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_hr_personnel_action_CreateChartElement(ec, args) {
  var rfParams, actionProc, result;

  rfParams = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  actionProc = sol.create("sol.hr.ix.actions.CreateChartElement", rfParams);
  result = actionProc.execute();

  return result;
}