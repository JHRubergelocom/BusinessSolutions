
/**
 * Creates a monitor for learning entities.
 *
 * - release date (COURSE_RELEASE_DATE=today)
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @requires sol.common.Cache
 * @requires sol.common.Config
 * @requires sol.common.Injection
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.ObjectUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ExceptionUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.TranslateTerms
 * @requires sol.common.Template
 * @requires sol.common_monitoring.as.MonitorUtils
 * @requires sol.common_monitoring.as.collectors.ChildrenCollector
 * @requires sol.common_monitoring.as.collectors.NextRunCollector
 * @requires sol.common_monitoring.as.analyzers.RuleAnalyzer
 * @requires sol.common_monitoring.as.executors.SimpleExecutor
 * @requires sol.common_monitoring.as.Monitor
 * @requires sol.learning.as.LearningMonitoring

 */
sol.define("sol.learning.as.LearningMonitoring", {

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    instances: { config: "learning", prop: "entities.course.monitoring.instances", template: false } // {}
  },

  getMonitorConfig: function (about) {
    return {
      collector: sol.create("sol.common_monitoring.as.collectors.NextRunCollector", about.collector),
      analyzer: sol.create("sol.common_monitoring.as.analyzers.RuleAnalyzer", { rules: about.rules }),
      executor: sol.create("sol.common_monitoring.as.executors.SimpleExecutor", {})
    };
  },

  process: function () {
    var me = this, logger = sol.create("sol.Logger", { scope: "sol.learning.as.LearningMonitoring" });

    logger.enter("LearningMonitoring");

    Object.keys(me.instances)
      .forEach(function (monitorName) {
        var monitor = sol.create("sol.common_monitoring.as.Monitor", me.getMonitorConfig(me.instances[monitorName]));
        monitor.run();
        monitor.close();
      });

    logger.exit("LearningMonitoring");
  }
});
