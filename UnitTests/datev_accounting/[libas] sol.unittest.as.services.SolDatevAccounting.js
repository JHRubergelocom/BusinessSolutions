
describe("[libas] sol.unittest.as.services.SolDatevAccounting", function () {
  var originalTimeout, content, entryFolder, value, sord, wfNamePattern,
      obSolDatevAccountingId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolDatevAccounting").then(function success(obSolDatevAccountingId1) {
        obSolDatevAccountingId = obSolDatevAccountingId1;
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
    describe("sol.datev.accounting.as.StartInvoiceWorkflow", function () {
      it("getEntryFolder", function (done) {
        expect(function () {
          entryFolder = "ARCPATH:/0 - Posteingang";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.datev.accounting.as.services.ExecuteLib",
            config: {
              className: "sol.datev.accounting.as.StartInvoiceWorkflow",
              classConfig: {},
              method: "getEntryFolder",
              params: [entryFolder]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getLocalizedKey", function (done) {
        expect(function () {
          value = "5123";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.datev.accounting.as.services.ExecuteLib",
            config: {
              className: "sol.datev.accounting.as.StartInvoiceWorkflow",
              classConfig: {},
              method: "getLocalizedKey",
              params: [value]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getWorkflowName", function (done) {
        expect(function () {
          sord = obSolDatevAccountingId;
          wfNamePattern = "{{{kwl:value sord.objKeys.INVOICE_TYPE}}}: {{{sord.name}}}";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.datev.accounting.as.services.ExecuteLib",
            config: {
              className: "sol.datev.accounting.as.StartInvoiceWorkflow",
              classConfig: {},
              method: "getWorkflowName",
              params: [sord, wfNamePattern]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("run", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.datev.accounting.as.services.ExecuteLib",
            config: {
              className: "sol.datev.accounting.as.StartInvoiceWorkflow",
              classConfig: {},
              method: "run",
              params: []
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
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