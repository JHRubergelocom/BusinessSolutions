
describe("[function] sol.common.ix.functions.ChangeWfName", function () {
  var originalTimeout, objChangeWfNameId, flowId, succNodes, succNodesIds,
      config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("objChangeWfName", { UNITTEST_STATUS3: "13", UNITTEST_STATUS4: "14" }).then(function success(objChangeWfNameId1) {
        objChangeWfNameId = objChangeWfNameId1;
        test.Utils.startWorkflow("Unittest", "Unittest", objChangeWfNameId).then(function success1(flowId1) {
          flowId = flowId1;
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
    describe("sol.common.ix.functions.ChangeWfName", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeWfName",
            classConfig: { objId: objChangeWfNameId, flowId: flowId, name: "XX" },
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ChangeWfName",
            classConfig: { objId: objChangeWfNameId, flowId: flowId, name: "XX" },
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
  describe("test ChangeWfName", function () {
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeWfName", {
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
    it("should throw if executed without 'flowId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeWfName", {
          objId: objChangeWfNameId
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
    it("should throw if executed without 'name'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeWfName", {
          objId: objChangeWfNameId,
          flowId: flowId
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
    it("ChangeWfName", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ChangeWfName", {
          objId: objChangeWfNameId,
          flowId: flowId,
          name: "XX"
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
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getWorkflow(flowId).then(function success(workflow) {
        succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
        succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
        test.Utils.forwardWorkflowTask(flowId, "1", succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
          test.Utils.getFinishedWorkflows().then(function success2(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
              test.Utils.getTempfolder().then(function success4(tempfolder) {
                test.Utils.deleteSord(tempfolder).then(function success5(deleteResult) {
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