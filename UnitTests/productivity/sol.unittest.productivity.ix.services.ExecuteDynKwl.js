
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.GenericDynKwl.js
//@include sol.contact.ix.dynkwl.FindCompanyIterator.js
//@include sol.contact.ix.dynkwl.FindContactIterator.js
//@include sol.contact.ix.dynkwl.FindContactlistIterator.js
//@include sol.contact.ix.dynkwl.FormOfAddressTemplate.js
//@include sol.contact.ix.dynkwl.generators.FilingStructCompanyContact.js
//@include sol.contact.ix.dynkwl.generators.FilingStructContactListCompany.js
//@include sol.contact.ix.dynkwl.generators.FilingStructContactListContact.js
//@include sol.contact.ix.dynkwl.generators.NameCompany.js
//@include sol.contact.ix.dynkwl.generators.NameContact.js
//@include sol.contact.ix.dynkwl.generators.NameContactList.js
//@include sol.contact.ix.dynkwl.generators.ReferenceCompany.js
//@include sol.contact.ix.dynkwl.generators.ReferenceContact.js
//@include sol.contact.ix.dynkwl.generators.ReferenceContactList.js
//@include sol.contact.ix.localizedKwl.Countries.js
//@include sol.contact.ix.localizedKwl.UserStatus.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.productivity.ix.services.ExecuteDynKwl" });

/**
 * Unittests of dynamic keyword list.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_productivity_service_ExecuteDynKwl', {
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
sol.define("sol.unittest.productivity.ix.services.ExecuteDynKwl", {
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
 * @member sol.unittest.productivity.ix.services.ExecuteDynKwl
 * @method RF_sol_unittest_productivity_service_ExecuteDynKwl
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_productivity_service_ExecuteDynKwl(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_productivity_service_ExecuteDynKwl", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "dynKwl", "providerConfig", "inputFieldName");
  params.ec = ec;
  service = sol.create("sol.unittest.productivity.ix.services.ExecuteDynKwl", params);
  result = service.process();
  logger.exit("RF_sol_unittest_productivity_service_ExecuteDynKwl", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
