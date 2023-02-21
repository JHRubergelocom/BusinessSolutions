/**
 * Collects all elements with a due date.
 *
 * Retrospection: searches for next run dates in the past, so it doesn't miss any object in case, one or more executions went wrong.
 *
 * The search can be limited to a specific mask by configuration.
 * The default retrospection time in days can be overridden by configuration.
 * The default field containing the due date can be overridden by configuration.
 *
 *     var collector = sol.create("sol.common_monitoring.as.collectors.NextRunCollector", {
 *       soltype: "CONTRACT"
 *       mask: "My Mask",
 *       retrospection: 27,
 *       nextRunField: "MY_DUE_DATE"
 *     });
 *
 * @eloas
 *
 * @requires sol.common.SordUtils
 * @requires sol.common.DateUtils
 */
sol.define("sol.common_monitoring.as.collectors.NextRunCollector", {

  /**
   * @cfg {String} [nextRunField="NEXT_RUN"] (optional) Spezifies, which field is used to search for the due items
   */

  /**
   * @cfg {Number} [retrospection=365] (optional) Spezifies, how long the rule looks back for next_run dates from now (in days) (see also {@link #defaultRetrospectionTime})
   */

  /**
   * @cfg {Number} [searchPeriodEndDays=0] (optional) Spezifies the end of the search period, e.g. `1` for `until yesterday`
   */

  /**
   * @cfg {String} mask (optional) If set, due items will be filtered by mask
   */

  /**
   * @cfg {String} soltype (optional) If set, due items will be filtered by solution type (GRP-field `SOL_TYPE`)
   */

  /**
   * @cfg {Object[]} additionalSearchCriteria (optional) additional criteria which will be used in the initial search for sords. multiple criterions will be "AND"ed
   * @cfg {Object} additionalSearchCriteria.Object the criterion
   * @cfg {String} additionalSearchCriteria.Object.key the GRP-field name
   * @cfg {String} additionalSearchCriteria.Object.value the value, which should be searched for
   */

  /**
   * @private
   * @property {String} defaultNextRunField
   */
  defaultNextRunField: "NEXT_RUN",

  /**
   * @private
   * @property {String} defaultRetrospectionTime
   */
  defaultRetrospectionTime: 365,

  /**
   * @private
   * @property {de.elo.ix.client.SordZ} defaultSordZ
   */
  defaultBatchSize: 1000,

  /**
   * @private
   * @property {de.elo.ix.client.SordZ} defaultSordZ
   */
  defaultSordZ: SordC.mbAllIndex,

  utils: {
    log: {
      findInfo: function (self, findInfo) {
        var findByIndex = (findInfo || {}).findByIndex || {},
            name = ((findByIndex.objKeys || [])[0] || {}).name,
            data = (((findByIndex.objKeys || [])[0] || {}).data || {})[0],
            maskId = findByIndex.maskId;

        self.logger.debug(["perform search: nextRunField={0}, lookupPeriod={1}, limitToMask={2}", name, data, maskId]);
      },
      postProcess: function (self, params) {
        params = params || {};
        self.logger.info([
          "update next run date(objId={0}, objKey={1}): oldValue='{2}', newValue='{3}'",
          (params.sord || {}).id,
          self.nextRunField,
          params.currentNextRunDate,
          params.newNextRunDate
        ]);
      }
    }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    me.nextRunField = (typeof me.nextRunField !== "undefined") ? me.nextRunField : me.defaultNextRunField;
    me.retrospection = (me.retrospection || (me.retrospection === 0)) ? me.retrospection : me.defaultRetrospectionTime;
    me.searchPeriodEndDays = (typeof me.searchPeriodEndDays !== "undefined") ? me.searchPeriodEndDays : 0;
    me._sordZ = me.defaultSordZ;
    me._batchSize = me.defaultBatchSize;
    me._findInfo = me.createFindInfo();
    me._hasMoreResults = true;
  },

  /**
   * Checks, if this collector has additional results.
   * @return {Boolean}
   */
  hasMoreResults: function () {
    var me = this;
    return me._hasMoreResults;
  },

  /**
   * Retrieves the next batch of work items.
   * @return {de.elo.ix.client.Sord[]}
   */
  getResults: function () {
    var me = this;

    me.logger.enter("getResults");

    me._workingSet = [];
    me._hasMoreResults = false;

    try {
      me.utils.log.findInfo(me, me._findInfo);

      if (!me._findResult) {
        me._idx = 0;
        me._findResult = ixConnect.ix().findFirstSords(me._findInfo, me._batchSize, me._sordZ);
      } else {
        me._findResult = ixConnect.ix().findNextSords(me._findResult.searchId, me._idx, me._batchSize, me._sordZ);
      }

      me._workingSet = me._findResult.sords;
      me._hasMoreResults = me._findResult.moreResults;
      me._idx += me._findResult.sords.length;

    } finally {
      if ((me._hasMoreResults === false) && me._findResult) {
        ixConnect.ix().findClose(me._findResult.searchId);
        me._findResult = null;
      }
    }

    me.logger.info(["return result batch: found {0} entries (hasMoreResults={1})", (me._workingSet || []).length, me._hasMoreResults]);
    me.logger.exit("getResults");

    return me._workingSet;
  },

  /**
   * Checks, if a result set contains any instruction for further executions (`nextRun`) and updates a sord with the most recent.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object[]} results The result object returned by an `analyzer`
   */
  postProcess: function (sord, results) {
    var me = this,
        newNextRunDate = "",
        postprocessingRequired = false,
        currentNextRunDate;

    me.logger.enter("postProcess");

    if (results && (results.length > 0)) {
      results.forEach(function (r) {
        if (r.nextRun) {
          newNextRunDate = (!newNextRunDate) ? r.nextRun : ((newNextRunDate < r.nextRun) ? newNextRunDate : r.nextRun);
          postprocessingRequired = true;
        }
      });
    }

    if (postprocessingRequired && me.nextRunField) {
      currentNextRunDate = sol.common.SordUtils.getObjKeyValue(sord, me.nextRunField);
      me.logger.debug(["next runs: currentNextRunDate={0}, newNextRunDate={1}", currentNextRunDate, newNextRunDate]);

      if (currentNextRunDate != newNextRunDate) {
        sol.common.SordUtils.setObjKeyValue(sord, me.nextRunField, newNextRunDate);
        ixConnect.ix().checkinSord(sord, me._sordZ, LockC.NO);

        me.utils.log.postProcess(me, { sord: sord, currentNextRunDate: currentNextRunDate, newNextRunDate: newNextRunDate });
      }
    } else {
      me.logger.debug("no 'nextRuns' defined, skip post processing");
    }

    me.logger.exit("postProcess");
  },

  /**
   * Performes cleanup by closeing the search and removing the current working set.
   */
  dispose: function () {
    var me = this;
    if (me._findResult) {
      ixConnect.ix().findClose(me._findResult.searchId);
      me._findResult = null;
    }
    me._workingSet = null;
  },

  /**
   * @private
   * Creates a FindInfo object for the search using {@link #nextRunField}, {@link #getLookupPeriod} and {@link #mask}.
   * @return {de.elo.ix.client.FindInfo}
   */
  createFindInfo: function () {
    var me = this,
        fi = new FindInfo(),
        fbi = new FindByIndex(),
        objKeys = [],
        nextRunObjKey = new ObjKey(),
        soltypeObjKey = new ObjKey();


    if (me.nextRunField) {
      nextRunObjKey.name = me.nextRunField;
      nextRunObjKey.data = [me.getLookupPeriod()];
      objKeys.push(nextRunObjKey);
    }

    if (me.mask) {
      fbi.maskId = me.mask;
    }

    if (me.soltype) {
      soltypeObjKey.name = "SOL_TYPE";
      soltypeObjKey.data = [me.soltype];
      objKeys.push(soltypeObjKey);
    }

    if (Array.isArray(me.additionalSearchCriteria)) {
      me.additionalSearchCriteria.forEach(function (criterion) {
        var objKey = new ObjKey();
        if (typeof criterion === "object" && criterion.key && (typeof criterion.value === "string")) {
          objKey.name = criterion.key;
          objKey.data = [criterion.value];
          objKeys.push(objKey);
        } else {
          throw "an additional search criterion must consist of an object having a key and a value property";
        }
      });
    } else if (me.additionalSearchCriteria !== undefined) {
      throw "parameter additionalSearchCriteria must be an array";
    }

    fbi.objKeys = objKeys;
    fi.findByIndex = fbi;
    return fi;
  },

  /**
   * @private
   * Calculates the lookup period for the search using {@link #retrospection}.
   * The period String has the following form:
   *
   *     "YYYYMMDD...YYYYMMDD"
   *
   * where the second ISO string is always the current date.
   * If {@link #retrospection} is set to 0, just the current date will be returned in ISO form.
   *
   * @return {String}
   */
  getLookupPeriod: function () {
    var me = this,
        isoPattern = "YYYYMMDD",
        isoFrom, isoNow, isoEnd, retrospectionDays, searchPeriodEndDays, searchPeriod;

    if (retrospectionDays === 0) {
      isoNow = sol.common.DateUtils.format(new Date(), isoPattern);
      return isoNow;
    }

    retrospectionDays = -Math.abs(me.retrospection);
    searchPeriodEndDays = -Math.abs(me.searchPeriodEndDays);

    isoFrom = sol.common.DateUtils.shift(new Date(), retrospectionDays, { pattern: isoPattern });
    isoEnd = sol.common.DateUtils.shift(new Date(), searchPeriodEndDays, { pattern: isoPattern });
    searchPeriod = isoFrom + "..." + isoEnd;
    return searchPeriod;
  }
});
