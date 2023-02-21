
describe("[function] sol.hr.ix.functions.FeedCommentPersonnelFile", function () {
  var objFeedCommentPersonnelFileId, flowId, succNodes, succNodesIds, originalTimeout,
      workflowUT, fct, paramObj, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("FeedCommentPersonnelFile").then(function success(objFeedCommentPersonnelFileId1) {
        objFeedCommentPersonnelFileId = objFeedCommentPersonnelFileId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.hr.ix.functions.FeedCommentPersonnelFile", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", objFeedCommentPersonnelFileId).then(function success(flowId1) {
            flowId = flowId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get Workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow) {
            workflowUT = workflow;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("executeIxFunctionAsAdministrator", function (done) {
        expect(function () {
          fct = "RF_sol_function_FeedComment";
          paramObj = { objId: objFeedCommentPersonnelFileId, writeToObjId: objFeedCommentPersonnelFileId, userGuid: 0, file: "sol.hr", key: "HR.CREATED" };
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.FeedCommentPersonnelFile",
            classConfig: { objId: objFeedCommentPersonnelFileId, flowId: flowId, wfOwnerName: workflowUT.wfOwnerName, wfCurrentUser: 0, file: "sol.hr", key: "HR.CREATED" },
            method: "executeIxFunctionAsAdministrator",
            params: [fct, paramObj]
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
          params = { objId: objFeedCommentPersonnelFileId, flowId: flowId, wfOwnerName: workflowUT.wfOwnerName, wfCurrentUser: 0, file: "sol.hr", key: "HR.CREATED" };
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.FeedCommentPersonnelFile",
            classConfig: { objId: objFeedCommentPersonnelFileId, flowId: flowId, wfOwnerName: workflowUT.wfOwnerName, wfCurrentUser: 0, file: "sol.hr", key: "HR.CREATED" },
            method: "process",
            params: [params]
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
      it("finish Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowId, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getFinishedWorkflows(objFeedCommentPersonnelFileId).then(function success(wfs) {
        test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
          test.Utils.getTempfolder().then(function success2(tempfolder) {
            test.Utils.deleteSord(tempfolder).then(function success3(deleteResult) {
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