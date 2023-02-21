
/**
 * Creates reminders for personnel files deadlines.
 *
 * - cassation date reminder for personnel files (filecassationdate=today)
 * - cassation date reminder for personnel file documents (cassationdate=today)
 * - cassation date reminder for personnel file structures (cassationdate=today)
 * - reminder before the end of the probationary period (endofprobationary-7days)
 * - reminder before a new employee enters the company (dateofjoining-7days)
 * - reminder before an employee leaves the company (dateofleaving-7days)
 * - reminder when an employee leaves the company (dateofleaving=today)
 * 
 * @author ESt, ELO Digital Office GmbH
 *
 * @requires sol.common.Cache
 * @requires sol.common.Config
 * @requires sol.common.Injection
 * @requires sol.hr.mixins.Configuration
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
 * @requires sol.hr.as.PersonnelFileReminder

 */
sol.define("sol.hr.as.PersonnelFileReminder", {

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],
  
  inject: {
    instances: { config: "hr", prop: "entities.file.reminders.instances", template: false } // {}
  },

  getMonitorConfig: function (about) {
    return {
      collector: sol.create("sol.common_monitoring.as.collectors.NextRunCollector", about.collector),
      analyzer: sol.create("sol.common_monitoring.as.analyzers.RuleAnalyzer", { rules: about.rules }),
      executor: sol.create("sol.common_monitoring.as.executors.SimpleExecutor", {})
    };
  },

  process: function () {
    var me = this, logger = sol.create("sol.Logger", { scope: "sol.hr.as.PersonnelFileReminder" });
    
    logger.enter("PersonnelFileReminder");
    // cassation reminder for documents

    Object.keys(me.instances).forEach(function (monitorName) {
      var monitor = sol.create("sol.common_monitoring.as.Monitor", me.getMonitorConfig(me.instances[monitorName]));
      monitor.run();
      monitor.close();
    });
    
    logger.exit("PersonnelFileReminder"); 
  }
});
