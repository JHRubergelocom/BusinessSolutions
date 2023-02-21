
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.GenericDynKwl.js
//@include sol.recruiting.ix.dynkwl.generators.CandidateNo.js
//@include sol.recruiting.ix.dynkwl.generators.CandidateShortDescGen.js
//@include sol.recruiting.ix.dynkwl.generators.CommShortDesc.js
//@include sol.recruiting.ix.dynkwl.generators.JobPortalUserShortDesc.js
//@include sol.recruiting.ix.dynkwl.generators.PostingNo.js
//@include sol.recruiting.ix.dynkwl.generators.PostingShortDesc.js
//@include sol.recruiting.ix.dynkwl.generators.RequisitionNo.js
//@include sol.recruiting.ix.dynkwl.generators.RequisitionShortDesc.js
//@include sol.recruiting.ix.dynkwl.OrganizationalStructuresIterator.js
//@include sol.recruiting.ix.dynkwl.PoolIterator.js
//@include sol.recruiting.ix.dynkwl.PostingIterator.js
//@include sol.recruiting.ix.dynkwl.RequisitionIterator.js
//@include sol.recruiting.ix.localizedKwl.CandidatePhase.js
//@include sol.recruiting.ix.localizedKwl.CandidateStatus.js
//@include sol.recruiting.ix.localizedKwl.CandidateStatusExt.js
//@include sol.recruiting.ix.localizedKwl.Country.js
//@include sol.recruiting.ix.localizedKwl.Degree.js
//@include sol.recruiting.ix.localizedKwl.Gender.js
//@include sol.recruiting.ix.localizedKwl.Language.js
//@include sol.recruiting.ix.localizedKwl.Location.js
//@include sol.recruiting.ix.localizedKwl.PostingStatus.js
//@include sol.recruiting.ix.localizedKwl.RequisitionCategory.js
//@include sol.recruiting.ix.localizedKwl.RequisitionStatus.js
//@include sol.recruiting.ix.localizedKwl.RequisitionType.js
//@include sol.recruiting.ix.localizedKwl.Seniority.js
//@include sol.recruiting.ix.localizedKwl.Workschedule.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.recruiting.ix.services.ExecuteDynKwl" });

/**
 * Unittests of dynamic keyword list.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_recruiting_service_ExecuteDynKwl', {
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
sol.define("sol.unittest.recruiting.ix.services.ExecuteDynKwl", {
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
 * @member sol.unittest.recruiting.ix.services.ExecuteDynKwl
 * @method RF_sol_unittest_recruiting_service_ExecuteDynKwl
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_recruiting_service_ExecuteDynKwl(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_recruiting_service_ExecuteDynKwl", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "dynKwl", "providerConfig", "inputFieldName");
  params.ec = ec;
  service = sol.create("sol.unittest.recruiting.ix.services.ExecuteDynKwl", params);
  result = service.process();
  logger.exit("RF_sol_unittest_recruiting_service_ExecuteDynKwl", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
