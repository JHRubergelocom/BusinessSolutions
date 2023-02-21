
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js

/**
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.Map
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.UserUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 *
 * @eloix
 *
 * This function sets security flags in the WFMAP of a sord according to specific rules.
 *
 * if the userId is not a team-member of the superior, or the superior's own userId or
 * (the userId is not the user's own id and the user is not a superior), the INQUIRY_ILLEGAL_USER
 * field will be set to TRUE.
 *
 * If the inquiry type id is not equal to the security role returned by getEligiblePersonnelFiles,
 * the INQUIRY_ILLEGAL_SECURITY_ROLE field will be set to true.
 *
 * Later, in the workflow form, error messages will be shown according to the values of these fields.
 *
 * This function will probably only be used in the particular personnel file inquiry workflow-step.
 */
sol.define("sol.hr.ix.functions.DoubleCheck", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    securityLevelField: { config: "hr", prop: "entities.file.functions.doublecheck.const.securityLevelMapField", template: true }, // ""
    originGUIDField: { config: "hr", prop: "entities.file.functions.doublecheck.const.originGUIDField", template: true }, // ""
    inquiryConfigs: { config: "hrsecurityroles", prop: "requestConfigs", template: true, log: false } // []
  },

  convertSecurityLevels: function (config, map) {
    var me = this;
    Array.isArray(config.securityclassifications) && config.securityclassifications.forEach(function (level, i) {
      map.setValue(me.securityLevelField + (i + 1), level);
    });
  },

  process: function () {
    var me = this, inquiryMap, securityRole, validUserFound = false, securityRoleValid = false, originSord, originGuid;

    me.inquiryConfigs.some(function (cfg) {
      securityRole = cfg.workflow === me.wfTemplateName && cfg;
      return securityRole;
    });

    originSord = sol.hr.shared.Utils.getSordData(me.objId, me.flowId, true);
    originGuid = String(sol.common.ObjectUtils.getProp(originSord, me.originGUIDField));
    (sol.common.IxUtils.execute("RF_sol_hr_service_GetEligiblePersonnelFiles", { userId: me.wfOwnerName })).forEach(function (configuredUser) {
      if (String(configuredUser.inheritanceGuid) === originGuid) {
        validUserFound = true;
        if (String(configuredUser.workflow) === String(securityRole.workflow)) { //id is not the userId but the security-role (workflow). see config
          securityRoleValid = true;
        }
      }
    });

    inquiryMap = sol.create("sol.common.WfMap", {
      objId: me.objId,
      flowId: me.flowId
    });

    inquiryMap.read();

    if (!validUserFound) {
      inquiryMap.setValue("INQUIRY_ILLEGAL_USER", "TRUE");
      inquiryMap.write();
    }

    if (!securityRoleValid) {
      inquiryMap.setValue("INQUIRY_ILLEGAL_SECURITY_ROLE", "TRUE");
      inquiryMap.write();
    }

    me.convertSecurityLevels(securityRole, inquiryMap);
    inquiryMap.write();
  }
});

/**
 * @member sol.common.ix.functions.DoubleCheck
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.wfTemplateName = String(wfDiagram.templateName);
  params.wfOwnerName = String(wfDiagram.ownerName);

  fun = sol.create("sol.hr.ix.functions.DoubleCheck", params);

  fun.process();
}

/**
 * @member sol.common.ix.functions.DoubleCheck
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.wfTemplateName = String(wfDiagram.templateName);
  params.wfOwnerName = String(wfDiagram.ownerName);

  fun = sol.create("sol.hr.ix.functions.DoubleCheck", params);

  fun.process();
}


/**
 * @member sol.common.ix.functions.DoubleCheck
 * @method RF_sol_hr_function_DoubleCheck
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_hr_function_DoubleCheck(iXSEContext, args) {
  var rfParams, fun;

  rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  fun = sol.create("sol.hr.ix.functions.DoubleCheck", rfParams);

  fun.process();
}
