
describe("[libix] sol.unittest.ix.services.SolInvoiceConverter", function () {
  var originalTimeout, value, sord, obTempIncomingInvoiceId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolInvoiceConverter").then(function success(obSolInvoiceConverterId) {
        test.Utils.createSord(obSolInvoiceConverterId, "Incoming Invoice", "TempIncomingInvoice", { INVOICE_CURRENCY_CODE: "EUR" }).then(function success1(obTempIncomingInvoiceId1) {
          obTempIncomingInvoiceId = obTempIncomingInvoiceId1;
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
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.invoice.Converter", function () {
      it("currency", function (done) {
        expect(function () {
          value = 100;
          sord = obTempIncomingInvoiceId;
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.Converter",
            classConfig: {},
            method: "currency",
            params: [value, sord]
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
      it("loadConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.Converter",
            classConfig: {},
            method: "loadConfig",
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
    }).not.toThrow();
  });
});