/* eslint-disable linebreak-style */

describe("[libix] sol.unittest.ix.services.SolMeetingBoardUtils", function () {
  var originalTimeout, boardService, boardOutput, options,
      configTypes, meetingBoardTypes, configAction, objTempId,
      wfInfo, objIdMB, succNodes, succNodesIds, objId,
      ticket, adminGroup;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolMeetingBoardUtils").then(function success(obSolMeetingBoardUtilsId) {
        objTempId = obSolMeetingBoardUtilsId;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });

  describe("create meeting board 'default", function () {
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
  describe("Test Lib Functions", function () {
    describe("sol.meeting.ix.MeetingBoardUtils", function () {
      it("addTicketToSubstitutionCache", function (done) {
        expect(function () {
          ticket = {};
          adminGroup = "adminGroup1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingBoardUtils",
            classConfig: {},
            method: "addTicketToSubstitutionCache",
            params: [ticket, adminGroup]
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
      it("findAllMeetingBoards", function (done) {
        expect(function () {
          boardService = {
            name: "RF_sol_common_service_SordProvider",
            args: {
              masks: ["Meeting Board"],
              search: [
                { key: "SOL_TYPE", value: ["MEETING_BOARD"] },
                { key: "MEETING_BOARD_CODE", value: ["MB"] }
              ],
              options: {
                formatAsTemplateSord: true
              }
            }
          };
          boardOutput = [
            {
              source: { type: "SORD", key: "id" },
              target: { prop: "id" }
            },
            {
              source: { type: "GRP", key: "MEETING_BOARD_NAME" },
              target: { prop: "meetingBoardName" }
            },
            {
              source: { type: "GRP", key: "MEETING_BOARD_CODE" },
              target: { prop: "meetingBoardCode" }
            }
          ];
          options = {
            optimizationName: "meetingBoardCode"
          };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingBoardUtils",
            classConfig: {},
            method: "findAllMeetingBoards",
            params: [boardService, boardOutput, options]
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
      it("findMeetingBoard", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingBoardUtils",
            classConfig: {},
            method: "findMeetingBoard",
            params: [boardService, boardOutput, options]
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
      it("getCachedSubstitutionTicketsByGroup", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingBoardUtils",
            classConfig: {},
            method: "getCachedSubstitutionTicketsByGroup",
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
      it("isOrganizer", function (done) {
        expect(function () {
          objId = objIdMB;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingBoardUtils",
            classConfig: {},
            method: "isOrganizer",
            params: [objId]
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
      it("isSubstituteForGroup", function (done) {
        expect(function () {
          adminGroup = "adminGroup1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingBoardUtils",
            classConfig: {},
            method: "isSubstituteForGroup",
            params: [adminGroup]
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
      it("isTicketInSubstitutionCache", function (done) {
        expect(function () {
          ticket = {};
          adminGroup = "adminGroup1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingBoardUtils",
            classConfig: {},
            method: "isTicketInSubstitutionCache",
            params: [ticket, adminGroup]
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