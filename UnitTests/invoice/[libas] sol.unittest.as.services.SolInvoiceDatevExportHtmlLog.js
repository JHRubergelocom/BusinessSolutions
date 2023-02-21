
describe("[libas] sol.unittest.as.services.SolInvoiceDatevExportHtmlLog", function () {
  var originalTimeout, content, classnTd, fontweight, padding, fontcolor, backgroundcolor,
      borderwidth, bordercolor, line, classnTdh, classnTd1, classnTd2, alignTd, valignTd, valueTd,
      boolTdl, colsWidth, logFileTableMessages, timeDateJava, totalDataSets, correctDataSets,
      logFileTableDataSets, arcPathDatevExport, t, l, r, b, obSolInvoiceDatevExportHtmlLogId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolInvoiceDatevExportHtmlLog").then(function success(obSolInvoiceDatevExportHtmlLogId1) {
        obSolInvoiceDatevExportHtmlLogId = obSolInvoiceDatevExportHtmlLogId1;
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
    describe("sol.invoice_datev.as.export.HtmlLog", function () {
      it("getHtmlStyleBody", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlStyleBody",
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
      it("getHtmlStyleCSS", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlStyleCSS",
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
      it("getHtmlStyleClassesExportMsg", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlStyleClassesExportMsg",
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
      it("getHtmlStyleClassesTd", function (done) {
        expect(function () {
          classnTd = "classnTd1";
          fontweight = "fontweight1";
          padding = "padding1";
          fontcolor = "fontcolor1";
          backgroundcolor = "backgroundcolor1";
          borderwidth = { top: "t", left: "l", right: "r", bottom: "b" };
          bordercolor = { top: "t", left: "l", right: "r", bottom: "b" };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlStyleClassesTd",
              params: [classnTd, fontweight, padding, fontcolor, backgroundcolor, borderwidth, bordercolor]
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
      it("getHtmlStyleClassesTdl", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlStyleClassesTdl",
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
      it("getHtmlStyleClassesTdt", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlStyleClassesTdt",
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
      it("getHtmlStyleH1", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlStyleH1",
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
      it("getHtmlStyleH2", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlStyleH2",
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
      it("getHtmlStyleTable", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlStyleTable",
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
      it("getHtmlStyleTableTd", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlStyleTableTd",
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
      it("getHtmlStyleTableTr", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlStyleTableTr",
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
      it("getHtmlTableCell", function (done) {
        expect(function () {
          line = 4;
          classnTdh = "classnTdh1";
          classnTd1 = "classnTd1";
          classnTd2 = "classnTd2";
          alignTd = "alignTd1";
          valignTd = "valignTd1";
          valueTd = "valueTd1";
          boolTdl = false;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlTableCell",
              params: [line, classnTdh, classnTd1, classnTd2, alignTd, valignTd, valueTd, boolTdl]
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
      it("getHtmlTableColgroup", function (done) {
        expect(function () {
          colsWidth = ["100", "200"];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getHtmlTableColgroup",
              params: [colsWidth]
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
      it("getTLRB", function (done) {
        expect(function () {
          t = "t1";
          l = "l1";
          r = "r1";
          b = "b1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "getTLRB",
              params: [t, l, r, b]
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
      it("saveExportLog", function (done) {
        expect(function () {
          logFileTableMessages = [];
          timeDateJava = "01012001";
          totalDataSets = 5;
          correctDataSets = 6;
          logFileTableDataSets = [];
          arcPathDatevExport = obSolInvoiceDatevExportHtmlLogId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_datev.as.export.HtmlLog",
              classConfig: {},
              method: "saveExportLog",
              params: [logFileTableMessages, timeDateJava, totalDataSets, correctDataSets, logFileTableDataSets, arcPathDatevExport]
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