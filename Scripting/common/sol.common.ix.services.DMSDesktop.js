
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_handlebars.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.DMSDesktop" });

/**
 * @private
 * Provides service functions for the DMS Desktop.
 *
 * This class is for internal use only. The behavior could be changed without notice.
 *
 * # Usage
 *
 * ## Load ELOas configuration
 *
 *     sol.common.IxUtils.execute("RF_sol_common_service_DMSDesktopLoadAsConfig", {
 *       solution: "contract"  // optional, fallback would be the common as.config
 *     });
 *
 *     // result //
 *     {
 *       protocol: "http",
 *       serverName: "localhost",
 *       port: "8080",
 *       serviceName": "as-contract"
 *     }
 *
 * ## Retrieve workflow status
 *
 *     sol.common.IxUtils.execute("RF_sol_common_service_DMSDesktopGetWfStatus", {
 *       flowId: "4711"
 *     });
 *
 *     // result //
 *     {
 *       wfstatus: "CANCELED"
 *     }
 *
 * ## Translate terms
 *
 *     sol.common.IxUtils.execute("RF_sol_common_service_DMSDesktopTranslate", {
 *       keys: ["sol.contract.client.ribbon.tabContract"],
 *       language: "en"  // optional, default is the IXConnection language
 *     });
 *
 *     // result //
 *     [
 *       {
 *         key: "sol.contract.client.ribbon.tabContract",
 *         lang: "en",
 *         text: "Contracts"
 *       }
 *     ]
 *
 * ## Apply handlebars
 *
 *     sol.common.IxUtils.execute("RF_sol_common_service_DMSDesktopHandlebars", {
 *       transformations: [
 *         { source: "Hello {{name}}.", context: { name: "Max" } },
 *         { source: "Hello {{name}}.", context: { name: "Moritz" } }
 *       ]
 *     });
 *
 *     // result //
 *     [
 *       { source: "Hello {{name}}.", context: { name: "Max" }, text: "Hello Max." },
 *       { source: "Hello {{name}}.", context: { name: "Moritz"}, text: "Hello Moritz." }
 *     ]
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.004
 *
 * @eloix
 * @requires handlebars
 * @requires sol.common.Config
 * @requires sol.common.WfUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.DMSDesktop", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Loads the ELOas server configuration
   * @return {Object} The ELOas server configuration
   * @return {String} return.protocol
   * @return {String} return.server
   * @return {String} return.port
   * @return {String} return.name
   */
  loadAsConfig: function () {
    var me = this,
        config;
    config = sol.create("sol.common.Config");
    return config.loadEloAsConfig(me.solution);
  },

  /**
   * Retrieves the status of a workflow.
   * @return {Object}
   * @return {String} return.wfstatus
   */
  getWfStatus: function () {
    var me = this,
        result;

    if (typeof me.flowId === "undefined") {
      throw "IllegalArgumentException: no 'flowId' set";
    }

    result = {
      wfstatus: sol.common.WfUtils.getWorkflowStatus(me.flowId)
    };

    return result;
  },

  /**
   * Translates a key.
   * @return {Object[]}
   * @return {String} return.key
   * @return {String} return.lang
   * @return {String} return.text
   */
  translate: function () {
    var me = this,
        result = [],
        language;

    if (typeof me.keys === "undefined") {
      throw "IllegalArgumentException: no 'keys' set";
    }

    language = me.language || ixConnect.loginResult.clientInfo.language;
    sol.common.TranslateTerms.require(me.keys);

    me.keys.forEach(function (key) {
      var text = sol.common.TranslateTerms.getTerm(language, key);
      result.push({ key: key, lang: language, text: text });
    });

    return result;
  },

  getConfigString: function (cfgTemplate, data) {
    return cfgTemplate ? Handlebars.compile(cfgTemplate)(data) : null;
  },

  prepareCfgObj: function (cfgTemplate, actionCfg) {
    var me = this,
        cfgObj, regex, objIdReplacement;

    cfgTemplate = cfgTemplate.replace(/\\{{/g, "{{");
    if (cfgTemplate.indexOf("\"{{objId}}\"") > -1) {
      regex = new RegExp("\"{{objId}}\"", "g");
      objIdReplacement = (actionCfg.objId) ? "\"" + actionCfg.objId + "\"" : null;
    } else {
      regex = new RegExp("{{objId}}", "g");
      objIdReplacement = (actionCfg.objId) ? actionCfg.objId : null;
    }
    cfgTemplate = cfgTemplate.replace(regex, objIdReplacement);

    try {
      cfgTemplate = me.getConfigString(cfgTemplate, actionCfg);
    } catch (ex) {
    }

    cfgObj = cfgTemplate ? JSON.parse(cfgTemplate) : {};

    cfgObj.$templating = { $type: actionCfg.type, $tree: actionCfg.tree, $preconditions: actionCfg.preconditions };

    return cfgObj;
  },

  handlebars: function () {
    var me = this,
        result = [];

    if (typeof me.transformations === "undefined") {
      throw "IllegalArgumentException: no 'transformations' set";
    }

    me.transformations.forEach(function (transformation) {
      if (transformation.source && transformation.context) {
        transformation.text = JSON.stringify(me.prepareCfgObj(transformation.source, transformation.context));
      }
      result.push(transformation);
    });

    return result;
  }
});

/**
 * @member sol.common.ix.services.DMSDesktop
 * @method RF_sol_common_service_DMSDesktopLoadAsConfig
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_DMSDesktopLoadAsConfig(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_common_service_DMSDesktopLoadAsConfig", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  service = sol.create("sol.common.ix.services.DMSDesktop", params);
  result = rfUtils.stringify(service.loadAsConfig());

  logger.exit("RF_sol_common_service_DMSDesktopLoadAsConfig", result);

  return result;
}

/**
 * @member sol.common.ix.services.DMSDesktop
 * @method RF_sol_common_service_DMSDesktopGetWfStatus
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_DMSDesktopGetWfStatus(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_common_service_DMSDesktopGetWfStatus", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "flowId");
  service = sol.create("sol.common.ix.services.DMSDesktop", params);
  result = rfUtils.stringify(service.getWfStatus());

  logger.exit("RF_sol_common_service_DMSDesktopGetWfStatus", result);

  return result;
}

/**
 * @member sol.common.ix.services.DMSDesktop
 * @method RF_sol_common_service_DMSDesktopTranslate
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_DMSDesktopTranslate(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_common_service_DMSDesktopTranslate", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "keys");
  service = sol.create("sol.common.ix.services.DMSDesktop", params);
  result = rfUtils.stringify(service.translate());

  logger.exit("RF_sol_common_service_DMSDesktopTranslate", result);

  return result;
}

/**
 * @member sol.common.ix.services.DMSDesktop
 * @method RF_sol_common_service_DMSDesktopHandlebars
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_DMSDesktopHandlebars(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_common_service_DMSDesktopHandlebars", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "transformations");
  service = sol.create("sol.common.ix.services.DMSDesktop", params);
  result = rfUtils.stringify(service.handlebars());

  logger.exit("RF_sol_common_service_DMSDesktopHandlebars", result);

  return result;
}
