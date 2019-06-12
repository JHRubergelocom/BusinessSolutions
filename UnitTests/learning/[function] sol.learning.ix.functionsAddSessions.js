
describe("[function] sol.learning.ix.functions.AddSessions", function () {
  var originalTimeout, sessionsPath, objIdSessions,
      flowIdCourse4, succNodes, succNodesIds,
      course4Path, objIdCourse4, metadataMapping;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("AddSessions").then(function success(objTempId) {
        course4Path = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course4";
        test.Utils.getSord(course4Path).then(function success1(sordCourse4) {
          objIdCourse4 = sordCourse4.id;
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_learning_function_AddSessions", function () {
      it("get metadataMapping from learning.config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
            objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning/Configuration/learning.config"
          }).then(function success(configResult) {
            metadataMapping = configResult.config.entities.course.workflowMixins.addsessions.addsessions.scriptProperties.metadataMapping;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start Workflow Unittest on Course4", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest on Course4", objIdCourse4).then(function success(flowId) {
            flowIdCourse4 = flowId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Prepare Sessions", function (done) {
        expect(function () {
          test.Utils.updateWfMapData(flowIdCourse4, objIdCourse4, { SESSION_TEMPLATE1: "Online", SESSION_NAME1: "Virtual Classroom", SESSION_STARTTIME1: "201901011200" }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_AddSessions", {
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
      it("should throw if executed without 'metadataMapping'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_AddSessions", {
            objId: objIdCourse4
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
      it("add sessions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_AddSessions", {
            objId: objIdCourse4,
            flowId: flowIdCourse4,
            metadataMapping: metadataMapping
          }).then(function success(jsonResult) {
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("finish Workflow Unittest on Signature1", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowIdCourse4).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowIdCourse4, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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
      it("remove sessions", function (done) {
        expect(function () {
          sessionsPath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course4/Sessions";
          test.Utils.getSord(sessionsPath).then(function success(sordSessions) {
            objIdSessions = sordSessions.id;
            test.Utils.deleteSord(objIdSessions).then(function success1(deleteResult) {
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
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
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