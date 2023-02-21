
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.services.CreateRepoEntry" });

/**
 * Creates a new repository entry.
 *
 * This service is useful if repositiory entries should be created from web applications.
 *
 * # As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_dev_service_CreateRepoEntry', {
 *       saveToRepoConfig: { repoPath: arcPath, maskId: elo.CONST.DOC_MASK.GUID_ELOSCRIPTS, contentObject: configJson }
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
sol.define("sol.dev.ix.services.CreateRepoEntry", {
  extend: "sol.common.ix.ServiceBase",
  requiredConfig: ["saveToRepoConfig"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Creates a new repository document or saves a new version to an existing document
   * @return {Object}
   */
  process: function () {
    var me = this,
        objId;

    objId = sol.common.RepoUtils.saveToRepo(me.saveToRepoConfig);

    return {
      objId: objId
    };
  }
});

/**
 * @member sol.dev.ix.services.CreateRepoEntry
 * @method RF_sol_dev_service_CreateRepoEntry
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_dev_service_CreateRepoEntry(iXSEContext, args) {
  logger.enter("RF_sol_dev_service_CreateRepoEntry", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "saveToRepoConfig");
  service = sol.create("sol.dev.ix.services.CreateRepoEntry", params);
  result = sol.common.JsonUtils.stringifyAll(service.process());
  logger.exit("RF_sol_dev_service_CreateRepoEntry", result);
  return result;
}
