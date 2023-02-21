
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.BLPProjects" });

/**
 * This service returns all the projects of a BLP server.
 *
 * @author ELO Digital Office GmbH
 * @version 1.13.000
 *
 * @eloix
 * @requires sol.common.ObjectUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.BLPProjects", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["serverUrl", "appToken"],

  /**
   * @cfg {String} $serverUrl Url of the BLP server (http://<IPAdress>:<Port>)
   * @cfg {String} $appToken Encrypted app token
   */

  /**
   * Performes the checks and retrieves the data as spezified in the configuration.
   * @returns {Object}
   */
  process: function () {
    var me = this;

    return me.getBLPProjects(me.serverUrl, me.appToken);
  },

  /**
   * Collects the types and stores them to `_types`.
   */
  getBLPProjects: function (serverUrl, appToken) {
    var me = this, url;

    url = serverUrl + "/api/v1/project";
    request = me.sendBLPRequest(url, appToken, "GET");

    if (!request.projects) {
      throw new Exception("No projects returned. Content: " + JSON.stringify(request));
    }

    return request.projects;
  },

  /**
   * @private
   * Retrieves a list of all projects of a BLP server.
   * @return {[]}
   */
  sendBLPRequest: function (url, appToken, method, data) {
    var me = this, responseObj, results, des, decryptedAppToken;
    logger.enter("sendBLPRequest", url);

    des = new Packages.de.elo.utils.sec.DesEncryption();
    decryptedAppToken = des.decrypt(appToken);
    requestProperties = {
      Authorization: "Bearer " + decryptedAppToken
    };

    responseObj = sol.common.HttpUtils.sendRequest({
      url: url,
      method: method,
      connectTimeout: 10000,
      readTimeout: 60000,
      dataObj: data,
      encodeData: false,
      requestProperties: requestProperties
    });

    results = JSON.parse(responseObj.content);
    logger.exit("sendBLPRequest");

    return results;
  }
});

/**
 * @member sol.common.ix.services.BLPProjects
 * @method BLPProjects
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_BLPProjects(ec, args) {
  var config, service, result;

  logger.enter("RF_sol_common_service_BLPProjects", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "serverUrl", "appToken");
  config.ci = ec.ci;
  config.user = ec.user;

  service = sol.create("sol.common.ix.services.BLPProjects", config);
  result = sol.common.ix.RfUtils.stringify(service.process());

  logger.exit("RF_sol_common_service_BLPProjects", result);

  return result;
}
