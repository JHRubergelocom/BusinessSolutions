
describe("[function] sol.learning.ix.functions.AddEnrollments", function () {
  var originalTimeout, enrollmentsPath, objIdEnrollments,
      flowIdCourse2, succNodes, succNodesIds,
      course2Path, objIdCourse2, metadataMapping,
      table, columns, map, mapName, key, sord, config, row,
      i1, user, courses, results, mappings, colMap, reference,
      keyDefinition, buf_, rowNo;

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
  describe("Test Lib Functions", function () {
    describe("sol.learning.ix.functions.AddEnrollments", function () {
      it("addKeyToTable", function (done) {
        expect(function () {
          table = [];
          columns = { mapName1: "mapName1" };
          map = {};
          mapName = "mapName1";
          key = "key1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "addKeyToTable",
            params: [table, columns, map, mapName, key]
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
      it("addMapToTable", function (done) {
        expect(function () {
          columns = [];
          sord = {};
          table = [];
          mapName = "mapName1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "addMapToTable",
            params: [columns, sord, table, mapName]
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
      it("adjustConfigForRow", function (done) {
        expect(function () {
          config = { metadataMapping: [] };
          row = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "adjustConfigForRow",
            params: [config, row]
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
      it("arrayOfInt", function (done) {
        expect(function () {
          i1 = 1;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "arrayOfInt",
            params: [i1]
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
      it("batchEnroll", function (done) {
        expect(function () {
          user = 0;
          courses = [];
          results = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "batchEnroll",
            params: [user, courses, results]
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
      it("buildTable", function (done) {
        expect(function () {
          columns = [];
          sord = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "buildTable",
            params: [columns, sord]
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
      it("convertTable", function (done) {
        expect(function () {
          table = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "convertTable",
            params: [table]
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
      it("createEnrollment", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "createEnrollment",
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
      it("extractColumnsFromConfig", function (done) {
        expect(function () {
          mappings = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "extractColumnsFromConfig",
            params: [mappings]
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
      it("generateEmptyTable", function (done) {
        expect(function () {
          colMap = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "generateEmptyTable",
            params: [colMap]
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
      it("getRefs", function (done) {
        expect(function () {
          reference = "R999";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "getRefs",
            params: [reference]
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
      it("getRelatedCourseRefs", function (done) {
        expect(function () {
          reference = "R999";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "getRelatedCourseRefs",
            params: [reference]
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
      it("getValueFromRow", function (done) {
        expect(function () {
          row = {};
          keyDefinition = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "getValueFromRow",
            params: [row, keyDefinition]
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
      it("getValueFromSord", function (done) {
        expect(function () {
          sord = {};
          keyDefinition = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "getValueFromSord",
            params: [sord, keyDefinition]
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
      it("manageEnrollment", function (done) {
        expect(function () {
          config = { user: 0, course: "course1", action: "couldBeALearningPath" };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "manageEnrollment",
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
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2, metadataMapping: [] },
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
      it("rowNotEmpty", function (done) {
        expect(function () {
          row = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "rowNotEmpty",
            params: [row]
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
      it("rowToEnrollment", function (done) {
        expect(function () {
          config = { metadataMapping: [] };
          results = [];
          row = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "rowToEnrollment",
            params: [config, results, row]
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
      it("rowToObject", function (done) {
        expect(function () {
          table = [];
          columns = [];
          buf_ = {};
          rowNo = 1;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "rowToObject",
            params: [table, columns, buf_, rowNo]
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
      it("shouldGetValueFromTable", function (done) {
        expect(function () {
          keyDefinition = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "shouldGetValueFromTable",
            params: [keyDefinition]
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
      it("sizeOfLargestColumn", function (done) {
        expect(function () {
          table = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.AddEnrollments",
            classConfig: { objId: objIdCourse2 },
            method: "sizeOfLargestColumn",
            params: [table]
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