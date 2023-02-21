
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting_ms365.ix.functions.CreateUpdateEvent" });

/**
 * Creates a Teams event
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.meeting_ms365.ix.functions.CreateUpdateEvent", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  process: function () {
    var me = this,
        events = [],
        paramsTpl, params, event, meetingSord, meetingTplSord, i, j, keyValue, mode;

    paramsTpl = {
      body: {
        contentType: "HTML"
      },
      start: {
      },
      end: {
      },
      location: {
      },
      attendees: [],
      organizer: {
        emailAddress: {
          address: ""
        }
      },

      isOnlineMeeting: true,
      onlineMeetingProvider: "TEAMS_FOR_BUSINESS"
    };

    meetingSord = sol.common.RepoUtils.getSord(me.objId);
    meetingTplSord = sol.common.WfUtils.getTemplateSord(meetingSord, me.flowId).sord;

    params = sol.common.ObjectUtils.clone(paramsTpl);

    for (i = 1; i <= 2000; i++) {
      if (!meetingTplSord.mapKeys["MEETING_TIMESLOT_DAY" + i]) {
        break;
      }

      params.subject = meetingTplSord.objKeys.MEETING_NAME;

      params.body.content = meetingTplSord.desc;

      params.start.dateTime = me.convertToLocalDateTime(meetingTplSord.mapKeys["MEETING_TIMESLOT_DAY" + i], meetingTplSord.mapKeys["MEETING_TIMESLOT_START" + i]);
      params.start.timeZone = meetingTplSord.mapKeys.MS365_TIMEZONE;

      params.end.dateTime = me.convertToLocalDateTime(meetingTplSord.mapKeys["MEETING_TIMESLOT_DAY" + i], meetingTplSord.mapKeys["MEETING_TIMESLOT_END" + i]);
      params.end.timeZone = meetingTplSord.mapKeys.MS365_TIMEZONE;

      params.location.displayName = meetingTplSord.objKeys.MEETING_LOCATION;

      params.organizer.emailAddress.address = meetingTplSord.mapKeys.MS365_EVENT_ORGANIZER_EMAIL_ADDRESS;

      for (j = 1; j <= 2000; j++) {
        if (!meetingTplSord.wfMapKeys["MEETING_PERSON_EMAIL" + j]) {
          break;
        }

        params.attendees.push({
          emailAddress: {
            address: meetingTplSord.wfMapKeys["MEETING_PERSON_EMAIL" + j],
            name: meetingTplSord.wfMapKeys["MEETING_PERSON_FIRSTNAME" + j] + " " + meetingTplSord.wfMapKeys["MEETING_PERSON_LASTNAME" + j]
          }
        });
      }

      if (meetingTplSord.mapKeys["MEETING_TIMESLOT_EXTERNAL_EVENT_ID" + i]) {
        mode = "Update";

        params.id = meetingTplSord.mapKeys["MEETING_TIMESLOT_EXTERNAL_EVENT_ID" + i];
        params.joinUrlContent = sol.common.SordUtils.getStringMapBlob({
          mapId: me.objId,
          key: "joinUrlContent" + i
        });

        event = sol.common.IxUtils.execute("RF_sol_connector_ms365_UpdateEvent", params);
      } else {
        mode = "Create";

        event = sol.common.IxUtils.execute("RF_sol_connector_ms365_CreateEvent", params);

        if (event.isOnlineMeeting) {
          sol.common.SordUtils.setStringMapBlob({
            mapId: me.objId,
            objId: me.objId,
            key: "joinUrl" + i,
            value: event.onlineMeeting.joinUrl
          });
        } else {
          logger.warn("isOnlineMeeting=false; please check onlineMeetingProvider=TEAMS_FOR_BUSINESS");
        }

        sol.common.SordUtils.setStringMapBlob({
          mapId: me.objId,
          objId: me.objId,
          key: "joinUrlContent" + i,
          value: event.joinUrlContent
        });
      }

      logger.info(mode + " Teams event: " + JSON.stringify(event));

      keyValue = new KeyValue("MEETING_TIMESLOT_EXTERNAL_EVENT_ID" + i, event.id);
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.objId, me.objId, [keyValue], LockC.NO);

      events.push(event);
    }

    logger.info("Results: " + JSON.stringify(events));

    return { result: events };
  },

  convertToLocalDateTime: function (isoDate, time) {
    var localDateTime;
    isoDate = isoDate || "";
    time = time || "";
    localDateTime = isoDate.substr(0, 4) + "-" + isoDate.substr(4, 2) + "-" + isoDate.substr(6, 2) + "T" + time + ":00";
    return localDateTime;
  }
});

/**
 * @member
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clientInfo, userId, diagram, nodeId) {
  var module, params;

  logger.enter("onExitNode_CreateUpdateEvent", { flowId: diagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId);

  params.clientInfo = clientInfo;
  params.objId = diagram.objId;
  params.flowId = diagram.id;
  module = sol.create("sol.meeting_ms365.ix.functions.CreateUpdateEvent", params);
  module.process();

  logger.exit("onExitNode_CreatUpdateEvent");
}
