
describe("[libix] sol.unittest.ix.services.SolPubsecRoutines", function () {
  var originalTimeout, name, routine, id, flowId, config, objId, routineTpl,
      status, routineId, obSolPubsecRoutinesId, routines, sord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolPubsecRoutines").then(function success(obSolPubsecRoutinesId1) {
        obSolPubsecRoutinesId = obSolPubsecRoutinesId1;
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
    describe("sol.pubsec.ix.Routines", function () {
      it("addRoutine", function (done) {
        expect(function () {
          name = "name1";
          routine = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "addRoutine",
            params: [name, routine]
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
      it("enhanceRoutinesFromDesc", function (done) {
        expect(function () {
          routines = "routines1";
          sord = "sord1";
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "enhanceRoutinesFromDesc",
            params: [routines, sord]
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
      it("enrichWithDirectiveData", function (done) {
        expect(function () {
          routine = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "enrichWithDirectiveData",
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
      it("enrichWithSigningData", function (done) {
        expect(function () {
          routine = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "enrichWithSigningData",
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
      it("getActiveSteps", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "getActiveSteps",
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
      it("getExternalRoutineObjId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "getExternalRoutineObjId",
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
      it("getMinimizedRoutineData", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "getMinimizedRoutineData",
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
      it("getNextId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "getNextId",
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
      it("getProcessSord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "getProcessSord",
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
      it("getRoutine", function (done) {
        expect(function () {
          id = 0;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "getRoutine",
            params: [id]
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
      it("getRoutineByFlowId", function (done) {
        expect(function () {
          flowId = 9999;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "getRoutineByFlowId",
            params: [flowId]
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
      it("getRoutineSord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId, isTemplate: true },
            method: "getRoutineSord",
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
      it("getRoutines", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "getRoutines",
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
      it("getRoutinesFromDesc", function (done) {
        expect(function () {
          sord = "sord1";
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "getRoutinesFromDesc",
            params: [sord]
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
      it("hasReadRightsOnProcessSord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "hasReadRightsOnProcessSord",
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
      it("initRoutines", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "initRoutines",
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
      it("initialize", function (done) {
        expect(function () {
          config = { objId: obSolPubsecRoutinesId };
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
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
      it("isMultipleRoutinesSupported", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "isMultipleRoutinesSupported",
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
      it("normalizeObjId", function (done) {
        expect(function () {
          objId = obSolPubsecRoutinesId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "normalizeObjId",
            params: [objId]
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
      it("refresh", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "refresh",
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
      it("retrieveActiveStep", function (done) {
        expect(function () {
          routine = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "retrieveActiveStep",
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
      it("retrieveRoutines", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "retrieveRoutines",
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
      it("save", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "save",
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
      it("saveExternalRoutine", function (done) {
        expect(function () {
          name = "name1";
          routineTpl = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId, isTemplate: true },
            method: "saveExternalRoutine",
            params: [name, routineTpl]
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
      it("setRoutineStatus", function (done) {
        expect(function () {
          status = "status1";
          routineId = 0;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "setRoutineStatus",
            params: [status, routineId]
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
      it("shouldRetrieveRoutinesFromDesc", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "shouldRetrieveRoutinesFromDesc",
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
          routine = {};
          id = 0;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.Routines",
            classConfig: { objId: obSolPubsecRoutinesId },
            method: "updateRoutine",
            params: [routine, id]
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