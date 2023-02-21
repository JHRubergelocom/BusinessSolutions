
describe("[libix] sol.unittest.ix.services.SolPubsecProcessUtils", function () {
  var originalTimeout, name, process, flowId, objId, step, sord, defaultReturnValue, inc,
      obSolPubsecProcessUtilsId, objProcessId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolPubsecProcessUtils").then(function success(obSolPubsecProcessUtilsId1) {
        obSolPubsecProcessUtilsId = obSolPubsecProcessUtilsId1;
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
    describe("sol.pubsec.ix.ProcessUtils", function () {
      it("createCirculationFolder", function (done) {
        expect(function () {
          name = "name1";
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "createCirculationFolder",
            params: [name]
          }).then(function success(jsonResult) {
            objId = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove CirculationFolder", function (done) {
        expect(function () {
          test.Utils.deleteSord(objId).then(function success1(deleteResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("create process", function (done) {
        expect(function () {
          test.Utils.createSord(obSolPubsecProcessUtilsId, "Process", "TestProcess").then(function success(objProcessId1) {
            objProcessId = objProcessId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("decrementSigningCounter", function (done) {
        expect(function () {
          process = objProcessId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "decrementSigningCounter",
            params: [process]
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
      it("getCirculationFolderArcpath", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "getCirculationFolderArcpath",
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
      it("getCirculationFolderName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "getCirculationFolderName",
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
      it("getMapKeyForRoutineId", function (done) {
        expect(function () {
          flowId = 9999;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "getMapKeyForRoutineId",
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
      it("getParentProcess", function (done) {
        expect(function () {
          objId = objProcessId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "getParentProcess",
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
      it("getSigningCount", function (done) {
        expect(function () {
          process = objProcessId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "getSigningCount",
            params: [process]
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
      it("incrementSigningCounter", function (done) {
        expect(function () {
          process = objProcessId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "incrementSigningCounter",
            params: [process]
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
      it("isActive", function (done) {
        expect(function () {
          step = { activated: true };
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "isActive",
            params: [step]
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
      it("isClosed", function (done) {
        expect(function () {
          sord = objProcessId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "isClosed",
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
      it("isNotDone", function (done) {
        expect(function () {
          step = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "isNotDone",
            params: [step]
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
      it("isOpen", function (done) {
        expect(function () {
          sord = objProcessId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "isOpen",
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
      it("isProcessesInstalled", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "isProcessesInstalled",
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
      it("loadConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "loadConfig",
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
      it("moveRoutineIdToFlow", function (done) {
        expect(function () {
          objId = objProcessId;
          flowId = 9999;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "moveRoutineIdToFlow",
            params: [objId, flowId]
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
      it("retrieveCurrentRoutineIdFromWorkflowOrSord", function (done) {
        expect(function () {
          objId = objProcessId;
          flowId = 9999;
          defaultReturnValue = 8888;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "retrieveCurrentRoutineIdFromWorkflowOrSord",
            params: [objId, flowId, defaultReturnValue]
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
      it("updateSigningCounter", function (done) {
        expect(function () {
          process = objProcessId;
          inc = true;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "updateSigningCounter",
            params: [process, inc]
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
      it("useMapForRoutines", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.ProcessUtils",
            classConfig: {},
            method: "useMapForRoutines",
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