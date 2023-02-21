
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.GetBusinessSolutionConfigs" });

/**
 * Retrieves all ELO Business Solution Configurations for a given parent.
 *
 * This service performs a search based on a parent id and filters elements that are
 * based on the mask "ELO Business Solution Configuration".
 *
 * Limited to a maximum of 100 results.
 *
 * Please note that BS_CONFIG_NAME and the SORD description is localized if a localization key is given.
 *
 * # As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_GetBusinessSolutionConfigs', {
 *       objId: '123'
 *     });
 *
 * Returns content as followed:
 *
 *     {
 *       configs: [{
 *       	// sol.common.ObjectFormatter.TemplateSord definition
 *          guid: '(...)',
 *          name: 'sol.common.config.as',
 *          objKeys: {
 *            BS_CONFIG_NAME: 'AS Configuration',
 *            BS_CONFIG_VERSION: '1.00.000'
 *       }]
 *     }
 *
 * @author NM, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.SordUtils
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.GetBusinessSolutionConfigs", {
  extend: "sol.common.ix.ServiceBase",
  requiredConfig: ["objId"],

  /**
   * Mask that is used for identifying configuration files.
   */
  configMask: "ELO Business Solution Configuration",

  /**
   * list of objects that are translated using IX translation keys.
   */
  translateObjectProperties: {
    desc: true,
    objKeys: {
      BS_CONFIG_NAME: true
    }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Reads a list of all configuration objects
   * @return {Object}
   */
  process: function () {
    var me = this,
        findInfo, findByIndex, findChildren, findResult,
        configs = [];

    findInfo = new FindInfo();
    findByIndex = new FindByIndex();
    findChildren = new FindChildren();
    findInfo.findByIndex = findByIndex;
    findInfo.findChildren = findChildren;

    findByIndex.maskId = me.configMask;
    findChildren.endLevel = -1;
    findChildren.parentId = me.objId;

    findResult = ixConnect.ix().findFirstSords(findInfo, 100, SordC.mbAll);

    if (findResult.sords && findResult.sords.length > 0) {
      configs = sol.common.ObjectFormatter.format({
        sord: {
          formatter: "sol.common.ObjectFormatter.TemplateSord",
          data: findResult.sords
        }
      }).sord;
    }

    return {
      configs: me.translate(configs)
    };
  },

  /**
   * Localization of configuration objects.
   * Translated keys as defined by translateObjectProperties.
   * @private
   * @param {Object} configs
   * @return {Object} configs
   */
  translate: function (configs) {
    var me = this,
        terms = [],
        i;

    // read definitions
    for (i = 0; i < configs.length; i++) {
      try {
        me.parseDefinition(me.translateObjectProperties, configs[i], function (key, val) {
          terms.push(val);
          return null;
        });
      } catch(ex) {
        me.logger.error("failed loading definition: " + configs[i].name, ex);
      }
    }

    // translate definitions
    sol.common.TranslateTerms.require(terms);

    for (i = 0; i < configs.length; i++) {
      me.parseDefinition(me.translateObjectProperties, configs[i], function (key, val) {
        return sol.common.TranslateTerms.translate(val);
      });
    }
    return configs;
  },

  /**
   * Helper for handling object structures.
   * @private
   * @param {Object} base
   * @param {Object} obj
   * @param {Object} fct
   */
  parseDefinition: function (base, obj, fct) {
    var me = this,
        objName, res;
    for (objName in base) {
      if (base && base.hasOwnProperty(objName)
          && obj && obj.hasOwnProperty(objName)) {
        if (base[objName] === true) {
          res = fct.call(me, objName, obj[objName], obj);
          if (res !== null && res !== "") {
            obj[objName] = res;
          }
        } else {
          me.parseDefinition(base[objName], obj[objName], fct);
        }
      }
    }
  }

});

/**
 * @member sol.common.ix.services.GetBusinessSolutionConfigs
 * @method RF_sol_common_service_GetBusinessSolutionConfigs
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_GetBusinessSolutionConfigs(iXSEContext, args) {
  logger.enter("RF_sol_common_service_GetBusinessSolutionConfigs", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId");
  service = sol.create("sol.common.ix.services.GetBusinessSolutionConfigs", params);
  result = service.process();
  logger.exit("RF_sol_common_service_GetBusinessSolutionConfigs", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
