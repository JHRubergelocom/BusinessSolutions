
describe("Create Meetingboard data", function () {
  var objTempId, configTypes, configAction,
      originalTimeout, meetingBoardDataConfig, RFs, RFfunction, RFparams,
      RFresults, i, j, meetingBoards, value, mapline,
      key, meetingContactData, valueExist, dataline,
      organizers;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("create rootfolder", function () {
    it("get configuration from meetingBoardData.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Configuration/meetingBoardData.config"
        }).then(function success(configResult) {
          meetingBoardDataConfig = configResult.config;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("meetingBoardDataConfig.rootFolder must be available", function () {
      expect(meetingBoardDataConfig.rootFolder).toBeDefined();
    });
    it("meetingBoardDataConfig.meetingBoards must be available", function () {
      expect(meetingBoardDataConfig.meetingBoards).toBeDefined();
    });
    it("create rootfolder", function (done) {
      expect(function () {
        test.Utils.createPath(meetingBoardDataConfig.rootFolder).then(function success(objTempId1) {
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
      meetingBoardDataConfig.meetingBoards.forEach(function (meetingBoard) {
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});