
describe("Create Meetingitem data pool", function () {
  var configTypes, configAction, meetingItemDataPoolConfig,
      originalTimeout, RFs, RFfunction, RFparams,
      RFresults, i, j,
      meetingItemTypes, meetingItems,
      meetingItemPoolSords, meetingItemPoolGuid, votings,
      votingTemplate, mbts, meetingBoardType, productline,
      userInfoData, responsibleId, speakers, dataline,
      mapline, valueExist, meetingContactData,
      key, value;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("create meeting items", function () {
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
    it("get configuration from meetingItemDataPool.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Configuration/meetingItemDataPool.config"
        }).then(function success(configResult) {
          meetingItemDataPoolConfig = configResult.config;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("meetingDataPoolConfig.meetings must be available", function () {
      expect(meetingItemDataPoolConfig.meetingItems).toBeDefined();
    });
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
    it("get meeting item pools", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_FindSords", {
          objKeysObj: {
            MEETING_ITEM_POOL_NAME: "*"
          }
        }).then(function success(jsonResult) {
          expect(jsonResult.sords).toBeDefined();
          meetingItemPoolSords = jsonResult.sords;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
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
    it("find meetingboardTypes for all meetingboards", function (done) {
      RFs = [];
      RFfunction = "RF_sol_meeting_function_FindMeetingBoardTypes";
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
    it("start action create workflow for all meetingitems", function (done) {
      mbts = [];
      RFresults.forEach(function (result) {
        result.RFresult.forEach(function (mbt) {
          mbts.push(mbt);
        });
      });
      RFs = [];
      meetingItems = [];
      meetingItemDataPoolConfig.meetingItems.forEach(function (meetingItem) {
        meetingItemPoolGuid = 0;
        meetingItemPoolSords.forEach(function (meetingItemPoolSord) {
          if (meetingItem.mapKeys.MEETING_ITEM_POOL_NAME == meetingItemPoolSord.objKeys.MEETING_ITEM_POOL_NAME) {
            meetingItemPoolGuid = meetingItemPoolSord.guid;
          }
        });
        mbts.forEach(function (mbt) {
          if (mbt.objKeys.MEETING_BOARD_CODE == meetingItem.objKeys.MEETING_BOARD_CODE) {
            meetingBoardType = mbt;
          }
        });
        productline = "Default";
        if (meetingBoardType.objKeys.MEETING_PRODUCT_LINE == "Premium") {
          productline = "Premium";
        }
        meetingItems.push(meetingItem);
        configAction = {
          objId: meetingItemPoolGuid,
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
                value: productline
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});