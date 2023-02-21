/**
 * Analyzes if a set of rules is applicable for an object.
 *
 * A rule should at least contain an `action`, which should be executed later if the rule applies to the analyzed object,
 * and a `date` configuration (see {@link sol.common.SordUtils#getValue}) on which all checks will be performed.
 *
 * Additionally it can specify a `shift` and a `recur` attribute (for poosible configurations see {@link sol.common_monitoring.as.MonitorUtils#evalDateUnitConfig MonitorUtils}).
 * While `shift` can be a positive or a negative value, `recure` has to be positive.
 * Also optional is the `execution` attribute, which saves the last execution eiter to a map field or an index field. In case the rule is 'reoccuring' it is mandatory,
 * because the analyzer needs determine when the next reoccurrence should be.
 *
 * `date` only: the analyzer just checks, if the date is in the past
 *
 * `shift`: the analyzer checks, if the date plus/minus a value is already exceeded.
 *
 * `recur`: the analyzer checks, if the date (or the last execution) plus a value is exceeded.
 *
 * `shift` and `recur` can be combined.
 *
 * If `date` or `shift` rules hit, now next run will be calculated, if they miss, the analyzer determines the date for the next check.
 * `recur` rules always calculate a next run date (no breaking condition so far).
 *
 * Each kind of rule returns it's specified action when it hits.
 *
 *     var analyzer = sol.create("sol.common_monitoring.as.analyzers.RuleAnalyzer", {
 *       rules: [
 *         ... rule objects ...
 *       ]
 *     });
 *
 * #Example rules:
 *
 * Starts a workflow (in the context of the user "John Doe"), if the date in the MY_DATE field is in the past:
 *
 *     {
 *       action: { type: "WORKFLOW", templateId: "MyWorkflowTemplate", user: "John Doe" },
 *       date: { type: "GRP", key: "MY_DATE" },
 *     }
 *
 * If you don't want to filter by date, instead of defining `date`, you can define `noAdditionalDateCheck: true`. This will execute the action for every sord found by the collector.
 *
 * Creates a reminder if the date in the MY_DATE field is less then two months in the future (date minus 2 month is before now) and saves the current date to a map field:
 *
 *     {
 *       action: { type: "REMINDER", user: "Administrator" },
 *       date: { type: "GRP", key: "MY_DATE" },
 *       shift: { value: -2, unit: "M" },
 *       execution: { type: "MAP", key: "MY_DATE_EXECUTION" }
 *     }
 *
 * Starts a workflow, if the date from the map field (see execution - or if not already set, the `date` itself) plus the value from the MY_REOCCURRENCE field in days ("D") is in the past,
 * and saves the date of the last sheduled execution a map field (therefor all recurring events will be executed, even if several checks have been missed).
 *
 *     {
 *       action: { type: "WORKFLOW", templateId: "MyWorkflowTemplate" },
 *       date: { type: "GRP", key: "MY_DATE" },
 *       recur: { type: "GRP", key: "MY_REOCCURRENCE", unit: "D" },
 *       execution: { type: "MAP", key: "MY_DATE_EXECUTION" }
 *     }
 *
 * @eloas
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.DateUtils
 * @requires sol.common_monitoring.as.MonitorUtils
 */
sol.define("sol.common_monitoring.as.analyzers.RuleAnalyzer", {

  requiredConfig: ["rules"],

  /**
   * @cfg {Object[]} rules
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    me._todayIso = sol.common.DateUtils.dateToIso(new Date());
  },

  /**
   * Analyzes an object utilizing the set of rules set during initialization.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Object[]}
   */
  analyze: function (sord) {
    var me = this,
        results = [],
        max = me.rules.length,
        i, rule, result, hitCount, missCount;

    me.logger.enter("analyze", { objId: sord.id, name: String(sord.name), rulesCount: me.rules.length });

    for (i = 0; i < max; i++) {
      rule = me.rules[i];
      result = me.analyzeRule(sord, rule);
      if (result) {
        results.push(result);
      }
    }

    hitCount = me.countHits(results);
    missCount = max - hitCount;

    me.logger.exit("analyze", { hits: hitCount, misses: missCount, result: results });

    return results;
  },

  /**
   * @private
   * Analyze an individual rule.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} rule
   * @return {Object}
   */
  analyzeRule: function (sord, rule) {
    var me = this,
        result = {},
        localRuleCopy = JSON.parse(JSON.stringify(rule)),
        isoDatefromSord, isoDate, sordFilingDate, lastExecution, sanitizedIsoDate;

    if (localRuleCopy.date) {
      isoDatefromSord = sol.common.SordUtils.getValue(sord, localRuleCopy.date);
      isoDate = isoDatefromSord;
    } else if (localRuleCopy.noAdditionalDateCheck === true) {
      isoDate = me._todayIso;
    }

    if (isoDatefromSord && localRuleCopy.execution && (localRuleCopy.execution.type === "MAP")) {
      // enhance rule.execution to enable new reminder after the sord date, which should be checked, was altered
      localRuleCopy.execution.key = localRuleCopy.execution.key + "_" + isoDatefromSord;
    }

    if (!isoDate) {
      me.logger.debug(["skip rule: date has no value", localRuleCopy.date]);
      return null;
    }

    sordFilingDate = sol.common.DateUtils.dateToIso(sol.common.DateUtils.isoToDate(sord.IDateIso), { startOfDay: true });
    lastExecution = me.checkExecution(sord, localRuleCopy.execution);

    if (lastExecution && !localRuleCopy.recur) {
      me.logger.debug(["skip rule: was already executed (execution={0})", lastExecution]);
      return null;
    }

    me.logger.debug("analyze rule: " + sol.common.JsonUtils.stringifyAll(localRuleCopy));

    if (localRuleCopy.shift) {
      isoDate = me.shiftIso(sord, isoDate, localRuleCopy.shift);
    }

    if (localRuleCopy.recur) {
      if (!localRuleCopy.execution) {
        throw "reoccuring rules need to define an 'execution' property";
      }
      if (lastExecution) {
        isoDate = lastExecution;
        do { // prevent useless reminders from before the element was in the repository
          isoDate = me.shiftIso(sord, isoDate, localRuleCopy.recur);
        }
        while (isoDate < sordFilingDate);
      }
      result.nextRun = me.shiftIso(sord, isoDate, localRuleCopy.recur);
      lastExecution = isoDate;
    }

    me.logger.debug(["check date: {0}", isoDate]);

    if (isoDate && (isoDate <= me._todayIso)) {
      me.updateExecution(sord, localRuleCopy.execution, lastExecution);
      sanitizedIsoDate = me.sanitizeIsoDate(isoDate, sordFilingDate);
      if (sanitizedIsoDate >= sordFilingDate) {
        result.action = localRuleCopy.action;
        me.logger.debug("check was successful", localRuleCopy);
      } else {
        me.logger.debug("skip action because date is before sord filing date");
      }
    } else {
      result.nextRun = isoDate;
      me.logger.debug("check was not successful", localRuleCopy);
    }

    if (result.action) {
      me.logger.debug(["found action: {0}", sol.common.JsonUtils.stringifyAll(result.action)]);
    }
    if (result.nextRun) {
      me.logger.debug(["next run scheduled for '{0}'", result.nextRun]);
    }

    return result;
  },

  /**
   * @private
   * Shifts an ISO date. Uses {@link sol.common.DateUtils DateUtils} and {@link sol.common_monitoring.as.MonitorUtils MonitorUtils} internally
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} isoDate
   * @param {Object} params See {@link sol.common_monitoring.as.MonitorUtils#evalDateUnitConfig evalDateUnitConfig}
   * @return {String}
   */
  shiftIso: function (sord, isoDate, params) {
    var dateUtils = sol.common.DateUtils,
        shiftCfg = sol.common_monitoring.as.MonitorUtils.evalDateUnitConfig(sord, params),
        date = dateUtils.isoToDate(isoDate + "");
    date = dateUtils.shift(date, shiftCfg.value, { unit: shiftCfg.unit });
    return dateUtils.dateToIso(date);
  },

  /**
   * @private
   * Retrieves the value of an earlier execution depending on a given configuration.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} execution
   * @return {String}
   */
  checkExecution: function (sord, execution) {
    if (execution) {
      return sol.common.SordUtils.getValue(sord, execution);
    }
    return null;
  },

  /**
   * @private
   * Updates the value of the current execution depending on a given configuration.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} execution
   * @param {String} date An ISO date to set according to `execution`
   */
  updateExecution: function (sord, execution, date) {
    var me = this,
        mapitems;
    if (!execution) {
      return;
    }
    execution.value = date || me._todayIso;
    mapitems = sol.common.SordUtils.updateSord(sord, [execution]);
    if (mapitems && mapitems.length > 0) {
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, sord.id, sord.id, mapitems, LockC.NO);
    }
  },

  /**
   * @private
   * Counts the results, that where a hit. A hit is marked by a result, containing an action.
   * @param {Object[]} results
   * @return {Number}
   */
  countHits: function (results) {
    var hitCount = 0,
        i, max;
    for (i = 0, max = results.length; i < max; i++) {
      if (results[i].action) {
        hitCount++;
      }
    }
    return hitCount;
  },

  /**
   * @private
   * Fills isoDate to the correct amount of digigt to prevent the fail of a check.
   * @param {String} isoDate
   * @param {String} verificationDate
   * @return {String}
   */
  sanitizeIsoDate: function (isoDate, verificationDate) {
    if (String(isoDate).length === 8 && String(verificationDate).length === 14) {
      isoDate += "000000";
    }
    return isoDate;
  }

});
