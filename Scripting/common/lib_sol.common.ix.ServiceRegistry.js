
//@include lib_Class.js

/**
 * @private
 * Global IX service registry
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.05.000
 *
 * @eloix
 *
 * @requires sol.common.SordUtils
 * @requires sol.common.Config
 * @requires sol.common.Template
 */
sol.define("sol.common.ix.ServiceRegistry", {
  singleton: true,

  TYPES: {
    SERVICE: "SERVICE",
    CONFIG: "CONFIG"
  },

  FUNCTIONS: {
    CREATE: "CREATE",
    IMPORT: "IMPORT",
    REGISTER_UPDATE: "REGISTER_UPDATE"
  },

  /**
   * @cfg {Boolean} includeMaskFields
   * If `true` the mask line information (if the service defines any) will be included.
   * Only used if a specific service is queried (`serviveId` instead of `query`).
   */

  /**
   * @cfg {Boolean} summarize
   * If `true` the queries will return a summary of the found services.
   */

  /**
   * @cfg {Boolean} evaluateConfig
   * If `true`, and the results are from type `config`, the config will be evaluated using a configured file.
   */

  /**
   * @private
   * @property {Object} docMaskCache
   * Caches the doc mask info.
   */
  docMaskCache: {},

  getServiceRegistry: function () {
    globalScope.$registries = globalScope.$registries || {};
    globalScope.$registries.services = globalScope.$registries.services || {};

    return globalScope.$registries.services;
  },

  register: function (serviceId, serviceDescription) {
    var me = this,
        serviceRegistry;

    serviceRegistry = me.getServiceRegistry();

    if (serviceRegistry[serviceId]) {
      throw "Service with id '" + serviceId + "' is already defined";
    }

    me.checkServiceDescription(serviceDescription);

    serviceRegistry[serviceId] = {
      serviceDescription: serviceDescription
    };

  },

  get: function (serviceId, params) {
    var me = this,
        serviceRegistry, result;

    serviceRegistry = me.getServiceRegistry();
    result = me.buildResult(serviceId, serviceRegistry[serviceId].serviceDescription, {
      includeMaskFields: params.includeMaskFields,
      summarize: false,
      evaluateConfig: params.evaluateConfig
    });

    return serviceRegistry[serviceId] ? [result] : [];
  },

  query: function (query, params) {
    var me = this,
        services = [],
        serviceRegistry, serviceId;

    serviceRegistry = me.getServiceRegistry();
    params = params || {};

    for (serviceId in serviceRegistry) {
      if (serviceRegistry.hasOwnProperty(serviceId) && me.matchQueryParams(query, serviceRegistry[serviceId].serviceDescription)) {
        services.push(
          me.buildResult(serviceId, serviceRegistry[serviceId].serviceDescription,
            {
              includeMaskFields: false,
              summarize: params.summarize,
              evaluateConfig: params.evaluateConfig
            }
          )
        );
      }
    }

    return services;
  },

  /* @private */
  checkServiceDescription: function (desc) {
    if (!desc.type || !desc.name || !desc.ns) {
      throw "IllegalConfigurationException: service description has to contain at least 'type', 'name' and 'ns'";
    }
  },

  /* @private */
  matchQueryParams: function (queryObject, serviceDescription) {
    var me = this,
        match = true,
        queryPropertyName, queryProperty, serviceProperty;

    for (queryPropertyName in queryObject) {
      if (queryObject.hasOwnProperty(queryPropertyName)) {
        queryProperty = queryObject[queryPropertyName];
        serviceProperty = serviceDescription[queryPropertyName];

        match = match && me.checkProperty(queryProperty, serviceProperty);
        if (!match) {
          break;
        }
      }
    }

    return match;
  },

  /* @private */
  checkProperty: function (lookup, serviceProperty) {
    var typeOfServiceProperty = (typeof serviceProperty);

    if ((typeOfServiceProperty === "string") || (typeOfServiceProperty === "number")) {
      return serviceProperty === lookup;
    } else if (Array.isArray(serviceProperty)) {
      return (serviceProperty.indexOf(lookup) > -1);
    }
    return false;
  },

  /* @private */
  buildResult: function (serviceId, serviceDescription, params) {
    var me = this,
        result;

    if (params.summarize) {
      result = {
        id: serviceId,
        name: serviceDescription.name,
        desc: serviceDescription.description
      };
    } else {
      result = {
        id: serviceId,
        serviceDescription: serviceDescription
      };

      if (params.includeMaskFields) {
        result.fields = me.getMaskLines(serviceDescription.masks);
      }

      if (params.evaluateConfig) {
        me.evaluateConfig(serviceDescription);
      }
    }

    return result;
  },

  /* @private */
  getMaskLines: function (masks) {
    var me = this,
        maskLines = [],
        docMask, seen;

    if (masks && (masks.length > 0)) {
      masks.forEach(function (maskName) {
        docMask = me.getDocMask(maskName);
        if (docMask && docMask.fields && (docMask.fields.length > 0)) {
          maskLines = maskLines.concat(docMask.fields);
        }
      });
    }

    seen = {};
    return maskLines.filter(function (item) {
      return seen.hasOwnProperty(item.key) ? false : (seen[item.key] = true);
    });
  },

  /* @private */
  getDocMask: function (name) {
    var me = this,
        docMask, docMaskData;

    if (!me.docMaskCache[name]) {
      docMask = sol.common.SordUtils.getDocMask(name, ixConnect.loginResult.clientInfo.language);
      docMaskData = { fields: [] };
      docMask.lines.forEach(function (docMaskLine) {
        docMaskData.fields.push({
          type: "GRP",
          key: String(docMaskLine.key),
          name: String(docMaskLine.name)
        });
      });
      me.docMaskCache[name] = docMaskData;
    }

    return me.docMaskCache[name];
  },

  /* @private */
  evaluateConfig: function (serviceDescription) {
    var me = this,
        configContentObj, configContentStr;

    if ((serviceDescription.type === me.TYPES.CONFIG) && serviceDescription && serviceDescription.cfg && serviceDescription.cfg.$config) {
      configContentObj = sol.create("sol.common.Config", { compose: serviceDescription.cfg.$config });
      configContentStr = sol.create("sol.common.Template", { source: JSON.stringify(serviceDescription.cfg) }).apply(configContentObj);
      serviceDescription.cfg = JSON.parse(configContentStr);
      delete serviceDescription.cfg.$config;
    }
  }

});
