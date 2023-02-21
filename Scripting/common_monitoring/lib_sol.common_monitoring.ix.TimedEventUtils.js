
//@include lib_Class.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js
//@include sol.common.ix.services.GetNamespacedConfigs.js

/**
 * Utility methods for the monitoring modul.
 *
 * @author ELO Digital Office GmbH
 * @version 1.02.001
 *
 * @eloix
 * @requires moment
 * @requires sol.commom.SordUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.TemplateUtils
 * @requires sol.common.ix.services.GetNamespacedConfigs
 */
sol.define("sol.common_monitoring.ix.TimedEventUtils", {
  logger: sol.create("sol.Logger", { scope: "sol.common_monitoring.ix.TimedEventUtils" }),

  singleton: true,

  getInjections: function (config) {
    if (config.configPath && config.configName) {
      return (config.configPath && config.configName)
        ? {
          $configRelation: { config: config.configPath },
          inject: { config: { config: "config", prop: config.configName, template: true } }
        }
        : null;
    }
  },

  getError: function (message, args) {
    return {
      hasError: true,
      error: {
        message: message,
        args: args || {}
      }
    };
  },

  optimizedExecute: function (self, requestParameters) {
    var me = this;
    try {
      return sol.common.IxUtils.optimizedExecute(
        requestParameters.provider,
        requestParameters.params,
        (self._optimize = self._optimize || {}),
        requestParameters.optimize,
        requestParameters.output
      );
    } catch (error) {
      me.logger.info("could not execute request", requestParameters);
      return null;
    }
  },

  translateMap: function (map) {
    return Object.keys(map)
      .map(function (key) {
        return {
          key: key,
          value: sol.common_monitoring.ix.TimedEventUtils.translateKey(map[key])
        };
      })
      .reduce(function (acc, keyValue) {
        acc[keyValue.key] = keyValue.value;
        return acc;
      }, {});
  },

  translateKey: function (key) {
    sol.common.TranslateTerms.require(key);
    return sol.common.TranslateTerms.translate(key);
  },

  setTimedEventDate: function (entry, params) {
    var dateEntry = sol.common.ObjectUtils.clone(entry),
        shift = sol.common.TemplateUtils.render(params.config.shift, params),
        date = (dateEntry.value == "{{now}}")
          ? sol.common.DateUtils.nowIso()
          : sol.common_monitoring.ix.TimedEventUtils.renderParams(dateEntry.value || "", params);

    dateEntry.value = sol.common_monitoring.ix.TimedEventUtils.shiftIso(date, shift) || dateEntry.value;

    return dateEntry;
  },

  shiftIso: function (isoDate, shift) {
    var date,
        shiftedIsoDate,
        fillString = "00000000000000";

    if (isoDate.length < fillString.length) {
      isoDate += fillString.substr(isoDate.length);
    }

    try {
      date = sol.common.DateUtils.shift(
        sol.common.DateUtils.isoToDate(isoDate + ""),
        shift.value,
        { unit: shift.unit }
      );
      shiftedIsoDate = sol.common.DateUtils.dateToIso(date);
    } catch (_e) {
      return null;
    }

    return shiftedIsoDate;
  },

  mapUpdateEntriesToKeys: function (entries, keyPrefix) {
    return (entries || [])
      .filter(function (entry) {
        return !(entry.key || "").indexOf(keyPrefix) == 0;
      })
      .map(function (entry) {
        return {
          key: keyPrefix + entry.type + "_" + entry.key,
          type: "MAP",
          value: entry.value
        };
      });
  },

  mapUpdateKeysToEntries: function (mapKeys, keyPrefix) {
    return Object.keys(mapKeys || {})
      .map(function (key) {
        return { key: key, value: mapKeys[key] };
      })
      .filter(function (mapEntry) {
        return (mapEntry.key || "").indexOf(keyPrefix) == 0;
      })
      .map(function (mapEntry) {
        var keyParts = (mapEntry.key || "")
          .substr(keyPrefix.length)
          .split("_");
        return {
          type: keyParts.shift(),
          key: keyParts.join("_"),
          value: mapEntry.value
        };
      });
  },

  getTemplateSord: function (sordId) {
    var sord,
        templateSord;

    if (sordId) {
      sord = sol.common.RepoUtils.getSord(sordId);

      templateSord = sord
        ? sol.common.ObjectFormatter.format({
          sord: {
            formatter: "sol.common.ObjectFormatter.TemplateSord",
            data: sord,
            config: {
              sordKeys: ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName"],
              allMapFields: true
            }
          }
        })
        : null;
    }

    return templateSord;
  },

  renderRequestParams: function (requestParams, params, isRerender) {
    return sol.common_monitoring.ix.TimedEventUtils.renderParams(requestParams, params, isRerender);
  },

  renderParams: function (requestParams, params, isRerender) {
    var renderedParams;
    if (!sol.common_monitoring.ix.TimedEventUtils.hasHandlebarExpression(requestParams)) {
      return requestParams;
    }

    renderedParams = sol.common.TemplateUtils.render(requestParams, params, { emptyNonRendered: isRerender });

    return isRerender
      ? renderedParams
      : sol.common_monitoring.ix.TimedEventUtils.renderParams(renderedParams, params, true);
  },

  hasHandlebarExpression: function (template) {
    return JSON.stringify(template).indexOf("{{") != -1;
  },

  getTimedEventDirectly: function (params) {
    return (params.timedEvent && params.timedEvent.id)
      ? params.timedEvent
      : null;
  },

  getTimedEventFromId: function (params) {
    return (params.id)
      ? (sol.common_monitoring.ix.TimedEventUtils.getTemplateSord(params.id) || {}).sord
      : null;
  },

  getSourceDirectly: function (params) {
    return (params.source && params.source.id)
      ? params.source
      : null;
  },

  getSourceFromSourceId: function (params) {
    return (params.sourceId)
      ? (sol.common_monitoring.ix.TimedEventUtils.getTemplateSord(params.sourceId) || {}).sord
      : null;
  },

  getTimedEventConfigDirectly: function (params) {
    return params.timedEventConfig;
  },

  getAndCacheTimedEventConfigByParams: function (params, cache) {
    var configs,
        configParams = sol.common.ObjectUtils.clone(params);

    configParams.configId = sol.common_monitoring.ix.TimedEventUtils.getConfigId(configParams);
    configParams.configNamespace = sol.common_monitoring.ix.TimedEventUtils.getConfigNamespace(configParams);

    configs = sol.common_monitoring.ix.TimedEventUtils.getAndCacheTimedEventConfigs(configParams, cache);
    return sol.common_monitoring.ix.TimedEventUtils.getTimedEventConfigFromConfigs(configs, configParams);
  },

  getTimedEventConfigFromConfigs: function (configs, params) {
    var configId,
        configNamespace;

    configNamespace = sol.common.TemplateUtils.render(params.configNamespace, params);
    configId = sol.common.TemplateUtils.render(params.configId, params);

    return configs && configs[configId]
      ? configs[configId]
      : configs && configs[configNamespace]
        ? configs[configNamespace][configId]
        : null;
  },

  getConfigId: function (params) {
    return sol.common_monitoring.ix.TimedEventUtils.getConfigIdDirectly(params)
      || sol.common_monitoring.ix.TimedEventUtils.getConfigIdFromTimedEvent(params);
  },

  getConfigIdDirectly: function (params) {
    return params.configId;
  },

  getConfigIdFromTimedEvent: function (params) {
    return sol.common.TemplateUtils
      .render(
        sol.common.ObjectUtils.getProp(params, "timedEvent.mapKeys.UPDATE_GRP_TIMED_EVENT_CONFIG_ID"),
        params
      )
      || sol.common.ObjectUtils.getProp(params, "timedEvent.objKeys.TIMED_EVENT_CONFIG_ID");
  },

  getConfigNamespace: function (params) {
    return sol.common_monitoring.ix.TimedEventUtils.getConfigNamespaceDirectly(params)
      || sol.common_monitoring.ix.TimedEventUtils.getConfigNamespaceFromTimedEvent(params);
  },

  getConfigNamespaceDirectly: function (params) {
    return params.configNamespace;
  },

  getConfigNamespaceFromTimedEvent: function (params) {
    return sol.common.TemplateUtils
      .render(
        sol.common.ObjectUtils.getProp(params, "timedEvent.mapKeys.UPDATE_GRP_TIMED_EVENT_CONFIG_NAMESPACE"),
        params
      )
      || sol.common.ObjectUtils.getProp(params, "timedEvent.objKeys.TIMED_EVENT_CONFIG_NAMESPACE");
  },

  getAndCacheTimedEventConfigs: function (params, cache) {
    var configs;

    configs = sol.common_monitoring.ix.TimedEventUtils.getTimedEventConfigs(params, cache);
    if (!configs) {
      return null;
    }
    sol.common_monitoring.ix.TimedEventUtils.setTimedEventConfigsToCache(configs, cache);

    return configs;
  },

  getTimedEventConfigs: function (params, cache) {
    return sol.common_monitoring.ix.TimedEventUtils.getTimedEventConfigsDirectly(params)
      || sol.common_monitoring.ix.TimedEventUtils.getTimedEventConfigsFromCache(cache)
      || sol.common_monitoring.ix.TimedEventUtils.getTimedEventConfigsFromService(params);
  },

  getTimedEventConfigsFromCache: function (cache) {
    return (cache || {}).timedEventConfigs;
  },

  setTimedEventConfigsToCache: function (configs, cache) {
    cache = cache || {};
    cache.timedEventConfigs = configs;
  },

  getTimedEventConfigsDirectly: function (params) {
    return params.timedEventConfigs;
  },

  getTimedEventConfigsFromService: function () {
    return sol.create("sol.common.ix.services.GetNamespacedConfigs", {
      paths: [],
      allSolutions: true
    }).process();
  }
});
