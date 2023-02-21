/**
 * Performs an automatic checkout of visitors.
 *
 * Which visitors will be checked out, can be defined by an offset in days via configuration file.
 *
 * @eloas
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.IxUtils
 */
sol.define("sol.visitor.as.AutoCheckOut", {

  initialize: function (config) {
    var me = this;

    me.$super("sol.Base", "initialize", [config]);
    me.config = sol.create("sol.common.Config", { compose: "/visitor/Configuration/visitor.config" }).config;
  },

  process: function () {
    var me = this,
        offset, expiredVisitors;

    offset = me.getOffset();

    expiredVisitors = me.retrieveExpiredVisitors(offset);

    if (expiredVisitors && expiredVisitors.length > 0) {
      expiredVisitors.forEach(me.checkoutVisitor, me);
    }
  },

  /**
   * Get offset from config.
   * @return {Number}
   */
  getOffset: function () {
    var me = this;
    return (me.config.visitor.autoCheckOut && (typeof me.config.visitor.autoCheckOut.offsetInDays === "number")) ? me.config.visitor.autoCheckOut.offsetInDays : 0;
  },

  /**
   * Search all expired (checked in and older then offset) visitors
   * @param {Number} offset
   * @return {de.elo.ix.client.Sord[]}
   */
  retrieveExpiredVisitors: function (offset) {
    var checkedInVisitors,
        expiredVisitors;

    checkedInVisitors = sol.common.RepoUtils.findSords({
      objKeysObj: {
        SOL_TYPE: "VISITOR",
        VISITOR_STATUS: "CI*"
      }
    });

    expiredVisitors = checkedInVisitors.filter(function (visitor) {
      var expired = false,
          arrivalIso, arrival, checkDate;

      arrivalIso = sol.common.SordUtils.getObjKeyValue(visitor, "VISITOR_ARRIVALDATE");
      arrival = (arrivalIso) ? sol.common.DateUtils.isoToMoment(arrivalIso, { startOfDay: true }) : null;

      if (arrival) {
        checkDate = moment().subtract(offset, "days");
        expired = arrival.isBefore(checkDate, "days") || arrival.isSame(checkDate, "days");
      }

      return expired;
    });

    return expiredVisitors;
  },

  /**
   * Checkout visitor
   * @param {de.elo.ix.client.Sord} visitor
   */
  checkoutVisitor: function (visitor) {
    var me = this;
    try {
      sol.common.IxUtils.execute("RF_sol_visitor_action_CheckOutVisitor", {
        visitorObjId: visitor.id,
        interactive: false
      });
    } catch (ex) {
      me.logger.error(["could not auto checkout visitor '{0}' ({1})", visitor.name, visitor.id], ex);
    }
  }

});
