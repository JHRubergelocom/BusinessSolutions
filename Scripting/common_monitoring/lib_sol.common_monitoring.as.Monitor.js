/**
 * Main class of the monitoring module.
 *
 * A monitor instance can be reused, but should be disposed via `close` method after last use.
 *
 * The monitor needs three components to perform the different tasks.
 * All components can define an optional 'dispose' function (with no parameter and no return value), which will be used by the monitor to clean up after the run.
 *
 * # Collector
 * Responsible for collecting the working set
 * ## Interface
 *
 * - hasMoreResults () : Boolean
 * - getResults () : de.elo.ix.client.Sord[]
 * - postProcess (de.elo.ix.client.Sord sord, Object[] results, Object ctx)
 * - getContext () : Object (optional, can return a prefilled context, if not implemented, the analyzers start with an empty context object)
 *
 * # Analyzer
 *
 * ## Interface
 * Responsible for performing the analysis and determining the necessary actions.
 *
 * - analyze (de.elo.ix.client.Sord sord, Object ctx) : Object[]
 *
 * # Executor
 * Responsible for executing the actions.
 *
 * ## Interface
 *
 * - execute (de.elo.ix.client.Sord sord, Object[] results, Object ctx)
 *
 * # Inter module dependencies
 * The object array returned by the analyzer modules `analyze` method will be handed over to the executor modules `execute` method and should therefor contain the needed properties.
 * The same objects will after execution be handed over to the collector modules `postProcess` method. The executor can enhance the result data further if needed.
 *
 * Each module is responsible for ensuring the consistency of the data it gets, because the monitor has no way of knowing, which modules play well together.
 *
 * # Module orchestration
 *
 * 1. Use `collector.getResults` to collect the first batch of Sord objects
 * 2. Iterate over batch
 *   1. Use `analyzer.analyze()` to check each Sord
 *   2. Use `executor.execute()` to execute potential actions
 *   3. Use `collector.postProcess()` to perform potential post processing
 * 3. Repeat from beginning until there are no results left
 * 4. Cleanup modules via `dispose()`
 *
 * # Usage:
 *
 *     var nextRunCollector = sol.create("sol.common_monitoring.as.collectors.NextRunCollector", { ... });
 *     var retentionAnalyzer = sol.create("sol.common_monitoring.as.analyzers.RetentionAnalyzer", { ... });
 *     var simpleExecutor = sol.create("sol.common_monitoring.as.executors.SimpleExecutor", { ... });
 *
 *     var monitor = sol.create("sol.common_monitoring.as.Monitor", {
 *       collector: nextRunCollector,
 *       analyzer: retentionAnalyzer,
 *       executor: simpleExecutor
 *     });
 *     monitor.run();
 *     monitor.close();
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.02.000
 *
 * @eloas
 * @requires sol.commom.DateUtils
 * @requires sol.common.ObjectUtils
 */
sol.define("sol.common_monitoring.as.Monitor", {

  requiredConfig: ["collector", "analyzer", "executor"],

  /**
   * @cfg {Object} collector The component responsible for collecting the working set
   */

  /**
   * @cfg {Object} analyzer The component responsible for performing the analysis and determining the necessary actions
   */

  /**
   * @cfg {String} executor The component responsible for executing the actions
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);

    me.logger.info("initialize monitor");

    me.todayIso = sol.common.DateUtils.dateToIso(new Date());
    me.checkComponents();
  },

  /**
   * @private
   * Checks all components if they implement the correct interface.
   * @throws InitializationException
   */
  checkComponents: function () {
    var me = this;

    me.logger.debug("initialize monitor: check component interfaces");

    me.checkInterface(me.collector, "collector", ["hasMoreResults", "getResults", "postProcess"]);
    me.checkInterface(me.analyzer, "analyzer", ["analyze"]);
    me.checkInterface(me.executor, "executor", ["execute"]);
  },

  /**
   * @private
   * Checks a component if it implements the correct interface.
   * @param {Array} component Component
   * @param {String} name Name
   * @param {Array} functions Functions
   * @throws InitializationException
   */
  checkInterface: function (component, name, functions) {
    if (!component) {
      throw "InitializationException: no '" + name + "' defined";
    }
    if (functions && (functions.length > 0)) {
      functions.forEach(function (f) {
        if (!component[f] || !sol.common.ObjectUtils.isFunction(component[f])) {
          throw "InitializationException: '" + name + "' has to define a function '" + f + "'";
        }
      });
    }
  },

  /**
   * @private
   * Cleans up a component if it defines a `dispose` function.
   * @param {Object} component The component
   * @param {String} name The name of the component
   */
  disposeComponent: function (component, name) {
    var me = this;
    me.logger.debug("cleanup " + name);
    if (!component.dispose || !sol.common.ObjectUtils.isFunction(component.dispose)) {
      me.logger.debug(["component '{0}' does not define a 'dispose' function", name]);
      return;
    }
    try {
      component.dispose();
    } catch (ex) {
      me.logger.error(["error cleaning up '{0}' module", name], ex);
    }
  },

  /**
   * Main method execute the monitor.
   */
  run: function () {
    var me = this,
        ctx, workingSet, i, max, currentSord, results;

    me.logger.enter("run");
    me.logger.info(["processing start: {0}", me.todayIso]);

    while (me.collector.hasMoreResults()) {
      workingSet = me.collector.getResults();
      me.logger.info(["processing batch: found {0} entries", workingSet.length]);
      for (i = 0, max = workingSet.length; i < max; i++) {
        try {
          ctx = (sol.common.ObjectUtils.isFunction(me.collector.getContext)) ? me.collector.getContext() : {};
          currentSord = workingSet[i];
          me.logger.info(["process sord: objId={0}; name={1}", currentSord.id, currentSord.name]);

          results = me.analyzer.analyze(currentSord, ctx);
          me.executor.execute(currentSord, results, ctx);
          me.collector.postProcess(currentSord, results, ctx);
        } catch (ex) {
          me.logger.error(["an error occured while processing sord: objId={0}; name={1}", currentSord.id, currentSord.name], ex);
        }
      }
    }

    me.logger.exit("run");
  },

  /**
   * This function should be used, to cleanup after using the monitor.
   */
  close: function () {
    var me = this;

    me.disposeComponent(me.collector, "collector");
    me.disposeComponent(me.analyzer, "analyzer");
    me.disposeComponent(me.executor, "executor");
  }

});
