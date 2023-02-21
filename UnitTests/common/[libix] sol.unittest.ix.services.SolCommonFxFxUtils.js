
describe("[libix] sol.unittest.ix.services.SolCommonFxFxUtils", function () {
  var originalTimeout, amount, from, to, currencies, currencyCode, url, persist, text, time,
      results, isoDate, serviceUrl, isoDateStr, dates, checkExisting;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonFxFxUtils").then(function success(obSolCommonFxFxUtilsId) {
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
    describe("sol.common_fx.ix.FxUtils", function () {
      it("addExchangeRateHistory", function (done) {
        expect(function () {
          results = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "addExchangeRateHistory",
            params: [results]
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
      it("calcIsoDates", function (done) {
        expect(function () {
          isoDate = "20220101120000";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "calcIsoDates",
            params: [isoDate]
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
      it("collectCurrentCurrencyCodes", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "collectCurrentCurrencyCodes",
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
      it("convertAmount", function (done) {
        expect(function () {
          amount = "47.11";
          from = "USD";
          to = "GBP";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "convertAmount",
            params: [amount, from, to]
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
      it("convertLocalCurrency", function (done) {
        expect(function () {
          currencies = { EUR: "1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "convertLocalCurrency",
            params: [currencies]
          }).then(function success(jsonResult) {
            currencies = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("fillHistoricData", function (done) {
        expect(function () {
          serviceUrl = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "fillHistoricData",
            params: [serviceUrl]
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
      it("getExchangeRateByCodeAndDate", function (done) {
        expect(function () {
          currencyCode = "USD";
          isoDate = "20220101120000";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "getExchangeRateByCodeAndDate",
            params: [currencyCode, isoDate]
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
      it("getExchangeRateForCurrency", function (done) {
        expect(function () {
          currencyCode = "USD";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "getExchangeRateForCurrency",
            params: [currencyCode]
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
      it("getExchangeRates", function (done) {
        expect(function () {
          url = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "getExchangeRates",
            params: [url]
          }).then(function success(jsonResult) {
            text = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getHistoricalExchangeRate", function (done) {
        expect(function () {
          currencyCode = "USD";
          isoDate = "20220101120000";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "getHistoricalExchangeRate",
            params: [currencyCode, isoDate]
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
      it("getOldestEntryForCurrency", function (done) {
        expect(function () {
          currencyCode = "USD";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "getOldestEntryForCurrency",
            params: [currencyCode]
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
      it("historicDataFilled", function (done) {
        expect(function () {
          isoDateStr = "20220101120000";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "historicDataFilled",
            params: [isoDateStr]
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
      it("historyTableHasEntries", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "historyTableHasEntries",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
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
      it("latestHistoryDateIsCurrent", function (done) {
        expect(function () {
          isoDateStr = "20220101120000";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "latestHistoryDateIsCurrent",
            params: [isoDateStr]
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
      it("loadExchangeRates", function (done) {
        expect(function () {
          persist = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "loadExchangeRates",
            params: [persist]
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
      it("parseDate", function (done) {
        expect(function () {
          text = text;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "parseDate",
            params: [text]
          }).then(function success(jsonResult) {
            time = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("queryHistoricalExchangeRateByPeriod", function (done) {
        expect(function () {
          currencyCode = "USD";
          dates = { isoLowerTimeLimit: "20220103", isoDate: "20220110", isoUpperTimeLimit: "20220117" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "queryHistoricalExchangeRateByPeriod",
            params: [currencyCode, dates]
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
      it("recordExchangeRateHistory", function (done) {
        expect(function () {
          currencies = { EUR: "1" };
          time = time;
          checkExisting = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "recordExchangeRateHistory",
            params: [currencies, time, checkExisting]
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
      it("sortExchangeRateEntries", function (done) {
        expect(function () {
          currencies = { EUR: "1" };
          time = time;
          checkExisting = false;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "sortExchangeRateEntries",
            params: [currencies, time, checkExisting]
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
      it("updateExchangeRateHistory", function (done) {
        expect(function () {
          results = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "updateExchangeRateHistory",
            params: [results]
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
      it("updateExchangeRates", function (done) {
        expect(function () {
          currencies = currencies;
          time = time;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_fx.ix.FxUtils",
            classConfig: {},
            method: "updateExchangeRates",
            params: [currencies, time]
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