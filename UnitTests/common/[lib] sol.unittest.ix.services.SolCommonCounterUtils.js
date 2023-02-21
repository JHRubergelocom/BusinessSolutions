
describe("[lib] sol.unittest.ix.services.SolCommonCounterUtils", function () {
  var originalTimeout, name, value, noInc, defaultValue;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonCounterUtils").then(function success(obSolCommonCounterUtilsId) {
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
    describe("sol.common.CounterUtils", function () {
      it("create", function (done) {
        expect(function () {
          name = "UnittestCounter";
          value = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.CounterUtils",
            classConfig: {},
            method: "create",
            params: [name, value]
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
      it("exists", function (done) {
        expect(function () {
          name = "UnittestCounter";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.CounterUtils",
            classConfig: {},
            method: "exists",
            params: [name]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getValue", function (done) {
        expect(function () {
          name = "UnittestCounter";
          noInc = false;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.CounterUtils",
            classConfig: {},
            method: "getValue",
            params: [name, noInc]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(1);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getValue", function (done) {
        expect(function () {
          name = "UnittestCounter";
          noInc = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.CounterUtils",
            classConfig: {},
            method: "getValue",
            params: [name, noInc]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(2);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("incCounter", function (done) {
        expect(function () {
          name = "UnittestCounter";
          defaultValue = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.CounterUtils",
            classConfig: {},
            method: "incCounter",
            params: [name, defaultValue]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(2);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("normalizeName", function (done) {
        expect(function () {
          name = "UnittestCounter&Test";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.CounterUtils",
            classConfig: {},
            method: "normalizeName",
            params: [name]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("UNITTESTCOUNTER__TEST");
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