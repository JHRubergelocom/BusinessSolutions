
/**
 * Updates permanent contracts
 *
 * This class uses the monitoring module to determine which contracts are due.
 * If a contract is due and is flaged for automatic extension, a workflow will be started.
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |fields.extensionDate|This field holds the due date of the contract|
 * |mapFields.extensionFlag|This field holds the value if the cintract should be extended automatically|
 * |extension.referenceValue|This is the value which has to be set on the `extension.referenceValue` so the contract is recognized as extendable|
 * |extension.retrospection|The number of days contracts will be processed in the past|
 * |extension.workflow|The workflow that will be started|
 *
 * @author PZ, ELO Digital Office GmbH
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
sol.define("sol.contract.as.UpdatePermanentContracts", {

  process: function () {
    var logger = sol.create("sol.Logger", { scope: "sol.common.as.UpdatePermanentContracts" }),
        contractConfig, collector, analyzer, executor, updateMonitor;

    logger.enter("UpdatePermanentContracts");

    contractConfig = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;

    collector = sol.create("sol.common_monitoring.as.collectors.NextRunCollector", {
      retrospection: contractConfig.updatePermanentContract.retrospection,
      nextRunField: contractConfig.fields.nextPossibleTermination,
      searchPeriodEndDays: 1
    });

    analyzer = sol.create("sol.common_monitoring.as.analyzers.ValueAnalyzer", {
      action: { type: "WORKFLOW", templateId: contractConfig.updatePermanentContract.workflow },
      values: [
        { type: "MAP", key: contractConfig.mapFields.durationType, referenceValue: contractConfig.updatePermanentContract.referenceValue }
      ]
    });

    executor = sol.create("sol.common_monitoring.as.executors.SimpleExecutor", {});

    updateMonitor = sol.create("sol.common_monitoring.as.Monitor", {
      collector: collector,
      analyzer: analyzer,
      executor: executor
    });
    updateMonitor.run();
    updateMonitor.close();

    logger.exit("UpdatePermanentContracts");
  }
});
