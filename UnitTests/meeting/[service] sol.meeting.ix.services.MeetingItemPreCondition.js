
describe("[service] sol.meeting.ix.services.MeetingItemPreCondition", function () {
  var originalTimeout, objTempId, meetingBoardTypes, configTypes, configAction,
      wfInfo, succNodes, succNodesIds, objIdMB, objIdM,
      result, prop, data;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("MeetingItemPreCondition").then(function success(objTempId1) {
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
  describe("create meeting board 'default'", function () {
    it("meetingboardTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting Board types",
          maxDescLength: 255
        }
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(meetingBoardTypes1) {
        meetingBoardTypes = meetingBoardTypes1;
        expect(meetingBoardTypes).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objTempId,
          $new: {
            target: {
              mode: "SELECTED"
            },
            name: meetingBoardTypes[0].name,
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting Board types",
              name: meetingBoardTypes[0].name
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
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_common_action_Standard", configAction, []).then(function success(jsonResults) {
          test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo1) {
            wfInfo = wfInfo1;

            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("fill meeting Board1 sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordMB1) {
          objIdMB = wfInfo.objId;
          test.Utils.updateKeywording(sordMB1, {
            MEETING_BOARD_NAME: "Testmeetingboard1",
            MEETING_BOARD_CODE: "TMB1"
          }, true).then(function success1(updateKeywordingResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("finish input forwarding workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove workflows", function (done) {
      expect(function () {
        test.Utils.getFinishedWorkflows().then(function success(wfs) {
          test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
  });
  describe("create meeting 'default'", function () {
    it("find meetingboardTypes", function (done) {
      test.Utils.execute("RF_sol_meeting_function_FindMeetingBoardTypes", {
        objId: objIdMB
      }).then(function success(meetingBoardTypes1) {
        meetingBoardTypes = meetingBoardTypes1;
        expect(meetingBoardTypes).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objIdMB,
          $new: {
            target: {
              mode: "DEFAULT"
            },
            name: "New Meeting",
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meetings",
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
                value: meetingBoardTypes[0].objKeys.MEETING_BOARD_NAME
              },
              {
                key: "MEETING_BOARD_REFERENCE",
                value: meetingBoardTypes[0].guid
              },
              {
                key: "MEETING_PROVIDED_PROPOSALTYPES",
                value: meetingBoardTypes[0].objKeys.MEETING_PROVIDED_PROPOSALTYPES
              },
              {
                key: "MEETING_BOARD_CODE",
                value: meetingBoardTypes[0].objKeys.MEETING_BOARD_CODE
              },
              {
                key: "MEETING_NAME",
                value: meetingBoardTypes[0].mapKeys.MEETING_BOARD_MEETING_DEFAULT_NAME
              },
              {
                key: "MEETING_MINUTE_TAKER",
                value: meetingBoardTypes[0].objKeys.MEETING_BOARD_MINUTE_TAKER
              },
              {
                key: "MEETING_PRODUCT_LINE",
                value: meetingBoardTypes[0].objKeys.MEETING_PRODUCT_LINE
              }
            ],
            mapItems: [
              {
                key: "MEETING_REGISTER_DEADLINE_SHIFT_VALUE",
                value: meetingBoardTypes[0].mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_VALUE
              },
              {
                key: "MEETING_REGISTER_DEADLINE_SHIFT_UNIT",
                value: meetingBoardTypes[0].mapKeys.MEETING_REGISTER_DEADLINE_SHIFT_UNIT
              },
              {
                key: "MEETING_BOARD_SETTING_DEADLINES_ACTIVATE",
                value: meetingBoardTypes[0].mapKeys.MEETING_BOARD_SETTING_DEADLINES_ACTIVATE
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
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_common_action_Standard", configAction, []).then(function success(jsonResults) {
          test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo1) {
            wfInfo = wfInfo1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("fill meeting1 sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordM1) {
          objIdM = wfInfo.objId;
          test.Utils.updateKeywording(sordM1, {
            MEETING_NAME: "Testmeeting1",
            MEETING_LOCATION: "Musterstadt",
            MEETING_STARTDATE: "202005051300",
            MEETING_ENDDATE: "202005071800"
          }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordM1, [{ key: "desc", value: "Unittest Testmeeting1" }]).then(function success2(updateSordResult) {
              test.Utils.updateMapData(objIdM, {
                MEETING_TIMESLOT_DAY1: "20200505",
                MEETING_TIMESLOT_START1: "1300",
                MEETING_TIMESLOT_END1: "1700",
                MEETING_TIMESLOT_DAY2: "20200506",
                MEETING_TIMESLOT_START2: "1400",
                MEETING_TIMESLOT_END2: "1600",
                MEETING_TIMESLOT_DAY3: "20200507",
                MEETING_TIMESLOT_START3: "1500",
                MEETING_TIMESLOT_END3: "1800"
              }).then(function success3(updateMapDataResult) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("finish input forwarding workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove workflows", function (done) {
      expect(function () {
        test.Utils.getFinishedWorkflows().then(function success(wfs) {
          test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
  });
  describe("Test Lib Functions", function () {
    describe("sol.meeting.services.MeetingItemPrecondition", function () {
      it("appendInDebugMode", function (done) {
        expect(function () {
          result = {};
          prop = {};
          data = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.services.MeetingItemPrecondition",
            classConfig: { targetId: objIdM },
            method: "appendInDebugMode",
            params: [result, prop, data]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("checkPreCondition", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.services.MeetingItemPrecondition",
            classConfig: { targetId: objIdM },
            method: "checkPreCondition",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("failedPrecondition", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.services.MeetingItemPrecondition",
            classConfig: { targetId: objIdM },
            method: "failedPrecondition",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.services.MeetingItemPrecondition",
            classConfig: { targetId: objIdM },
            method: "process",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("shouldSkipValidation", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.services.MeetingItemPrecondition",
            classConfig: { targetId: objIdM },
            method: "shouldSkipValidation",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("skipValidation", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.services.MeetingItemPrecondition",
            classConfig: { targetId: objIdM },
            method: "skipValidation",
            params: []
          }).then(function success(jsonResult) {
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
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_meeting_service_CreateMeetingItemPrecondition", function () {
      it("should throw if executed without Parameter 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_CreateMeetingItemPrecondition", {
          }).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("create meeting item precondition", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_CreateMeetingItemPrecondition", {
            targetId: objIdM
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.targetId).toBeDefined();
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
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.getFinishedWorkflows().then(function success2(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
});