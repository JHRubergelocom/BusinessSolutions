
describe("[lib] sol.unittest.ix.services.SolCommonDocumentBatchImportData", function () {
  var BatchImportDataSord, originalTimeout,
      title, rowData, config, data, headers, row, timestamp;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonDocumentBatchImportData").then(function success(obSolCommonDocumentBatchImportDataId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success1(BatchImportDataSord1) {
          BatchImportDataSord = BatchImportDataSord1;
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
    describe("sol.common_document.BatchImportData", function () {
      it("clear", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "clear",
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
      it("createNewHeaderEntry", function (done) {
        expect(function () {
          title = "title1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "createNewHeaderEntry",
            params: [title]
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
      it("createNewRow", function (done) {
        expect(function () {
          rowData = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "createNewRow",
            params: [rowData]
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
      it("getConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "getConfig",
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
      it("getExecutionRowCount", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "getExecutionRowCount",
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
      it("getHeader", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "getHeader",
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
      it("getLastModified", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "getLastModified",
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
      it("getRowCount", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "getRowCount",
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
      it("getRows", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "getRows",
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
      it("hasNext", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "hasNext",
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
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
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
      it("isDataLoaded", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "isDataLoaded",
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
      it("loadData", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "loadData",
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
      it("loadFromMap", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "loadFromMap",
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
      it("next", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "next",
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
      it("prepareData", function (done) {
        expect(function () {
          data = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "prepareData",
            params: [data]
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
      it("put", function (done) {
        expect(function () {
          row = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "put",
            params: [row]
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
      it("reset", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "reset",
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
      it("save", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "save",
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
      it("setConfig", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "setConfig",
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
      it("setData", function (done) {
        expect(function () {
          data = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "setData",
            params: [data]
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
      it("setHeader", function (done) {
        expect(function () {
          headers = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "setHeader",
            params: [headers]
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
      it("setLastModified", function (done) {
        expect(function () {
          timestamp = "01012020";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "setLastModified",
            params: [timestamp]
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
      it("shouldExecute", function (done) {
        expect(function () {
          row = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "shouldExecute",
            params: [row]
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
      it("validateRow", function (done) {
        expect(function () {
          row = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportData",
            classConfig: { sourceId: BatchImportDataSord.id },
            method: "validateRow",
            params: [row]
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