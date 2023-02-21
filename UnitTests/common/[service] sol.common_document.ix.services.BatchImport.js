
describe("[service] sol.common_document.ix.services.BatchImport", function () {
  var originalTimeout, objBatchImportContentId, config,
      serviceName, tplSord, headerDef, value, header, cfg,
      serviceConfig, key, ex, row;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("BatchImport").then(function success(obBatchImportId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/CsvParser").then(function success1(objBatchImportContentId1) {
          objBatchImportContentId = objBatchImportContentId1;
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
    describe("sol.common_document.ix.services.BatchImport", function () {
      it("callService", function (done) {
        expect(function () {
          serviceName = "RF_sol_common_service_SordProvider";
          tplSord = objBatchImportContentId;
          config = {
            ids: [objBatchImportContentId], 
            output: [{ source: { type: "SORD", key: "id" } }] 
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_document.ix.services.BatchImport",
            classConfig: { objId: objBatchImportContentId },
            method: "callService",
            params: [serviceName, tplSord, config]
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
      it("convertValue", function (done) {
        expect(function () {
          headerDef = {};
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_document.ix.services.BatchImport",
            classConfig: { objId: objBatchImportContentId },
            method: "convertValue",
            params: [headerDef, value]
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
      it("date", function (done) {
        header = {};
        cfg = { pattern: "DD.MM.YYYY" };
        value = "01.01.9999";
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_document.ix.services.BatchImport",
            classConfig: { objId: objBatchImportContentId },
            method: "date",
            params: [header, cfg, value]
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
      it("enhanceConfig", function (done) {
        expect(function () {
          serviceConfig = {};
          key = "key1";
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_document.ix.services.BatchImport",
            classConfig: { objId: objBatchImportContentId },
            method: "enhanceConfig",
            params: [serviceConfig, key, value]
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
      it("getExceptionDetails", function (done) {
        expect(function () {
          ex = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_document.ix.services.BatchImport",
            classConfig: { objId: objBatchImportContentId },
            method: "getExceptionDetails",
            params: [ex]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_document.ix.services.BatchImport",
            classConfig: { objId: objBatchImportContentId },
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
      it("notempty", function (done) {
        expect(function () {
          header = {};
          cfg = {};
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_document.ix.services.BatchImport",
            classConfig: { objId: objBatchImportContentId },
            method: "notempty",
            params: [header, cfg, value]
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
      it("prepareServiceData", function (done) {
        expect(function () {
          header = {};
          row = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_document.ix.services.BatchImport",
            classConfig: { objId: objBatchImportContentId },
            method: "prepareServiceData",
            params: [header, row]
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
      it("readData", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_document.ix.services.BatchImport",
            classConfig: { objId: objBatchImportContentId },
            method: "readData",
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
      it("run", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_document.ix.services.BatchImport",
            classConfig: { 
              objId: objBatchImportContentId, 
              header: ["H1", "H2", "H3"],
              data: [["D11", "D12", "D13"], ["D21", "D22", "D23"]],
              config: {}
            },
            method: "run",
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
      it("updateData", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_document.ix.services.BatchImport",
            classConfig: { objId: objBatchImportContentId },
            method: "updateData",
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
      it("validateValue", function (done) {
        expect(function () {
          headerDef = {};
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_document.ix.services.BatchImport",
            classConfig: { objId: objBatchImportContentId },
            method: "validateValue",
            params: [headerDef, value]
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_document_service_BatchImport_Read", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_BatchImport_Read", {
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
      it("should not throw if executed with sord batch import content", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_BatchImport_Read", {
            objId: objBatchImportContentId
          }).then(function success(jsonResult) {
            expect(jsonResult.header).toBeDefined();
            expect(jsonResult.data).toBeDefined();
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
    describe("RF_sol_common_document_service_BatchImport_Update", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_BatchImport_Update", {
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
      it("should throw if executed without 'header'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_BatchImport_Update", {
            objId: objBatchImportContentId
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
      it("should throw if executed without 'data'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_BatchImport_Update", {
            objId: objBatchImportContentId,
            header: "H1;H2;H3"
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
      it("should throw if executed without 'config'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_BatchImport_Update", {
            objId: objBatchImportContentId,
            header: "H1;H2;H3",
            data: "D1;D2;D3"
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
      it("should not throw if executed with sord batch import content", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_BatchImport_Update", {
            objId: objBatchImportContentId,
            header: ["H1", "H2", "H3"],
            data: [["D11", "D12", "D13"], ["D21", "D22", "D23"]],
            config: {}
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
      it("read updated data", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_BatchImport_Read", {
            objId: objBatchImportContentId
          }).then(function success(jsonResult) {
            expect(jsonResult.header).toBeDefined();
            expect(jsonResult.data).toBeDefined();
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
    describe("RF_sol_common_document_service_BatchImport_Run", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_BatchImport_Run", {
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
      it("should not throw if executed with sord batch import content", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_BatchImport_Run", {
            objId: objBatchImportContentId
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