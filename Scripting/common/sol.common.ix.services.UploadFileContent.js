
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.UploadFileContent" });

/**
 * Uploads a small file content as text to a document that is stored in elo.
 *
 * This service is useful if information should be uploaded from web applications.
 *
 * # As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_UploadFileContent', {
 *       objId: '123',
 *       content: '<xml><mydata></mydata></xml>'
 *     });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires  sol.Logger
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.UploadFileContent", {
  extend: "sol.common.ix.ServiceBase",
  requiredConfig: ["objId", "content"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Uploads the given file content as string
   */
  process: function () {
    var me = this;

    sol.common.RepoUtils.uploadSmallContent(me.objId, me.content);
  }
});

/**
 * @member sol.common.ix.services.UploadFileContent
 * @method RF_sol_common_service_UploadFileContent
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_UploadFileContent(iXSEContext, args) {
  logger.enter("RF_sol_common_service_UploadFileContent", args);
  var params, service;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "content");
  service = sol.create("sol.common.ix.services.UploadFileContent", params);
  service.process();
  logger.exit("RF_sol_common_service_UploadFileContent");
}
