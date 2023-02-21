
describe("[service] sol.meeting.ix.services.UpdateTask", function () {
  var originalTimeout, objTasksId, objTaskId, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UpdateTask").then(function success(objTempId) {
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
    describe("sol.meeting.task.ix.services.UpdateTask", function () {
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
      it("initialize", function (done) {
        config = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.UpdateTask",
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
      it("updateTask", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.UpdateTask",
            classConfig: { objId: objTaskId },
            method: "updateTask",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_meeting_task_service_Task_Done", function () {
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
          test.Utils.execute("RF_sol_meeting_task_service_Task_Done", {
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
      it("done task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Done", {
            objId: objTaskId
          }).then(function success(jsonResult) {
            expect(jsonResult.result).toBeDefined();
            expect(jsonResult.result.objId).toBeDefined();
            expect(jsonResult.result.flowId).toBeDefined();
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
    describe("RF_sol_meeting_task_service_Task_Open", function () {
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
          test.Utils.execute("RF_sol_meeting_task_service_Task_Open", {
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
      it("open task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Open", {
            objId: objTaskId
          }).then(function success(jsonResult) {
            expect(jsonResult.result).toBeDefined();
            expect(jsonResult.result.objId).toBeDefined();
            expect(jsonResult.result.flowId).toBeDefined();
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
    describe("RF_sol_meeting_task_service_Task_Close", function () {
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
          test.Utils.execute("RF_sol_meeting_task_service_Task_Close", {
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
      it("close task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Close", {
            objId: objTaskId
          }).then(function success(jsonResult) {
            expect(jsonResult.result).toBeDefined();
            expect(jsonResult.result.objId).toBeDefined();
            expect(jsonResult.result.flowId).toBeDefined();
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
    describe("RF_sol_meeting_task_service_Task_Edit", function () {
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
          test.Utils.execute("RF_sol_meeting_task_service_Task_Edit", {
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
      it("edit task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Edit", {
            objId: objTaskId
          }).then(function success(jsonResult) {
            expect(jsonResult.result).toBeDefined();
            expect(jsonResult.result.objId).toBeDefined();
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