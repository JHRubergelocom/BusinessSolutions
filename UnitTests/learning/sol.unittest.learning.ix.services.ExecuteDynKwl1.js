
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.learning.ix.configKwl.Base.js
//@include lib_sol.learning.ix.dynKwl.generators.Base.js
//@include lib_sol.learning.ix.dynkwl.notification.template.base.js
//@include lib_sol.learning.ix.localizedKwl.Base.js
//@include sol.common_monitoring.ix.dynkwl.ConfigKwl.js
//@include sol.learning.ix.configKwl.InteractionElements.js
//@include sol.learning.ix.configKwl.Label.js
//@include sol.learning.ix.dynkwl.CourseRepetitionConfigKwl.js
//@include sol.learning.ix.dynkwl.NotifyTemplate.js
//@include sol.learning.ix.dynkwl.SessionReminderConfigKwl.js
//@include sol.learning.ix.dynkwl.SessionsListReminderConfigKwl.js
//@include sol.learning.ix.localizedKwl.NotifyRecipientSearch.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.learning.ix.services.ExecuteDynKwl1" });

/**
 * Unittests of dynamic keyword list.
 *
 * Examples
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_learning_service_ExecuteDynKwl1', {
 *       objId: 5201,
 *       dynKwl: 'sol.unittest.ix.dynkwl.UserNames',
 *       providerConfig: {
 *          tableTitle :'Benutzerinfos',
 *          tableHeaders: ['ID', 'Name'],
 *          userIdFieldName:"Benutzer-ID"
 *       },
 *       "inputFieldName": "UNITTEST_FIELD2"
 *     });
 *
 * *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.learning.ix.services.ExecuteDynKwl1", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId", "dynKwl", "providerConfig", "inputFieldName"],

  /**
   * @cfg {String} objId Sord objId.
   */

  /**
   * @cfg {String} dynKwl Dnynamic Keyword list script name.
   */

  /**
   * @cfg {Object} providerConfig Provider Configuration.
   */

  /**
   * @cfg {Object} inputFieldName Input field.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Call the dynamic keyword list and returns the result
   * @return {String|Object} result of dynamic keyword list
   */
  process: function () {
    var me = this,
        result = {},
        resultData = [],
        provider, sord;

    switch (me.dynKwl) {
      case "sol.learning.ix.dynKwl.generators.Base":
      case "sol.learning.ix.dynkwl.notification.template.base":
      case "sol.learning.ix.localizedKwl.Base":
        return { keynames: [], header: [], title: "", data: [] };
      default:
    }  

    try {

      if (me.dynKwl == "sol.common.ix.GenericDynKwl") {
        provider = sol.create("sol.common.ix.GenericDynKwl", me.providerConfig).getProvider();
      } else {
        provider = sol.create(me.dynKwl, me.providerConfig);
      }

      sord = ixConnect.ix().checkoutSord(me.objId, new SordZ(SordC.mbAll), LockC.NO);

      provider.open(me.ec, sord, me.inputFieldName);

      if (provider.getMessage()) {
        result.message = provider.getMessage();
        return result;
      }

      while (provider.hasMoreRows()) {
        resultData.push(provider.getNextRow());
      }

      result.keynames = provider.getKeyNames();
      result.header = provider.getHeader();
      result.title = provider.getTitle();
      result.data = resultData;

    } catch (ex) {
      result.error = String(ex);
    } finally {
      if (provider && (sol.common.ObjectUtils.isFunction(provider.close))) {
        provider.close();
      }
    }

    return result;
  }
});


/**
 * @member sol.unittest.learning.ix.services.ExecuteDynKwl1
 * @method RF_sol_unittest_learning_service_ExecuteDynKwl1
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_learning_service_ExecuteDynKwl1(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_learning_service_ExecuteDynKwl1", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "dynKwl", "providerConfig", "inputFieldName");
  params.ec = ec;
  service = sol.create("sol.unittest.learning.ix.services.ExecuteDynKwl1", params);
  result = service.process();
  logger.exit("RF_sol_unittest_learning_service_ExecuteDynKwl1", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
