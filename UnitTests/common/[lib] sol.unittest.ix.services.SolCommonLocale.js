
describe("[lib] sol.unittest.ix.services.SolCommonLocale", function () {
  var originalTimeout, decimal, params, javaChar, dateFormat;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonLocale").then(function success(obSolCommonLocaleId) {
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
    describe("sol.common.Locale", function () {
      it("formatDecimal", function (done) {
        expect(function () {
          decimal = "201311,478238";
          params = { decimalSeparator: "d", groupingSeparator: "g", minimumFractionDigits: 2, maximumFractionDigits: 5 };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Locale",
            classConfig: {},
            method: "formatDecimal",
            params: [decimal, params]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("201g311d47824");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("formatDecimal", function (done) {
        expect(function () {
          decimal = "201311,4";
          params = { decimalSeparator: "d", groupingSeparator: "g", minimumFractionDigits: 2, maximumFractionDigits: 5 };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Locale",
            classConfig: {},
            method: "formatDecimal",
            params: [decimal, params]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("201g311d40");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("formatDecimal", function (done) {
        expect(function () {
          decimal = "201311,478238";
          params = { decimalSeparator: "d", groupingSeparator: "g", minimumFractionDigits: 2, maximumFractionDigits: 5, groupingUsed: false };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Locale",
            classConfig: {},
            method: "formatDecimal",
            params: [decimal, params]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("201311d47824");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getDefaultDateFormat", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Locale",
            classConfig: {},
            method: "getDefaultDateFormat",
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
      it("getDefaultDecimalSeparator", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Locale",
            classConfig: {},
            method: "getDefaultDecimalSeparator",
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
      it("getDefaultGroupingSeparator", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Locale",
            classConfig: {},
            method: "getDefaultGroupingSeparator",
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
      it("javaCharToJsString", function (done) {
        expect(function () {
          javaChar = "V";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Locale",
            classConfig: {},
            method: "javaCharToJsString",
            params: [javaChar]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("V");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("normalizeDateFormat", function (done) {
        expect(function () {
          dateFormat = "y MM.TT xx.y";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Locale",
            classConfig: {},
            method: "normalizeDateFormat",
            params: [dateFormat]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("yyyy MM.TT xx.y");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("read", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Locale",
            classConfig: {},
            method: "read",
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