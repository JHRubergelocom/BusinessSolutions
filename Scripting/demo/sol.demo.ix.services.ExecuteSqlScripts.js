
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ExceptionUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.SqlConnection.js

var logger = sol.create("sol.Logger", { scope: "sol.demo.ix.services.ExecuteSqlScripts" });

/**
 * Executes SQL scripts
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 *
 * # Example
 *
 * By default StatisticSord formatter is used for generating objects that are optimized for statistical
 * operations. Refer to sol.common.ObjectFormatter.StatisticSord for more information.
 *
 *     var result = sol.common.IxUtils.execute("RF_sol_demo_service_ExecuteSqlScripts", {
 *       scriptFolderRepoPath: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/demo/SQL scripts"
 *     });
 */
sol.define("sol.demo.ix.services.ExecuteSqlScripts", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;

    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  requiredConfig: ["scriptFolderRepoPath"],


  /**
   * @cfg {String} scriptFolderRepoPath
   * Script folder repo path
   */

  /**
   * Executs SQL scripts
   * @return {Object} Result
   */
  process: function () {
    var me = this,
        result = [],
        dbTypeFilePrefix, scriptSords, i, scriptSord, scriptName, scriptContent, sqlConnection, scriptResult, jsonResult;

    scriptSords = sol.common.RepoUtils.findChildren(me.scriptFolderRepoPath, { includeFolders: false, includeDocuments: true });
    sqlConnection = sol.create("sol.common.ix.SqlConnection", {});
    sqlConnection.open();
    dbTypeFilePrefix = sqlConnection.getDbTypeFilePrefix();


    for (i = 0; i < scriptSords.length; i++) {
      scriptSord = scriptSords[i];
      scriptName = scriptSord.name + "";
      if (scriptName.indexOf(dbTypeFilePrefix) == 0) {
        scriptContent = sol.common.RepoUtils.downloadToString(scriptSord.id);
        me.logger.debug(["Execute sql script: {0}", scriptContent]);
        scriptResult = sqlConnection.executeSqlScript(scriptContent);
        scriptResult.scriptName = scriptName;
        result.push(scriptResult);
      }
    }

    sqlConnection.close();

    jsonResult = JSON.stringify(result)

    return jsonResult;
  }
});

/**
 * @member sol.demo.ix.services.ExecuteSqlScripts
 * @method RF_sol_demo_service_ExecuteSqlScripts
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_demo_service_ExecuteSqlScripts(ec, args) {
  var params, service, result, jsonResult;

  logger.enter("RF_sol_demo_service_ExecuteSqlScripts", args);
  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  service = sol.create("sol.demo.ix.services.ExecuteSqlScripts", params);
  result = service.process();
  jsonResult = sol.common.JsonUtils.stringifyAll(result);
  logger.exit("RF_sol_demo_service_ExecuteSqlScripts", jsonResult);

  return jsonResult;
}
