/* eslint-disable linebreak-style */

describe("[service] sol.pubsec.ix.services.Routines", function () {
  var originalTimeout, objRoutineId, objProcessId, flowId,
      userNodes, nodeIdUserProcessing, succNodes, succNodesIds,
      config, routine, activeNode, obj, processSord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Routines").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/pubsec [unit tests]/Test data/Routine").then(function success2(objRoutineId1) {
          objRoutineId = objRoutineId1;
          test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/pubsec [unit tests]/Test data/Process").then(function success3(objProcessId1) {
            objProcessId = objProcessId1;
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
  describe("Test Lib Functions", function () {
    describe("sol.pubsec.ix.services.ForwardRoutine", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.ForwardRoutine",
            classConfig: {},
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
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.ForwardRoutine",
            classConfig: {},
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
    describe("sol.pubsec.ix.services.Routines", function () {
      it("addRoutine", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.Routines",
            classConfig: {},
            method: "addRoutine",
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
      it("getActiveNode", function (done) {
        expect(function () {
          routine = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.Routines",
            classConfig: {},
            method: "getActiveNode",
            params: [routine]
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
      it("getSuccessorNodes", function (done) {
        expect(function () {
          activeNode = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.Routines",
            classConfig: {},
            method: "getSuccessorNodes",
            params: [activeNode]
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
      it("initProcessSord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.Routines",
            classConfig: {},
            method: "initProcessSord",
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
      it("initWfDiagram", function (done) {
        expect(function () {
          routine = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.Routines",
            classConfig: {},
            method: "initWfDiagram",
            params: [routine]
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
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.Routines",
            classConfig: {},
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
      it("readAdditionalData", function (done) {
        expect(function () {
          obj = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.Routines",
            classConfig: {},
            method: "readAdditionalData",
            params: [obj]
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
      it("readProcessData", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.Routines",
            classConfig: {},
            method: "readProcessData",
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
      it("readRoutines", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.Routines",
            classConfig: {},
            method: "readRoutines",
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
      it("updateRoutine", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.Routines",
            classConfig: {},
            method: "updateRoutine",
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
    describe("sol.pubsec.ix.services.StartRoutine", function () {
      it("buildWfName", function (done) {
        expect(function () {
          processSord = { id: objProcessId };
          routine = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.StartRoutine",
            classConfig: {},
            method: "buildWfName",
            params: [processSord, routine]
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
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.StartRoutine",
            classConfig: {},
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
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.StartRoutine",
            classConfig: {},
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_pubsec_service_AddRoutine", function () {
      it("should throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_AddRoutine", {
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
      it("should throw if executed without Parameter 'name' ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_AddRoutine", {
            objId: objProcessId
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
      it("add routine if executed with Parameter {'objId': objProcessId, 'name': 'XYZ'}", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_AddRoutine", {
            objId: objProcessId,
            name: "XYZ"
          }).then(function success(jsonResult) {
            expect(jsonResult.steps).toBeDefined();
            expect(jsonResult.name).toBeDefined();
            expect(jsonResult.name).toEqual("XYZ");
            expect(jsonResult.id).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("add routine if executed with Parameter {'objId': objProcessId, 'name': 'XYZ', routine: {'templateName': 'Mustergeschäftsgang'}}", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_AddRoutine", {
            objId: objProcessId,
            name: "XYZ",
            templateName: "Mustergeschäftsgang"
          }).then(function success(jsonResult) {
            expect(jsonResult.steps).toBeDefined();
            expect(jsonResult.name).toBeDefined();
            expect(jsonResult.name).toEqual("XYZ");
            expect(jsonResult.id).toBeDefined();
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
    describe("RF_sol_pubsec_service_GetRoutine", function () {
      it("should throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_GetRoutine", {
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
      it("get routine if executed with Parameter {'objId': objRoutineId}", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_GetRoutine", {
            objId: objRoutineId,
            isTemplate: true
          }).then(function success(jsonResult) {
            expect(jsonResult.routines).toBeDefined();
            expect(jsonResult.routineTemplates).toBeDefined();
            expect(jsonResult.options).toBeDefined();
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
    describe("RF_sol_pubsec_service_UpdateRoutine", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_UpdateRoutine", {
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
      it("should throw if executed without Parameter 'routine'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_UpdateRoutine", {
            objId: objRoutineId
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
      it("update routine if executed with Parameter {'objId': objRoutineId, 'routine': {}}", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_UpdateRoutine", {
            objId: objRoutineId,
            routine: {}
          }).then(function success(jsonResult) {
            expect(jsonResult);
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
    describe("RF_sol_pubsec_service_StartRoutine", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_StartRoutine", {
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
      it("should throw if executed with invalid Parameter {'objId': 1}", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_StartRoutine", {
            objId: 1
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
      it("start routine if executed with Parameter {'objId': objProcessId}", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_StartRoutine", {
            objId: objProcessId,
            isTemplate: true
          }).then(function success(jsonResult) {
            flowId = jsonResult.flowId;
            expect(jsonResult.flowId).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("workflow 'so.pubsec.process.routine.dynamic' must be startet", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success(workflow) {
            expect(workflow.templateName).toEqual("sol.pubsec.process.routine.dynamic");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("'Forward' workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success(workflow) {
            userNodes = test.Utils.getActiveUserNodes(workflow);
            if (userNodes.length > 0) {
              nodeIdUserProcessing = userNodes[0].id;
              succNodes = test.Utils.getSuccessorNodes(workflow, nodeIdUserProcessing, null, "sol.pubsec.process.routine.forward");
              succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
              test.Utils.forwardWorkflowTask(flowId, nodeIdUserProcessing, succNodesIds, "Unittest 'Forward'").then(function success1(forwardWorkflowTaskResult1) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            } else {
              done();
            }
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("'Finish' workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success(workflow) {
            userNodes = test.Utils.getActiveUserNodes(workflow);
            if (userNodes.length > 0) {
              nodeIdUserProcessing = userNodes[0].id;
              succNodes = test.Utils.getSuccessorNodes(workflow, nodeIdUserProcessing, null, "sol.pubsec.process.routine.close");
              succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
              test.Utils.forwardWorkflowTask(flowId, nodeIdUserProcessing, succNodesIds, "Unittest 'Finish'").then(function success1(forwardWorkflowTaskResult1) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            } else {
              done();
            }
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflow", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows(objProcessId).then(function success(wfs) {
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
    describe("RF_sol_pubsec_service_ForwardRoutine", function () {
      it("start routine if executed with Parameter {'objId': objProcessId}", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_StartRoutine", {
            objId: objProcessId,
            isTemplate: true
          }).then(function success(jsonResult) {
            flowId = jsonResult.flowId;
            expect(jsonResult.flowId).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("workflow 'so.pubsec.process.routine.dynamic' must be startet", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success(workflow) {
            expect(workflow.templateName).toEqual("sol.pubsec.process.routine.dynamic");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without Parameter 'flowId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_ForwardRoutine", {
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
      it("should throw if executed without Parameter 'currentNodeId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_ForwardRoutine", {
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
      it("should throw if executed without Parameter 'successorNodeId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_ForwardRoutine", {
            flowId: flowId,
            currentNodeId: 3
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
      it("'Forward' workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success(workflow) {
            userNodes = test.Utils.getActiveUserNodes(workflow);
            if (userNodes.length > 0) {
              nodeIdUserProcessing = userNodes[0].id;
              succNodes = test.Utils.getSuccessorNodes(workflow, nodeIdUserProcessing, null, "sol.pubsec.process.routine.forward");
              succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
              test.Utils.execute("RF_sol_pubsec_service_ForwardRoutine", {
                flowId: flowId,
                currentNodeId: nodeIdUserProcessing,
                successorNodeId: succNodesIds[0]
              }).then(function success1(jsonResult) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            } else {
              done();
            }
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("'Finish' workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success(workflow) {
            userNodes = test.Utils.getActiveUserNodes(workflow);
            if (userNodes.length > 0) {
              nodeIdUserProcessing = userNodes[0].id;
              succNodes = test.Utils.getSuccessorNodes(workflow, nodeIdUserProcessing, null, "sol.pubsec.process.routine.close");
              succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
              test.Utils.execute("RF_sol_pubsec_service_ForwardRoutine", {
                flowId: flowId,
                currentNodeId: nodeIdUserProcessing,
                successorNodeId: succNodesIds[0]
              }).then(function success1(jsonResult) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            } else {
              done();
            }
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflow", function (done) {
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