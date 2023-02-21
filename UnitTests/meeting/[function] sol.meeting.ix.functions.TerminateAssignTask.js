
describe("[function] sol.meeting.ix.functions.TerminateAssignTask", function () {
  var originalTimeout, objMeetingTaskId,
      wfDiagram, currentNodeId, array, endNodeId, nodeArray,
      nodeFromId, nodeToId, flowId, destinationNodeIds,
      nodes, id;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("TerminateAssignTask").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/MeetingTask").then(function success1(objMeetingTaskId1) {
          objMeetingTaskId = objMeetingTaskId1;
          test.Utils.getSord(objMeetingTaskId).then(function success2(sordMT) {
            test.Utils.updateKeywording(sordMT, {
              MEETING_TASK_ASSIGNEE: "Administrator"
            }, true).then(function success3(updateKeywordingResult) {
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
  describe("Test Lib Functions", function () {
    describe("sol.meeting.task.ix.functions.TerminateAssignTask", function () {
      it("addEndNodeToWorkflow", function (done) {
        expect(function () {
          wfDiagram = {};
          currentNodeId = 1;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
            method: "addEndNodeToWorkflow",
            params: [wfDiagram, currentNodeId]
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
      it("buildArray", function (done) {
        expect(function () {
          array = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
            method: "buildArray",
            params: [array]
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
      it("clearWorkflowId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
            method: "clearWorkflowId",
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
      it("createEndNode", function (done) {
        endNodeId = 1;
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
            method: "createEndNode",
            params: [endNodeId]
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
      it("createEndNodeId", function (done) {
        nodeArray = [];
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
            method: "createEndNodeId",
            params: [nodeArray]
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
      it("createNodeAssociation", function (done) {
        nodeFromId = 0;
        nodeToId = 1;
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
            method: "createNodeAssociation",
            params: [nodeFromId, nodeToId]
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
      it("endWorkflow", function (done) {
        wfDiagram = {};
        currentNodeId = 1;
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
            method: "endWorkflow",
            params: [wfDiagram, currentNodeId]
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
      it("forwardWorkflowToEndNode", function (done) {
        expect(function () {
          flowId = 1;
          currentNodeId = 1;
          destinationNodeIds = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
            method: "forwardWorkflowToEndNode",
            params: [flowId, currentNodeId, destinationNodeIds]
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
      it("getHighestNodeId", function (done) {
        expect(function () {
          nodes = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
            method: "getHighestNodeId",
            params: [nodes]
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
      it("getTargetWorkflow", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
            method: "getTargetWorkflow",
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
      it("getTargetWorkflowById", function (done) {
        expect(function () {
          id = 1;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
            method: "getTargetWorkflowById",
            params: [id]
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
      it("getTargetWorkflowId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
            method: "getTargetWorkflowId",
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
            className: "sol.meeting.task.ix.functions.TerminateAssignTask",
            classConfig: { objId: objMeetingTaskId },
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_meeting_function_Task_TerminateAssignTask", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_Task_TerminateAssignTask", {
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
      it("terminate assign task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_Task_TerminateAssignTask", {
            objId: objMeetingTaskId
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