
describe("[function] sol.learning.ix.functions.AddEnrollments", function () {
  var originalTimeout, enrollmentsPath, objIdEnrollments,
      flowIdCourse2, succNodes, succNodesIds,
      course2Path, objIdCourse2, metadataMapping;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("AddEnrollments").then(function success(objTempId) {
        course2Path = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course2";
        test.Utils.getSord(course2Path).then(function success1(sordCourse2) {
          objIdCourse2 = sordCourse2.id;
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
    describe("RF_sol_learning_function_AddEnrollments", function () {
      it("get metadataMapping from learning.config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
            objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning/Configuration/learning.config"
          }).then(function success(configResult) {
            metadataMapping = configResult.config.entities.course.workflowMixins.addparticipants.addenrollments.scriptProperties.metadataMapping;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start Workflow Unittest on Course2", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest on Course2", objIdCourse2).then(function success(flowId) {
            flowIdCourse2 = flowId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Prepare Enrollments", function (done) {
        expect(function () {
          test.Utils.updateWfMapData(flowIdCourse2, objIdCourse2, { COURSE_ENROLLMENT_USER1: "Administrator", COURSE_ENROLLMENT_STATUS1: "ENROLLED" }).then(function success(updateMapDataResult) {
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
          test.Utils.execute("RF_sol_learning_function_AddEnrollments", {
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
          test.Utils.execute("RF_sol_learning_function_AddEnrollments", {
            objId: objIdCourse2
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
      it("add enrollments", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_AddEnrollments", {
            objId: objIdCourse2,
            flowId: flowIdCourse2,
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
          test.Utils.getWorkflow(flowIdCourse2).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowIdCourse2, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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
      it("remove enrollments", function (done) {
        expect(function () {
          enrollmentsPath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course2/Enrollments";
          test.Utils.getSord(enrollmentsPath).then(function success(sordEnrollments) {
            objIdEnrollments = sordEnrollments.id;
            test.Utils.deleteSord(objIdEnrollments).then(function success1(deleteResult) {
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