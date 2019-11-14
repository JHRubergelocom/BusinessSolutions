
describe("[function] sol.common.as.functions.ReadExcelTable", function () {
  var originalTimeout, ReadExcelTableSord, objId, absolutePath;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    test.Utils.createTempSord("ReadExcelTable").then(function success(obExecuteAsActionId) {
      test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/ReadExcelTable").then(function success1(ReadExcelTableSord1) {
        ReadExcelTableSord = ReadExcelTableSord1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
      done();
    }, function error(err) {
      fail(err);
      console.error(err);
      done();
    }
    );
  });
  describe("Tests AS Action", function () {
    describe("sol.common.as.ReadExcelTable", function () {
      it("should not throw with empty config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.common.as.ReadExcelTable",
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
      it("downloadToFile", function (done) {
        expect(function () {
          objId = ReadExcelTableSord.id;
          config = { dstDirPath: "C:\Temp", createDirs: true, createUniqueFileName: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "downloadToFile",
            params: [objId, config]
          }).then(function success(jsonResult) {
            absolutePath = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw with Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.common.as.ReadExcelTable",
            config: {
              file: absolutePath
            }
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