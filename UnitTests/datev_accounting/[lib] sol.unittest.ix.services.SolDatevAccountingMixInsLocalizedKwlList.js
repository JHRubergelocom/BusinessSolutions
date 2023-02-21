
describe("[lib] sol.unittest.ix.services.SolDatevAccountingMixInsLocalizedKwlList", function () {
  var originalTimeout, value, options, text, regExp;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolDatevAccountingMixInsLocalizedKwlList").then(function success(obSolDatevAccountingMixInsLocalizedKwlListId) {
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
    describe("sol.datev.accounting.mixins.LocalizedKwlList", function () {
      it("getLocalizedKey", function (done) {
        expect(function () {
          value = "value1";
          options = {};
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.datev.accounting.mixins.LocalizedKwlList",
            classConfig: {},
            method: "getLocalizedKey",
            params: [value, options]
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
      it("getLocalizedValue", function (done) {
        expect(function () {
          value = "value1";
          options = {};
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.datev.accounting.mixins.LocalizedKwlList",
            classConfig: {},
            method: "getLocalizedValue",
            params: [value, options]
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
      it("extract", function (done) {
        expect(function () {
          text = "text1";
          regExp = "regExp1";
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.datev.accounting.mixins.LocalizedKwlList",
            classConfig: {},
            method: "extract",
            params: [text, regExp]
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