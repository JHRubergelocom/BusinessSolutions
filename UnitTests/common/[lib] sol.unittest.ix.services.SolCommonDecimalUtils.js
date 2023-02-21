
describe("[lib] sol.unittest.ix.services.SolCommonDecimalUtils", function () {
  var originalTimeout,
      config, str, target, replacement, value, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonDecimalUtils").then(function success(obSolCommonDecimalUtilsId) {
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
    describe("sol.common.DecimalUtils", function () {
      it("configureDecimals", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.DecimalUtils",
            classConfig: {},
            method: "configureDecimals",
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
      it("replaceAll", function (done) {
        expect(function () {
          str = "Mein Text";
          target = "M";
          replacement = "D";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.DecimalUtils",
            classConfig: {},
            method: "replaceAll",
            params: [str, target, replacement]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Dein Text");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("toDecimal", function (done) {
        expect(function () {
          value = "1.000.234,56";
          params = { thousandsSeparator: ".", decimalSeparator: "," };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.DecimalUtils",
            classConfig: {},
            method: "toDecimal",
            params: [value, params]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("1000234.56");
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