importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common_monitoring.ix.TimedEventUtils.js
//@include sol.common.ix.services.GetNamespacedConfigs.js
/**
*
* @author ELO Digital Office GmbH
* @version 1.0
*
* @eloix
*
* @requires sol.common.DateUtils
* @requires sol.common.ObjectUtils
* @requires sol.common.ObjectFormatter
* @requires sol.common.Injection
* @requires sol.common.IxUtils
* @requires sol.common.ix.ServiceBase
* @requires sol.common.ix.RfUtils
* @requires sol.common.RepoUtils
* @requires sol.common.SordUtils
* @requires sol.common.Template
* @requires sol.common_monitoring.ix.TimedEventUtils
* @requires sol.common.ix.services.GetNamespacedConfigs
*
*/
sol.define("sol.common_monitoring.ix.services.SearchTimedEvents", {
  extend: "sol.common.ix.ServiceBase",

  logger: sol.create("sol.Logger", { scope: "sol.common_monitoring.ix.services.SearchTimedEvents" }),
  utils: sol.create("sol.common_monitoring.ix.TimedEventUtils"),

  messages: {
    missingSearchTemplate: "sol.common_monitoring.error.message.missing_search_template",
    missingResult: "sol.common_monitoring.error.message.missing_result"
  },

  optimize: {},

  initialize: function (config) {
    var me = this;

    if (config) {
      me.setupConfig(config);
      me.setupInjection(config);
    }

    me.$super(me.extend, "initialize", [config]);

    me.messages = me.utils.translateMap(me.messages);
  },

  setupConfig: function (config) {
    var me = this;

    me.params = config;
    me.inject = me.inject || {};
    me.inject.params = { prop: "params" };
  },

  setupInjection: function (config) {
    var me = this,
        injections;

    injections = me.utils.getInjections(config);

    if (injections && injections.$configRelation && injections.inject) {
      me.$configRelation = sol.common.ObjectUtils.mergeObjects({}, [me.$configRelation || {}, injections.$configRelation], true);
      me.inject = sol.common.ObjectUtils.mergeObjects({}, [me.inject || {}, injections.inject], true);
      sol.create("sol.common.Injection").inject(me);
    }
  },

  getSource: function (params) {
    var me = this;

    return me.utils.getSourceDirectly(params) || me.utils.getSourceFromSourceId(params);
  },

  getSearchTemplate: function (params) {
    params = params || {};

    return params.search
      ? params.referenceId && params.search.reference
        ? params.search.reference
        : params.configId && params.configNamespace && params.search.config
          ? params.search.config
          : params.search
      : null;
  },

  renderSearchTemplate: function (template, params) {
    var me = this;

    return me.utils.renderRequestParams(template, params);
  },

  getIdsFromResult: function (result) {
    var me = this;

    return ((result || {}).sords || [])
      .map(me.getSomeId)
      .filter(function (id) {
        return id != null;
      });
  },

  getSomeId: function (obj) {
    return sol.common.ObjectUtils.type(obj, 'string')
      ? obj
      : ["id", "objId", "guid"]
        .map(function (idCandidateKey) {
          return obj[idCandidateKey];
        })
        .filter(function (idCandidate) {
          return idCandidate;
        })[0];
  },

  process: function (_params) {
    var me = this,
        params;

    params = sol.common.ObjectUtils.mergeObjects(params, [(me.config || {}), (me.params || {}), (_params || {})]) || {};

    params.source = me.getSource(params);

    params.searchTemplate = me.getSearchTemplate(params);

    if (!params.searchTemplate) {
      me.logger.info(me.messages.missingSearchTemplate, { params: params });
      return [];
    }

    params.search = me.renderSearchTemplate(params.searchTemplate, params);

    params.searchResult = me.utils.optimizedExecute(me, params.search);

    // an empty array is a valid result
    if (!params.searchResult) {
      me.logger.info(me.messages.missingResult, { params: params });
      return [];
    }

    return me.getIdsFromResult(params.searchResult);

  }
});

/**
* @member sol.common_monitoring.ix.services.SearchTimedEvents
* @method RF_sol_common_monitoring_ix_service_SearchTimedEvents
* @static
* @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
*/
function RF_sol_common_monitoring_ix_service_SearchTimedEvents(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  fun = sol.create("sol.common_monitoring.ix.services.SearchTimedEvents", rfArgs);

  return JSON.stringify(fun.process());
}
