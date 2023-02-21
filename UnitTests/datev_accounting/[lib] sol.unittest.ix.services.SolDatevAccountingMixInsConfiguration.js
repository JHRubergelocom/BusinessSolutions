
describe("[lib] sol.unittest.ix.services.SolDatevAccountingMixInsConfiguration", function () {
  var originalTimeout, api, resource;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolDatevAccountingMixInsConfiguration").then(function success(obSolDatevAccountingMixInsConfigurationId) {
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
    describe("sol.datev.accounting.mixins.Configuration", function () {
      it("getApiBaseUri", function (done) {
        expect(function () {
          api = {};
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.datev.accounting.mixins.Configuration",
            classConfig: {},
            method: "getApiBaseUri",
            params: [api]
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
      it("getApiResourceUri", function (done) {
        expect(function () {
          api = {};
          resource = "resource1";
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.datev.accounting.mixins.Configuration",
            classConfig: {},
            method: "getApiResourceUri",
            params: [api, resource]
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