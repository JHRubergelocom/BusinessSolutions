
/**
 * Set the status of contracts to Ended.
 *
 * This class uses the monitoring module to determine which contracts should be set to Ended.
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.ObjectUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common_monitoring.as.MonitorUtils
 * @requires sol.common_monitoring.as.Monitor
 * @requires sol.common_monitoring.as.collectors.NextRunCollector
 * @requires sol.common_monitoring.as.analyzers.ValueAnalyzer
 * @requires sol.common_monitoring.as.executors.SimpleExecutor
 */
sol.define("sol.contract.as.SetContractsEnded", {

  process: function () {
    var logger, contractConfig, collector, analyzer, executor, monitor;

    logger = sol.create("sol.Logger", { scope: "sol.common.as.SetContractsEnded" });

    logger.enter("SetContractsEnded");

    contractConfig = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;

    collector = sol.create("sol.common_monitoring.as.collectors.NextRunCollector", {
      soltype: "CONTRACT",
      retrospection: contractConfig.setEnded.retrospection,
      nextRunField: contractConfig.fields.contractEnd
    });

    analyzer = sol.create("sol.common_monitoring.as.analyzers.ValueAnalyzer", {
      action: { type: "WORKFLOW", templateId: contractConfig.setEnded.workflow },
      values: [
        { type: "MAP", key: contractConfig.mapFields.extensionFlag, isEmpty: true },
        { type: "GRP", key: contractConfig.fields.contractStatus, localizedKwl: true, referenceValues: contractConfig.setEnded.statusToSetEnded }
      ]
    });

    executor = sol.create("sol.common_monitoring.as.executors.SimpleExecutor", {});

    monitor = sol.create("sol.common_monitoring.as.Monitor", {
      collector: collector,
      analyzer: analyzer,
      executor: executor
    });

    monitor.run();
    monitor.close();

    logger.exit("SetContractsEnded");
  }
});
