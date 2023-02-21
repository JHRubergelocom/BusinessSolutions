

importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.DateUtils.js

/**
 * AgendaSchedulare calculate or recalculate the given item list of an day.
 *
 * Currently the class is usage for recuring items so we can calculate the right
 * timing informations. The calculation is straight simple at the moment because we only
 * calculate the duration on top of each start time of an item to calculate the end time.
 *
 * In future the schedule should get more complex features like insert an item to an already prepared
 * agenda items or insert to an existing container and so on.
 *
 */
sol.define("sol.meeting.ix.AgendaScheduler", {

  requiredConfig: ["startTime"],

  /**
   * @cfg meeting {TemplateSord}
   */

  /**
   * @cfg items {TemplateSord}
   */

  /**
   * @private
   * */
  DEFAULT_TIME_FORMATTER: "HH:mm",

   schedule: function () {
     var me = this,
      items = me.getItems();

    if (sol.common.ObjectUtils.isArray(items) && items.length > 0) {
      // calculate foreach item start and enddate
      items.reduce(me.calculateItem.bind(me), me.getStartDate());
    }

     return items;
   },

   calculateItem: function (time, item) {
    var me = this,
      start = time,
      end = me.calculateEndTime(time, item);

    item.objKeys.MEETING_ITEM_START = String(start.format(me.DEFAULT_TIME_FORMATTER));
    item.objKeys.MEETING_ITEM_END = String(end.format(me.DEFAULT_TIME_FORMATTER));

    return end;
   },

   calculateEndTime: function (time, item) {
    var duration, startTime;

    duration = +item.objKeys.MEETING_ITEM_DURATION || 0;
    startTime = sol.common.DateUtils.of(time);
    // when endTime could not be calculated then use startTime as fallback
    return startTime ? startTime.add(duration, "minutes") : startTime;
   },

   getStartDate: function () {
      return sol.common.DateUtils.createMoment(this.startTime, "HH:mm");
   },

   getItems: function () {
     return this.items;
   }

});