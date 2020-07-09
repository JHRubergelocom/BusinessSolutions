
describe("[function] sol.learning.ix.functions.InitiateSessionConclusion", function () {
  var originalTimeout, sessionsPath, objIdSessions,
      flowIdCourse5, succNodes, succNodesIds,
      course5Path, objIdCourse5, metadataMapping;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("InitiateSessionConclusion").then(function success(objTempId) {
        course5Path = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course5";
        test.Utils.getSord(course5Path).then(function success1(sordCourse5) {
          objIdCourse5 = sordCourse5.id;
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
    describe("add session", function () {
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
      it("start Workflow Unittest on Course5", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest on Course5", objIdCourse5).then(function success(flowId) {
            flowIdCourse5 = flowId;
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
          test.Utils.updateWfMapData(flowIdCourse5, objIdCourse5, { SESSION_TEMPLATE1: "Online", SESSION_NAME1: "Virtual Classroom", SESSION_STARTTIME1: "201901011200" }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("add sessions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_AddSessions", {
            objId: objIdCourse5,
            flowId: flowIdCourse5,
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
          test.Utils.getWorkflow(flowIdCourse5).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowIdCourse5, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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
    describe("RF_sol_learning_function_InitiateSessionConclusion", function () {
      it("get metadataMapping from learning.config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
            objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning/Configuration/learning.config"
          }).then(function success(configResult) {
            metadataMapping = configResult.config.entities.session.workflowMixins.endSession.initiatesessionconclusion.scriptProperties.metadataMapping;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start Workflow Unittest on Course5", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest on Course5", objIdCourse5).then(function success(flowId) {
            flowIdCourse5 = flowId;
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
          test.Utils.updateWfMapData(flowIdCourse5, objIdCourse5, { SESSION_TEMPLATE1: "Online", SESSION_NAME1: "Virtual Classroom", SESSION_STARTTIME1: "201901011200" }).then(function success(updateMapDataResult) {
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
          test.Utils.execute("RF_sol_learning_function_InitiateSessionConclusion", {
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
          test.Utils.execute("RF_sol_learning_function_InitiateSessionConclusion", {
            objId: objIdCourse5
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
      it("initiate session conclusion", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_InitiateSessionConclusion", {
            objId: objIdCourse5,
            flowId: flowIdCourse5,
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
          test.Utils.getWorkflow(flowIdCourse5).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowIdCourse5, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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
          sessionsPath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course5/Sessions";
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