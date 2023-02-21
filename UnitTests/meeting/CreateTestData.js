
describe("Create Testdata", function () {
  var objTempId, configTypes, configAction,
      originalTimeout, testdataConfig, RFs, RFfunction, RFparams,
      RFresults, i, j, meetingBoards, meetings, value, mapline,
      key, meetingItemTypes, meetingItems, meetingItemPools, mBoard, votings,
      votingTemplate, meetingContactData, valueExist, dataline,
      mbtmembers, startDate, endDate, timeSlotDay, timeSlotStart,
      timeSlotEnd, timeSlotsDay, timeSlotsStart, timeSlotsEnd,
      offsetMember, userInfoData, responsibleId, speakers,
      timeSlotCount, timeSlotDate, year, month, day,
      registerDeadLine, weekday, offsetDay,
      arraySlotDayOffsetDay, organizers,
      shiftValue, shiftUnit;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("create rootfolder", function () {
    it("get configuration from testdata.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Configuration/testdata.config"
        }).then(function success(configResult) {
          testdataConfig = configResult.config;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("testdataConfig.weekday must be available", function () {
      expect(testdataConfig.weekday).toBeDefined();
      weekday = testdataConfig.weekday;
    });
    it("testdataConfig.rootFolder must be available", function () {
      expect(testdataConfig.rootFolder).toBeDefined();
    });
    it("testdataConfig.meetingBoards must be available", function () {
      expect(testdataConfig.meetingBoards).toBeDefined();
    });
    it("create rootfolder", function (done) {
      expect(function () {
        test.Utils.createPath(testdataConfig.rootFolder).then(function success(objTempId1) {
          objTempId = objTempId1;
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
  describe("create meeting boards", function () {
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
    it("meetingboardTypes must be available for all meetingboards", function (done) {
      RFs = [];
      meetingBoards = [];
      testdataConfig.meetingBoards.forEach(function (meetingBoard) {
        meetingBoard.pathMeetingBoardTypes = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting Board types";
        if (meetingBoard.objKeys.MEETING_PRODUCT_LINE == "Premium") {
          meetingBoard.pathMeetingBoardTypes = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting_premium/Configuration/Meeting Board types";
        }
        meetingBoards.push(meetingBoard);
        RFfunction = "RF_sol_common_service_StandardTypes";
        configTypes = {
          $types: {
            path: meetingBoard.pathMeetingBoardTypes,
            maxDescLength: 255
          }
        };
        RFparams = configTypes;
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
    it("start action create workflow for all meetingboards", function (done) {
      i = 0;
      RFresults.forEach(function (result) {
        meetingBoards[i].meetingBoardTypes = result.RFresult;
        i++;
      });
      RFs = [];
      meetingBoards.forEach(function (meetingBoard) {
        configAction = {
          objId: objTempId,
          $new: {
            target: {
              mode: "SELECTED"
            },
            name: meetingBoard.meetingBoardTypes[0].name,
            template: {
              base: meetingBoard.pathMeetingBoardTypes,
              name: meetingBoard.meetingBoardTypes[0].name
            }
          },
          $name: "CreateMeetingBoard",
          $metadata: {
            solType: "MEETING_BOARD",
            owner: {
              fromConnection: true
            },
            objKeys: [
              {
                key: "MEETING_BOARD_ORGANIZER",
                value: "{{currentUser}}"
              }
            ]
          },
          $wf: {
            template: {
              name: "sol.meeting.meetingBoard.Create"
            },
            name: "{{translate 'sol.meeting.meetingBoard.create.prefix'}}"
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "GOTO",
              onWfStatus: "CREATE"
            },
            {
              id: "REFRESH",
              onWfStatus: ""
            }
          ],
          $permissions: {
            mode: "SET",
            copySource: true,
            inherit: {
              fromDirectParent: true
            }
          }
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
    it("fill meeting board sords", function (done) {
      i = 0;
      RFresults.forEach(function (result) {
        meetingBoards[i].objId = result.RFresult.events[1].obj.objId;
        meetingBoards[i].flowId = result.RFresult.events[0].obj.flowId;
        i++;
      });
      RFs = [];
      meetingBoards.forEach(function (meetingBoard) {
        if (meetingBoard.mapTableOrganizers.length < 1) {
          meetingBoard.mapTableOrganizers.push(["MEETING_BOARD_ORGANIZER"]);
          meetingBoard.mapTableOrganizers.push(["Administrator"]);
        }
        organizers = [];
        for (i = 1; i < meetingBoard.mapTableOrganizers.length; i++) {
          mapline = meetingBoard.mapTableOrganizers[i];
          for (j = 0; j < mapline.length; j++) {
            value = mapline[j];
            if (meetingBoard.mapTableOrganizers[0][j] == "MEETING_BOARD_ORGANIZER") {
              organizers.push(value);
            }
          }
        }
        organizers = organizers.join("¶");
        RFfunction = "RF_sol_function_Set";
        RFparams = {
          objId: meetingBoard.objId,
          flowId: meetingBoard.flowId,
          entries: [{
            type: "SORD",
            key: "desc",
            value: meetingBoard.desc
          }, {
            type: "GRP",
            key: "MEETING_BOARD_NAME",
            value: meetingBoard.objKeys.MEETING_BOARD_NAME
          }, {
            type: "GRP",
            key: "MEETING_BOARD_CODE",
            value: meetingBoard.objKeys.MEETING_BOARD_CODE
          }, {
            type: "GRP",
            key: "MEETING_BOARD_ORGANIZER",
            value: organizers
          }, {
            type: "GRP",
            key: "MEETING_BOARD_MINUTE_TAKER",
            value: meetingBoard.objKeys.MEETING_BOARD_MINUTE_TAKER
          }, {
            type: "MAP",
            key: "MEETING_BOARD_SETTING_DEADLINES_ACTIVATE",
            value: meetingBoard.mapKeys.MEETING_BOARD_SETTING_DEADLINES_ACTIVATE
          }, {
            type: "MAP",
            key: "MEETING_REGISTER_DEADLINE_SHIFT_VALUE",
            value: meetingBoard.mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_VALUE
          }, {
            type: "MAP",
            key: "MEETING_REGISTER_DEADLINE_SHIFT_UNIT",
            value: meetingBoard.mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_UNIT
          }]
        };
        if (meetingBoard.wfMapTableMembers.length > 0) {
          meetingBoard.wfMapTableMembers[0].push("MEETING_PERSON_EMAIL");
          meetingBoard.wfMapTableMembers[0].push("MEETING_PERSON_CONTACT_REFERENCE");
          meetingBoard.wfMapTableMembers[0].push("MEETING_PERSON_CONTACTLIST_NAME");
          meetingBoard.wfMapTableMembers[0].push("MEETING_PERSON_CONTACTLIST_REFERENCE");
          meetingBoard.wfMapTableMembers[0].push("MEETING_PERSON_COMPANYNAME");
          meetingBoard.wfMapTableMembers[0].push("MEETING_PERSON_USERNAME");
          meetingBoard.wfMapTableMembers[0].push("MEETING_PERSON_ELOUSERID");
          meetingBoard.wfMapTableMembers[0].push("MEETING_PERSON_CRUD_STATUS");
          meetingBoard.wfMapTableMembers[0].push("MEETING_PARTICIPANT_ROLE");
        }
        for (i = 1; i < meetingBoard.wfMapTableMembers.length; i++) {
          mapline = meetingBoard.wfMapTableMembers[i];
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
            mapline.push("M - Mitglied");
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
            key = meetingBoard.wfMapTableMembers[0][j] + i;
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
        for (i = 1; i < meetingBoard.wfMapTableRecuringItems.length; i++) {
          mapline = meetingBoard.wfMapTableRecuringItems[i];
          for (j = 0; j < mapline.length; j++) {
            key = meetingBoard.wfMapTableRecuringItems[0][j] + i;
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
        for (i = 1; i < meetingBoard.mapTableNotifications.length; i++) {
          mapline = meetingBoard.mapTableNotifications[i];
          for (j = 0; j < mapline.length; j++) {
            key = meetingBoard.mapTableNotifications[0][j] + i;
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
        for (i = 1; i < meetingBoard.mapTableProposals.length; i++) {
          mapline = meetingBoard.mapTableProposals[i];
          for (j = 0; j < mapline.length; j++) {
            key = meetingBoard.mapTableProposals[0][j] + i;
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
        for (i = 1; i < meetingBoard.mapTableOrganizers.length; i++) {
          mapline = meetingBoard.mapTableOrganizers[i];
          for (j = 0; j < mapline.length; j++) {
            key = meetingBoard.mapTableOrganizers[0][j] + i;
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
      meetingBoards.forEach(function (meetingBoard) {
        RFfunction = "RF_sol_unittest_meeting_service_ExecuteLib1";
        RFparams = {
          className: "sol.common.WfUtils",
          classConfig: {},
          method: "forwardWorkflow",
          params: [meetingBoard.flowId, 1, [7]]
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
  describe("create meetings", function () {
    it("find meetingboardTypes for all meetingboards", function (done) {
      RFs = [];
      meetingBoards.forEach(function (meetingBoard) {
        RFfunction = "RF_sol_meeting_function_FindMeetingBoardTypes";
        RFparams = meetingBoard.objId;
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
    it("get members for all meetingboardTypes", function (done) {
      i = 0;
      RFresults.forEach(function (result) {
        mBoard = meetingBoards[i];
        result.RFresult.forEach(function (meetingBoardType) {
          if (meetingBoardType.id == mBoard.objId) {
            mBoard.meetingBoardType = meetingBoardType;
          }
        });
        i++;
      });
      RFs = [];
      meetingBoards.forEach(function (meetingBoard) {
        RFfunction = "RF_sol_meeting_service_GetMembers";
        RFparams = { objId: meetingBoard.id };
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
        mBoard = meetingBoards[i];
        mBoard.mbtmember = mbtmember;
        i++;
      });
      RFs = [];
      meetings = [];
      meetingBoards.forEach(function (meetingBoard) {
        meetingBoard.meetings.forEach(function (meeting) {
          meeting.productline = "Default";
          meeting.mbtmember = meetingBoard.mbtmember;
          meetingBoard.meetingBoardType.pathMeetingTypes = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meetings";
          if (meetingBoard.meetingBoardType.objKeys.MEETING_PRODUCT_LINE == "Premium") {
            meeting.productline = "Premium";
            meetingBoard.meetingBoardType.pathMeetingTypes = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting_premium/Configuration/Meetings";
          }
          meeting.deadlineshiftvalue = meetingBoard.mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_VALUE;
          meeting.deadlineshiftunit = meetingBoard.mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_UNIT;
          meeting.deadlineactivate = meetingBoard.mapKeys.MEETING_BOARD_SETTING_DEADLINES_ACTIVATE;
          meetings.push(meeting);
          configAction = {
            objId: meetingBoard.objId,
            $new: {
              target: {
                mode: "DEFAULT"
              },
              name: "New Meeting",
              template: {
                base: meetingBoard.meetingBoardType.pathMeetingTypes,
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
                  value: meetingBoard.meetingBoardType.objKeys.MEETING_BOARD_NAME
                },
                {
                  key: "MEETING_BOARD_REFERENCE",
                  value: meetingBoard.meetingBoardType.guid
                },
                {
                  key: "MEETING_PROVIDED_PROPOSALTYPES",
                  value: meetingBoard.meetingBoardType.objKeys.MEETING_PROVIDED_PROPOSALTYPES
                },
                {
                  key: "MEETING_BOARD_CODE",
                  value: meetingBoard.meetingBoardType.objKeys.MEETING_BOARD_CODE
                },
                {
                  key: "MEETING_NAME",
                  value: meetingBoard.meetingBoardType.mapKeys.MEETING_BOARD_MEETING_DEFAULT_NAME
                },

                {
                  key: "MEETING_MINUTE_TAKER",
                  value: meetingBoard.meetingBoardType.objKeys.MEETING_BOARD_MINUTE_TAKER
                },
                {
                  key: "MEETING_PRODUCT_LINE",
                  value: meetingBoard.meetingBoardType.objKeys.MEETING_PRODUCT_LINE
                }
              ],
              mapItems: [
                {
                  key: "MEETING_REGISTER_DEADLINE_SHIFT_VALUE",
                  value: meetingBoard.meetingBoardType.mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_VALUE
                },
                {
                  key: "MEETING_REGISTER_DEADLINE_SHIFT_UNIT",
                  value: meetingBoard.meetingBoardType.mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_UNIT
                },
                {
                  key: "MEETING_BOARD_SETTING_DEADLINES_ACTIVATE",
                  value: meetingBoard.meetingBoardType.mapKeys.MEETING_BOARD_SETTING_DEADLINES_ACTIVATE
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
            type: "MAP",
            key: "MEETING_REGISTER_DEADLINE_SHIFT_VALUE",
            value: meeting.deadlineshiftvalue
          }, {
            type: "MAP",
            key: "MEETING_REGISTER_DEADLINE_SHIFT_UNIT",
            value: meeting.deadlineshiftunit
          }, {
            type: "MAP",
            key: "MEETING_BOARD_SETTING_DEADLINES_ACTIVATE",
            value: meeting.deadlineactivate
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
        offsetMember = meeting.mbtmember.sords.length;
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
  describe("create meeting items", function () {
    it("meetingItemTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting item types",
          maxDescLength: 255
        }
      };
      test.Utils.execute("RF_sol_meeting_service_GetMeetingItemTypes", configTypes).then(function success(meetingItemTypes1) {
        meetingItemTypes = meetingItemTypes1;
        expect(meetingItemTypes).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("get user info data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
          objId: 1,
          dynKwl: "sol.common.ix.dynkwl.UserNames",
          providerConfig: { onlyUsers: true },
          inputFieldName: "UNITTEST_FIELD2"
        }).then(function success(jsonResult) {
          if (jsonResult.error) {
            fail(jsonResult.error);
          } else {
            expect(jsonResult.keynames).toBeDefined();
            expect(jsonResult.header).toBeDefined();
            expect(jsonResult.title).toBeDefined();
            expect(jsonResult.data).toBeDefined();
            userInfoData = jsonResult.data;
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
    it("start action create workflow for all meetingitems", function (done) {
      RFs = [];
      meetingItems = [];
      meetings.forEach(function (meeting) {
        meeting.meetingItems.forEach(function (meetingItem) {
          meetingItems.push(meetingItem);
          configAction = {
            objId: meeting.objId,
            $new: {
              target: {
                mode: "DEFAULT"
              },
              name: meetingItemTypes[0].name,
              template: {
                base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting item types",
                name: meetingItemTypes[0].specificMeetingItemType
              }
            },
            $name: "CreateMeetingItem",
            $metadata: {
              solType: "MEETING_ITEM",
              owner: {
                fromConnection: true
              },
              objKeys: [
                {
                  key: "MEETING_REFERENCE",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_REFERENCE}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_NAME",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_NAME}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_BOARD_NAME",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_BOARD_NAME}}}{{else}}{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING_ITEM_POOL\"}}{{{sord.objKeys.MEETING_BOARD_NAME}}}{{/ifCond}}{{/ifCond}}"
                },
                {
                  key: "MEETING_BOARD_REFERENCE",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.guid}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_PROVIDED_PROPOSALTYPES",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_PROVIDED_PROPOSALTYPES}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_ENDDATE",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_ENDDATE}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_STARTDATE",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_STARTDATE}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_BOARD_CODE",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_BOARD_CODE}}}{{else}}{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING_ITEM_POOL\"}}{{{sord.objKeys.MEETING_BOARD_CODE}}}{{/ifCond}}{{/ifCond}}"
                },
                {
                  key: "MEETING_PRODUCT_LINE",
                  value: meeting.productline
                }
              ],
              mapItems: [
                {
                  key: "MEETING_GUID",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.guid}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_ASSIGNMENT_CHECKED",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}1{{/ifCond}}"
                },
                {
                  key: "MEETING_ITEM_POOL_NAME",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING_ITEM_POOL\"}}{{{sord.objKeys.MEETING_ITEM_POOL_NAME}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_ITEM_POOL_GUID",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING_ITEM_POOL\"}}{{sord.guid}}{{/ifCond}}"
                }
              ]
            },
            $wf: {
              template: {
                name: "sol.meeting.item.Create"
              },
              name: "{{translate 'sol.meeting.item.create.prefix'}}-{{formatDate 'YYYYMMDDHHmmss'}}"
            },
            $events: [
              {
                id: "DIALOG",
                onWfStatus: ""
              },
              {
                id: "GOTO",
                onWfStatus: "CREATED"
              }
            ]
          };
          RFfunction = "RF_sol_common_action_Standard";
          RFparams = configAction;
          RFs.push({ function: RFfunction, params: RFparams });
        });
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
    it("fill meeting item", function (done) {
      i = 0;
      RFresults.forEach(function (result) {
        meetingItems[i].objId = result.RFresult.events[1].obj.objId;
        meetingItems[i].flowId = result.RFresult.events[0].obj.flowId;
        i++;
      });
      RFs = [];
      meetingItems.forEach(function (meetingItem) {
        responsibleId = "";
        dataline = [];
        for (i = 0; i < userInfoData.length; i++) {
          dataline = userInfoData[i];
          if (dataline[1] == meetingItem.objKeys.MEETING_ITEM_RESPONSIBLE_PERSON) {
            responsibleId = dataline[0];
          }
        }
        RFfunction = "RF_sol_function_Set";
        RFparams = {
          objId: meetingItem.objId,
          entries: [{
            type: "SORD",
            key: "desc",
            value: meetingItem.desc
          }, {
            type: "GRP",
            key: "MEETING_ITEM_TITLE",
            value: meetingItem.objKeys.MEETING_ITEM_TITLE
          }, {
            type: "GRP",
            key: "MEETING_ITEM_DURATION",
            value: meetingItem.objKeys.MEETING_ITEM_DURATION
          }, {
            type: "GRP",
            key: "MEETING_ITEM_RESPONSIBLE_PERSON",
            value: meetingItem.objKeys.MEETING_ITEM_RESPONSIBLE_PERSON
          }, {
            type: "GRP",
            key: "MEETING_ITEM_DAY",
            value: meetingItem.objKeys.MEETING_ITEM_DAY
          }, {
            type: "GRP",
            key: "MEETING_ITEM_START",
            value: meetingItem.objKeys.MEETING_ITEM_START
          }, {
            type: "GRP",
            key: "MEETING_ITEM_END",
            value: meetingItem.objKeys.MEETING_ITEM_END
          }, {
            type: "GRP",
            key: "MEETING_AGENDA_POSITION",
            value: 1000
          }, {
            type: "MAP",
            key: "MEETING_ITEM_RESPONSIBLE_PERSON_ID",
            value: responsibleId
          }]
        };
        speakers = [];
        if (meetingItem.mapTableSpeakers.length > 0) {
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_EMAIL");
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_CONTACT_REFERENCE");
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_CONTACTLIST_NAME");
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_CONTACTLIST_REFERENCE");
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_COMPANYNAME");
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_USERNAME");
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_ELOUSERID");
        }
        for (i = 1; i < meetingItem.mapTableSpeakers.length; i++) {
          mapline = meetingItem.mapTableSpeakers[i];
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
            // MEETING_ITEM_SPEAKER_EMAIL
            mapline.push(dataline[4]);
            // MEETING_ITEM_SPEAKER_CONTACT_REFERENCE
            mapline.push(dataline[5]);

            // MEETING_ITEM_SPEAKER_CONTACTLIST_NAME
            mapline.push(dataline[6]);

            // MEETING_ITEM_SPEAKER_CONTACTLIST_REFERENCE
            mapline.push(dataline[7]);

            // MEETING_ITEM_SPEAKER_COMPANYNAME
            mapline.push(dataline[8]);

            // MEETING_ITEM_SPEAKER_USERNAME
            mapline.push(dataline[9]);
            speakers.push(dataline[9]);

            // MEETING_ITEM_SPEAKER_ELOUSERID
            mapline.push(dataline[10]);
          } else {
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
          }
          for (j = 0; j < mapline.length; j++) {
            key = meetingItem.mapTableSpeakers[0][j] + i;
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
        speakers = speakers.join("¶");
        RFparams.entries.push(
          {
            type: "GRP",
            key: "MEETING_ITEM_SPEAKER",
            value: speakers
          }
        );
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
    it("finish input forwarding workflow", function (done) {
      RFs = [];
      meetingItems.forEach(function (meetingItem) {
        RFfunction = "RF_sol_unittest_meeting_service_ExecuteLib1";
        RFparams = {
          className: "sol.common.WfUtils",
          classConfig: {},
          method: "forwardWorkflow",
          params: [meetingItem.flowId, 2, [3]]
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
    it("create tasks for all meetingitems", function (done) {
      RFs = [];
      meetingItems.forEach(function (meetingItem) {
        meetingItem.tasks.forEach(function (task) {
          RFfunction = "RF_sol_meeting_task_service_Task_CreateItemTask";
          RFparams = {
            objId: meetingItem.objId,
            source: {
              desc: task.desc,
              objKeys: {
                MEETING_TASK_TITLE: task.objKeys.MEETING_TASK_TITLE,
                MEETING_TASK_ASSIGNEE: task.objKeys.MEETING_TASK_ASSIGNEE,
                MEETING_TASK_DUEDATE: task.objKeys.MEETING_TASK_DUEDATE,
                MEETING_TASK_STATUS: task.objKeys.MEETING_TASK_STATUS
              }
            }
          };
          RFs.push({ function: RFfunction, params: RFparams });
        });
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
    it("find voting templates", function (done) {
      RFs = [];
      RFfunction = "RF_sol_meeting_voting_service_Find_Templates";
      RFparams = {};
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
    it("create votings for all meetingitems", function (done) {
      votings = [];
      RFresults.forEach(function (result) {
        result.RFresult.sords.forEach(function (vt) {
          votings.push(vt);
        });
      });
      RFs = [];
      meetingItems.forEach(function (meetingItem) {
        meetingItem.votings.forEach(function (voting) {
          votingTemplate = {};
          votingTemplate.objKeys = {};
          votingTemplate.mapKeys = {};
          votings.forEach(function (vt) {
            if (vt.objKeys.MEETING_VOTING_TITLE == voting.objKeys.MEETING_VOTING_TITLE) {
              votingTemplate.objKeys.MEETING_VOTING_TITLE = vt.objKeys.MEETING_VOTING_TITLE;
              votingTemplate.objKeys.MEETING_VOTING_STATUS = vt.objKeys.MEETING_VOTING_STATUS;
              votingTemplate.objKeys.MEETING_VOTING_IMPLEMENTATION = vt.objKeys.MEETING_VOTING_IMPLEMENTATION;
              votingTemplate.objKeys.MEETING_VOTING_QUORUM_TYPE = vt.objKeys.MEETING_VOTING_QUORUM_TYPE;
              if (vt.mapKeys.MEETING_VOTE_ANSWER1) {
                votingTemplate.mapKeys.MEETING_VOTE_ANSWER1 = vt.mapKeys.MEETING_VOTE_ANSWER1;
              }
              if (vt.mapKeys.MEETING_VOTE_ANSWER2) {
                votingTemplate.mapKeys.MEETING_VOTE_ANSWER2 = vt.mapKeys.MEETING_VOTE_ANSWER2;
              }
              if (vt.mapKeys.MEETING_VOTE_ANSWER3) {
                votingTemplate.mapKeys.MEETING_VOTE_ANSWER3 = vt.mapKeys.MEETING_VOTE_ANSWER3;
              }
              if (vt.mapKeys.MEETING_VOTE_USE_TRANSLATION_KEYS) {
                votingTemplate.mapKeys.MEETING_VOTE_USE_TRANSLATION_KEYS = vt.mapKeys.MEETING_VOTE_USE_TRANSLATION_KEYS;
              }
            }
          });
          votingTemplate.objKeys.MEETING_VOTING_QUESTION = voting.objKeys.MEETING_VOTING_QUESTION;
          votingTemplate.objKeys.MEETING_VOTING_MAX_VOTES = voting.objKeys.MEETING_VOTING_MAX_VOTES;
          votingTemplate.desc = voting.objKeys.desc;
          RFfunction = "RF_sol_meeting_voting_service_Voting_CreateItemVoting";
          RFparams = {
            objId: meetingItem.objId,
            templateSord: votingTemplate
          };
          RFs.push({ function: RFfunction, params: RFparams });
        });
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
    it("create notes for all meetingitems", function (done) {
      RFs = [];
      RFfunction = "RF_sol_meeting_note_function_CreateNote";
      meetingItems.forEach(function (meetingItem) {
        meetingItem.notes.forEach(function (note) {
          RFparams = {
            source: {
              text: note.text,
              title: note.title,
              meetingMinutesRelevant: note.meetingMinutesRelevant,
              visibility: note.visibility
            },
            params: { rootId: meetingItem.objId }
          };
          RFs.push({ function: RFfunction, params: RFparams });
        });
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
  describe("create meeting item pools", function () {
    it("start action create workflow for all meetingitempools", function (done) {
      RFs = [];
      meetingItemPools = [];
      testdataConfig.meetingItemPools.forEach(function (meetingItemPool) {
        configAction = {
          $new: {
            target: {
              mode: "SELECTED"
            },
            name: "New Meeting Item Pool",
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting item pool types",
              name: "Default"
            }
          },
          $name: "CreateMeetingItemPool",
          $metadata: {
            solType: "MEETING_ITEM_POOL",
            owner: {
              fromConnection: true
            },
            objKeys: [
              {
                key: "SOL_TYPE",
                value: "MEETING_ITEM_POOL"
              },
              {
                key: "MEETING_PRODUCT_LINE",
                value: meetingItemPool.objKeys.MEETING_PRODUCT_LINE
              }
            ],
            mapItems: []
          },
          $wf: {
            template: {
              name: "sol.meeting.item.CreatePool"
            },
            name: "{{translate 'sol.meeting.itemPool.create.prefix'}}"
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "REFRESH",
              onWfStatus: ""
            },
            {
              id: "GOTO",
              onWfStatus: "CREATED"
            }
          ],
          $permissions: {
            mode: "SET",
            copySource: false,
            inherit: {
              fromDirectParent: true
            }
          },
          objId: objTempId
        };
        meetingItemPool.productline = "Default";
        if (meetingItemPool.objKeys.MEETING_PRODUCT_LINE == "Premium") {
          meetingItemPool.productline = "Premium";
        }
        meetingItemPools.push(meetingItemPool);
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
    it("fill meeting item pool sords", function (done) {
      i = 0;
      RFresults.forEach(function (result) {
        meetingItemPools[i].objId = result.RFresult.events[2].obj.objId;
        meetingItemPools[i].flowId = result.RFresult.events[0].obj.flowId;
        i++;
      });
      RFs = [];
      i = 0;
      meetingItemPools.forEach(function (meetingItemPool) {
        RFfunction = "RF_sol_function_Set";
        RFparams = {
          objId: meetingItemPool.objId,
          entries: [{
            type: "SORD",
            key: "desc",
            value: meetingItemPool.desc
          }, {
            type: "GRP",
            key: "MEETING_BOARD_NAME",
            value: meetingItemPool.objKeys.MEETING_BOARD_NAME
          }, {
            type: "GRP",
            key: "MEETING_BOARD_CODE",
            value: meetingItemPool.objKeys.MEETING_BOARD_CODE
          }, {
            type: "GRP",
            key: "MEETING_ITEM_POOL_NAME",
            value: meetingItemPool.objKeys.MEETING_ITEM_POOL_NAME
          }]
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
    it("finish input forwarding workflows", function (done) {
      RFs = [];
      meetingItemPools.forEach(function (meetingItemPool) {
        RFfunction = "RF_sol_unittest_meeting_service_ExecuteLib1";
        RFparams = {
          className: "sol.common.WfUtils",
          classConfig: {},
          method: "forwardWorkflow",
          params: [meetingItemPool.flowId, 2, [5]]
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
  describe("create meeting items in meeting item pools", function () {
    it("meetingItemTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting item types",
          maxDescLength: 255
        }
      };
      test.Utils.execute("RF_sol_meeting_service_GetMeetingItemTypes", configTypes).then(function success(meetingItemTypes1) {
        meetingItemTypes = meetingItemTypes1;
        expect(meetingItemTypes).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("get user info data", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
          objId: 1,
          dynKwl: "sol.common.ix.dynkwl.UserNames",
          providerConfig: { onlyUsers: true },
          inputFieldName: "UNITTEST_FIELD2"
        }).then(function success(jsonResult) {
          if (jsonResult.error) {
            fail(jsonResult.error);
          } else {
            expect(jsonResult.keynames).toBeDefined();
            expect(jsonResult.header).toBeDefined();
            expect(jsonResult.title).toBeDefined();
            expect(jsonResult.data).toBeDefined();
            userInfoData = jsonResult.data;
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
    it("start action create workflow for all meetingitems", function (done) {
      RFs = [];
      meetingItems = [];
      meetingItemPools.forEach(function (meetingItemPool) {
        meetingItemPool.meetingItems.forEach(function (meetingItem) {
          meetingItems.push(meetingItem);
          configAction = {
            objId: meetingItemPool.objId,
            $new: {
              target: {
                mode: "DEFAULT"
              },
              name: meetingItemTypes[0].name,
              template: {
                base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting item types",
                name: meetingItemTypes[0].specificMeetingItemType
              }
            },
            $name: "CreateMeetingItem",
            $metadata: {
              solType: "MEETING_ITEM",
              owner: {
                fromConnection: true
              },
              objKeys: [
                {
                  key: "MEETING_REFERENCE",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_REFERENCE}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_NAME",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_NAME}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_BOARD_NAME",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_BOARD_NAME}}}{{else}}{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING_ITEM_POOL\"}}{{{sord.objKeys.MEETING_BOARD_NAME}}}{{/ifCond}}{{/ifCond}}"
                },
                {
                  key: "MEETING_BOARD_REFERENCE",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.guid}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_PROVIDED_PROPOSALTYPES",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_PROVIDED_PROPOSALTYPES}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_ENDDATE",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_ENDDATE}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_STARTDATE",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_STARTDATE}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_BOARD_CODE",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.objKeys.MEETING_BOARD_CODE}}}{{else}}{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING_ITEM_POOL\"}}{{{sord.objKeys.MEETING_BOARD_CODE}}}{{/ifCond}}{{/ifCond}}"
                },
                {
                  key: "MEETING_PRODUCT_LINE",
                  value: meetingItemPool.productline
                }
              ],
              mapItems: [
                {
                  key: "MEETING_GUID",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}{{{sord.guid}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_ASSIGNMENT_CHECKED",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING\"}}1{{/ifCond}}"
                },
                {
                  key: "MEETING_ITEM_POOL_NAME",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING_ITEM_POOL\"}}{{{sord.objKeys.MEETING_ITEM_POOL_NAME}}}{{/ifCond}}"
                },
                {
                  key: "MEETING_ITEM_POOL_GUID",
                  value: "{{#ifCond sord.objKeys.SOL_TYPE '==' \"MEETING_ITEM_POOL\"}}{{sord.guid}}{{/ifCond}}"
                }
              ]
            },
            $wf: {
              template: {
                name: "sol.meeting.item.Create"
              },
              name: "{{translate 'sol.meeting.item.create.prefix'}}-{{formatDate 'YYYYMMDDHHmmss'}}"
            },
            $events: [
              {
                id: "DIALOG",
                onWfStatus: ""
              },
              {
                id: "GOTO",
                onWfStatus: "CREATED"
              }
            ]
          };
          RFfunction = "RF_sol_common_action_Standard";
          RFparams = configAction;
          RFs.push({ function: RFfunction, params: RFparams });
        });
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
    it("fill meeting item", function (done) {
      i = 0;
      RFresults.forEach(function (result) {
        meetingItems[i].objId = result.RFresult.events[1].obj.objId;
        meetingItems[i].flowId = result.RFresult.events[0].obj.flowId;
        i++;
      });
      RFs = [];
      meetingItems.forEach(function (meetingItem) {
        responsibleId = "";
        dataline = [];
        for (i = 0; i < userInfoData.length; i++) {
          dataline = userInfoData[i];
          if (dataline[1] == meetingItem.objKeys.MEETING_ITEM_RESPONSIBLE_PERSON) {
            responsibleId = dataline[0];
          }
        }
        RFfunction = "RF_sol_function_Set";
        RFparams = {
          objId: meetingItem.objId,
          entries: [{
            type: "SORD",
            key: "desc",
            value: meetingItem.desc
          }, {
            type: "GRP",
            key: "MEETING_ITEM_TITLE",
            value: meetingItem.objKeys.MEETING_ITEM_TITLE
          }, {
            type: "GRP",
            key: "MEETING_ITEM_DURATION",
            value: meetingItem.objKeys.MEETING_ITEM_DURATION
          }, {
            type: "GRP",
            key: "MEETING_ITEM_RESPONSIBLE_PERSON",
            value: meetingItem.objKeys.MEETING_ITEM_RESPONSIBLE_PERSON
          }, {
            type: "GRP",
            key: "MEETING_ITEM_DAY",
            value: 0
          },  {
            type: "GRP",
            key: "MEETING_AGENDA_POSITION",
            value: 1000
          },
          {
            type: "MAP",
            key: "MEETING_ITEM_RESPONSIBLE_PERSON_ID",
            value: responsibleId
          }]
        };
        speakers = [];
        if (meetingItem.mapTableSpeakers.length > 0) {
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_EMAIL");
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_CONTACT_REFERENCE");
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_CONTACTLIST_NAME");
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_CONTACTLIST_REFERENCE");
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_COMPANYNAME");
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_USERNAME");
          meetingItem.mapTableSpeakers[0].push("MEETING_ITEM_SPEAKER_ELOUSERID");
        }
        for (i = 1; i < meetingItem.mapTableSpeakers.length; i++) {
          mapline = meetingItem.mapTableSpeakers[i];
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
            // MEETING_ITEM_SPEAKER_EMAIL
            mapline.push(dataline[4]);
            // MEETING_ITEM_SPEAKER_CONTACT_REFERENCE
            mapline.push(dataline[5]);

            // MEETING_ITEM_SPEAKER_CONTACTLIST_NAME
            mapline.push(dataline[6]);

            // MEETING_ITEM_SPEAKER_CONTACTLIST_REFERENCE
            mapline.push(dataline[7]);

            // MEETING_ITEM_SPEAKER_COMPANYNAME
            mapline.push(dataline[8]);

            // MEETING_ITEM_SPEAKER_USERNAME
            mapline.push(dataline[9]);
            speakers.push(dataline[9]);

            // MEETING_ITEM_SPEAKER_ELOUSERID
            mapline.push(dataline[10]);
          } else {
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
            mapline.push("");
          }
          for (j = 0; j < mapline.length; j++) {
            key = meetingItem.mapTableSpeakers[0][j] + i;
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
        speakers = speakers.join("¶");
        RFparams.entries.push(
          {
            type: "GRP",
            key: "MEETING_ITEM_SPEAKER",
            value: speakers
          }
        );
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
    it("finish input forwarding workflow", function (done) {
      RFs = [];
      meetingItems.forEach(function (meetingItem) {
        RFfunction = "RF_sol_unittest_meeting_service_ExecuteLib1";
        RFparams = {
          className: "sol.common.WfUtils",
          classConfig: {},
          method: "forwardWorkflow",
          params: [meetingItem.flowId, 2, [3]]
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
    it("create tasks for all meetingitems", function (done) {
      RFs = [];
      meetingItems.forEach(function (meetingItem) {
        meetingItem.tasks.forEach(function (task) {
          RFfunction = "RF_sol_meeting_task_service_Task_CreateItemTask";
          RFparams = {
            objId: meetingItem.objId,
            source: {
              desc: task.desc,
              objKeys: {
                MEETING_TASK_TITLE: task.objKeys.MEETING_TASK_TITLE,
                MEETING_TASK_ASSIGNEE: task.objKeys.MEETING_TASK_ASSIGNEE,
                MEETING_TASK_DUEDATE: task.objKeys.MEETING_TASK_DUEDATE,
                MEETING_TASK_STATUS: task.objKeys.MEETING_TASK_STATUS
              }
            }
          };
          RFs.push({ function: RFfunction, params: RFparams });
        });
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
    it("find voting templates", function (done) {
      RFs = [];
      RFfunction = "RF_sol_meeting_voting_service_Find_Templates";
      RFparams = {};
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
    it("create votings for all meetingitems", function (done) {
      votings = [];
      RFresults.forEach(function (result) {
        result.RFresult.sords.forEach(function (vt) {
          votings.push(vt);
        });
      });
      RFs = [];
      meetingItems.forEach(function (meetingItem) {
        meetingItem.votings.forEach(function (voting) {
          votingTemplate = {};
          votingTemplate.objKeys = {};
          votingTemplate.mapKeys = {};
          votings.forEach(function (vt) {
            if (vt.objKeys.MEETING_VOTING_TITLE == voting.objKeys.MEETING_VOTING_TITLE) {
              votingTemplate.objKeys.MEETING_VOTING_TITLE = vt.objKeys.MEETING_VOTING_TITLE;
              votingTemplate.objKeys.MEETING_VOTING_STATUS = vt.objKeys.MEETING_VOTING_STATUS;
              votingTemplate.objKeys.MEETING_VOTING_IMPLEMENTATION = vt.objKeys.MEETING_VOTING_IMPLEMENTATION;
              votingTemplate.objKeys.MEETING_VOTING_QUORUM_TYPE = vt.objKeys.MEETING_VOTING_QUORUM_TYPE;
              if (vt.mapKeys.MEETING_VOTE_ANSWER1) {
                votingTemplate.mapKeys.MEETING_VOTE_ANSWER1 = vt.mapKeys.MEETING_VOTE_ANSWER1;
              }
              if (vt.mapKeys.MEETING_VOTE_ANSWER2) {
                votingTemplate.mapKeys.MEETING_VOTE_ANSWER2 = vt.mapKeys.MEETING_VOTE_ANSWER2;
              }
              if (vt.mapKeys.MEETING_VOTE_ANSWER3) {
                votingTemplate.mapKeys.MEETING_VOTE_ANSWER3 = vt.mapKeys.MEETING_VOTE_ANSWER3;
              }
              if (vt.mapKeys.MEETING_VOTE_USE_TRANSLATION_KEYS) {
                votingTemplate.mapKeys.MEETING_VOTE_USE_TRANSLATION_KEYS = vt.mapKeys.MEETING_VOTE_USE_TRANSLATION_KEYS;
              }
            }
          });
          votingTemplate.objKeys.MEETING_VOTING_QUESTION = voting.objKeys.MEETING_VOTING_QUESTION;
          votingTemplate.objKeys.MEETING_VOTING_MAX_VOTES = voting.objKeys.MEETING_VOTING_MAX_VOTES;
          votingTemplate.desc = voting.objKeys.desc;
          RFfunction = "RF_sol_meeting_voting_service_Voting_CreateItemVoting";
          RFparams = {
            objId: meetingItem.objId,
            templateSord: votingTemplate
          };
          RFs.push({ function: RFfunction, params: RFparams });
        });
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
    it("create notes for all meetingitems", function (done) {
      RFs = [];
      RFfunction = "RF_sol_meeting_note_function_CreateNote";
      meetingItems.forEach(function (meetingItem) {
        meetingItem.notes.forEach(function (note) {
          RFparams = {
            source: {
              text: note.text,
              title: note.title,
              meetingMinutesRelevant: note.meetingMinutesRelevant,
              visibility: note.visibility
            },
            params: { rootId: meetingItem.objId }
          };
          RFs.push({ function: RFfunction, params: RFparams });
        });
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