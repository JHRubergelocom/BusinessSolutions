
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common_document.BatchImportData.js

var logger = sol.create("sol.Logger", { scope: "sol.common_document.ix.services.BatchImportStatus" });

/**
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.05.000
 *
 * @eloix
 * @requires  sol.common.ObjectUtils
 * @requires  sol.common.StringUtils
 * @requires  sol.common.ix.ServiceBase
 * @requires  sol.common_document.BatchImportData
 */
sol.define("sol.common_document.ix.services.BatchImportStatus", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.statusProvider = sol.create("sol.common_document.BatchImportStatus", {
      objId: me.objId
    });
  },

  retrieveStatus: function () {
    var me = this;

    return me.statusProvider.getStatus();
  },

  triggerStop: function () {
    var me = this;

    me.statusProvider.setStopFlag();
  }

});


/**
 * @member sol.common_document.ix.services.BatchImportStatus
 * @method RF_sol_common_document_service_BatchImport_Status
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_document_service_BatchImport_Status(ec, args) {
  var params, service, result;

  logger.enter("RF_sol_common_document_service_BatchImport_Status", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.common_document.ix.services.BatchImportStatus", params);
  result = service.retrieveStatus();

  logger.exit("RF_sol_common_document_service_BatchImport_Status", result);

  return sol.common.JsonUtils.stringifyAll(result);
}

/**
 * @member sol.common_document.ix.services.BatchImportStatus
 * @method RF_sol_common_document_service_BatchImport_Stop
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_document_service_BatchImport_Stop(ec, args) {
  var params, service;

  logger.enter("RF_sol_common_document_service_BatchImport_Stop", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.common_document.ix.services.BatchImportStatus", params);
  service.triggerStop();

  logger.exit("RF_sol_common_document_service_BatchImport_Stop");
}
