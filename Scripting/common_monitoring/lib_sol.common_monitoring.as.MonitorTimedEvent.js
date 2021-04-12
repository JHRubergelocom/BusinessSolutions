//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common_monitoring.as.Monitor.js

/**
 *
 *
 * @author PB, ELO Digital Office GmbH
 * @version 0.01.000
 *
 * @eloas
 *
 * @requires sol.commom.DateUtils
 * @requires sol.common.Template
 * @requires sol.common.ObjectUtils
 * @requires sol.common_monitoring.as.Monitor
 */
sol.define("sol.common_monitoring.as.MonitorTimedEvent", {
  extend: "sol.common_monitoring.as.Monitor",

  requiredConfig: [],

  utils: {
    helper: {
      wrapInFunction: function (value) {
        return function () {
          return value;
        };
      }
    }
  },

  initialize: function (params) {
    var me = this,
        check,
        injections;

    check = me.checkParameters(params);

    if (check.hasError) {
      throw new Error(check.message);
    }

    if (check.useDefaultMonitor) {
      // use default monitor @see lib_sol.common_monitoring.as.Monitor
      me.useDefaultMonitor = true;

      me.setupComponents(params);

      me.requiredConfig = ["collector", "analyzer", "executor"];

      me.$super("sol.common_monitoring.as.Monitor", "initialize", [params]);
    } else {
      me.params = params;

      injections = me.getInjections(params);
      me.$configRelation = injections.$configRelation;
      me.inject = injections.inject;
      me.$configRelation && sol.create("sol.common.Injection").inject(me);

      check = me.checkInjection(me);
      if (check.hasError) {
        throw new Error(check.message);
      }

      me.$super("sol.Base", "initialize", [params]);

      me.collector = me.setupComponent(me.config.collector || params.collector, "collector", ["hasMoreResults", "getResults", "postProcess"]);


      me.todayIso = sol.common.DateUtils.dateToIso(new Date());
    }
  },

  checkParameters: function (params) {
    if (params.ignoreParameterCheck) {
      return {};
    }
    // check if from config
    if (params.configPath && params.configName) {
      return {};
    }

    // check if default Monitor
    if (config.collector && config.analyzer && params.executor) {
      return {
        useDefaultMonitor: true
      };
    }

    return {
      hasError: true,
      error: ["missing parameters"]
    };
  },

  getInjections: function (params) {
    var $configRelation = {},
        inject = {};

    if (params.configPath && params.configName) {
      $configRelation.config = params.configPath;
      inject.config = {
        config: "config",
        prop: params.configName
      };
    }
    return {
      $configRelation: $configRelation,
      inject: inject
    };
  },

  checkInjection: function (params) {
    var result = {};

    if (params.ignoreInjectionCheck) {
      return {};
    }
    if (!(params.config && params.config.collector)) {
      return {
        hasError: true,
        message: "missing collector configuration"
      };
    }
    if (!(params.config && params.config.analyzer)) {
      return {
        hasError: true,
        message: "missing analyzer configuration"
      };
    }
    if (!(params.config && params.config.executor)) {
      return {
        hasError: true,
        message: "missing executor configuration"
      };
    }
    return result;
  },

  setupComponents: function (config) {
    var me = this;

    me.collector = me.setupComponent(me.collector || config.collector, "collector", ["hasMoreResults", "getResults", "postProcess"]);
    me.analyzer = me.setupComponent(me.analyzer || config.analyzer, "analyzer", ["analyze"]);
    me.executor = me.setupComponent(me.executor || config.executor, "executor", ["execute"]);
  },

  setupComponent: function (component, name, functions, secondRun, currentSord) {
    var me = this,
        templateSord;

    if (!component) {
      throw new Error("InitializationException: no '" + name + "' defined");
    }

    if (currentSord) {
      templateSord = sol.common.SordUtils.getTemplateSord(currentSord).sord;
      component = sol.common.TemplateUtils.render(component, templateSord);
    }

    if (secondRun || (name && functions)) {
      try {
        me.checkInterface(component, name, functions);
        return component;
      } catch (error) {
        if (secondRun || !component.create) {
          throw error;
        }
      }
    }
    component = (typeof component.create === "string")
      ? sol.create(component.create, component.params || {})
      : component;

    return me.setupComponent(component, name, functions, true);
  },

  getAnalyzer: function (params) {
    var analyzeConfig = sol.common.ObjectUtils.getProp(params, "config.analyzer");

    return analyzeConfig
      ? params.setupComponent(analyzeConfig, null, null, false, params.sord)
      : null;
  },

  prepareExecution: function (sord, params) {
    var action = null,
        prepareParams = params,
        actionType,
        functionType,
        actionParams;

    if (prepareParams.action) {
      prepareParams.sord = (sol.common.SordUtils.getTemplateSord(sord) || {}).sord;
      actionType = sol.common.ObjectUtils.getProp(prepareParams, "sord.objKeys.TIMED_EVENT_ACTION_TYPE");
      if (actionType == "FUNCTION") {
        functionType = sol.common.ObjectUtils.getProp(prepareParams, "sord.mapKeys.TIMED_EVENT_FUNCTION_TYPE");
        actionParams = sol.common.ObjectUtils.getProp(actionParams, "config.prepareActions." + actionType + "." + functionType);
      } else {
        actionParams = sol.common.ObjectUtils.getProp(prepareParams, "config.prepareActions." + actionType);
      }
      action = sol.common.TemplateUtils.render(actionParams, prepareParams, { emptyNonRendered: true });
    }

    return Object
      .keys(action)
      .map(function (key) {
        return [key, action[key]];
      })
      .filter(function (keyValue) {
        // filter Attribute, dessen Wert nicht gesetzt ist
        return !sol.common.ObjectUtils.isBlank(keyValue[1]);
      })
      .reduce(function (acc, keyValue) {
        if (keyValue.length == 2) {
          acc[keyValue[0]] = keyValue[1];
        }
        return acc;
      }, {});

  },

  getExecutor: function (params) {
    var executorConfig = sol.common.ObjectUtils.getProp(params, "config.executor");

    return executorConfig
      ? params.setupComponent(executorConfig, null, null, false, params.sord)
      : null;
  },

  processSord: function (sord, params) {
    var collector = params.getCollector(params),
        analyzer = params.getAnalyzer(params),
        prepareExecution = params.prepareExecution,
        executor = params.getExecutor(params),
        action,
        actionParams = params;

    if (collector && analyzer && prepareExecution && executor) {
      actionParams.action = analyzer.analyze(sord, params.ctx);

      action = prepareExecution(sord, actionParams);

      executor.execute(sord, action, params.ctx);

      collector.postProcess(sord, action, params.ctx);
    }
  },

  processSords: function (sords, params, sordProcessFunction) {
    var i,
        max = (sords || {}).length || 0;

    for (i = 0; i < max; i++) {
      sordProcessFunction(sords[i], params);
    }
  },

  run: function () {
    var me = this,
        collector = me.collector,
        helper = me.utils.helper;

    if (me.useDefaultMonitor) {
      // use default monitor
      me.$super("sol.common_monitoring.as.Monitor", "run", []);
    } else {
      while (collector.hasMoreResults()) {
        me.processSords(
          collector.getResults(),
          {
            ctx: (sol.common.ObjectUtils.isFunction(me.collector.getContext)) ? me.collector.getContext() : {},
            config: me.config,
            getCollector: helper.wrapInFunction(collector),
            getAnalyzer: me.getAnalyzer,
            prepareExecution: me.prepareExecution,
            getExecutor: me.getExecutor,
            setupComponent: me.setupComponent.bind(me)
          },
          me.processSord
        );
      }
    }
  }
});

/**
 * Default Collection
 */
sol.define("sol.common_monitoring.as.DefaultMonitorTimedEvent", {
  process: function () {
    var monitor,
        config = {
          configPath: "/common_monitoring/Configuration/timedevent.config",
          configName: "monitor"
        };

    monitor = sol.create("sol.common_monitoring.as.MonitorTimedEvent", config);

    monitor.run();

    monitor.close();
  }
});