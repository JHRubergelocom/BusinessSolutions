
//@include lib_Class.js

/**
 * Utility methods for the monitoring modul.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.02.001
 *
 * @eloix
 * @requires moment
 * @requires sol.commom.SordUtils
 * @requires sol.common.DateUtils
 */
sol.define("sol.common_monitoring.ix.MonitorUtils", {
  singleton: true,

  // config for `registerUpdate`
  // Duplicates {@link sol.common_monitoring.as.MonitorUtils} due to compatibility reasons. All changes schould be reflected there.
  queueId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/_global/Job queue",
  timestampBufferValue: -5,
  timestampBufferUnit: "s",

  /**
   * Register object to be updated by the `JobQueue` rule.
   * Registration will be skipped if element is in chaos cabinet.
   *
   * Duplicates {@link sol.common_monitoring.as.MonitorUtils} due to compatibility reasons. All changes schould be reflected there.
   * @param {String} objId
   * @param {String} wfTemplate
   */
  registerUpdate: function (objId, wfTemplate) {
    var me = this,
        qId, updatedSord, now, utcDate, isoDate, mapKeys;

    qId = ixConnectAdmin.ix().checkoutSord(me.queueId, SordC.mbOnlyId, LockC.NO).id;
    updatedSord = ixConnectAdmin.ix().checkoutSord(objId, SordC.mbMin, LockC.NO);

    if (updatedSord.parentId !== 0) {
      now = new Date();
      utcDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
      isoDate = sol.common.DateUtils.shift(utcDate, me.timestampBufferValue, { unit: me.timestampBufferUnit });

      mapKeys = [
        new KeyValue("SOL_UPDATE_WF_TEMPLATE." + objId, wfTemplate),
        new KeyValue("SOL_UPDATE_TIMESTAMP." + objId, sol.common.DateUtils.dateToIso(isoDate))
      ];
      ixConnectAdmin.ix().checkinMap(MapDomainC.DOMAIN_SORD, qId, qId, mapKeys, LockC.NO);

      ixConnectAdmin.ix().refSord(null, qId, objId, -1);

      me.logger.info(["registered element for update (objId={0})", objId]);
    } else {
      me.logger.warn(["element is in chaos cabinet; skip register element for update (objId={0})", objId]);
    }

  }

});
