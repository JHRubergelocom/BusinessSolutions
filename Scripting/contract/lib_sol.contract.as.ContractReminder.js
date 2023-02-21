
/**
 * Creates reminders for contracts.
 *
 * This class uses the monitoring module to determine for which contracts a reminder should be created.
 * If the reminder date is reached (and the reminder was not executed before), a workflow will be started.
 *
 * |Property|Description|
 * |:------|:------|
 * |fields.nextReminderDate|This field holds the reminder date of the contract|
 * |mapFields.reminderExecutionDate|To this map field the date will be written, at which the reminder was started|
 * |reminder.retrospection|The number of days contracts will be processed in the past|
 * |reminder.workflow|The workflow that will be started|
 * 
 * @author PZ, ELO Digital Office GmbH
 * @version 1.1
 *
 * @requires sol.common.Config
 * @requires sol.common.ObjectUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.TranslateTerms
 * @requires sol.common.Template
 * @requires sol.common_monitoring.as.MonitorUtils
 * @requires sol.common_monitoring.as.Monitor
 * @requires sol.common_monitoring.as.collectors.NextRunCollector
 * @requires sol.common_monitoring.as.analyzers.RuleAnalyzer
 * @requires sol.common_monitoring.as.executors.SimpleExecutor
 */
sol.define("sol.contract.as.ContractReminder", {

  process: function () {
    var logger = sol.create("sol.Logger", { scope: "sol.common.as.ContractReminder" }),
        contractConfig, collector, analyzer, executor, reminderMonitor;
    
    logger.enter("ContractReminder");
    
    contractConfig = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;
    
    collector = sol.create("sol.common_monitoring.as.collectors.NextRunCollector", {
      retrospection: contractConfig.reminder.retrospection,
      nextRunField: contractConfig.fields.nextReminderDate
    });
    
    analyzer = sol.create("sol.common_monitoring.as.analyzers.RuleAnalyzer", {
      rules: [
        {
          action: { type: "WORKFLOW", templateId: contractConfig.reminder.workflow, nameTemplate: contractConfig.reminder.workflowName },
          date: { type: "GRP", key: contractConfig.fields.nextReminderDate },
          execution: { type: "MAP", key: contractConfig.mapFields.reminderExecutionDate }
        }
      ]
    });
    
    executor = sol.create("sol.common_monitoring.as.executors.SimpleExecutor", {});
    
    reminderMonitor = sol.create("sol.common_monitoring.as.Monitor", {
      collector: collector,
      analyzer: analyzer,
      executor: executor
    });
    reminderMonitor.run();
    reminderMonitor.close();
    
    logger.exit("ContractReminder");
  }
});
