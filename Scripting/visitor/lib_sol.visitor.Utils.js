
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * Visitor management utilities
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.DateUtils
 */
sol.define("sol.visitor.Utils", {
  singleton: true,

  LONG_TERM_BADGE: {
    FIELDS: {
      SOL_TYPE: "SOL_TYPE",
      STATUS: "LONGTERM_BADGE_STATUS",
      LONGTERM_BADGE_VALID_FROM: "LONGTERM_BADGE_VALID_FROM",
      LONGTERM_BADGE_VALID_UNTIL: "LONGTERM_BADGE_VALID_UNTIL",
      RESPONSIBLEEMPLOYEE: "VISITOR_RESPONSIBLEEMPLOYEE"
    },
    SOL_TYPE: "LONG_TERM_BADGE",
    STATUS: {
      ACTIVE: "ACTIVE",
      NOT_ACTIVE: "DEACTIVATED"
    }
  },

  /**
   * Loads the configuration from the JSON file: `/Administration/Business Solutions/visitor/Configuration/visitor.config`
   * @return {Object}
   */
  loadConfig: function () {
    return sol.create("sol.common.Config", { compose: "/visitor/Configuration/visitor.config" }).config;
  },

  /**
   * Checks, if an element is from type visitor
   * @param {de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  isVisitor: function (sord) {
    var me = this,
        solType;

    solType = String(sol.common.SordUtils.getObjKeyValue(sord, "SOL_TYPE") || "");

    return sol.common.SordUtils.isSord(sord) && (me.loadConfig().visitor.typeOfVisitors.indexOf(solType) > -1);
  },

  /**
   * Checks, if an element is from type long-term bagde
   * @param {de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  isLongtermBadge: function (sord) {
    var me = this,
        solType;

    solType = String(sol.common.SordUtils.getObjKeyValue(sord, "SOL_TYPE") || "");

    return (sol.common.SordUtils.isSord(sord) && (solType == me.LONG_TERM_BADGE.SOL_TYPE));
  },

  /**
   * Checks, if a long-term badge is active
   * @param {de.elo.ix.client.Sord} longtermBadge
   * @return {Boolean}
   */
  isLongtermBadgeActive: function (longtermBadge) {
    var me = this,
        status;

    status = String(sol.common.SordUtils.getObjKeyValue(longtermBadge, me.LONG_TERM_BADGE.FIELDS.STATUS) || "");

    return (status == me.LONG_TERM_BADGE.STATUS.ACTIVE);
  },

  /**
   * Checks, if a long-term badge is currently valid
   * @param {de.elo.ix.client.Sord} longtermBadge
   * @return {Boolean}
   */
  isLongtermBadgeInValidTimerange: function (longtermBadge) {
    var me = this,
        validFromIso, validToIso, validFrom, validTo;

    validFromIso = sol.common.SordUtils.getObjKeyValue(longtermBadge, me.LONG_TERM_BADGE.FIELDS.LONGTERM_BADGE_VALID_FROM);
    validToIso = sol.common.SordUtils.getObjKeyValue(longtermBadge, me.LONG_TERM_BADGE.FIELDS.LONGTERM_BADGE_VALID_UNTIL);

    validFrom = (validFromIso) ? sol.common.DateUtils.isoToDate(validFromIso) : null;
    validTo = (validToIso) ? sol.common.DateUtils.isoToDate(validToIso) : null;

    return sol.common.DateUtils.isBetween(validFrom, validTo);
  },

  /**
   * Searches the repository hierarchy to find the parent visitor (if there is any).
   * @param {String} objId
   * @return {de.elo.ix.client.Sord}
   */
  getParentVisitor: function (objId) {
    var me = this,
        sord = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO),
        isVisitor = me.isVisitor(sord);

    if (!isVisitor && sord.id !== 1) {
      return me.getParentVisitor(sord.parentId);
    }
    return (isVisitor) ? sord : null;
  }

});
