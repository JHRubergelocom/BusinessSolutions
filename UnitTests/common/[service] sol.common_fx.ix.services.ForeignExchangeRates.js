
describe("[service] sol.common_fx.ix.services.ForeignExchangeRates", function () {
  var originalTimeout;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_fx_service_LoadExchangeRates", function () {
      it("should throw if executed without 'persist'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_fx_service_LoadExchangeRates", {
          }).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("result should return exchangerates", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_fx_service_LoadExchangeRates", {
            persist: true
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
    describe("RF_sol_common_fx_service_ConvertCurrencies", function () {
      it("should throw if executed without 'amount'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_fx_service_ConvertCurrencies", {
          }).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without 'from'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_fx_service_ConvertCurrencies", {
            amount: 47.11
          }).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("result should return default currency conversion to 'EUR'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_fx_service_ConvertCurrencies", {
            amount: 47.11,
            from: "USD"
          }).then(function success(jsonResult) {
            expect(jsonResult.to).toBeDefined();
            expect(jsonResult.to).toEqual("EUR");
            expect(jsonResult.result).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("result should return  currency conversion to 'GBP'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_fx_service_ConvertCurrencies", {
            amount: 47.11,
            from: "USD",
            to: "GBP"
          }).then(function success(jsonResult) {
            expect(jsonResult.to).toBeDefined();
            expect(jsonResult.to).toEqual("GBP");
            expect(jsonResult.result).toBeDefined();
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
    describe("RF_sol_common_fx_service_getExchangeRateByCodeAndDate", function () {
      it("should throw if executed without 'currencyCode'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_fx_service_getExchangeRateByCodeAndDate", {
          }).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without 'isoDate'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_fx_service_getExchangeRateByCodeAndDate", {
            currencyCode: "AUD"
          }).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("result should return exchangeRate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_fx_service_getExchangeRateByCodeAndDate", {
            currencyCode: "AUD",
            isoDate: "20220118000000"
          }).then(function success(jsonResult) {
            expect(jsonResult.exchangeRate).toBeDefined();
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});