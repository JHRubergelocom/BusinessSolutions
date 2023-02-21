
importPackage(Packages.java.io);
importPackage(Packages.java.util);
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.org.apache.commons.io);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.ExecuteLib9" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib9', {
 *       className: 'sol.unittest.ix.ActionBase',
 *       classConfig: {}
 *       method: 'getName',
 *       params: []
 *     });
 *
 * *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.ix.services.ExecuteLib9", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["className", "classConfig", "method", "params"],

  /**
   * @cfg {String} className Class name.
   */

  /**
   * @cfg {Object} classConfig configuration for class initialization.
   */

  /**
   * @cfg {String} method Method name.
   */

  /**
   * @cfg {Object[]} params Method parameters array.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this,
        result = {}, findInfo,
        cls, func;

    switch (me.className) {
      case "sol.common.ix.services.ActionCancelForm":
      case "sol.common.ix.services.ActionDefinitionCollector":
      case "sol.common.ix.services.BLPProjects":
      case "sol.common.ix.services.BLPQueries":
      case "sol.common.ix.services.ChildrenDataCollector":
      case "sol.common.ix.services.ChildrenDataWithMaps":
      case "sol.common.ix.services.DMSDesktop":
      case "sol.common.ix.services.DownloadFileContent":
      case "sol.common.ix.services.Encrypt":
      case "sol.common.ix.services.ExecuteAsAction":
      case "sol.common.ix.services.FindSords":
      case "sol.common.ix.services.GenerateSetInstructions":
      case "sol.common.ix.services.GetBusinessSolutionConfigs":
      case "sol.common.ix.services.GetConfig":
      case "sol.common.ix.services.GetDocumentsPreviewURLs":
      case "sol.common.ix.services.GetKeywordingForms":
      case "sol.common.ix.services.GetLocalization":
      case "sol.common.ix.services.GetNamespacedConfigs":
      case "sol.common.ix.services.GetRedactorTemplates":
      case "sol.common.ix.services.GetTemplates":
      case "sol.common.ix.services.GetUsers":
      case "sol.common.ix.services.GetWorkflowMetadata":
      case "sol.common.ix.services.KwlDataCollector":
      case "sol.common.ix.services.KwlDataCollector.BaseDynKwl":
      case "sol.common.ix.services.KwlDataCollector.BaseKwl":
      case "sol.common.ix.services.KwlDataCollector.FlatKwl":
      case "sol.common.ix.services.KwlDataCollector.SimpleKeyMapDynKwl":
      case "sol.common.ix.services.ParentDataCollector":
      case "sol.common.ix.services.ScriptVersionReportCreate":
      case "sol.common.ix.services.ScriptVersionReportValidate":
      case "sol.common.ix.services.SordDataCollector":
      case "sol.common.ix.services.StandardPreconditions":
      case "sol.common.ix.services.StandardTypes":
      case "sol.common.ix.services.TestGenericDynKwl":
      case "sol.common.ix.services.UploadFile":
      case "sol.common.ix.services.UploadFileContent":
      case "sol.common.ix.services.UserProfileOptions":
      case "sol.common_document.ix.services.BatchImport":
      case "sol.common_document.ix.services.BatchImportStatus":
      case "sol.common_monitoring.ix.services.SearchTimedEvents":
      case "sol.common_sig.ix.services.UploadSignature":
      case "sol.connector.ix.services.SQLProvider":
      case "sol.dev.ix.services.CreateRepoEntry":
      case "sol.dev.ix.services.DownloadIxPlugin":
      case "sol.dev.ix.services.GetPackageTypes":
      case "sol.dev.ix.services.IntegrityCheck":
        return result;
      default:
    }

    me.classConfig.ec = me.ec;
    me.classConfig.ci = me.ec.ci;

    switch (me.className) {
      case "sol.common.ix.services.ActionDefinitionCollector":
      case "sol.common.ix.services.ChildrenDataCollector":
      case "sol.common.ix.services.SordDataCollector":
        me.classConfig.sordZ = new SordZ(SordC.mbAll);
        switch (me.method) {
          case "determinatePageStartIdxByObjId":
          case "execute":
            return result;
          default:
        }
        break;
      case "sol.common.ix.services.BLPProjects":
      case "sol.common.ix.services.BLPQueries":
        return result;
      case "sol.common.ix.services.DMSDesktop":
        switch (me.method) {
          case "prepareCfgObj":
            return result;
          default:
        }
        break;
      case "sol.common.ix.services.GetDocumentsPreviewURLs":
        switch (me.method) {
          case "addPageSelection":
          case "addPreviewSize":
          case "addProcessDocument":
          case "addAnnOpts":
          case "process":
            return result;
          default:
        }
        break;
      case "sol.common.ix.services.GetTemplates":
      case "sol.common.ix.services.GetTemplates.Provider":
        return result;
      case "sol.common.ix.services.KwlDataCollector.BaseDynKwl":
        switch (me.method) {
          case "listToJsArray":
            return result;
          default:
        }
        break;
      case "sol.common_document.ix.services.BatchImport":
        switch (me.method) {
          case "run":
            return result;
          default:
        }
        break;
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.common.ix.services.ChildrenDataCollector":
        switch (me.method) {
          case "getFormattedJson":
            me.params[0] = cls.getSordFormatter();
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.common.ix.services.GetNamespacedConfigs":
        switch (me.method) {
          case "removeDuplicats":
            func = cls.utils[me.method];
            break;
          default:
        }
        break;
      case "sol.common.ix.services.ParentDataCollector":
        switch (me.method) {
          case "collectHierarchy":
          case "createTemplateSord":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.common.ix.services.ScriptVersionReportCreate":
        switch (me.method) {
          case "isoFromDate":
            me.params[0] = new Date();
            break;
          default:
        }
        break;
      case "sol.common.ix.services.SordDataCollector":
        switch (me.method) {
          case "buildFindByIndex":
          case "buildFindDirect":
          case "buildFindInfo":
          case "findGuids":
            findInfo = new FindInfo();
            findInfo.findChildren = new FindChildren();
            findInfo.findChildren.parentId = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions";
            findInfo.findChildren.endLevel = 1;
            me.params[0] = findInfo;
            break;
          default:
        }
        break;
      case "sol.common.ix.services.StandardPreconditions":
        switch (me.method) {
          case "isValid":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.common.ix.services.StandardTypes":
        switch (me.method) {
          case "convertType":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.common_document.ix.services.BatchImport":
        switch (me.method) {
          case "callService":
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "date":
            func = cls.converterFunctions[me.method];
            break;
          case "notempty":
            func = cls.validatorFunctions[me.method];
            break;
          default:
        }
        break;
      case "sol.dev.ix.services.IntegrityCheck":
        switch (me.method) {
          case "getbiJson":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      default:
    }

    if (sol.common.ObjectUtils.isFunction(func)) {
      result = func.apply(cls, me.params);
    } else {
      throw "IllegalMethodException: Method '" + me.method + "' not supported in Class '" + me.className + "'";
    }

    return result;
  }
});

/**
 * @member sol.unittest.ix.services.ExecuteLib9
 * @method RF_sol_unittest_service_ExecuteLib9
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_ExecuteLib9(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_ExecuteLib9", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.ix.services.ExecuteLib9", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_ExecuteLib9", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
