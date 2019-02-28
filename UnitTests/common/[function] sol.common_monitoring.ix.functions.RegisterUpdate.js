
describe("[function] sol.common_monitoring.ix.functions.RegisterUpdate", function () {
  var originalTimeout, objBatchImportContentId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("RegisterUpdate").then(function success(obBatchImportId) {
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
    describe("RF_sol_common_monitoring_function_RegisterUpdate", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_monitoring_function_RegisterUpdate", {
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
          test.Utils.execute("RF_sol_common_monitoring_function_RegisterUpdate", {
            objId: objBatchImportContentId
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
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