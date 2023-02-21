
describe("Create Meeting data", function () {
  var configAction, mbts, meetingDataConfig,
      originalTimeout, RFs, RFfunction, RFparams,
      RFresults, i, j, meetings, value, mapline,
      key, meetingBoardType, startDate, endDate,
      timeSlotDay, timeSlotStart, timeSlotEnd,
      timeSlotsDay, timeSlotsStart, timeSlotsEnd,
      meetingContactData, valueExist, dataline,
      mbtmembers, offsetMember,
      timeSlotCount, timeSlotDate, year, month,
      day, registerDeadLine, weekday, offsetDay,
      arraySlotDayOffsetDay, shiftValue, shiftUnit;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("create meetings", function () {
    it("get configuration from meetingData.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Configuration/meetingData.config"
        }).then(function success(configResult) {
          meetingDataConfig = configResult.config;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("meetingDataConfig.weekday must be available", function () {
      expect(meetingDataConfig.weekday).toBeDefined();
      weekday = meetingDataConfig.weekday;
    });
    it("meetingDataConfig.meetings must be available", function () {
      expect(meetingDataConfig.meetings).toBeDefined();
    });
    it("get meeting contact data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
          objId: 1,
          dynKwl: "sol.meeting.ix.dynkwl.MeetingContact",
          providerConfig: {},
          inputFieldName: "UNITTEST_FIELD2"
        }).then(function success(jsonResult) {
          if (jsonResult.error) {
            fail(jsonResult.error);
          } else {
            expect(jsonResult.keynames).toBeDefined();
            expect(jsonResult.header).toBeDefined();
            expect(jsonResult.title).toBeDefined();
            expect(jsonResult.data).toBeDefined();
            meetingContactData = jsonResult.data;
          }
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("find meetingboardTypes for all meetingboards", function (done) {
      RFs = [];
      RFfunction = "RF_sol_common_service_SordProvider";
      RFparams = {
        masks: ["Meeting Board"],
        search: [
          { key: "SOL_TYPE", value: "MEETING_BOARD" }
        ],
        output: {
          formatter: "sol.common.ObjectFormatter.TemplateSord",
          config: {
            mapKeys: ["MEETING_BOARD_MEETING_DEFAULT_NAME", "MEETING_BOARD_SETTING_DEADLINES_ACTIVATE", "MEETING_REGISTER_DEADLINE_SHIFT_VALUE", "MEETING_REGISTER_DEADLINE_SHIFT_UNIT"],
            descMaxLen: 120
          }
        },
        options: {
          optimization: "GetMeetingBoardTypes"
        }
      };
      RFs.push({ function: RFfunction, params: RFparams });
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteRFs", {
          RFs: RFs
        }).then(function success(jsonResult) {
          RFresults = jsonResult;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get members for all meetingboardTypes", function (done) {
      mbts = [];
      RFresults.forEach(function (result) {
        result.RFresult.sords.forEach(function (mbt) {
          mbts.push(mbt);
        });
      });
      RFs = [];
      mbts.forEach(function (mbt) {
        RFfunction = "RF_sol_meeting_service_GetMembers";
        RFparams = { objId: mbt.id };
        RFs.push({ function: RFfunction, params: RFparams });
      });
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteRFs", {
          RFs: RFs
        }).then(function success(jsonResult) {
          RFresults = jsonResult;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("start action create workflow for all meetings", function (done) {
      mbtmembers = [];
      RFresults.forEach(function (result) {
        mbtmembers.push(result.RFresult);
      });
      i = 0;
      mbtmembers.forEach(function (mbtmember) {
        mbts[i].mbtmember = mbtmember;
        i++;
      });

      RFs = [];
      meetings = [];
      meetingDataConfig.meetings.forEach(function (meeting) {
        mbts.forEach(function (mbt) {
          if (mbt.objKeys.MEETING_BOARD_CODE == meeting.objKeys.MEETING_BOARD_CODE) {
            meetingBoardType = mbt;
          }
        });
        meeting.meetingBoardType = meetingBoardType;
        meeting.deadlineshiftvalue = meetingBoardType.mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_VALUE;
        meeting.deadlineshiftunit = meetingBoardType.mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_UNIT;
        meetings.push(meeting);
        meetingBoardType.pathMeetingTypes = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meetings";
        if (meetingBoardType.objKeys.MEETING_PRODUCT_LINE == "Premium") {
          meetingBoardType.pathMeetingTypes = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting_premium/Configuration/Meetings";
        }
        configAction = {
          objId: meetingBoardType.id,
          $new: {
            target: {
              mode: "DEFAULT"
            },
            name: "New Meeting",
            template: {
              base: meetingBoardType.pathMeetingTypes,
              name: "Default"
            }
          },
          $name: "CreateMeeting",
          $metadata: {
            solType: "MEETING",
            owner: {
              fromConnection: true
            },
            objKeys: [
              {
                key: "MEETING_BOARD_NAME",
                value: meetingBoardType.objKeys.MEETING_BOARD_NAME
              },
              {
                key: "MEETING_BOARD_REFERENCE",
                value: meetingBoardType.guid
              },
              {
                key: "MEETING_PROVIDED_PROPOSALTYPES",
                value: meetingBoardType.objKeys.MEETING_PROVIDED_PROPOSALTYPES
              },
              {
                key: "MEETING_BOARD_CODE",
                value: meetingBoardType.objKeys.MEETING_BOARD_CODE
              },
              {
                key: "MEETING_NAME",
                value: meetingBoardType.mapKeys.MEETING_BOARD_MEETING_DEFAULT_NAME
              },
              {
                key: "MEETING_MINUTE_TAKER",
                value: meetingBoardType.objKeys.MEETING_BOARD_MINUTE_TAKER
              },
              {
                key: "MEETING_PRODUCT_LINE",
                value: meetingBoardType.objKeys.MEETING_PRODUCT_LINE
              }
            ],
            mapItems: [
              {
                key: "MEETING_REGISTER_DEADLINE_SHIFT_VALUE",
                value: meetingBoardType.mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_VALUE
              },
              {
                key: "MEETING_REGISTER_DEADLINE_SHIFT_UNIT",
                value: meetingBoardType.mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_UNIT
              },
              {
                key: "MEETING_BOARD_SETTING_DEADLINES_ACTIVATE",
                value: meetingBoardType.mapKeys.MEETING_BOARD_SETTING_DEADLINES_ACTIVATE
              }
            ]
          },
          $wf: {
            template: {
              name: "sol.meeting.Create"
            },
            name: "{{translate 'sol.meeting.create.prefix'}}"
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "GOTO",
              onWfStatus: "CREATED"
            },
            {
              id: "FEEDBACK",
              onWfStatus: "REPEATED",
              message: "{{translate 'sol.meeting.client.createMeeting.feedback.repeate'}}"
            }
          ]
        };
        RFfunction = "RF_sol_common_action_Standard";
        RFparams = configAction;
        RFs.push({ function: RFfunction, params: RFparams });
      });
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteRFs", {
          RFs: RFs
        }).then(function success(jsonResult) {
          RFresults = jsonResult;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("fill meeting sords", function (done) {
      i = 0;
      RFresults.forEach(function (result) {
        meetings[i].objId = result.RFresult.events[1].obj.objId;
        meetings[i].flowId = result.RFresult.events[0].obj.flowId;
        i++;
      });
      RFs = [];
      meetings.forEach(function (meeting) {
        if (meeting.settings.default) {
          if (meeting.settings.default == true) {
            meeting.mapTable = [];
            meeting.mapTable.push(["MEETING_TIMESLOT_DAY", "MEETING_TIMESLOT_START", "MEETING_TIMESLOT_END"]);
            timeSlotDay = meeting.settings.timeslotday;
            timeSlotStart = meeting.settings.timeslotstart;
            timeSlotEnd = meeting.settings.timeslotend;
            timeSlotCount = meeting.settings.timeslotcount;
            offsetDay = 0;
            timeSlotDay = timeSlotDay.trim();
            arraySlotDayOffsetDay = timeSlotDay.split("+");
            if (arraySlotDayOffsetDay.length > 1) {
              timeSlotDay = arraySlotDayOffsetDay[0].trim();
              offsetDay = Number(arraySlotDayOffsetDay[1].trim());
            }
            if (timeSlotDay == "now") {
              timeSlotDate = new Date();
            } else {
              year = timeSlotDay.substring(0, 4);
              month = timeSlotDay.substring(4, 6);
              month = Number(month);
              month--;
              day = timeSlotDay.substring(6, 8);
              timeSlotDate = new Date(year, month, day);
            }
            timeSlotDate = new Date(timeSlotDate.getFullYear(), timeSlotDate.getMonth(), timeSlotDate.getDate() + offsetDay);
            for (i = 0; i < timeSlotCount; i++) {
              year = timeSlotDate.getFullYear();
              month = timeSlotDate.getMonth();
              month++;
              day = timeSlotDate.getDate();
              if (month < 10) {
                month = "0" + month;
              }
              if (day < 10) {
                day = "0" + day;
              }
              timeSlotDay = String(year) + String(month) + String(day);
              meeting.mapTable.push([timeSlotDay, timeSlotStart, timeSlotEnd]);
              timeSlotDate = new Date(timeSlotDate.getFullYear(), timeSlotDate.getMonth(), timeSlotDate.getDate() + 1);
            }
          }
        }
        startDate = "00000000";
        endDate =   "00000000";
        timeSlotDay = "00000000";
        timeSlotStart = "00:00";
        timeSlotEnd = "00:00";
        timeSlotsDay = [];
        timeSlotsStart = [];
        timeSlotsEnd = [];
        for (i = 1; i < meeting.mapTable.length; i++) {
          mapline = meeting.mapTable[i];
          for (j = 0; j < mapline.length; j++) {
            value = mapline[j];
            if (meeting.mapTable[0][j] == "MEETING_TIMESLOT_DAY") {
              if (i == 1) {
                startDate = value;
              }
              if (i == (meeting.mapTable.length - 1)) {
                endDate = value;
              }
              timeSlotsDay.push(value);
            }
            if (meeting.mapTable[0][j] == "MEETING_TIMESLOT_START") {
              timeSlotsStart.push(value);
            }
            if (meeting.mapTable[0][j] == "MEETING_TIMESLOT_END") {
              timeSlotsEnd.push(value);
            }
          }
          timeSlotDay = timeSlotsDay.join("¶");
          timeSlotStart = timeSlotsStart.join("¶");
          timeSlotEnd = timeSlotsEnd.join("¶");
        }
        registerDeadLine = "";
        switch (meeting.mapKeys.MEETING_DEADLINE_TYPE) {
          case "sol.meeting.forms.meetingBoard.settings.noDeadline":
            registerDeadLine = "";
            break;
          case "sol.meeting.forms.meetingBoard.settings.boardDeadline":
            if (meeting.mapTable.length > 1) {
              registerDeadLine = meeting.mapTable[1][0];
              year = registerDeadLine.substring(0, 4);
              month = registerDeadLine.substring(4, 6);
              month = Number(month);
              month--;
              day = registerDeadLine.substring(6, 8);
              registerDeadLine = new Date(year, month, day);
            } else {
              registerDeadLine = new Date();
            }
            // Subtract
            shiftValue = Number(meeting.deadlineshiftvalue);
            shiftUnit = meeting.deadlineshiftunit.split(" ")[0];
            switch (shiftUnit) {
              case "y":
                year = shiftValue;
                month = 0;
                day = 0;
                break;
              case "Q":
                year = 0;
                month = shiftValue * 3;
                day = 0;
                break;
              case "M":
                year = 0;
                month = shiftValue;
                day = 0;
                break;
              case "w":
                year = 0;
                month = 0;
                day = shiftValue * 7;
                break;
              case "d":
                year = 0;
                month = 0;
                day = shiftValue;
                break;
              default:
                year = 0;
                month = 0;
                day = 0;
                break;
            }
            registerDeadLine = new Date(registerDeadLine.getFullYear() - year, registerDeadLine.getMonth() - month, registerDeadLine.getDate() - day);
            // Subtract

            year = registerDeadLine.getFullYear();
            month = registerDeadLine.getMonth();
            month++;
            day = registerDeadLine.getDate();
            if (month < 10) {
              month = "0" + month;
            }
            if (day < 10) {
              day = "0" + day;
            }
            registerDeadLine = String(year) + String(month) + String(day);
            break;
          case "sol.meeting.forms.meetingBoard.settings.customDeadline":
            if (meeting.mapTable.length > 1) {
              registerDeadLine = meeting.mapTable[1][0];
            } else {
              registerDeadLine = new Date();
              year = registerDeadLine.getFullYear();
              month = registerDeadLine.getMonth();
              month++;
              day = registerDeadLine.getDate();
              if (month < 10) {
                month = "0" + month;
              }
              if (day < 10) {
                day = "0" + day;
              }
              registerDeadLine = String(year) + String(month) + String(day);
            }
            break;
          default:
            break;
        }
        if (meeting.productline == "Default") {
          registerDeadLine = "";
        }
        RFfunction = "RF_sol_function_Set";
        RFparams = {
          objId: meeting.objId,
          flowId: meeting.flowId,
          entries: [{
            type: "SORD",
            key: "desc",
            value: meeting.desc
          }, {
            type: "GRP",
            key: "MEETING_NAME",
            value: meeting.objKeys.MEETING_NAME
          }, {
            type: "GRP",
            key: "MEETING_LOCATION",
            value: meeting.objKeys.MEETING_LOCATION
          }, {
            type: "GRP",
            key: "MEETING_STARTDATE",
            value: startDate
          }, {
            type: "GRP",
            key: "MEETING_ENDDATE",
            value: endDate
          }, {
            type: "GRP",
            key: "MEETING_REGISTER_DEADLINE",
            value: registerDeadLine
          }, {
            type: "GRP",
            key: "MEETING_TIMESLOT_DAY",
            value: timeSlotDay
          }, {
            type: "GRP",
            key: "MEETING_TIMESLOT_START",
            value: timeSlotStart
          }, {
            type: "GRP",
            key: "MEETING_TIMESLOT_END",
            value: timeSlotEnd
          }, {
            type: "GRP",
            key: "MEETING_MINUTE_TAKER",
            value: meeting.objKeys.MEETING_MINUTE_TAKER
          }, {
            type: "GRP",
            key: "MEETING_STATUS",
            value: "A - Freigegeben"
          }, {
            type: "MAP",
            key: "MEETING_DEADLINE_TYPE",
            value: meeting.mapKeys.MEETING_DEADLINE_TYPE
          }, {
            type: "WFMAP",
            key: "MEETING_REPETITION_CREATE",
            value: meeting.wfMapKeys.MEETING_REPETITION_CREATE
          }]
        };
        for (i = 1; i < meeting.mapTable.length; i++) {
          mapline = meeting.mapTable[i];
          for (j = 0; j < mapline.length; j++) {
            key = meeting.mapTable[0][j] + i;
            value = mapline[j];
            RFparams.entries.push(
              {
                type: "MAP",
                key: key,
                value: value
              }
            );
          }
          timeSlotDay = mapline[0];
          year = timeSlotDay.substring(0, 4);
          month = timeSlotDay.substring(4, 6);
          month = Number(month);
          month--;
          day = timeSlotDay.substring(6, 8);
          timeSlotDate = new Date(year, month, day);
          key = "MEETING_WEEKDAY" + i;
          value = weekday[timeSlotDate.getDay()];
          RFparams.entries.push(
            {
              type: "MAP",
              key: key,
              value: value
            }
          );
        }
        if (meeting.wfMapTableParticipants.length > 0) {
          meeting.wfMapTableParticipants[0].push("MEETING_PERSON_EMAIL");
          meeting.wfMapTableParticipants[0].push("MEETING_PERSON_CONTACT_REFERENCE");
          meeting.wfMapTableParticipants[0].push("MEETING_PERSON_CONTACTLIST_NAME");
          meeting.wfMapTableParticipants[0].push("MEETING_PERSON_CONTACTLIST_REFERENCE");
          meeting.wfMapTableParticipants[0].push("MEETING_PERSON_COMPANYNAME");
          meeting.wfMapTableParticipants[0].push("MEETING_PERSON_USERNAME");
          meeting.wfMapTableParticipants[0].push("MEETING_PERSON_ELOUSERID");
          meeting.wfMapTableParticipants[0].push("MEETING_PERSON_CRUD_STATUS");
          meeting.wfMapTableParticipants[0].push("MEETING_PARTICIPANT_ROLE");
        }
        offsetMember = meeting.meetingBoardType.mbtmember.sords.length;
        for (i = 1; i < meeting.wfMapTableParticipants.length; i++) {
          mapline = meeting.wfMapTableParticipants[i];

          valueExist = false;
          dataline = [];
          for (j = 0; j < meetingContactData.length; j++) {
            dataline = meetingContactData[j];
            if (dataline[2] == mapline[1]) {
              if (dataline[3] == mapline[2]) {
                valueExist = true;
                break;
              }
            }
          }
          if (valueExist == true) {
            // MEETING_PERSON_EMAIL
            mapline.push(dataline[4]);
            // MEETING_PERSON_CONTACT_REFERENCE
            mapline.push(dataline[5]);

            // MEETING_PERSON_CONTACTLIST_NAME
            mapline.push(dataline[6]);

            // MEETING_PERSON_CONTACTLIST_REFERENCE
            mapline.push(dataline[7]);

            // MEETING_PERSON_COMPANYNAME
            mapline.push(dataline[8]);

            // MEETING_PERSON_USERNAME
            mapline.push(dataline[9]);

            // MEETING_PERSON_ELOUSERID
            mapline.push(dataline[10]);

            // MEETING_PERSON_CRUD_STATUS
            mapline.push("CREATE");

            // MEETING_PARTICIPANT_ROLE
            mapline.push("P - Teilnehmer");
          } else {
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
          }
          for (j = 0; j < mapline.length; j++) {
            key = meeting.wfMapTableParticipants[0][j] + i + offsetMember;
            value = mapline[j];
            RFparams.entries.push(
              {
                type: "WFMAP",
                key: key,
                value: value
              }
            );
          }
        }
        for (i = 1; i < meeting.mapTableNotifications.length; i++) {
          mapline = meeting.mapTableNotifications[i];
          for (j = 0; j < mapline.length; j++) {
            key = meeting.mapTableNotifications[0][j] + i;
            value = mapline[j];
            RFparams.entries.push(
              {
                type: "MAP",
                key: key,
                value: value
              }
            );
          }
        }
        for (i = 1; i < meeting.wfMapTableRepetition.length; i++) {
          mapline = meeting.wfMapTableRepetition[i];
          for (j = 0; j < mapline.length; j++) {
            key = meeting.wfMapTableRepetition[0][j] + i;
            value = mapline[j];
            RFparams.entries.push(
              {
                type: "WFMAP",
                key: key,
                value: value
              }
            );
          }
          timeSlotDay = mapline[1];
          year = timeSlotDay.substring(0, 4);
          month = timeSlotDay.substring(4, 6);
          month = Number(month);
          month--;
          day = timeSlotDay.substring(6, 8);
          timeSlotDate = new Date(year, month, day);
          key = "MEETING_REPETITION_WEEKDAY" + i;
          value = weekday[timeSlotDate.getDay()];
          RFparams.entries.push(
            {
              type: "WFMAP",
              key: key,
              value: value
            }
          );
        }
        RFs.push({ function: RFfunction, params: RFparams });
      });
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteRFs", {
          RFs: RFs
        }).then(function success(jsonResult) {
          RFresults = jsonResult;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("finish input forwarding workflows", function (done) {
      RFs = [];
      meetings.forEach(function (meeting) {
        RFfunction = "RF_sol_unittest_meeting_service_ExecuteLib1";
        RFparams = {
          className: "sol.common.WfUtils",
          classConfig: {},
          method: "forwardWorkflow",
          params: [meeting.flowId, 2, [3]]
        };
        RFs.push({ function: RFfunction, params: RFparams });
      });
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteRFs", {
          RFs: RFs
        }).then(function success(jsonResult) {
          RFresults = jsonResult;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
  });
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});