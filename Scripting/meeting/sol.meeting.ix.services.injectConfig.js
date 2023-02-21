importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.InjectConfig" });

/**
* Get injected Data with 'sol.commoon.Injection'.
* Pass Injections defined in 'sol.common.Injection' within the inject attribute.
* The config property within the config attribute
*
*
* @author ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.Injection
* @requires sol.common.ObjectUtils
* @requires sol.common.ix.ServiceBase
*/
sol.define("sol.meeting.ix.services.InjectConfig", {
  extend: "sol.common.ix.ServiceBase",

  mixins: [
    "sol.common.mixins.Inject"
  ],

  requiredConfig: ["inject"],

  $configRelation: {},

  inject: {},

  injectedKeys: [],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [sol.common.ObjectUtils.clone(config)]);

    Object.keys(config.inject || {})
      .map(function (key) {
        me.setInjection(key, config.inject[key]);
      });

    Object.keys(config.$configRelation || {})
      .map(function (key) {
        me.setConfigRelation(key, config.$configRelation[key]);
      });

    sol.create("sol.common.Injection").inject(me);
  },

  setInjection: function (key, injection) {
    var me = this;

    if (injection.config) {
      me.setConfigRelation(injection.config, injection.config);
    }

    me.inject[key] = injection;
    me.injectedKeys.push(key);
  },

  setConfigRelation: function (key, configRelation) {
    var me = this;

    me.$configRelation[key] = configRelation;
  },

  process: function () {
    var me = this;

    return me.getConfigProperties();
  },

  getConfigProperties: function () {
    var me = this;

    return (me.injectedKeys || [])
      .reduce(function (configProperties, injectedKey) {
        configProperties[injectedKey] = me[injectedKey];
        return configProperties;
      }, {});
  }
});

/**
* @member sol.meeting.ix.services.InjectConfig
* @method RF_sol_meeting_service_InjectConfig
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_InjectConfig(iXSEContext, args) {
  var params,
      module,
      result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  module = sol.create("sol.meeting.ix.services.InjectConfig", params);
  result = module.process();

  return sol.common.JsonUtils.stringifyQuick(result);
}