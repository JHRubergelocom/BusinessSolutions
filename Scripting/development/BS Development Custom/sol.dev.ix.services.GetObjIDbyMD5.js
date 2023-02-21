
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.services.GetObjIDbyMD5" });

sol.define("sol.dev.ix.services.GetObjIDbyMD5", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

 
  process: function () {
    var me = this, resultSet, statement, database;

    statement = "select objid from objekte po INNER JOIN elodmdocs pdocs on pdocs.docid = po.objdoc where po.objstatus = 0 and pdocs.md5 like " + me.md5 + "  order by po.objidate, md5";
    log.warn("sol.dev.ix.services.GetObjIDbyMD5 statement" + statement);
    database = new Packages.de.elo.ix.jscript.DBConnection();
    resultSet = database.query(statement);
    var result = [];
    log.warn("sol.dev.ix.services.GetObjIDbyMD5 resultSet.length" + resultSet.length);
    var idx = 0;
    while (resultSet[idx] && resultSet[idx][0]) {
      try {
        ixConnect.ix().checkoutSord(resultSet[idx][0], SordC.mbMin, LockC.NO);
        result.push({ objid: resultSet[idx][0] + "" });
      }
      catch (ex) {
      }
      idx++;
    }
    return result;
  }
});


/**
 * @member sol.dev.ix.services.GetObjIDbyMD5
 * @method RF_sol_dev_service_GetObjIDbyMD5
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_dev_service_GetObjIDbyMD5(iXSEContext, args) {
  var rfUtils, config, service, result;

  logger.enter("RF_sol_dev_service_GetObjIDbyMD5", args);

  rfUtils = sol.common.ix.RfUtils;
  config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  service = sol.create("sol.dev.ix.services.GetObjIDbyMD5", config);
  result = rfUtils.stringify(service.process());

  logger.exit("RF_sol_dev_service_GetObjIDbyMD5", result);

  return result;
}
