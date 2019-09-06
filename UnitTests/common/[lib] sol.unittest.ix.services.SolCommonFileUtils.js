
describe("[lib] sol.unittest.ix.services.SolCommonFileUtils", function () {
  var FileUtilsSord, userName, path, originalTimeout, file, extension, pathPartsArr, replacement, srcFile, dstFile, params, config, objId, dstDirPath, filePath, pattern, contentType, dir, newName, fileName, fileData, stringArray;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonFileUtils").then(function success(obSolCommonFileUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success1(FileUtilsSord1) {
          FileUtilsSord = FileUtilsSord1;
          userName = test.Utils.getCurrentUserName();
          test.Utils.getUserInfo(userName).then(function success3(userInfo1) {
            userInfo = userInfo1;
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
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.common.FileUtils", function () {
      it("changeExtension", function (done) {
        expect(function () {
          file = { absolutePath: "test.bat"};
          extension = ".cmd";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "changeExtension",
            params: [file, extension]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("test.cmd");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("cleanPathParts", function (done) {
        expect(function () {
          pathPartsArr = ["test1:txt", "test2:txt"];
          replacement = ".";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "cleanPathParts",
            params: [pathPartsArr, replacement]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(["test1.txt", "test2.txt"]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("copyFile", function (done) {
        expect(function () {
          srcFile = "File1.txt";
          dstFile = "File2.txt";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "copyFile",
            params: [srcFile, dstFile]
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
      it("createTempDir", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "createTempDir",
            params: [params]
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
      it("delete", function (done) {
        expect(function () {
          file = "File1.txt";
          params = { quietly: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "delete",
            params: [file, params]
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
      it("deleteFiles", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "deleteFiles",
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
      it("downloadDocument", function (done) {
        expect(function () {
          objId = FileUtilsSord.id;
          dstDirPath = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "downloadDocument",
            params: [objId, dstDirPath]
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
      it("downloadDocuments", function (done) {
        expect(function () {
          objId = FileUtilsSord.id;
          dstDirPath = "C:\\Temp";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "downloadDocuments",
            params: [objId, dstDirPath, params]
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
      it("exists", function (done) {
        expect(function () {
          path = "File1.txt";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "exists",
            params: [path]
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
      it("getExtension", function (done) {
        expect(function () {
          file = "File1.txt";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "getExtension",
            params: [file]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("txt");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getExtensionFromPath", function (done) {
        expect(function () {
          filePath = "File1.txt";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "getExtensionFromPath",
            params: [filePath]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("txt");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getName", function (done) {
        expect(function () {
          file = "File1.txt";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "getName",
            params: [file]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("File1");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getParentPath", function (done) {
        expect(function () {
          path = "C://File1.txt";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "getParentPath",
            params: [path]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("C:");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getTempDirPath", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "getTempDirPath",
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
      it("getTimeStampString", function (done) {
        expect(function () {
          pattern = "HH:mm:ss";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "getTimeStampString",
            params: [pattern]
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
      it("getTimeStampString", function (done) {
        expect(function () {
          pattern = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "getTimeStampString",
            params: [pattern]
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
      it("getUrlFromFilePath", function (done) {
        expect(function () {
          filePath = "C://File1.txt";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "getUrlFromFilePath",
            params: [filePath]
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
      it("loadToFileData", function (done) {
        expect(function () {
          filePath = "File1";
          contentType = "txt";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "loadToFileData",
            params: [filePath, contentType]
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
      it("makeDirectories", function (done) {
        expect(function () {
          dir = "C://Temp";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "makeDirectories",
            params: [dir]
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
      it("readConfig", function (done) {
        expect(function () {
          filePath = "File1.txt";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "readConfig",
            params: [filePath]
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
      it("readFileToObject", function (done) {
        expect(function () {
          filePath = "File1.txt";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "readFileToObject",
            params: [filePath, params]
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
      xit("readFileToString", function (done) {
        expect(function () {
          filePath = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "readFileToString",
            params: [filePath, params]
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
      xit("readManifestFile", function (done) {
        expect(function () {
          filePath = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "readManifestFile",
            params: [filePath]
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
      xit("removeExtension", function (done) {
        expect(function () {
          file = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "removeExtension",
            params: [file]
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
      xit("rename", function (done) {
        expect(function () {
          path = PVALUE;
          newName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "rename",
            params: [path, newName]
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
      xit("sanitizeFilename", function (done) {
        expect(function () {
          fileName = PVALUE;
          replacement = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "sanitizeFilename",
            params: [fileName, replacement]
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
      xit("saveFileData", function (done) {
        expect(function () {
          fileData = PVALUE;
          filePath = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "saveFileData",
            params: [fileData, filePath]
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
      xit("writeConfigToFile", function (done) {
        expect(function () {
          path = PVALUE;
          config = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "writeConfigToFile",
            params: [path, config]
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
      xit("writeObjectToFile", function (done) {
        expect(function () {
          obj = PVALUE;
          filePath = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "writeObjectToFile",
            params: [obj, filePath]
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
      xit("writeStringArrayToFile", function (done) {
        expect(function () {
          path = PVALUE;
          stringArray = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "writeStringArrayToFile",
            params: [path, stringArray]
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
      xit("writeStringToFile", function (done) {
        expect(function () {
          filePath = PVALUE;
          content = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.FileUtils",
            classConfig: {},
            method: "writeStringToFile",
            params: [filePath, content, params]
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