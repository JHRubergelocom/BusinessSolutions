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
 * Creates a new request for personnel file inquiry. Starts a workflow on the entry afterwards.
 *
 * ### Example Config
 *
 *     {"id": "hr.securityrole.employee"", "userId": "Erik Stach", "name": "Personalakteneinsicht", "description": "Anfrage einer Personalakteneinsicht", "personnelFileId": "1214124"}
 *
 *
 * @cfg {String} id (required) property name which will be read from /hr/Configuration/hr.externalsecurityroles.config
 * @cfg {String} userId (required) user, who inquired the personnel file access
 * @cfg {String} name (required) name for personnel file copy folder
 * @cfg {String} descripton (required) description-text for workflow-entry
 * @cfg {String} personnelFileId (required) objId of the personnel file to deliver
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

sol.define("sol.hr.ix.actions.InquirePersonnelFileAccess", {
  extend: "sol.common.ix.ActionBase",

  getName: function () {
    return "InquirePersonnelFileAccess";
  },

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    //configproperties
    inheritanceActiveForSoltypes: { config: "hr", prop: "entities.file.actions.inquire.options.api.enable.soltypes" }, // []
    shortDescription: { config: "hr", prop: "entities.file.actions.inquire.const.temporaryAttributes.shortDescription", template: true }, // ""
    target: { config: "hr", prop: "entities.file.actions.inquire.const.temporaryAttributes.targetDirectory", template: true }, // ""
    standardWfField: { config: "hr", prop: "entities.file.actions.inquire.workflow.maskStandardWorkflow.field", template: true }, // ""
    useStandardWf: { config: "hr", prop: "entities.file.actions.inquire.workflow.maskStandardWorkflow.start" }, // bool
    dialogTitle: { config: "hr", prop: "entities.file.actions.inquire.workflow.dialogTitle", template: true }, // ""
    customWf: { config: "hr", prop: "entities.file.actions.inquire.workflow.customWorkflow.name", template: true }, // ""
    addReferences: { config: "hr", prop: "entities.file.actions.inquire.options.addReferences", template: true, log: false }, // []
    rights: { config: "hr", prop: "entities.file.actions.inquire.options.changeRights", template: true }, // {}
    inquiryConfigs: { config: "hrsecurityroles", prop: "requestConfigs", template: true, log: false }, // []
    //templating data
    params: { prop: "params", log: false },
    PERSONNELFILE: { prop: "personnelfile", log: false }
  },

  initialize: function (params) {
    var me = this;
    this.$super("sol.common.ix.ActionBase", "initialize", [params]);
    me.params = params;
    me.personnelfile = params.typeInheritanceGuid && sol.hr.shared.Utils.getSordData(params.typeInheritanceGuid, undefined, true);  // can't use direct sord-inject because admin access is required
  },

  process: function () {
    var me = this, newId, wfOpts, inheritDataFunction;

    newId = sol.hr.shared.Utils.prepareFolderViaTemplate({
      target: me.target,
      shortDescription: me.shortDescription,
      typeTargetMaskName: me.typeTargetMaskName
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
      sourceId: me.typeInheritanceGuid,
      targetId: newId,
      apiPath: "inquiryConfigs." + me.typeId.trim() + ".api",
      apisBase: me,
      inheritanceActiveForSoltypes: me.inheritanceActiveForSoltypes,
      useStandardWf: me.useStandardWf,
      addReferences: me.addReferences
    }, wfOpts, true); //  wfOpts reference is passed to function-binding, because inherit changes data in it  // wfOpts reference is passed into inheritDataFunction

    wfOpts.inheritDataFunction = inheritDataFunction; // inheritData will be called in startWorkflowAndEvents as soon as flowId is available

    sol.hr.shared.Utils.startWorkflowAndEvents(me, newId, wfOpts); // 3. start workflow

    if (me.rights) {
      sol.common.AclUtils.changeRightsInBackground(newId, me.rights);
    }
  }
});

/**
 * @member sol.hr.ix.actions.InquirePersonnelFileAccess
 * @method RF_sol_hr_personnel_action_InquirePersonnelFileAccess
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_hr_personnel_action_InquirePersonnelFileAccess(ec, args) {
  var rfParams, actionProc, result;

  rfParams = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  actionProc = sol.create("sol.hr.ix.actions.InquirePersonnelFileAccess", rfParams);
  result = actionProc.execute();

  return result;
}