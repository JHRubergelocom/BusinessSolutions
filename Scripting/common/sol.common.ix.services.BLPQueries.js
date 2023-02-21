
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.BLPQueries" });

/**
 * This service returns the queries of a BLP project.
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
sol.define("sol.common.ix.services.BLPQueries", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["serverUrl", "appToken", "projectId"],

  /**
   * @cfg {String} serverUrl Url of the BLP server (http://<IPAdress>:<Port>)
   * @cfg {String} appToken Encrypted app 
   * @cfg {String} projectId Id (or name) of the BLP project
   */

  /**
   * Gets all BLP queries of a BLP project
   * @returns {Object}
   */
  process: function () {
    var me = this;

    return me.getBLPQueries(me.serverUrl, me.appToken, me.projectId);
  },

  /**
   * Collects the types and stores them to `_types`.
   */
  getBLPQueries: function (serverUrl, appToken, projectId) {
    var me = this, url, queries = [];

    url = serverUrl + "/api/v1/project/" + projectId + "/dataquery";
    result = me.sendBLPRequest(url, appToken, "GET");

    if (!result.result) {
      throw new Exception("No queries returned. Content: " + JSON.stringify(result));
    }
    
    result.result.forEach(function (module) {
      module.items.forEach(function (query) {
        query.moduleId = module.module_id;
        query.addInId = module.addin_id;
        queries.push(query);
      });
    });

    return queries;
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
 * @member sol.common.ix.services.BLPQueries
 * @method BLPQueries
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_BLPQueries(ec, args) {
  var config, service, result;

  logger.enter("RF_sol_common_service_BLPQueries", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "serverUrl", "appToken", "projectId");
  config.ci = ec.ci;
  config.user = ec.user;

  service = sol.create("sol.common.ix.services.BLPQueries", config);
  result = sol.common.ix.RfUtils.stringify(service.process());

  logger.exit("RF_sol_common_service_BLPQueries", result);

  return result;
}
