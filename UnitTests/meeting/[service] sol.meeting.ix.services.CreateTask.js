
describe("[service] sol.meeting.ix.services.CreateTask", function () {
  var originalTimeout, objTasksId, config,
      tasksFolderId, templateSord, taskResult,
      objId, desc, s1, dateTimeStr, wfId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateTask").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Tasks").then(function success1(objTasksId1) {
          objTasksId = objTasksId1;
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
  describe("Test Lib Functions", function () {
    describe("sol.meeting.task.ix.services.CreateTask", function () {
      it("assignWorkflow", function (done) {
        expect(function () {
          templateSord = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "assignWorkflow",
            params: [templateSord]
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
      it("buildWorkflowTitle", function (done) {
        expect(function () {
          objId = objTasksId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "buildWorkflowTitle",
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
      it("checkPermissions", function (done) {
        expect(function () {
          tasksFolderId = objTasksId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "checkPermissions",
            params: [tasksFolderId]
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
      it("checkTaskAssignee", function (done) {
        expect(function () {
          templateSord = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "checkTaskAssignee",
            params: [templateSord]
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
      it("createTask", function (done) {
        expect(function () {
          templateSord = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "createTask",
            params: [templateSord]
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
      it("createTaskFromScratch", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "createTaskFromScratch",
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
      it("getTaskAssignee", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "getTaskAssignee",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "initialize",
            params: [config]
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
      it("refreshTask", function (done) {
        expect(function () {
          taskResult = { objId: objTasksId };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "refreshTask",
            params: [taskResult]
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
      it("removeTimeFromDueDateStr", function (done) {
        expect(function () {
          dateTimeStr = "202201011330";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "removeTimeFromDueDateStr",
            params: [dateTimeStr]
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
      it("storeWorkflowId", function (done) {
        expect(function () {
          objId = objTasksId;
          wfId = 1;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "storeWorkflowId",
            params: [objId, wfId]
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
      it("updateTaskContent", function (done) {
        expect(function () {
          objId = objTasksId;
          desc = "desc1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "updateTaskContent",
            params: [objId, desc]
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
      it("updateTaskStatus", function (done) {
        expect(function () {
          objId = objTasksId;
          s1 = "status1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.CreateTask",
            classConfig: {
              tasksFolderId: objTasksId,
              objId: objTasksId,
              source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
            },
            method: "updateTaskStatus",
            params: [objId, s1]
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
    describe("RF_sol_meeting_task_service_Task_Create", function () {
      it("should throw if executed without Parameter 'tasksFolderId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Create", {
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
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Create", {
            tasksFolderId: objTasksId
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
      it("should throw if executed without Parameter 'source'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Create", {
            tasksFolderId: objTasksId,
            objId: objTasksId
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
      it("create task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Create", {
            tasksFolderId: objTasksId,
            objId: objTasksId,
            source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
          }).then(function success(jsonResult) {
            expect(jsonResult.params).toBeDefined();
            expect(jsonResult.params.tasksFolderId).toBeDefined();
            expect(jsonResult.result).toBeDefined();
            expect(jsonResult.result.objId).toBeDefined();
            expect(jsonResult.sord).toBeDefined();
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
    describe("RF_sol_meeting_task_service_Task_CreateItemTask", function () {
      it("should throw if executed without Parameter 'tasksFolderId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_CreateItemTask", {
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
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_CreateItemTask", {
            tasksFolderId: objTasksId
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
      it("should throw if executed without Parameter 'source'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_CreateItemTask", {
            tasksFolderId: objTasksId,
            objId: objTasksId
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
      it("create task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_CreateItemTask", {
            tasksFolderId: objTasksId,
            objId: objTasksId,
            source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
          }).then(function success(jsonResult) {
            expect(jsonResult.params).toBeDefined();
            expect(jsonResult.params.tasksFolderId).toBeDefined();
            expect(jsonResult.result).toBeDefined();
            expect(jsonResult.result.objId).toBeDefined();
            expect(jsonResult.sord).toBeDefined();
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