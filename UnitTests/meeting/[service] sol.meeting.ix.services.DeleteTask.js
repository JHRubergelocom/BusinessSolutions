
describe("[service] sol.meeting.ix.services.DeleteTask", function () {
  var originalTimeout, objTasksId, objTaskId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("DeleteTask").then(function success(objTempId) {
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
    describe("sol.meeting.task.ix.services.DeleteTask", function () {
      it("create task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Create", {
            tasksFolderId: objTasksId,
            objId: objTasksId,
            source: { objKeys: { MEETING_TASK_TITLE: "Meeting TaskT", SOL_REFERENCE: "SRT" } }
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
      it("deleteTask", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.services.DeleteTask",
            classConfig: { objId: objTaskId },
            method: "deleteTask",
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
    describe("RF_sol_meeting_task_service_Task_Delete", function () {
      it("create task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Create", {
            tasksFolderId: objTasksId,
            objId: objTasksId,
            source: { objKeys: { MEETING_TASK_TITLE: "Meeting Task2", SOL_REFERENCE: "SR2" } }
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
          test.Utils.execute("RF_sol_meeting_task_service_Task_Delete", {
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
      it("delete task", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_task_service_Task_Delete", {
            objId: objTaskId
          }).then(function success(jsonResult) {
            expect(jsonResult.objId).toBeDefined();
            expect(jsonResult.flowId).toBeDefined();
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