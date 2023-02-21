
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.RepoUtils.js

var logger = sol.create("sol.Logger", {
  scope: "sol.meeting.Utils"
});


/**
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.ObjectUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.RepoUtils
 *
 */
sol.define("sol.meeting.Utils", {
  singleton: true,

  masks: {
    MEETING_BOARD: "Meeting Board",
    MEETING: "Meeting"
  },

  solTypes: {
    MEETING: "MEETING"
  },

  fields: {
    meeting: {
      status: "objKeys.MEETING_STATUS",
      meetingBoardReference: "objKeys.MEETING_BOARD_REFERENCE"
    }
  },

  /**
     * Return true if the passed templateSord object has the mask "Meeting"
     *  and SOL_TYPE === Meeting Board
     * @param {Object} templateSord
     * @returns {Boolean}
     */
  isMeeting: function (templateSord) {
    var me = this;
    logger.info(["checks meetings {0} , {1}", JSON.stringify(me.masks), JSON.stringify(templateSord)]);
    return templateSord && templateSord.maskName === me.masks.MEETING
      && templateSord.objKeys.SOL_TYPE === me.solTypes.MEETING;
  },

  hasMeetingStatus: function (meeting, status) {
    var me = this;

    return status
      ? me.getMeetingStatus(meeting) == status
      : !!me.getMeetingStatus(meeting);
  },

  getMeetingStatus: function (meeting) {
    var me = this;

    return sol.common.ObjectUtils.getProp(meeting, me.fields.meeting.status).split(" - ")[0];
  },

  getMeetingBoardFromMeeting: function (meeting) {
    var me = this;

    return me.getFormattedSord(
      sol.common.RepoUtils.getSord(
        me.getMeetingBoardReferenceFromMeeting(meeting)
      )
    );
  },

  getMeetingBoardReferenceFromMeeting: function (meeting) {
    var me = this;

    return sol.common.ObjectUtils.getProp(
      meeting,
      me.fields.meeting.meetingBoardReference
    );
  },

  getFormattedSord: function (sord) {
    return sord ?
      sol.common.ObjectFormatter.format({
        sord: {
          formatter: "sol.common.ObjectFormatter.TemplateSord",
          data: sord,
          config: {
            sordKeys: ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName"],
            allMapFields: true
          }
        }
      }).sord
      : null;
  }

});