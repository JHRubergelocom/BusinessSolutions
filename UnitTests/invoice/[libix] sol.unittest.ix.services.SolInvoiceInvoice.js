
describe("[libix] sol.unittest.ix.services.SolInvoiceInvoice", function () {
  var originalTimeout, invoiceType, config, configPath, kwlName, key,
      obTempIncomingInvoiceId, indexData;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolInvoiceInvoice").then(function success(obSolInvoiceInvoiceId) {
        indexData = {
          INVOICE_CURRENCY_CODE: "EUR",
          VENDOR_NO: 100,
          VENDOR_NAME: "Unittest",
          COMPANY_CODE: 100,
          COMPANY_NAME: "Unittest"
        };
        test.Utils.createSord(obSolInvoiceInvoiceId, "Incoming Invoice", "TempIncomingInvoice", indexData).then(function success1(obTempIncomingInvoiceId1) {
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
    describe("sol.invoice.ix.Invoice", function () {
      it("correctCreditNoteKey", function (done) {
        expect(function () {
          invoiceType = "invoiceType1";
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.Invoice",
            classConfig: { sord: obTempIncomingInvoiceId },
            method: "correctCreditNoteKey",
            params: [invoiceType]
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
          config = { sord: { id: obTempIncomingInvoiceId } };
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.Invoice",
            classConfig: { sord: obTempIncomingInvoiceId },
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
      it("localizedKwlKeyExists", function (done) {
        expect(function () {
          configPath = "/invoice/Configuration/sol.invoice.LocalizedKwls.config";
          kwlName = "docType";
          key = "CR";
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.Invoice",
            classConfig: { sord: obTempIncomingInvoiceId },
            method: "localizedKwlKeyExists",
            params: [configPath, kwlName, key]
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
      it("setDefaultValues", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.Invoice",
            classConfig: { sord: obTempIncomingInvoiceId },
            method: "setDefaultValues",
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