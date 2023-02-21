importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

//@include lib_sol.common.Injection.js
//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.datev.accounting.mixins.LocalizedKwlList.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js

// noinspection ES6ConvertVarToLetConst
var logger = sol.create("sol.Logger", { scope: "sol.datev.accounting.ix.functions.SkipAccounting" });

/**
 *
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.common.Config
 * @requires  sol.common.ix.FunctionBase
 *
 * This functions module can only be used as an end script onto a workflow node
 *
 */
sol.define("sol.datev.accounting.ix.functions.SkipAccounting", {
  extend: "sol.common.ix.FunctionBase",

  required: ["objId", "flowId", "dependsOn"],

  mixins: [
    "sol.datev.accounting.mixins.Configuration",
    "sol.datev.accounting.mixins.LocalizedKwlList",
    "sol.common.mixins.Inject"],

  inject: {
    documentTypes: { config: "accounting", prop: "documentTypes", template: false }
  },

  initialize: function (config) {
    // noinspection ES6ConvertVarToLetConst
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
     *
     */
  process: function () {
    // noinspection ES6ConvertVarToLetConst
    var me = this, matchDocTypes, shouldSkip;

    try {
      me.logger.info(["documentTypes={0}", JSON.stringify(me.documentTypes)]);

      matchDocTypes = me.getRulesByDocType();
      me.logger.info(["matchDocTypes = {0} " , JSON.stringify(matchDocTypes)]);


      shouldSkip = me.shouldSkipAccounting(matchDocTypes[0]);
      if (me.flowId && matchDocTypes.length > 0 && shouldSkip){
        me.logger.info("set wf status");
        sol.common.WfUtils.setWorkflowStatus(me.wfDiagram, "SKIP_ACCOUNTING");
      } else {
        me.logger.info(["cant write wf status flowId={0}, matchDocTypes={1} , skip={2}", me.flowId, JSON.stringify(matchDocTypes),shouldSkip ]);
      }
    } catch (e) {
      me.logger.warn(["Couldn't skip accounting for objId={0}", me.objId] , ex);
    }
  },


  /**
   *
   * @return {*}
   */
  getRulesByDocType: function () {
    // noinspection ES6ConvertVarToLetConst
    var me = this,
        sord, docType, docTypeKey;

    sord = sol.common.RepoUtils.getSord(me.objId, { sordZ: SordC.mbAllIndex });

    me.logger.info(["depends on field config = {0} " , JSON.stringify(me.dependsOn)]);

    docType = sol.common.SordUtils.getValue(sord, me.dependsOn);

    if (!docType){
       throw "field indicator is not set in obj= " + sord.id;
    }

    docTypeKey = docType;



    if (me.dependsOn.useKwl){
       docTypeKey = me.getLocalizedKey(docType);
    }
    me.logger.info(["key {0}", docTypeKey])
    me.logger.info(["docTypes {0}", JSON.stringify(me.documentTypes)])
    return me.documentTypes.filter(function (type) {
      me.logger.info(["ty {0}", JSON.stringify(type)])
      return type.key === docTypeKey
    });

  },

  /**
     *
     * @param rules
     * @return {boolean}
     */
  shouldSkipAccounting: function (documentType) {
    // noinspection ES6ConvertVarToLetConst
    var me = this,
        result = true,
        accountingRule;

    if (!documentType) {
      return false;
    }

    if (documentType && documentType.workflow && documentType.workflow.accounting) {
      accountingRule = documentType.workflow.accounting;

      if (typeof  accountingRule.skipping === 'string'){
        accountingRule.skipping = accountingRule.skipping == 'true';
      }

      if (typeof accountingRule.skipping === "boolean") {
        result = accountingRule.skipping;
      }
    } else {
      me.logger.info(["no process accounting ruleset is defined for {0}, rules={1}", documentType.key, JSON.stringify(documentType)])
    }
    return result;
  },

});

/**
 * @member
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  // noinspection ES6ConvertVarToLetConst
  var params, module;

  logger.enter("onExitNode_SkipAccounting", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "dependsOn");
  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  params.wfDiagram = wFDiagram;

  module = sol.create("sol.datev.accounting.ix.functions.SkipAccounting", params);

  module.process();

  logger.exit("onExitNode_SkipAccounting");
}


/**
 * @member sol.datev.accounting.ix.functions.SkipAccounting
 * @method RF_sol_datev_accounting_service_GetDocumentTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_datev_accounting_function_SkipAccounting(iXSEContext, args) {
  logger.enter("RF_sol_datev_accounting_function_SkipAccounting", args);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      module, result;

  module = sol.create("sol.datev.accounting.ix.functions.SkipAccounting", config);
  result = rfUtils.stringify(module.process());
  logger.exit("RF_sol_datev_accounting_function_SkipAccounting", result);
  return result;
}
