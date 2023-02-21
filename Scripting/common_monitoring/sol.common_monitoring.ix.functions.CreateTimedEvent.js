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
* @requires sol.common.ix.services.GetNamespacedConfigs
* @requires sol.common_monitoring.ix.TimedEventUtils
*
*/
sol.define("sol.common_monitoring.ix.functions.CreateTimedEvent", {
  extend: "sol.common.ix.FunctionBase",

  logger: sol.create("sol.Logger", { scope: "sol.common_monitoring.ix.functions.CreateTimedEvent" }),
  utils: sol.create("sol.common_monitoring.ix.TimedEventUtils"),

  templatePaths: {
    createSord: "create.createSord.params",
    setValues: "create.setValues.params"
  },

  messages: {
    missingReferenceId: "sol.common_monitoring.error.message.missing_reference_id",
    missingCreate: "sol.common_monitoring.error.message.missing_create",
    missingSource: "sol.common_monitoring.error.message.missing_source",
    missingConfig: "sol.common_monitoring.error.message.missing_config",
    failedCreation: "sol.common_monitoring.error.message.failed_creation",
    missingSetValueRequest: "sol.common_monitoring.error.message.missing_setvaluerequest",
    success: "sol.common_monitoring.error.message.success"
  },

  requests: {
    create: {
      provider: "RF_sol_function_CreateSord",
      optimize: "createRequest",
      output: ["output"]
    },
    setValues: {
      provider: "RF_sol_function_Set",
      optimize: "updateRequest",
      output: ["output"]
    }
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
    if (config.configName) {
      me.inject.create = { config: "config", prop: config.configName + ".create", template: false };
    }
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

    return me.utils.getSourceDirectly(params) || me.utils.getSourceFromSourceId(params);
  },

  getTimedEventConfig: function (params) {
    var me = this;

    return me.utils.getTimedEventConfigDirectly(params)
      || me.getTimedEventConfigByParams(params);
  },

  getTimedEventConfigByParams: function (params) {
    var me = this;

    return (params.configNamespace && params.configNamespace)
      ? me.utils.getTimedEventConfigFromConfigs(
        me.utils.getAndCacheTimedEventConfigs(params, me.timedEventConfigs),
        params
      )
      : null;
  },

  getUpdateRequest: function (template, params) {
    var me = this,
        request;


    request = sol.common.ObjectUtils.clone(me.requests.setValues);

    request.params = me.getUpdateRequestParams(template, params);

    return request;
  },

  getUpdateRequestParams: function (template, params) {
    var me = this,
        requestParams;

    requestParams = me.renderUpdateRequestEntries(sol.common.ObjectUtils.clone(template), params);
    requestParams.entries = requestParams.entries.concat(me.createUpdateEntries(template));

    return requestParams;
  },

  renderUpdateRequestEntries: function (template, params) {
    var me = this;

    template.entries = (template.entries || [])
      .map(me.mapUpdateRequestEntries.bind(me, params));

    return me.utils.renderRequestParams(template, params);
  },

  mapUpdateRequestEntries: function (params, entry) {
    var me = this;

    if (entry.key == "TIMED_EVENT_DATE" && entry.type === "GRP") {
      return me.utils.setTimedEventDate(entry, params);
    }

    return entry;
  },

  createUpdateEntries: function (template) {
    var me = this;

    return me.utils.mapUpdateEntriesToKeys(template.entries || [], "UPDATE_");
  },

  getCreateRequest: function (template, params) {
    var me = this,
        request,
        requestParams;

    requestParams = me.utils.renderRequestParams(template, params);

    request = sol.common.ObjectUtils.clone(me.requests.create);
    request.params = requestParams;

    return request;
  },

  process: function (_params) {
    var me = this,
        params,
        createRequest,
        updateRequest;

    params = sol.common.ObjectUtils.mergeObjects(params, [me.config || {}, me.params || {}, _params || {}]) || {};

    if (!params.referenceId) {
      return { message: me.messages.missingReferenceId, params: params };
    } else {
      // check if already exists
    }

    if (!params.create) {
      return { message: me.messages.missingCreate, params: params };
    }

    params.source = me.getSource(params);
    if (!params.source) {
      return { message: me.messages.missingSource, params: params };
    }

    params.config = me.getTimedEventConfig(params);

    if (!params.config) {
      return { message: me.messages.missingConfig, params: params };
    }

    createRequest = me.getCreateRequest(sol.common.ObjectUtils.getProp(me, me.templatePaths.createSord), params);
    params.created = me.utils.optimizedExecute(me, createRequest);
    params.timedEvent = me.getTimedEvent({ id: (params.created || {}).objId });

    if (!params.timedEvent) {
      return { message: me.messages.failedCreation, params: params };
    }

    updateRequest = me.getUpdateRequest(sol.common.ObjectUtils.getProp(me, me.templatePaths.setValues), params);

    if (!updateRequest) {
      // TODO delete created timed event
      return { message: me.messages.missingSetValueRequest, params: params };
    }

    me.utils.optimizedExecute(me, updateRequest);

    return { message: me.messages.success, id: params.timedEvent.id };
  }
});

/**
* @member sol.common_monitoring.ix.functions.CreateTimedEvent
* @static
* @inheritdoc sol.common.ix.FunctionBase#onEnterNode
*/
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  sol.create("sol.common_monitoring.ix.functions.CreateTimedEvent", params).process();
}

/**
* @member sol.common_monitoring.ix.functions.CreateTimedEvent
* @static
* @inheritdoc sol.common.ix.FunctionBase#onExitNode
*/
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  sol.create("sol.common_monitoring.ix.functions.CreateTimedEvent", params).process();
}

/**
* @member sol.common_monitoring.ix.functions.CreateTimedEvent
* @method RF_sol_common_monitoring_function_ix_CreateTimedEvent
* @static
* @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
*/
function RF_sol_common_monitoring_ix_function_CreateTimedEvent(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  fun = sol.create("sol.common_monitoring.ix.functions.CreateTimedEvent", rfArgs);

  return JSON.stringify(fun.process());
}
