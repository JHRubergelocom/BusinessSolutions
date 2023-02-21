
describe("[function] sol.learning.ix.functions.PrepareSessionConclusion", function () {
  var originalTimeout, course4Path, objIdCourse4, metadataMapping, flowIdCourse4,
      config, participants, flattenedArray, arr, participant, field,
      availableParticipants, tableType, propsInParticipant, propCounters,
      entries, prop, succNodes, succNodesIds, sessionsPath, objIdSessions, 
      wfDiagram;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("PrepareSessionConclusion").then(function success(objPrepareSessionConclusionId) {
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
  describe("Test Lib Functions", function () {
    describe("sol.learning.ix.functions.PrepareSessionConclusion", function () {
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
      it("searchParticipants", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.PrepareSessionConclusion",
            classConfig: { objId: objIdCourse4, flowId: flowIdCourse4, search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }], setting: "standard", masks: [""] },
            method: "searchParticipants",
            params: []
          }).then(function success(jsonResult) {
            participants = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("generateSETConfig", function (done) {
        expect(function () {
          participants = participants;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.PrepareSessionConclusion",
            classConfig: { objId: objIdCourse4, flowId: flowIdCourse4, search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }], setting: "standard" },
            method: "generateSETConfig",
            params: [participants]
          }).then(function success(jsonResult) {
            config = jsonResult; 
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("addParticipantsToFormTable", function (done) {
        expect(function () {
          config = config;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.PrepareSessionConclusion",
            classConfig: { objId: objIdCourse4, flowId: flowIdCourse4, search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }], setting: "standard" },
            method: "addParticipantsToFormTable",
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
      it("concatInto", function (done) {
        expect(function () {
          flattenedArray = [];
          arr = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.PrepareSessionConclusion",
            classConfig: { objId: objIdCourse4, flowId: flowIdCourse4, search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }], setting: "standard" },
            method: "concatInto",
            params: [flattenedArray, arr]
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
      it("fillEmptyValueInParticipant", function (done) {
        expect(function () {
          participant = participants[0];
          field = "field1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.PrepareSessionConclusion",
            classConfig: { objId: objIdCourse4, flowId: flowIdCourse4, search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }], setting: "standard" },
            method: "fillEmptyValueInParticipant",
            params: [participant, field]
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
      it("generateSearchConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.PrepareSessionConclusion",
            classConfig: { objId: objIdCourse4, flowId: flowIdCourse4, search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }], setting: "standard" },
            method: "generateSearchConfig",
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
      it("get wfDiagram", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowIdCourse4).then(function success(workflow) {
            wfDiagram = workflow;
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
            className: "sol.learning.ix.functions.PrepareSessionConclusion",
            classConfig: { objId: objIdCourse4, flowId: flowIdCourse4, search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }], setting: "standard", masks: [""], wfDiagram: wfDiagram },
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
      it("removeSessionFilter", function (done) {
        expect(function () {
          config = {
            masks: [""],
            search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }],
            setting: "standard",
            options: { allowEmptyMask: true },
            output: [{ source: { type: "SORD", key: "id" }, target: { prop: "COURSE_ENROLLMENT_OBJID" } }]
          };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.PrepareSessionConclusion",
            classConfig: { objId: objIdCourse4, flowId: flowIdCourse4, search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }], setting: "standard" },
            method: "removeSessionFilter",
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
      it("get wfDiagram", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowIdCourse4).then(function success(workflow) {
            wfDiagram = workflow;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setWfStatus", function (done) {
        expect(function () {
          availableParticipants = 0;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.PrepareSessionConclusion",
            classConfig: { objId: objIdCourse4, flowId: flowIdCourse4, search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }], setting: "standard", wfDiagram: wfDiagram },
            method: "setWfStatus",
            params: [availableParticipants]
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
      it("toEntries", function (done) {
        expect(function () {
          tableType = "tableType1";
          propsInParticipant = {};
          propCounters = {};
          participant = participants[0];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.PrepareSessionConclusion",
            classConfig: { objId: objIdCourse4, flowId: flowIdCourse4, search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }], setting: "standard" },
            method: "toEntries",
            params: [tableType, propsInParticipant, propCounters, participant]
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
      it("toEntry", function (done) {
        expect(function () {
          tableType = "tableType1";
          participant = participants[0];
          propCounters = {};
          entries = [];
          prop = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.PrepareSessionConclusion",
            classConfig: { objId: objIdCourse4, flowId: flowIdCourse4, search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }], setting: "standard" },
            method: "toEntry",
            params: [tableType, participant, propCounters, entries, prop]
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
      it("toFilled", function (done) {
        expect(function () {
          participant = participants[0];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.PrepareSessionConclusion",
            classConfig: { objId: objIdCourse4, flowId: flowIdCourse4, search: [{ key: "SOL_TYPE", value: "COURSE_ENROLLMENT" }], setting: "standard", fillEmptyValues: [] },
            method: "toFilled",
            params: [participant]
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