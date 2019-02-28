
describe("[service] sol.common_document.ix.services.BatchImport", function () {
  var originalTimeout, objBatchImportContentId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("BatchImport").then(function success(obBatchImportId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/Unittest").then(function success1(objBatchImportContentId1) {
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