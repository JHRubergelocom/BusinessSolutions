
describe("[lib] sol.unittest.ix.services.SolCommonElementService", function () {
  var originalTimeout, config, opt, cfg;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonElementService").then(function success(obSolCommonElementServiceId) {
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
    describe("sol.common.mixins.ElementService", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.mixins.ElementService",
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
      it("sanitizeElementServiceConfig", function (done) {
        expect(function () {
          opt = { name: "RF_unittest" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.mixins.ElementService",
            classConfig: {},
            method: "sanitizeElementServiceConfig",
            params: [opt]
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
      it("executeElementService", function (done) {
        expect(function () {
          cfg = { name: "RF_unittest" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.mixins.ElementService",
            classConfig: {},
            method: "executeElementService",
            params: [cfg]
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