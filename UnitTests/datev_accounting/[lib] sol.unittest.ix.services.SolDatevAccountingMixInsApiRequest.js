
describe("[lib] sol.unittest.ix.services.SolDatevAccountingMixInsApiRequest", function () {
  var originalTimeout, url, config, object;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolDatevAccountingMixInsApiRequest").then(function success(obSolDatevAccountingMixInsApiRequestId) {
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
    describe("sol.datev.accounting.mixins.ApiRequest", function () {
      it("getResourceByUrl", function (done) {
        expect(function () {
          url = "url1";
          config = {};
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.datev.accounting.mixins.ApiRequest",
            classConfig: {},
            method: "getResourceByUrl",
            params: [url, config]
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
      it("resolveUrl", function (done) {
        expect(function () {
          url = "url1";
          object = {};
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.datev.accounting.mixins.ApiRequest",
            classConfig: {},
            method: "resolveUrl",
            params: [url, object]
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
      it("postResourceByUrl", function (done) {
        expect(function () {
          url = "url1";
          config = {};
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.datev.accounting.mixins.ApiRequest",
            classConfig: {},
            method: "postResourceByUrl",
            params: [url, config]
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