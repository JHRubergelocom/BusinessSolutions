
describe("[function] sol.common.ix.functions.ParallelSectionStart", function () {
  var originalTimeout, config, objParallelSectionStartId,
      flowId, workflow, succNodes, succNodesIds,
      wfDiagram, nodeId, parallelSectionInfo, parallelSectionId,
      startNodeId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ParallelSectionStart").then(function success(objParallelSectionStartId1) {
        objParallelSectionStartId = objParallelSectionStartId1;
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
    describe("sol.common.ix.functions.ParallelSectionStart", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", objParallelSectionStartId).then(function success(flowId1) {
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
      it("get Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success(workflow1) {
            workflow = workflow1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("collectNode", function (done) {
        expect(function () {
          wfDiagram = workflow;
          nodeId = 1;
          parallelSectionInfo = {};
          parallelSectionId = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ParallelSectionStart",
            classConfig: { wfDiagram: workflow },
            method: "collectNode",
            params: [wfDiagram, nodeId, parallelSectionInfo, parallelSectionId]
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
      it("collectParallelNodes", function (done) {
        expect(function () {
          wfDiagram = workflow;
          startNodeId = 1;
          parallelSectionId = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ParallelSectionStart",
            classConfig: { wfDiagram: workflow },
            method: "collectParallelNodes",
            params: [wfDiagram, startNodeId, parallelSectionId]
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
      it("getSuccessorAssocs", function (done) {
        expect(function () {
          wfDiagram = workflow;
          nodeId = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ParallelSectionStart",
            classConfig: { wfDiagram: workflow },
            method: "getSuccessorAssocs",
            params: [wfDiagram, nodeId]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.ParallelSectionStart",
            classConfig: { wfDiagram: workflow },
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
            className: "sol.common.ix.functions.ParallelSectionStart",
            classConfig: { wfDiagram: workflow },
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
      it("finish Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow1) {
            succNodes = test.Utils.getSuccessorNodes(workflow1, "1", null, "node 2");
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
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
              test.Utils.getActiveWorkflows().then(function success2(wfs1) {
                test.Utils.removeActiveWorkflows(wfs1).then(function success3(removeFinishedWorkflowsResult1) {
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