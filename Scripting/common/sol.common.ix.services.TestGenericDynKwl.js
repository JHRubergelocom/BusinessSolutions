
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.GenericDynKwl.js


/**
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 *
 * @requires sol.common.ix.ServiceBase
 *
 */
sol.define("sol.common.ix.services.TestGenericDynKwl", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  test: function () {
    var me = this,
        result = {},
        resultData = [],
        provider, sord, objKeys, inputFieldName;

    try {
      provider = sol.create("sol.common.ix.GenericDynKwl", me.providerConfig).getProvider();

      sord = ixConnect.ix().createSord("0", "0", SordC.mbAllIndex);
      objKeys = me.buildFilter();

      if (me.providerConfig && me.providerConfig.input) {
        inputFieldName = (me.providerConfig && me.providerConfig.input) ? me.providerConfig.input.name : "";
        objKeys.push(me.createObjKey(inputFieldName, me.providerConfig.input.value));
      }

      sord.objKeys = objKeys;

      provider.open(me.ec, sord, inputFieldName);

      if (provider.getMessage()) {
        result.message = provider.getMessage();
        return result;
      }

      while (provider.hasMoreRows()) {
        resultData.push(provider.getNextRow());
      }

      result.data = resultData;

    } catch (ex) {
      result.error = String(ex);
    } finally {
      if (provider && (sol.common.ObjectUtils.isFunction(provider.close))) {
        provider.close();
      }
    }

    return result;

  },

  buildFilter: function () {
    var me = this,
        objKeys = [];
    if (me.providerConfig && me.providerConfig.filter && (me.providerConfig.filter.length > 0)) {
      me.providerConfig.filter.forEach(function (param) {
        if (param.name && param.value) {
          objKeys.push(me.createObjKey(param.name, param.value));
        }
      });
    }
    return objKeys;
  },

  createObjKey: function (name, value) {
    var objKey = new ObjKey();
    objKey.name = name;
    objKey.data = [value];
    return objKey;
  }

});


/**
 * @member sol.common.ix.services.TestGenericDynKwl
 * @method RF_sol_service_TestGenericDynKwl
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_service_TestGenericDynKwl(ec, args) {
  var params = {},
      service;

  params.providerConfig = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  params.ec = ec;

  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);

  service = sol.create("sol.common.ix.services.TestGenericDynKwl", params);

  return sol.common.ix.RfUtils.stringify(service.test());
}

