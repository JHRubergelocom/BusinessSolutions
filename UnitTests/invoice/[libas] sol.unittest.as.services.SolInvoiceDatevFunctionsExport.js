
describe("[libas] sol.unittest.as.services.SolInvoiceDatevFunctionsExport", function () {
  var originalTimeout, content, sordInvoices, key, logFileTableDataSets, boolHeader,
      keyFieldName, actMapEntry, objKey, logFileTableMessages, row, column, datevFileLine,
      isMapField, mapItems, datevFieldName, datevFieldContent, message, eloDocument,
      eloFieldName, eloGroup, eloData, eloGuid, obSolInvoiceDatevFunctionsExportId, sord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolInvoiceDatevFunctionsExport").then(function success(obSolInvoiceDatevFunctionsExportId1) {
        obSolInvoiceDatevFunctionsExportId = obSolInvoiceDatevFunctionsExportId1;
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
    describe("sol.invoice_datev.as.functions.Export", function () {
      it("exportInvoices", function (done) {
        expect(function () {
          sordInvoices = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.functions.Export",
              classConfig: {},
              method: "exportInvoices",
              params: [sordInvoices]
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
      it("getKeyIndex", function (done) {
        expect(function () {
          key = "key1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.functions.Export",
              classConfig: {},
              method: "getKeyIndex",
              params: [key]
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.functions.Export",
              classConfig: {},
              method: "process",
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
      it("readInvoices", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.functions.Export",
              classConfig: {},
              method: "readInvoices",
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
      it("writeDataSet", function (done) {
        expect(function () {
          logFileTableDataSets = [];
          sord = obSolInvoiceDatevFunctionsExportId;
          boolHeader = false;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.functions.Export",
              classConfig: {},
              method: "writeDataSet",
              params: [logFileTableDataSets, sord, boolHeader]
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
      it("writeDatevExport", function (done) {
        expect(function () {
          keyFieldName = "Währung";
          actMapEntry = "actMapEntry1";
          objKey = {};
          sord = {};
          logFileTableMessages = [];
          row = 3;
          column = 4;
          datevFileLine = "datevFileLine1";
          isMapField = true;
          mapItems = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.functions.Export",
              classConfig: {},
              method: "writeDatevExport",
              params: [keyFieldName, actMapEntry, objKey, sord, logFileTableMessages, row, column, datevFileLine, isMapField, mapItems]
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
      it("writeExportReport", function (done) {
        expect(function () {
          logFileTableMessages = [];
          row = 3;
          column = 4;
          datevFieldName = "datevFieldName1";
          datevFieldContent = "datevFieldContent1";
          message = "message1";
          eloDocument = "eloDocument1";
          eloFieldName = "eloFieldName1";
          eloGroup = "eloGroup1";
          eloData = "eloData1";
          eloGuid = "eloGuid1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.functions.Export",
              classConfig: {},
              method: "writeExportReport",
              params: [logFileTableMessages, row, column, datevFieldName, datevFieldContent, message, eloDocument, eloFieldName, eloGroup, eloData, eloGuid]
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