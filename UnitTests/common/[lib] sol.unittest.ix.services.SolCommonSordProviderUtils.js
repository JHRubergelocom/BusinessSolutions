
describe("[lib] sol.unittest.ix.services.SolCommonSordProviderUtils", function () {
  var originalTimeout, config, opts, cacheObject, optimizationName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonSordProviderUtils").then(function success(obSolCommonSordProviderUtilsId) {
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
    describe("sol.common.SordProviderUtils", function () {
      it("create", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderUtils",
            classConfig: {},
            method: "create",
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
      it("run", function (done) {
        expect(function () {
          config = { output: [{ source: { type: "SORD", key: "name" }, target: { prop: "name" } }] };
          opts = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderUtils",
            classConfig: {},
            method: "run",
            params: [config, opts]
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("runOptimized", function (done) {
        expect(function () {
          config = { output: [{ source: { type: "SORD", key: "name" }, target: { prop: "name" } }] };
          cacheObject = {};
          optimizationName = "optimization";
          opts = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderUtils",
            classConfig: {},
            method: "runOptimized",
            params: [config, cacheObject, optimizationName, opts]
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