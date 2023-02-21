
importPackage(Packages.java.io);
importPackage(Packages.java.util);
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.org.apache.commons.io);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.functions.GenerateIdentifier.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.ExecuteLib8" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib8', {
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
sol.define("sol.unittest.ix.services.ExecuteLib8", {
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
        result = {},
        cls, func;

    switch (me.className) {
      case "sol.common.ix.functions.ApplyDynKwl":
      case "sol.common.ix.functions.BackToPreviousUser":
      case "sol.common.ix.functions.Blackening":
      case "sol.common.ix.functions.ChangeColor":
      case "sol.common.ix.functions.ChangeGroup":
      case "sol.common.ix.functions.ChangeRights":
      case "sol.common.ix.functions.ChangeRightsWrapper":
      case "sol.common.ix.functions.ChangeUser":
      case "sol.common.ix.functions.ChangeWfName":
      case "sol.common.ix.functions.CheckDoc":
      case "sol.common.ix.functions.CheckDynAdHocFlowEnd":
      case "sol.common.ix.functions.CheckDynAdHocFlowStart":
      case "sol.common.ix.functions.CheckFromService":
      case "sol.common.ix.functions.CheckMandatoryFields":
      case "sol.common.ix.functions.CheckSolutionEnabled":
      case "sol.common.ix.functions.CopyFolderContents":
      case "sol.common.ix.functions.CopySordData":
      case "sol.common.ix.functions.CreateFromTemplate":
      case "sol.common.ix.functions.CreateGroup":
      case "sol.common.ix.functions.CreateSord":
      case "sol.common.ix.functions.Decide":
      case "sol.common.ix.functions.Delete":
      case "sol.common.ix.functions.FeedComment":
      case "sol.common.ix.functions.FillSord":
      case "sol.common.ix.functions.ForEach":
      case "sol.common.ix.functions.Inherit":
      case "sol.common.ix.functions.IsoDate":
      case "sol.common.ix.functions.Move":
      case "sol.common.ix.functions.MultiSet":
      case "sol.common.ix.functions.Notify":
      case "sol.common.ix.functions.ParallelSectionStart":
      case "sol.common.ix.functions.RemoveAcl":
      case "sol.common.ix.functions.RenderTemplate":
      case "sol.common.ix.functions.RestoreAcl":
      case "sol.common.ix.functions.Set":
      case "sol.common.ix.functions.SetPrivacyFields":
      case "sol.common.ix.functions.Status":
      case "sol.common.ix.functions.Subscription":
      case "sol.common.ix.functions.Unset":
      case "sol.common.ix.functions.UserDispatcher":
      case "sol.common.ix.functions.UserNodeStart":
      case "sol.common.ix.functions.UserRolesToMap":
      case "sol.common.ix.functions.UserToIndex":
      case "sol.common_document.ix.functions.EditWordParts":
      case "sol.common_monitoring.ix.events.Update":
      case "sol.common_monitoring.ix.functions.CreateTimedEvent":
      case "sol.common_monitoring.ix.functions.UpdateTimedEvent":
      case "sol.common_monitoring.ix.functions.UpsertTimedEvents":
      case "sol.dev.ix.functions.Deploy":
      case "sol.dev.ix.functions.GeneratePackage":
      case "sol.dev.ix.functions.RenamePackage":
      case "sol.dev.ix.functions.ResolveTemplate":
        return result;
      default:
    }

    me.classConfig.ec = me.ec;

    switch (me.className) {
      case "sol.common_monitoring.ix.events.Update":
        me.classConfig.sordZ = new SordZ(SordC.mbAll);
        break;
      case "sol.common_monitoring.ix.functions.UpsertTimedEvents":
        return result;
      case "sol.common.ix.functions.Blackening":
        switch (me.method) {
          case "byteArrayFromStream":
            return result;
          default:
        }
        break;
      case "sol.common.ix.functions.CopyFolderContents":
      case "sol.common.ix.functions.CreateFromTemplate":
      case "sol.common.ix.functions.CreateSord":
      case "sol.common.ix.functions.ForEach":
        return result;
      case "sol.common.ix.functions.Decide":
        me.classConfig.sord = ixConnect.ix().checkoutSord(me.classConfig.wfDiagram.objId, SordC.mbAllIndex, LockC.NO);
        break;
      case "sol.common.ix.functions.GenerateIdentifier":
        me.className = "sol.unittest.ix.functions.GenerateIdentifier";
        me.classConfig.sord = ixConnect.ix().checkoutSord(me.classConfig.objId, SordC.mbAllIndex, LockC.NO);
        break;
      case "sol.common.ix.functions.Set":
        switch (me.method) {
          case "getValueFromDynKwl":
            return result;
          default:
        }
        break;
      case "sol.common.ix.functions.Status":
        switch (me.method) {
          case "getStatusFromDynKwl":
            return result;
          default:
        }
        break;
      case "sol.dev.ix.functions.GeneratePackage":
      case "sol.dev.ix.functions.RenamePackage":
        switch (me.method) {
          case "process":
            return result;
          default:
        }
        break;
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.common.ix.functions.ChangeRightsWrapper":
        cls.conn = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;
        break;
      case "sol.common.ix.functions.Status":
        switch (me.method) {
          case "getStatus":
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
 * @member sol.unittest.ix.services.ExecuteLib8
 * @method RF_sol_unittest_service_ExecuteLib8
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_ExecuteLib8(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_ExecuteLib8", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.ix.services.ExecuteLib8", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_ExecuteLib8", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

sol.define("sol.unittest.ix.functions.GenerateIdentifier", {
  extend: "sol.common.ix.functions.GenerateIdentifier",

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifierTemplateId
   */
  getIdentifierTemplateId: function () {
    return "UTTemplateX9999";
  },

  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#getIdentifier
   */
  getIdentifier: function () {
    return "UTX9999";
  },
  /**
   * @inheritdoc sol.common.ix.functions.GenerateIdentifier#setIdentifier
   */
  setIdentifier: function () {
  }

});
