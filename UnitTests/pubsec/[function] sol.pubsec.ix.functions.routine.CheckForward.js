/* eslint-disable linebreak-style */

describe("[function] sol.pubsec.ix.functions.routine.CheckForward", function () {
  var originalTimeout, objRoutineId, objProcessId, activeStep, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CheckForward").then(function success(objTempId) {
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
    describe("sol.pubsec.ix.functions.routine.CheckForward", function () {
      it("allMandatoryDirectivesStarted", function (done) {
        expect(function () {
          activeStep = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.routine.CheckForward",
            classConfig: {},
            method: "allMandatoryDirectivesStarted",
            params: [activeStep]
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
      it("allMandatorySigningsStarted", function (done) {
        expect(function () {
          activeStep = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.routine.CheckForward",
            classConfig: {},
            method: "allMandatorySigningsStarted",
            params: [activeStep]
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
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.routine.CheckForward",
            classConfig: {},
            method: "getSigningCount",
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
          config = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.functions.routine.CheckForward",
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
            className: "sol.pubsec.ix.functions.routine.CheckForward",
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
    describe("RF_sol_pubsec_function_routine_CheckForward", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_function_routine_CheckForward", {
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
      it("should throw if executed without Parameter 'routineId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_function_routine_CheckForward", {
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
      it("should receive result ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_function_routine_CheckForward", {
            objId: objProcessId,
            routineId: objRoutineId
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.allowed).toBeDefined();
            expect(jsonResult.allowed).toEqual(true);
            expect(jsonResult.reasons).toBeDefined();
            expect(jsonResult.reasons.length).toEqual(0);
            done();
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