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
//@include lib_sol.common_monitoring.ix.MonitorUtils.js
//@include sol.common.ix.services.GetNamespacedConfigs.js
//@include lib_sol.common_monitoring.ix.TimedEventUtils.js
//@include sol.common_monitoring.ix.services.SearchTimedEvents.js


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
* @requires sol.common_monitoring.ix.MonitorUtils
* @requires sol.common.ix.services.GetNamespacedConfigs
* @requires sol.common_monitoring.ix.TimedEventUtils
* @requires sol.common_monitoring.ix.services.SearchTimedEvents
*
*/
sol.define("sol.common_monitoring.ix.functions.UpsertTimedEvents", {
  extend: "sol.common.ix.FunctionBase",

  logger: sol.create("sol.Logger", { scope: "sol.common_monitoring.ix.functions.UpsertTimedEvents" }),
  utils: sol.create("sol.common_monitoring.ix.TimedEventUtils"),

  messages: {
    creationExecuted: "sol.common_monitoring.error.message.creation_executed", // "Timed event creation executed",
    updateExecuted: "sol.common_monitoring.error.message.update_executed" // "Timed event update(s) executed"
  },

  requests: {
    search: {
      provider: "RF_sol_common_monitoring_ix_service_SearchTimedEvents",
      optimize: "searchTimedEvents",
      output: ["output"]
    },
    create: {
      provider: "RF_sol_common_monitoring_ix_function_CreateTimedEvent",
      optimize: "createTimedEvent",
      output: ["output"]

    },
    update: {
      provider: "RF_sol_common_monitoring_ix_function_UpdateTimedEvent",
      optimize: "updateTimedEvent",
      output: ["output"]
    },
    callees: []
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

    if (!config.sourceId && !config.source && config.objId) {
      config.sourceId = config.objId;
    }

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

  isCreationRequest: function (params, timedEventIds) {
    return params.referenceId && timedEventIds.length == 0;
  },

  searchTimedEvents: function (params) {
    var me = this,
        searchParams,
        request;

    searchParams = sol.common.ObjectUtils.clone(params);
    searchParams.configPath = params.searchConfigPath || params.configPath;
    searchParams.configName = params.searchConfigName || params.configName;

    request = sol.common.ObjectUtils.clone(me.requests.search);
    request.params = searchParams;

    return me.utils.optimizedExecute(me, request) || [];
  },

  createTimedEvent: function (params) {
    var me = this,
        createParams,
        request;

    createParams = sol.common.ObjectUtils.clone(params);
    createParams.configPath = params.createConfigPath || params.configPath;
    createParams.configName = params.createConfigName || params.configName;

    request = sol.common.ObjectUtils.clone(me.requests.create);
    request.params = createParams;

    return me.utils.optimizedExecute(me, request);
  },

  updateTimedEvent: function (timedEventId, additionalParams) {
    var me = this,
        request;

    request = sol.common.ObjectUtils.clone(me.requests.update);
    request.params = {
      id: timedEventId,
      additionalParams: additionalParams
    };

    return me.utils.optimizedExecute(me, request);
  },

  createTimedEventAndReturnMessage: function (params) {
    var me = this;
    return {
      message: me.messages.creationExecuted,
      creationResponse: me.createTimedEvent(params)
    };
  },

  upsertTimedEventsAndReturnMessage: function (timedEventIds, additionalParams) {
    var me = this;

    sol.common.ObjectUtils.forEach(
      (timedEventIds || []),
      function (timedEventId) {
        me.updateTimedEvent(timedEventId, additionalParams);
      }
    );

    return { message: me.messages.updateExecuted };
  },

  process: function (_params) {
    var me = this,
        params,
        timedEventIds;

    params = sol.common.ObjectUtils.mergeObjects(params, [me.config || {}, me.params || {}, _params || {}]) || {};

    timedEventIds = me.searchTimedEvents(params);

    return me.isCreationRequest(params, timedEventIds)
      ? me.createTimedEventAndReturnMessage(params)
      : me.upsertTimedEventsAndReturnMessage(timedEventIds, params.additionalParams);
  }
});

/**
* @member sol.common_monitoring.ix.functions.UpsertTimedEvents
* @static
* @inheritdoc sol.common.ix.FunctionBase#onEnterNode
*/
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  sol.create("sol.common_monitoring.ix.functions.UpsertTimedEvents", params).process();
}

/**
* @member sol.common_monitoring.ix.functions.UpsertTimedEvents
* @static
* @inheritdoc sol.common.ix.FunctionBase#onExitNode
*/
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  sol.create("sol.common_monitoring.ix.functions.UpsertTimedEvents", params).process();
}

/**
* @member sol.common_monitoring.ix.functions.UpsertTimedEvents
* @method RF_sol_common_monitoring_ix_function_UpsertTimedEvents
* @static
* @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
*/
function RF_sol_common_monitoring_ix_function_UpsertTimedEvents(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  fun = sol.create("sol.common_monitoring.ix.functions.UpsertTimedEvents", rfArgs);

  return JSON.stringify(fun.process());
}
