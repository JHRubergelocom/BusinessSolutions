
describe("[service] sol.common.ix.services.GetWorkflowMeta", function () {
  var originalTimeout, flowId, objTempId, succNodes, succNodesIds;

  it("should throw if executed without 'flowId'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_common_service_GetWorkflowMetadata", {
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
  describe("test getworkflowmeta", function () {
    beforeAll(function (done) {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
      expect(function () {
        test.Utils.createTempSord("As.Actions.GetWorkflowMeta", null, null).then(function success(objTempId1) {
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
    it("start Workflow Unittest", function (done) {
      expect(function () {
        test.Utils.startWorkflow("Unittest", "Workflow Unittest", objTempId).then(function success(flowId1) {
          flowId = flowId1;
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
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("getworkflowmeta should return defined result", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetWorkflowMetadata", {
          flowId: flowId
        }).then(function success(jsonConfig) {
          expect(jsonConfig).toBeDefined();
          expect(jsonConfig).not.toBeNull();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    afterAll(function (done) {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      expect(function () {
        test.Utils.getFinishedWorkflows(objTempId).then(function success(wfs) {
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
});