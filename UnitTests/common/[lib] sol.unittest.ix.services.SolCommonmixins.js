
describe("[lib] sol.unittest.ix.services.SolCommonmixins", function () {
  var originalTimeout, filter, obj;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonmixins").then(function success(obSolCommonmixinsId) {
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
    describe("sol.common.mixins.Inject", function () {
      it("initialize", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.mixins.Inject",
            classConfig: {},
            method: "initialize",
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
    describe("sol.common.mixins.ObjectFilter", function () {
      it("generateFilter", function (done) {
        expect(function () {
          filter = [{ prop: "sordMetadata.mapKeys.SOLUTION_FIELD", value: ["A -*", "B -*"] }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.mixins.ObjectFilter",
            classConfig: {},
            method: "generateFilter",
            params: [filter]
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
      it("matchObject", function (done) {
        expect(function () {
          filter = [];
          obj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.mixins.ObjectFilter",
            classConfig: {},
            method: "matchObject",
            params: [filter, obj]
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