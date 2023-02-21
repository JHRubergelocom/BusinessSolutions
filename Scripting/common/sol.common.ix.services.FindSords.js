
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.UploadFileContent" });

/**
 * Find Sords
 *
 * # As IX call
 *
 *     sol.common.IxUtils.execute("RF_sol_common_service_FindSords", {
 *       "objKeysObj": {
 *         "COMPANY_CODE": "1000",
 *         "VENDOR_NO": "1111",
 *         "INVOICE_NUMBER": "2222"
 *       }
 *     });
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires  sol.Logger
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.FindSords", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.findConfig = config;
    me.$super("sol.common.ix.ServiceBase", "initialize", []);
  },

  /**
   * Find sords
   * @return {Array} Template sords
   */
  process: function () {
    var me = this,
        sords, tplSords, result;

    sords = sol.common.RepoUtils.findSords(me.findConfig);

    tplSords = sords.map(function (sord) {
      return sol.common.SordUtils.getTemplateSord(sord).sord;
    });

    result = { sords: tplSords };

    return result;
  }
});

/**
 * @member sol.common.ix.services.FindSords
 * @method RF_sol_common_service_FindSords
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_FindSords(ec, args) {
  var params, service, result, resultString;

  logger.enter("RF_sol_common_service_FindSords", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  service = sol.create("sol.common.ix.services.FindSords", params);
  result = service.process();
  resultString = JSON.stringify(result);

  logger.exit("RF_sol_common_service_FindSords");

  return resultString;
}
