
describe("[lib] sol.unittest.ix.services.SolCommonDocumentBatchImportStatus", function () {
  var BatchImportStatusSord, originalTimeout,
      config, statusObj, count, total;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonDocumentBatchImportStatus").then(function success(obSolCommonDocumentBatchImportStatusId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success1(BatchImportStatusSord1) {
          BatchImportStatusSord = BatchImportStatusSord1;
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
    describe("sol.common_document.BatchImportStatus", function () {
      it("getStatus", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportStatus",
            classConfig: { objId: BatchImportStatusSord.id },
            method: "getStatus",
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
      it("initStatus", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportStatus",
            classConfig: { objId: BatchImportStatusSord.id },
            method: "initStatus",
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
            className: "sol.common_document.BatchImportStatus",
            classConfig: { objId: BatchImportStatusSord.id },
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
      it("isRunning", function (done) {
        expect(function () {
          statusObj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportStatus",
            classConfig: { objId: BatchImportStatusSord.id },
            method: "isRunning",
            params: [statusObj]
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
      it("isStopping", function (done) {
        expect(function () {
          statusObj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportStatus",
            classConfig: { objId: BatchImportStatusSord.id },
            method: "isStopping",
            params: [statusObj]
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
      it("proceed", function (done) {
        expect(function () {
          count = 0;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportStatus",
            classConfig: { objId: BatchImportStatusSord.id },
            method: "proceed",
            params: [count]
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
      it("saveStatus", function (done) {
        expect(function () {
          statusObj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportStatus",
            classConfig: { objId: BatchImportStatusSord.id },
            method: "saveStatus",
            params: [statusObj]
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
      it("setStopFlag", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportStatus",
            classConfig: { objId: BatchImportStatusSord.id },
            method: "setStopFlag",
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
      it("start", function (done) {
        expect(function () {
          total = 0;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportStatus",
            classConfig: { objId: BatchImportStatusSord.id },
            method: "start",
            params: [total]
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
      it("stop", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportStatus",
            classConfig: { objId: BatchImportStatusSord.id },
            method: "stop",
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