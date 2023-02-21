
/**
 * Extends contracts.
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
sol.define("sol.contract.as.ExtendContracts", {

  process: function () {
    var logger = sol.create("sol.Logger", { scope: "sol.common.as.ExtendContracts" }),
        contractConfig, collectorNextPossibleTermination, collectorContractEnd, analyzer, executor, extendMonitorNextPossibleTermination, extendMonitorContractEnd;

    logger.enter("ExtendContracts");

    contractConfig = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;

    collectorNextPossibleTermination = sol.create("sol.common_monitoring.as.collectors.NextRunCollector", {
      retrospection: contractConfig.extension.retrospection,
      nextRunField: contractConfig.fields.nextPossibleTermination
    });

    collectorContractEnd = sol.create("sol.common_monitoring.as.collectors.NextRunCollector", {
      retrospection: contractConfig.extension.retrospection,
      nextRunField: contractConfig.fields.contractEnd
    });

    analyzer = sol.create("sol.common_monitoring.as.analyzers.ValueAnalyzer", {
      action: { type: "WORKFLOW", templateId: contractConfig.extension.workflow },
      values: [
        { type: "MAP", key: contractConfig.mapFields.extensionFlag, referenceValue: contractConfig.extension.referenceValue },
        { type: "GRP", key: contractConfig.fields.contractStatus, localizedKwl: true, referenceValues: contractConfig.extension.extensionStatus }
      ]
    });

    executor = sol.create("sol.common_monitoring.as.executors.SimpleExecutor", {});

    extendMonitorNextPossibleTermination = sol.create("sol.common_monitoring.as.Monitor", {
      collector: collectorNextPossibleTermination,
      analyzer: analyzer,
      executor: executor
    });
    extendMonitorNextPossibleTermination.run();
    extendMonitorNextPossibleTermination.close();

    extendMonitorContractEnd = sol.create("sol.common_monitoring.as.Monitor", {
      collector: collectorContractEnd,
      analyzer: analyzer,
      executor: executor
    });
    extendMonitorContractEnd.run();
    extendMonitorContractEnd.close();

    logger.exit("ExtendContracts");
  }
});
