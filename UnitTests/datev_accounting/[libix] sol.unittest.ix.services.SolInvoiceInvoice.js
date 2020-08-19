
describe("[libix] sol.unittest.ix.services.SolInvoiceInvoice", function () {
  var originalTimeout, invoiceType, config, configPath, kwlName, key,
      objRDId, indexData;

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
        test.Utils.createSord(obSolInvoiceInvoiceId, "Receipt Document", "TestReceiptDocument", indexData).then(function success1(objRDId1) {
          objRDId = objRDId1;
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
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.invoice.ix.Invoice",
            classConfig: { sord: objRDId },
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
          config = { sord: { id: objRDId } };
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.invoice.ix.Invoice",
            classConfig: { sord: objRDId },
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
          configPath = "/sol.datev.accounting/Configuration/sol.invoice.LocalizedKwls.config";
          kwlName = "docType";
          key = "CR";
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.invoice.ix.Invoice",
            classConfig: { sord: objRDId },
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
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.invoice.ix.Invoice",
            classConfig: { sord: objRDId },
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