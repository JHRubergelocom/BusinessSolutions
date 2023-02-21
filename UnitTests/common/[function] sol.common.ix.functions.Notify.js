
describe("[function] sol.common.ix.functions.Notify", function () {
  var originalTimeout, config, objNotifyId, flowId, succNodes, succNodesIds;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("objNotify").then(function success(objNotifyId1) {
        objNotifyId = objNotifyId1;
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
    describe("sol.common.ix.functions.Notify", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", objNotifyId).then(function success(flowId1) {
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Notify",
            classConfig: {
              params: {
                flowId: flowId,
                nodeId: "1",
                objId: objNotifyId,
                mode: "run",
                from: "test-business-solutions@elo.local",
                to: "test-business-solutions@elo.local",
                subject: "Neue Aufgabe",
                body: {
                  type: "html",
                  tplObjId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/Notify"
                }
              }
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Notify",
            classConfig: {
              params: {
                flowId: flowId,
                nodeId: "1",
                objId: objNotifyId,
                mode: "run",
                from: "test-business-solutions@elo.local",
                to: "test-business-solutions@elo.local",
                subject: "Neue Aufgabe",
                body: {
                  type: "html",
                  tplObjId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/Notify"
                }
              }
            },
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
  describe("test Notify", function () {
    it("should not throw if executed without parameters", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Notify", {
        }).then(function success(jsonResult) {
          done();
        }, function error(err) {
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("Notification type. Default is 'e-mail'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Notify", {
          objId: "ARCPATH:/Administration/Business Solutions/dev_internal/Notify",
          mode: "run",
          from: "test-business-solutions@elo.local",
          to: {
            type: "CURRENT"
          },
          subject: "Neue Aufgabe",
          body: {
            type: "html",
            tplObjId: "ARCPATH:/Administration/Business Solutions/development/Configuration/Mail templates/Notification"
          }
        }).then(function success(jsonResult) {
          done();
        }, function error(err) {
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