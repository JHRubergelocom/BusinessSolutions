/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonZipUtils", function () {
  var originalTimeout, folder, zipOutputStream,
      prefixLength, zipFilePath, pathInZipFile, params, zipFile, dstDir,
      path, basicFileAttributes;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonZipUtils").then(function success(obSolCommonZipUtilsId) {
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
    describe("sol.common.ZipUtils", function () {
      it("compressFolder", function (done) {
        expect(function () {
          folder = "folder1";
          zipOutputStream = "zipOutputStream1";
          prefixLength = 3;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.ZipUtils",
            classConfig: {},
            method: "compressFolder",
            params: [folder, zipOutputStream, prefixLength]
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
      it("deleteFilesInZipFileFolder", function (done) {
        expect(function () {
          zipFilePath = "zipFilePath";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.ZipUtils",
            classConfig: {},
            method: "deleteFilesInZipFileFolder",
            params: [zipFilePath, params]
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
      it("existsFilePathInZip", function (done) {
        expect(function () {
          zipFilePath = "zipFilePath";
          pathInZipFile = "pathInZipFile";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.ZipUtils",
            classConfig: {},
            method: "existsFilePathInZip",
            params: [zipFilePath, pathInZipFile]
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
      it("readFileInZipToByteArray", function (done) {
        expect(function () {
          zipFilePath = "zipFilePath";
          pathInZipFile = "pathInZipFile";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.ZipUtils",
            classConfig: {},
            method: "readFileInZipToByteArray",
            params: [zipFilePath, pathInZipFile]
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
      it("readFileInZipToString", function (done) {
        expect(function () {
          zipFilePath = "zipFilePath";
          pathInZipFile = "pathInZipFile";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.ZipUtils",
            classConfig: {},
            method: "readFileInZipToString",
            params: [zipFilePath, pathInZipFile, params]
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
      it("unzip", function (done) {
        expect(function () {
          zipFile = "zipFile";
          dstDir = "dstDir";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.ZipUtils",
            classConfig: {},
            method: "unzip",
            params: [zipFile, dstDir, params]
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
      it("visitFile", function (done) {
        expect(function () {
          path = "path1";
          basicFileAttributes = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.ZipUtils",
            classConfig: {},
            method: "visitFile",
            params: [path, basicFileAttributes]
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
      it("zipFolder", function (done) {
        expect(function () {
          folder = "folder";
          zipFile = "zipFile";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.ZipUtils",
            classConfig: {},
            method: "zipFolder",
            params: [folder, zipFile]
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