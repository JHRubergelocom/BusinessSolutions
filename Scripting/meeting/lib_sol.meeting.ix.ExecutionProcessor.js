//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js

/**
 * @author ELO Digital Office GmbH
 * @requires sol.common.IxUtils
 * @requires sol.common.ObjectUtils
 */
sol.define("sol.meeting.ix.ExecutionProcessor", {

  process: function (config) {
    var me = this, result, preparedConfig;

    me.logger.debug(["templateData process {0}", JSON.stringify(me.$templateData)]);

    if (!config || sol.common.ObjectUtils.isEmpty(config)) {
      throw Error("no config is passed");
    }

    preparedConfig = me.sanitizeConfig(me.setupMapping(config));

    me.logger.debug(["after execution processor {0}", JSON.stringify(preparedConfig)]);

    result = me.processExecutionStatement(preparedConfig.callback, preparedConfig.options);

    delete me.$configs;
    delete me.$templateData;
    delete me.options;

    return result;
  },

  setupMapping: function (config) {
    var me = this, val;

    if (config.callback.mapping) {
      config.callback.mapping.map(function (mapping) {
        val = sol.common.ObjectUtils.getProp(me.$templateData, mapping.from);
        sol.common.ObjectUtils.setProp(
          config.callback.args,
          mapping.to,
          val,
          mapping.overwrite,
          mapping.customPropName
        );
      });
    }
    return config;
  },

  sanitizeConfig: function (cfg) {
    var me = this, result = {};
    me.logger.debug(["sanitize config {0}", JSON.stringify(cfg)]);
    function verifyCallback(opt) {
      var name = me.validStr(opt.name), args = opt.args || {};
      if (!name || name.indexOf("RF_") !== 0) {
        throw Error("`callback.name` must be a string starting with 'RF_' (a valid registered function)`: " + name);
      }
      if (args && !me.isObj(args)) {
        throw Error("`callback.args` must be an object if it is defined. current type: " + typeof args);
      }
      return { name: name, args: args };
    }

    result.callback = verifyCallback(cfg.callback);
    result.options = cfg.options;

    return result;
  },

  /**
   * @private
   * @param {*} callback
   * @param {*} opts
   *
   *  @returns {*} any
   */
  processExecutionStatement: function (callback, opts) {
    var me = this, preparedArgs;
    if (callback && callback.name) {
      // when a callback is defined we apply the executionSet
      me.logger.debug(["before args {0}", JSON.stringify(callback.args)]);

      preparedArgs = me.prepareExecutionArgs(callback.args || {}, me.$templateData, opts);

      me.logger.debug(["preparedArgs {0}", JSON.stringify(preparedArgs)]);

      if (opts.dryRun) {
        me.logger.debug(["Dry run: No callback executed. Returning args: {0}", JSON.stringify({ args: preparedArgs, functionName: callback.name })]);
        return { args: preparedArgs };
      } else {
        me.logger.debug(["Callback will be executed. Returning args: {0}", JSON.stringify({ args: preparedArgs, functionName: callback.name })]);
        return { args: preparedArgs, result: me.executeCallback(callback.name, preparedArgs) };
      }
    } else {
      throw Error("statement or callback is not defined");
    }
  },

  prepareExecutionArgs: function (args, templateData, options) {
    var me = this,
        freshArgs = args;

    options = options || {};

    function deepMerge(a, b) {
      return Object.keys(b).forEach(function (p) {
        a[p] = (me.isObj(a[p]) && me.isObj(b[p]))
          ? deepMerge(a[p], b[p])
          : b[p];
      }) || a;
    }

    if (me.options.renderArgsWithElement && templateData) {
      // TODO: same function is used in sol.common.ix.funcitons.ForEach
      // so we should combine both classes when we accept RuleEngine
      // to common
      // Refactor deepMerge to ObjectUtils or something
      freshArgs = sol.common.TemplateUtils.render(freshArgs, templateData);
    }

    return options.withoutTemplateData
      ? freshArgs
      : deepMerge(templateData, freshArgs);
  },

  executeCallback: function (functionName, args) {
    return sol.common.IxUtils.execute(functionName, args);
  },

  validStr: function (s) {
    // TODO: ObjectUtils?
    return sol.common.ObjectUtils.type(s, "string") && String(s) && s.trim();
  },

  isObj: function (o) {
    // TODO: ObjectUtils
    return sol.common.ObjectUtils.type(o, "object");
  }
});
