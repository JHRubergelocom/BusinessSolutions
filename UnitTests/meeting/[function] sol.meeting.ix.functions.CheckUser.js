
describe("[function] sol.meeting.ix.functions.CheckUser", function () {
  var originalTimeout, objMeetingTaskId,
      config, userName, objId, keyName,
      result, wfDiagram;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CheckUser").then(function success(objTempId) {
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
    describe("sol.meeting.task.ix.functions.CheckUser", function () {
      it("buildResultObject", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.CheckUser",
            classConfig: { objId: objMeetingTaskId, keyName: "MEETING_TASK_ASSIGNEE" },
            method: "buildResultObject",
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
      it("checkUser", function (done) {
        expect(function () {
          userName = "Administrator";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.CheckUser",
            classConfig: { objId: objMeetingTaskId, keyName: "MEETING_TASK_ASSIGNEE" },
            method: "checkUser",
            params: [userName]
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
      it("getUserNameFromField", function (done) {
        expect(function () {
          objId = objMeetingTaskId;
          keyName = "MEETING_TASK_ASSIGNEE";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.CheckUser",
            classConfig: { objId: objMeetingTaskId, keyName: "MEETING_TASK_ASSIGNEE" },
            method: "getUserNameFromField",
            params: [objId, keyName]
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
            className: "sol.meeting.task.ix.functions.CheckUser",
            classConfig: { objId: objMeetingTaskId, keyName: "MEETING_TASK_ASSIGNEE" },
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.CheckUser",
            classConfig: { objId: objMeetingTaskId, keyName: "MEETING_TASK_ASSIGNEE" },
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
      it("setWorkflowStatus", function (done) {
        expect(function () {
          result = {};
          wfDiagram = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.task.ix.functions.CheckUser",
            classConfig: { objId: objMeetingTaskId, keyName: "MEETING_TASK_ASSIGNEE" },
            method: "setWorkflowStatus",
            params: [result, wfDiagram]
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
    describe("RF_sol_meeting_function_Task_CheckUser", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_Task_CheckUser", {
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
      it("should not throw if executed without 'keyName'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_Task_CheckUser", {
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
      it("task checkuser", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_Task_CheckUser", {
            objId: objMeetingTaskId,
            keyName: "MEETING_TASK_ASSIGNEE"
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.userName).toBeDefined();
            expect(jsonResult.userName).toEqual("Administrator");
            expect(jsonResult.isValidUser).toBeDefined();
            expect(jsonResult.isValidUser).toEqual("VALID");
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