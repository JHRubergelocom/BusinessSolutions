//@include lib_class.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.SordProvider.js
//@include lib_sol.meeting.ix.Meeting.js


/**
 * @requires sol.common.SordProvider
 * @requires sol.meeting.entity.Meeting
 */
sol.define("sol.meeting.ix.MeetingRepository", {

  singleton: true,

  _optimized: {},

  /**
   * @private
   * @property {sol.common.Cache} cache This contains the already loaded references
   */
  referenceCache: sol.create("sol.common.Cache"),

  findMeeting: function (id, output, optimizationName) {
    var me = this;
    return sol.common.RepoUtils.isRepoId(id)
      ? me.findMeetingById(id, output, optimizationName)
      : me.findMeetingByRef(id, output, optimizationName);
  },

  /**
     *
     * @param {*} id
     * @param {*} output
     * @param {*} outputOptimizationName
     * @returns {sol.meeting.entity.Meeting} meeting object
     */
  findMeetingById: function (id, output, optimizationName) {
    var me = this, meeting, cfg, result;

    cfg = {
      ids: [id],
      output: output
    };

    result = sol.common.SordProviderUtils
      .runOptimized(cfg, me._optimized, optimizationName, { copy: false });

    if (result.sords.length == 0) {
      throw Error("meeting object was not found id=" + id);
    }

    meeting = sol.create("sol.meeting.entity.Meeting", { data: result.sords[0] });

    if (meeting.guid && !me.referenceCache.containsKey(meeting.getReference())) {
      me.logger.info(["Meeting Reference Cache: put key={0} into reference cache", meeting.getReference()]);
      me.referenceCache.put(meeting.getReference(), meeting.guid);
    }

    return meeting;
  },

  /**
     *  @returns {sol.meeting.entity.Meeting} meeting object
     */
  findMeetingByRef: function (ref, output, optimizationName) {
    var me = this, meeting, guid, cacheInvalid = false, cfg, result;

    if (me.referenceCache.containsKey(ref)) {
      me.logger.info(["Meeting Reference Cache: read key={0} from cache, value={1}", ref, guid]);
      guid = me.referenceCache.get(ref);
      meeting = me.findMeetingById(guid, output, optimizationName);

      if (!meeting) {
        cacheInvalid = true;
        me.logger.warn(["Reference cache seems to be invalid. Try to find sord by ref {0}", ref]);
      }

    }

    if (!meeting) {
      // If meeting could not retreived by cache we have to search by reference
      cfg = {
        masks: ["Meeting"],
        search: [
          { type: "GRP", key: "SOL_TYPE", value: "MEETING" },
          { type: "GRP", key: "MEETING_REFERENCE", value: ref }
        ],
        output: output
      };
      result = sol.common.SordProviderUtils
        .runOptimized(cfg, me._optimized, optimizationName, { copy: false });

      if (result.sords.length == 0) {
        throw Error("meeting object was not found ref=" + ref);
      }

      meeting = sol.create("sol.meeting.entity.Meeting", { data: result.sords[0] });

      // cache is invalid when the cache is invalid (with a reference/guid pair we couldn't find the regular object)
      if (meeting.guid && (cacheInvalid === true || !me.referenceCache.containsKey(meeting.getReference()))) {
        me.logger.info(["put key={0} into cache", meeting.getReference()]);
        me.referenceCache.put(meeting.getReference(), meeting.guid);
      }
    }

    return meeting;
  },

  findParticipants: function (meetingRef, output, optimizationName, options) {
    var me = this;

    if (!meetingRef) {
      throw Error("meetingRef must be set to find participants of the meeting");
    }

    return sol.common.SordProviderUtils
            .create({ options: options, optimizationCache: me._optimized, optimizationName: optimizationName })
            .addMasks("Meeting Participant")
            .addSearchCriteria("SOL_TYPE", ["PARTICIPANT"])
            .addSearchCriteria("MEETING_REFERENCE", meetingRef)
            .addOutputs(output)
            .run({ copy: false });
  },

  /**
     *
     * @param {String} id objId of the meeting
     * @returns
     */
  findMeetingItemListFolder: function (id) {
    if (!id) {
      throw Error("`id` prop is missing in `sol.meeting.ix.MeetingRepository.findMeetingItemListFolder`");
    }
    return sol.common.IxUtils.execute("RF_sol_meeting_function_FindMeetingItemListFolder", {
      objId: id
    });
  }
});