
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.ExecuteAsAction" });

/**
 * Executes an ELO AS Business Solution action without the need of running an ELO AS instance in the DMZ.
 *
 * This service is useful if AS actions should be executed from web applications (e.g. ELO Web Client).
 *
 * # Configuration
 *
 * requires the solution name and rule name. A configuration object can be passed
 * as defined by the action. e.g.
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_ExecuteAsAction', {
 *       solution: 'pubsec',
 *       action: 'sol.pubsec.as.actions.CreateFilesReport',
 *       config: {
 *         templateId: templateId,
 *         fileId: fileId,
 *         targetId: targetId
 *       },
 *       connParams: {
 *         language: 'de'
 *       }
 *     }, function(data) {
 *        // process result
 *     }, function (err) {
 *        // error handling
 *     });
 *
 * In addition the client language should be passed. (connParams) This is required if localization information is processed by ELO AS.
 *
 * @author NM, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.ExecuteAsAction", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["action", "config"],

  /**
   * @cfg {String} solution
   * Name of the solution, which the as rule is part of.
   * This is used for handling several elo as configurations.
   */
  solution: "common",

  /**
   * @cfg {String} action
   * Name of the action that should be called. Usually the name of the ELO AS rule.
   */

  /**
   * @cfg {Object} config
   * Configuration for the action as defined by the action.
   */

  /**
   * @cfg {Object} connParams (optional)
   * Configuration of the current connection. This includes localization information.
   *
   *     {
   *	     language: 'en'
   *     }
   */

  /**
   * @private
   * @property {String} eloAsUrlTemplate
   */
  eloAsUrlTemplate: "{{asCfg.protocol}}://{{asCfg.serverName}}:{{asCfg.port}}/{{asCfg.serviceName}}/as?cmd=get&name={{action.rule}}&param2={{action.config}}&param3={{connParams}}&ticket={{ticket}}",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  getRuleConfig: function (config) {
    var tplData, strConfig;
    strConfig = sol.common.JsonUtils.stringifyAll(config);
    tplData = JSON.parse(strConfig);

    if (tplData.$templating) {
      tplData.type = tplData.$templating.$type;
      tplData.tree = tplData.$templating.$tree;
      tplData.preconditions = tplData.$templating.$preconditions;
    }

    return (sol.create("sol.common.Template", { source: strConfig })).apply(tplData);
  },

  /**
   * Executes an ELO AS Business Solution action without the need of running an ELO AS instance in the DMZ
   * @return {Object}
   */
  process: function () {
    var me = this,
        asCfg, asUrlTpl, asUrl, asUrlParamsObj, asUrlParamsLogObj, readTimeout, result;

    asCfg = sol.create("sol.common.Config").loadEloAsConfig(me.solution || "common");

    readTimeout = asCfg.readTimeout || 60000;

    me.connParams = me.connParams || {};
    me.connParams.language = me.connParams.language || me.ci.language + "";
    me.connParams.timeZone = me.connParams.timeZone || me.ci.timeZone + "";

    asUrlParamsObj = {
      ticket: me.ci.ticket + "",
      asCfg: asCfg,
      action: {
        rule: encodeURIComponent(me.action),
        config: encodeURIComponent(me.getRuleConfig(me.config))
      },
      connParams: encodeURIComponent(sol.common.JsonUtils.stringifyAll(me.connParams))
    };

    if (logger.debugEnabled) {
      asUrlParamsLogObj = JSON.parse(JSON.stringify(asUrlParamsObj));
      asUrlParamsLogObj.ticket = asUrlParamsLogObj.ticket.substring(0, 6) + "...";
      logger.debug("Build AS URL: asUrlTemplate=" + me.eloAsUrlTemplate + ", asUrlParams=" + JSON.stringify(asUrlParamsLogObj));
      logger.debug("readTimeout=" + readTimeout);
    }

    asUrlTpl = sol.create("sol.common.Template", { source: me.eloAsUrlTemplate });
    asUrl = asUrlTpl.apply(asUrlParamsObj);

    if (me.objId) {
      asUrl += "&param1=" + me.objId;
    }

    logger.info("Executing ELO AS action.", asUrl);

    result = sol.common.HttpUtils.sendGet(asUrl, {
      connectTimeout: 30000,
      readTimeout: readTimeout,
      contentType: "application/json;charset=UTF-8"
    });

    if (result.responseOk === false) {
      throw result.errorMessage;
    }

    return result;
  }

});

/**
 * @member sol.common.ix.services.ExecuteAsAction
 * @method RF_sol_common_service_ExecuteAsAction
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_ExecuteAsAction(ec, configAny) {
  var config, module, result;

  logger.enter("RF_sol_common_service_ExecuteAsAction", configAny);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "action", "config");
  config.ci = ec.ci;

  module = sol.create("sol.common.ix.services.ExecuteAsAction", config);
  result = sol.common.JsonUtils.stringifyAll(module.process());

  logger.exit("RF_sol_common_service_ExecuteAsAction", result);
  return result;
}
