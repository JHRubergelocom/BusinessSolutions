importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.FunctionBase.js
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
* @requires sol.common.ix.FunctionBase
* @requires sol.common.ix.RfUtils
* @requires sol.common.RepoUtils
* @requires sol.common.SordUtils
* @requires sol.common.Template
* @requires sol.common_monitoring.ix.TimedEventUtils
* @requires sol.common.ix.services.GetNamespacedConfigs
*
*/
sol.define("sol.common_monitoring.ix.functions.UpdateTimedEvent", {
  extend: "sol.common.ix.FunctionBase",

  logger: sol.create("sol.Logger", { scope: "sol.common_monitoring.ix.functions.UpdateTimedEvent" }),
  utils: sol.create("sol.common_monitoring.ix.TimedEventUtils"),

  optimize: {},

  messages: {
    missingTimedEent: "sol.common_monitoring.error.message.missing_timed_event",
    missingSource: "sol.common_monitoring.error.message.missing_source",
    missingConfig: "sol.common_monitoring.error.message.missing_config",
    missingRequest: "sol.common_monitoring.error.message.missing_request",
    success: "sol.common_monitoring.error.message.update_success"
  },

  requests: {
    update: {
      provider: "RF_sol_function_Set",
      optimize: "updateRequest",
      output: ["output"]
    }
  },

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

  getTimedEvent: function (params) {
    var me = this;

    return me.utils.getTimedEventDirectly(params) || me.utils.getTimedEventFromId(params);
  },

  getSource: function (params) {
    var me = this;

    return me.utils.getSourceDirectly(params)
      || me.getSourceFromTimedEvent(params)
      || me.utils.getSourceFromSourceId(params);
  },

  getSourceFromTimedEvent: function (params) {
    var me = this,
        timedEvent,
        sourceId;

    timedEvent = me.getTimedEvent({ timedEvent: params.timedEvent, id: params.id });
    sourceId = sol.common.ObjectUtils.getProp(timedEvent || {}, "objKeys.TIMED_EVENT_SOURCE");

    return me.utils.getSourceFromSourceId({ sourceId: sourceId });
  },

  getTimedEventConfig: function (params) {
    var me = this;

    return me.utils.getTimedEventConfigDirectly(params)
      || me.utils.getAndCacheTimedEventConfigByParams(params, me.timedEventConfigs);
  },

  getUpdateRequest: function (params) {
    var me = this,
        template,
        renderedTemplate,
        request;

    // this is the only additional value during creation, needs to be set explicit
    params.referenceId = params.timedEvent.objKeys.TIMED_EVENT_REFERENCE;

    template = { objId: params.timedEvent.id };

    template.entries = me
      .getUpdateRequestEntries(params)
      .map(me.mapUpdateRequestEntries.bind(me, params));

    renderedTemplate = me.utils.renderRequestParams(template, params);

    request = sol.common.ObjectUtils.clone(me.requests.update);
    request.params = renderedTemplate;

    return request;
  },

  getUpdateRequestEntries: function (params) {
    var me = this;

    return me.utils.mapUpdateKeysToEntries(params.timedEvent.mapKeys, "UPDATE_") || [];
  },

  mapUpdateRequestEntries: function (params, entry) {
    var me = this;

    if (entry.key == "TIMED_EVENT_DATE" && entry.type === "GRP") {
      return me.utils.setTimedEventDate(entry, params);
    }
    return entry;
  },

  process: function (_params) {
    var me = this,
        params = {},
        request;

    params = sol.common.ObjectUtils.mergeObjects(params, [(me.config || {}), (me.params || {}), (_params || {})]) || {};

    params.timedEvent = me.getTimedEvent(params);
    if (!params.timedEvent) {
      return { message: me.messages.missingTimedEvent, params: params };
    }

    params.source = me.getSource(params);
    if (!params.source) {
      return { message: me.messages.missingSource, params: params };
    }

    params.config = me.getTimedEventConfig(params);
    if (!params.config) {
      return { message: me.messages.missingConfig, params: params };
    }

    request = me.getUpdateRequest(params);

    if (!request) {
      return { message: me.messages.missingRequest, params: params };
    }

    me.utils.optimizedExecute(me, request);
    return { message: me.messages.success, id: params.id };
  }
});

/**
* @member sol.common_monitoring.ix.functions.UpdateTimedEvent
* @static
* @inheritdoc sol.common.ix.FunctionBase#onEnterNode
*/
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  sol.create("sol.common_monitoring.ix.functions.UpdateTimedEvent", params).process();
}

/**
* @member sol.common_monitoring.ix.functions.UpdateTimedEvent
* @static
* @inheritdoc sol.common.ix.FunctionBase#onExitNode
*/
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  sol.create("sol.common_monitoring.ix.functions.UpdateTimedEvent", params).process();
}

/**
* @member sol.common_monitoring.ix.functions.UpdateTimedEvent
* @method RF_sol_common_monitoring_function_ix_UpdateTimedEvent
* @static
* @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
*/
function RF_sol_common_monitoring_ix_function_UpdateTimedEvent(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  fun = sol.create("sol.common_monitoring.ix.functions.UpdateTimedEvent", rfArgs);

  return JSON.stringify(fun.process());
}
