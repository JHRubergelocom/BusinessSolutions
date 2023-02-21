
describe("[service] sol.meeting.ix.services.Task", function () {
  var originalTimeout, objTasksId, objTaskId, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Task").then(function success(objTempId) {
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
    describe("sol.meeting.task.ix.services.Task", function () {
      it("create task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Create", {
            tasksFolderId: objTasksId,
            objId: objTasksId,
            source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
          }).then(function success(jsonResult) {
            expect(jsonResult.result.objId).toBeDefined();
            objTaskId = jsonResult.result.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("findTasksByReference", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.Task",
            classConfig: { objId: objTaskId },
            method: "findTasksByReference",
            params: []
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
      it("getTask", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.Task",
            classConfig: { objId: objTaskId },
            method: "getTask",
            params: []
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
      it("initialize", function (done) {
        config = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.Task",
            classConfig: { objId: objTaskId },
            method: "initialize",
            params: [config]
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_meeting_task_service_Task_FindTasks", function () {
      it("create task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Create", {
            tasksFolderId: objTasksId,
            objId: objTasksId,
            source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
          }).then(function success(jsonResult) {
            expect(jsonResult.result.objId).toBeDefined();
            objTaskId = jsonResult.result.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_FindTasks", {
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
      it("find tasks", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_FindTasks", {
            objId: objTaskId
          }).then(function success(jsonResult) {
            expect(jsonResult.tasks).toBeDefined();
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
    describe("RF_sol_meeting_task_service_Task_Get", function () {
      it("create task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Create", {
            tasksFolderId: objTasksId,
            objId: objTasksId,
            source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task1", SOL_REFERENCE: "SR1" } }
          }).then(function success(jsonResult) {
            expect(jsonResult.result.objId).toBeDefined();
            objTaskId = jsonResult.result.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Get", {
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
      it("get tasks", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Get", {
            objId: objTaskId
          }).then(function success(jsonResult) {
            expect(jsonResult.reference).toBeDefined();
            expect(jsonResult.status).toBeDefined();
            expect(jsonResult.assignee).toBeDefined();
            expect(jsonResult.dueDate).toBeDefined();
            expect(jsonResult.title).toBeDefined();
            expect(jsonResult.taskId).toBeDefined();
            expect(jsonResult.solType).toBeDefined();
            expect(jsonResult.desc).toBeDefined();
            expect(jsonResult.name).toBeDefined();
            expect(jsonResult.id).toBeDefined();
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