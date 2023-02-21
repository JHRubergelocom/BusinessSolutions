
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.recruiting.mixins.ConfigurationJobPortal.js
//@include lib_sol.common.Injection.js

/**
 * Retrieves a user profile by `guid` or `email`
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.UserUtils
 * @requires sol.recruiting.mixins.ConfigurationJobPortal
 * @requires sol.common.Injection
 */
sol.define("sol.recruiting.ix.services.GetUserProfile", {
  extend: "sol.common.ix.ServiceBase",

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.recruiting.mixins.ConfigurationJobPortal", "sol.common.mixins.Inject"],

  inject: {
    _config: { config: "recruitingjp", prop: "entities.jobportaluser.services.getuserprofile.config" }, // {}
    customSearchConfig: { config: "recruitingjp", prop: "entities.jobportaluser.services.getuserprofile.customSearchConfig" } // {}
  },

  getUser: function (strategy) {
    var me = this;
    try {
      return sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._config, me._optimize, strategy, ["output"]);
    } catch (_) {}
  },

  process: function () {
    var me = this, result;
    try {
      if (!me.email && !me.guid) {
        throw "an `email` or `guid` must be defined to retrieve a user profile";
      }
      if (me.guid) {
        me._config.id = String(me.guid);
        me._config.search = undefined;
        result = me.getUser("getByGuid");
      } else if (me.email) {
        if (Array.isArray(me.search)) {
          me._config.search = (me._config.search || []).concat(me.search);
        }
        me.customSearchConfig.value = String(me.email);
        me._config.search.push(me.customSearchConfig);
        result = me.getUser("searchByMail");
      }

      return result && result.sords[0];
    } catch (_) {}
  }
});

/**
 * @member sol.recruiting.ix.services.GetUserProfile
 * @method RF_sol_recruiting_service_GetUserProfile
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_recruiting_service_GetUserProfile(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfParams._optimize;

  serviceProc = sol.create("sol.recruiting.ix.services.GetUserProfile", rfParams);
  result = JSON.stringify(serviceProc.process());
  return result;
}