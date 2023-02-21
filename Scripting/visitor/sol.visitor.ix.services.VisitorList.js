
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.AsUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.visitor.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.services.VisitorList" });

/**
 * Reads a visitor list
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |||
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.visitor.Utils
 *
 */
sol.define("sol.visitor.ix.services.ReadVisitorList", {
  extend: "sol.common.ix.ServiceBase",

  firstLineNo: undefined,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.visitor.Utils.loadConfig();
  },

  process: function () {
    var me = this,
        updates = {},
        tableConfig, result, content, contentObj;

    tableConfig = me.config.readVisitorList.tableConfig;

    result = sol.common.AsUtils.callAs({
      objId: me.objId,
      ruleName: "sol.common_document.as.functions.ReadExcelTable",
      tableConfig: tableConfig
    });

    content = result.content;

    contentObj = JSON.parse(content);

    updates = contentObj.data;

    return updates;
  }
});


/**
 * @member sol.visitor.ix.services.ReadVisitorList
 * @method RF_sol_visitor_service_ReadVisitorList
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 *
 * Example:
 *
 *     RF_sol_visitor_service_ReadVisitorList
 *     {
 *       "objId": "1234"
 *     }
 */
function RF_sol_visitor_service_ReadVisitorList(ec, args) {
  var service, params, result, resultString;

  logger.enter("RF_sol_visitor_service_ReadVisitorList", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");

  service = sol.create("sol.visitor.ix.services.ReadVisitorList", params);

  result = service.process();
  resultString = sol.common.ix.RfUtils.stringify(result);
  logger.exit("RF_sol_visitor_service_ReadVisitorList", resultString);

  return resultString;
}
