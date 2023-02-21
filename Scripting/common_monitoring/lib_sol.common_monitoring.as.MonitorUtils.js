
//@include lib_Class.js

/**
 * Utility methods for the monitoring modul.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.02.000
 *
 * @eloas
 * @requires moment
 * @requires sol.commom.SordUtils
 * @requires sol.common.DateUtils
 */
sol.define("sol.common_monitoring.as.MonitorUtils", {
  singleton: true,

  // config for `registerUpdate`
  // Is duplicated in {@link sol.common_monitoring.ix.MonitorUtils} due to compatibility reasons. All changes schould be reflected there.
  queueId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/_global/Job queue",
  timestampBufferValue: -5,
  timestampBufferUnit: "s",

  /**
   * Evaluates a Sord and a configuration to determine a value and a unit.
   *
   * If no value was found, it will be set so `0` as default.
   * If no unit was found, it will be left blank.
   *
   *     { value: 10 }
   *     { value: 10, unit: "Y" }
   *     { value: 10, unit: { type: "GRP", key: "MY_UNIT" } }
   *     { type: "GRP", key: "MY_DATE" }
   *     { type: "GRP", key: "MY_DATE", unit: "Y" }
   *     { type: "GRP", key: "MY_DATE", unit: { type: "GRP", key: "MY_UNIT" } }
   *
   * The followig call
   *
   *      sol.common_monitoring.as.MonitorUtils.evalDateUnitConfig(sord, { value: 10, unit: "Y" });
   *
   * would just return the two fix values
   *
   *      { value: 10, unit: "Y" }
   *
   * while this call
   *
   *     sol.common_monitoring.as.MonitorUtils.evalDateUnitConfig(sord, { type: "GRP", key: "MY_DATE", unit: { type: "GRP", key: "MY_UNIT" } });
   *
   * would read the resulting `value` from the indexfield `MY_DATE` and the `unit` from the indexfield `MY_UNIT`.
   *
   * If the field holding the unit is filled by a localized keyword list, it will contain values like 'd - days'.
   * Therefor the function analyses the unit and if it contains any `-` the key (string befor the `-`) will be extracted and used.
   *
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} config
   * @return {Object} Returns an object with the two attributes: `value` and `unit`
   */
  evalDateUnitConfig: function (sord, config) {
    var me = this,
        result = {};

    if (config.type && config.key) {
      result.value = sol.common.SordUtils.getValue(sord, config) + "";
    } else {
      result.value = config.value;
    }

    if (!result.value) {
      result.value = 0;
    }

    if (config.unit && config.unit.type && config.unit.key) {
      result.unit = sol.common.SordUtils.getValue(sord, config.unit) + "";
      result.unit = me.getLocalizedKwlKey(result.unit);
    } else {
      result.unit = config.unit;
    }

    return result;
  },

  /**
   * @private
   * Extracts the unit, if the value was set from a localized keyword list.
   * @param {String} str
   * @return {String}
   */
  getLocalizedKwlKey: function (str) {
    var separator = "-",
        part, separatorPos;
    if (!str) {
      part = "";
    } else {
      separatorPos = str.indexOf(separator);
      if (separatorPos < 0) {
        part = str;
      } else {
        part = str.substring(0, separatorPos).trim();
      }
    }
    return part;
  },

  /**
   * Register object to be updated by the `JobQueue` rule.
   * Registration will be skipped if element is in chaos cabinet.
   *
   * Is duplicated by {@link sol.common_monitoring.ix.MonitorUtils} due to compatibility reasons. All changes schould be reflected there.
   * @param {String} objId
   * @param {String} wfTemplate
   */
  registerUpdate: function (objId, wfTemplate) {
    var me = this,
        qId, updatedSord, now, utcDate, isoDate, mapKeys;

    qId = ixConnect.ix().checkoutSord(me.queueId, SordC.mbOnlyId, LockC.NO).id;
    updatedSord = ixConnect.ix().checkoutSord(objId, SordC.mbMin, LockC.NO);

    if (updatedSord.parentId !== 0) {
      now = new Date();
      utcDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
      isoDate = sol.common.DateUtils.shift(utcDate, me.timestampBufferValue, { unit: me.timestampBufferUnit });

      mapKeys = [
        new KeyValue("SOL_UPDATE_WF_TEMPLATE." + objId, wfTemplate),
        new KeyValue("SOL_UPDATE_TIMESTAMP." + objId, sol.common.DateUtils.dateToIso(isoDate))
      ];
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, qId, qId, mapKeys, LockC.NO);

      ixConnect.ix().refSord(null, qId, objId, -1);

      me.logger.info(["registered element for update (objId={0})", objId]);
    } else {
      me.logger.warn(["element is in chaos cabinet; skip register element for update (objId={0})", objId]);
    }

  }

});
