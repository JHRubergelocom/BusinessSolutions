
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.connector_dx.DXUtils.js


var logger = sol.create("sol.Logger", { scope: "sol.connector_dx.ix.services.SetDxStatus" });

/**
 * Sets the DocXtractor status field
 *
 * # As IX function call
 *
 *     sol.common.IxUtils.execute('RF_sol_connector_dx_service_SetDxStatus', {
 *       objId: "(CE526160-41D1-D54E-CDA5-0CF6F88964CB)",
 *       status: "Imported",
 *     });
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.connector_dx.DXUtils
 *
 */
sol.define("sol.connector_dx.ix.services.SetDxStatus", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId", "subsystem", "status"],

  /**
   * @cfg {String} objId
   * Object ID
   */

  /**
   * @cfg {String} subsystem
   * The subsystem from which the configuration should be read.
   */

  /**
   * @cfg {String} status
   * Status
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  dxStatusFieldNames: {},

  /**
   * Sets the DocXtractor status.
   */
  process: function () {
    var me = this,
        dxStatusFieldName, dxConfig, sord, sordZ;

    dxStatusFieldName = me.dxStatusFieldNames[me.subsystem];

    if (!dxStatusFieldName) {

      dxConfig = sol.connector_dx.DXUtils.getDxConfig(me.subsystem);
      dxStatusFieldName = dxConfig.dxStatusFieldName;

      if (!dxStatusFieldName) {
        throw "DocXtractor status field name is empty: subsystem=" + me.subsystem;
      }
      me.dxStatusFieldNames[me.subsystem] = dxStatusFieldName;
    }

    if (typeof me.status === "undefined") {
      throw "Status is undefined.";
    }

    sordZ = new SordZ(SordC.mbObjKeys);
    sord = ixConnect.ix().checkoutSord(me.objId, sordZ, LockC.NO);

    sol.common.SordUtils.setObjKeyValue(sord, dxStatusFieldName, me.status);
    ixConnect.ix().checkinSord(sord, sordZ, LockC.NO);
  }
});

/**
 * @member sol.connector_dx.ix.services.SetDxStatus
 * @method RF_sol_connector_dx_service_SetDxStatus
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_connector_dx_service_SetDxStatus(iXSEContext, args) {
  var params, module, result;
  logger.enter("RF_sol_connector_dx_service_SetDxStatus", args);
  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "subsystem", "status");
  module = sol.create("sol.connector_dx.ix.services.SetDxStatus", params);
  result = sol.common.ix.RfUtils.stringify(module.process());
  logger.exit("RF_sol_connector_dx_service_SetDxStatus", result);
  return result;
}

// Prevents a multithreading problem within Handlebars caused by frequent DocXtractor calls
sol.common.RepoUtils.determinateSpecialFolders();
