
describe("[lib] sol.unittest.ix.services.SolCommonDocumentBatchImportConst", function () {
  var originalTimeout, key, data, entry;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonDocumentBatchImportConst").then(function success(obSolCommonDocumentBatchImportConstId) {
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
    describe("sol.common_document.BatchImportConst", function () {
      it("createMapValue", function (done) {
        expect(function () {
          key = "key";
          data = { data: "data1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportConst",
            classConfig: {},
            method: "createMapValue",
            params: [key, data]
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
      it("extractMapValue", function (done) {
        expect(function () {
          entry = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common_document.BatchImportConst",
            classConfig: {},
            method: "extractMapValue",
            params: [entry]
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