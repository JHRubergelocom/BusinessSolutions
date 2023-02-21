/**
 * Analyzes, if an object is obsolete by checking if a specified retention time is exceeded.
 *
 * This analyzer does that, by checking the objects (and possible children) changed date. If all changes are older then the minimum age an action will be executed.
 *
 *     var analyzer = sol.create("sol.common_monitoring.as.analyzers.RetentionAnalyzer", {
 *       retention: { value: 2, unit: "M" },
 *       action: { type: "WORKFLOW", templateId: "TestMonitoring", user: "Administrator" }
 *     });
 *
 * For possible retention configuration see {@link sol.common_monitoring.as.MonitorUtils#evalDateUnitConfig}.
 *
 * The action needs to be specified, because analysers are responsible for determining the actions. This special analyzer just returns exactely one ore no action.
 *
 * @eloas
 *
 * @requires sol.common.DateUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common_monitoring.as.MonitorUtils
 */
sol.define("sol.common_monitoring.as.analyzers.RetentionAnalyzer", {

  requiredConfig: ["retention", "action"],

  /**
   * @cfg {Object} retention Configuration to determine, if an object is obsolete or not (see {@link sol.common_monitoring.as.MonitorUtils#evalDateUnitConfig})
   * @cfg {String} retention.type (optional)
   * @cfg {String} retention.key (optional)
   * @cfg {Number} retention.value (optional)
   * @cfg {String|Object} retention.unit (optional)
   * @cfg {String} retention.unit.type (optional)
   * @cfg {String} retention.unit.key (optional)
   */

  /**
   * @cfg {Object} action
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    me._todayIso = sol.common.DateUtils.dateToIso(new Date());
  },

  /**
   * Analyzes if the object and all children are older than a specified retention time.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Object[]}
   */
  analyze: function (sord) {
    var me = this,
        results = [],
        latestChange, latestChildChangedDate, nextRun;

    me.logger.enter("analyze", { objId: sord.id, name: String(sord.name) });

    latestChange = me.retrieveChangedDate(sord);
    latestChildChangedDate = me.retrieveOldestChildrenChangedDate(sord);
    if (latestChildChangedDate && (latestChange.getTime() < latestChildChangedDate.getTime())) {
      latestChange = latestChildChangedDate;
    }
    me.logger.debug(["last change: {0}", latestChange]);

    if (me.isObsolete(sord, latestChange)) {
      results.push({ action: me.action });
      me.logger.info(["retention exceeded: objId={0}, latestChange={1}", sord.id, latestChange]);
    } else {
      nextRun = me.calculateNextCheck(sord, latestChange, true);
      results.push({ nextRun: nextRun });
      me.logger.info(["retention not exceeded: objId={0}, nextPossibleRetention={1};", sord.id, nextRun]);
    }

    me.logger.exit("analyze", results);

    return results;
  },

  /**
   * @private
   * Retrieves an objects last changed date.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Date}
   */
  retrieveChangedDate: function (sord) {
    return sol.common.DateUtils.isoToDate(sord.TStamp + "");
  },

  /**
   * @private
   * Retrieves the most current last changed date of all children.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Date}
   */
  retrieveOldestChildrenChangedDate: function (sord) {
    var me = this,
        findOptions = new FindOptions(),
        changedDate = null,
        children;

    findOptions.orderBy = "objtstamp DESC";
    findOptions.totalCount = 1;

    children = sol.common.RepoUtils.findChildren(sord.id, {
      includeFolders: true,
      includeDocuments: true,
      sordZ: SordC.mbLean,
      recursive: true,
      level: -1,
      findOptions: findOptions
    });

    if (children && (children.length === 1)) {
      changedDate = me.retrieveChangedDate(children[0]);
      me.logger.debug(["latest changed child: objId={0}; name={1}, changed={2}", children[0].id, children[0].name, changedDate]);
    }
    return changedDate;
  },

  /**
   * @private
   * Calculates the date on which the next check should occur using {@link #retention} and `latestChange`.
   * @param {de.elo.ix.client.Sord} sord Used to determine the retention (if it depends on indexfields)
   * @param {Date} latestChange The most current change of the object (or any child)
   * @param {Boolean} [resultWithoutTime=false] (optional) Defines, if the resutling ISO string should contain tzhe time or not
   * @return {String}
   */
  calculateNextCheck: function (sord, latestChange, resultWithoutTime) {
    var me = this,
        distance = sol.common_monitoring.as.MonitorUtils.evalDateUnitConfig(sord, me.retention),
        checkDate;

    checkDate = sol.common.DateUtils.shift(latestChange, distance.value, { unit: distance.unit });

    return sol.common.DateUtils.dateToIso(checkDate, { withoutTime: resultWithoutTime });
  },

  /**
   * @private
   * Checks, if an date (`latestChange`) has exceeded the retention time.
   * @param {de.elo.ix.client.Sord} sord Used to determine the retention (if it depends on indexfields)
   * @param {Date} latestChange The most current change of the object (or any child)
   * @return {Boolean}
   */
  isObsolete: function (sord, latestChange) {
    var me = this,
        nextCheck = me.calculateNextCheck(sord, latestChange);

    me.logger.debug(["check retention: object would expire at {0}", nextCheck]);

    return nextCheck < me._todayIso;
  }

});
