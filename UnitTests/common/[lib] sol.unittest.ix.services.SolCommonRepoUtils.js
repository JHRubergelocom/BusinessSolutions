/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonRepoUtils", function () {
  var RepoUtilsSord, originalTimeout, newColors, values,
      path, newSeparator, repoPath, currentVersionString, requiredVersionString,
      requiredMainVersionStrings, colorName, startIds, newParentId, params,
      connProps, sessOpts, overrideParams, name, objId, sord, config, docId,
      exportZipFile, exportOptions, ixConn, findInfo, key, filter, startFolderId,
      relativePath, withPrefix, objIds, type, importZipFile, dstRepoPath,
      str, dstFolderId, startObjId, dstStoragePathId, paramObj, id, value,
      saveToRepoConfig, sessionOption, newOptions, sords, content, obSolCommonRepoUtilsId,
      objCopyRepoUtilsId, copyRepoUtilsSord, testTempFolderSord, increaseBy, guid;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonRepoUtils").then(function success(obSolCommonRepoUtilsId1) {
        obSolCommonRepoUtilsId = obSolCommonRepoUtilsId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success1(RepoUtilsSord1) {
          RepoUtilsSord = RepoUtilsSord1;
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
    describe("sol.common.RepoUtils", function () {
      it("addColors", function (done) {
        expect(function () {
          newColors = [{ name: "sol.solution.processed", rgb: "2129920" }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "addColors",
            params: [newColors]
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
      it("buildOrValuesSearchString", function (done) {
        expect(function () {
          values = ["Value1", "Value2"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "buildOrValuesSearchString",
            params: [values]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("\"Value1\" OR \"Value2\"");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("calcNextVersion", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          increaseBy = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "calcNextVersion",
            params: [objId, increaseBy]
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
      it("changePathSeparator", function (done) {
        expect(function () {
          path = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils";
          newSeparator = "#";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "changePathSeparator",
            params: [path, newSeparator]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("ARCPATH:#Administration#Business Solutions#common [unit tests]#Resources#FileUtils");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("checkRepoPath", function (done) {
        expect(function () {
          repoPath = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "checkRepoPath",
            params: [repoPath]
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
      it("checkRepoPath 'empty path'", function (done) {
        expect(function () {
          repoPath = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources//FileUtils";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "checkRepoPath",
            params: [repoPath]
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
      it("checkVersion", function (done) {
        expect(function () {
          currentVersionString = "9.03.26";
          requiredVersionString = "9.03.021";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "checkVersion",
            params: [currentVersionString, requiredVersionString]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("checkVersions", function (done) {
        expect(function () {
          currentVersionString = "9.03.26";
          requiredMainVersionStrings = ["9.03.021", "10.01.044"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "checkVersions",
            params: [currentVersionString, requiredMainVersionStrings]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("colorExists", function (done) {
        expect(function () {
          colorName = ["sol.solution.processed"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "colorExists",
            params: [colorName]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("copySords", function (done) {
        expect(function () {
          startIds = RepoUtilsSord.id;
          newParentId = obSolCommonRepoUtilsId;
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "copySords",
            params: [startIds, newParentId, params]
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
      it("createConnFact", function (done) {
        expect(function () {
          connProps = null;
          sessOpts = null;
          overrideParams = { timeoutSeconds: 3000 };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "createConnFact",
            params: [connProps, sessOpts, overrideParams]
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
      it("createExternalLink", function (done) {
        expect(function () {
          params = { objId: RepoUtilsSord.id };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "createExternalLink",
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
      it("createObjKey", function (done) {
        expect(function () {
          id = 9999;
          name = "name1";
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "createObjKey",
            params: [id, name, value]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("[9999,name1=value1]");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("createPath", function (done) {
        expect(function () {
          repoPath = test.Utils.TESTTEMPFOLDER + "/ZZZ";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "createPath",
            params: [repoPath, params]
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
      it("createTempFileWithSordName", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "createTempFileWithSordName",
            params: [objId]
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
      it("copysord", function (done) {
        expect(function () {
          test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success(objCopyRepoUtilsId1) {
            objCopyRepoUtilsId = objCopyRepoUtilsId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );

        }).not.toThrow();
      });
      it("getsord", function (done) {
        expect(function () {
          test.Utils.getSord(objCopyRepoUtilsId).then(function success(copyRepoUtilsSord1) {
            copyRepoUtilsSord = copyRepoUtilsSord1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );

        }).not.toThrow();
      });
      it("deleteAllReferences", function (done) {
        expect(function () {
          sord = copyRepoUtilsSord;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "deleteAllReferences",
            params: [sord]
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
      it("deleteSord", function (done) {
        expect(function () {
          objId = copyRepoUtilsSord.id;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "deleteSord",
            params: [objId, config]
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
      it("detectScriptEnvironment", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "detectScriptEnvironment",
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
      it("determinateSpecialFolders", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "determinateSpecialFolders",
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
      it("downloadSmallContentToString", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          docId = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "downloadSmallContentToString",
            params: [objId, docId]
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
      it("downloadToBase64String", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          docId = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "downloadToBase64String",
            params: [objId, docId]
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
      it("downloadToByteArray", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          docId = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "downloadToByteArray",
            params: [objId, docId]
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
          objId = RepoUtilsSord.id;
          config = { dstDirPath: "C:\Temp", createDirs: true, createUniqueFileName: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "downloadToFile",
            params: [objId, config]
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
      it("downloadToFileData", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          docId = null;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "downloadToFileData",
            params: [objId, docId, config]
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
      it("downloadToStream", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          docId = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "downloadToStream",
            params: [objId, docId]
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
      it("downloadToString", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          docId = null;
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "downloadToString",
            params: [objId, docId, params]
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
          repoPath = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "exists",
            params: [repoPath]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("exportRepoData", function (done) {
        expect(function () {
          exportZipFile = "test.zip";
          exportOptions = { srcList: [RepoUtilsSord.id] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "exportRepoData",
            params: [exportZipFile, exportOptions]
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
      it("findChildren", function (done) {
        expect(function () {
          objId = "2";
          config = {};
          ixConn = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "findChildren",
            params: [objId, config, ixConn]
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
      it("findIds", function (done) {
        expect(function () {
          findInfo = "2";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "findIds",
            params: [findInfo, params]
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
      it("findInHierarchy", function (done) {
        expect(function () {
          objId = "2";
          config = { sordTypeNames: ["Folder"] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "findInHierarchy",
            params: [objId, config]
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
      it("findObjectTypeInHierarchy", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          values = ["UNITTEST"];
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "findObjectTypeInHierarchy",
            params: [objId, values, config]
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
      it("findSords", function (done) {
        expect(function () {
          params = { maskId: "UnitTest" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "findSords",
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
      it("getColorId", function (done) {
        expect(function () {
          colorName = "sol.solution.processed";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getColorId",
            params: [colorName]
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
      it("getDownloadUrl", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          docId = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getDownloadUrl",
            params: [objId, docId]
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
      it("getEloDmsLink", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getEloDmsLink",
            params: [objId]
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
      it("getFirstChild", function (done) {
        expect(function () {
          config = { parentId: 2 };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getFirstChild",
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
      it("getGuid", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getGuid",
            params: [objId]
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
      it("getIxId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getIxId",
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
      it("getIxOption", function (done) {
        expect(function () {
          key = "debuggerPort";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getIxOption",
            params: [key]
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
      it("getIxOptions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getIxOptions",
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
      it("getNameFromPath", function (done) {
        expect(function () {
          repoPath = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getNameFromPath",
            params: [repoPath]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("FileUtils");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getObjId", function (done) {
        expect(function () {
          path = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getObjId",
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
      it("copysord", function (done) {
        expect(function () {
          test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success(objCopyRepoUtilsId1) {
            objCopyRepoUtilsId = objCopyRepoUtilsId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );

        }).not.toThrow();
      });
      it("getsord", function (done) {
        expect(function () {
          test.Utils.getSord(objCopyRepoUtilsId).then(function success(copyRepoUtilsSord1) {
            copyRepoUtilsSord = copyRepoUtilsSord1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );

        }).not.toThrow();
      });
      it("set 'UNITTEST_FIELD3' to 'Value33'", function (done) {
        expect(function () {
          test.Utils.updateKeywording(copyRepoUtilsSord, {
            UNITTEST_FIELD3: "Value33"
          }, true).then(function success(updateKeywordingResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getsord", function (done) {
        expect(function () {
          test.Utils.getSord(copyRepoUtilsSord.id).then(function success(copyRepoUtilsSord1) {
            copyRepoUtilsSord = copyRepoUtilsSord1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getObjIdByIndex", function (done) {
        expect(function () {
          filter = { mask: "UnitTest", objKeyData: [{ key: "UNITTEST_FIELD3", value: "Value33" }] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getObjIdByIndex",
            params: [filter]
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
      it("getObjIdFromRelativePath", function (done) {
        expect(function () {
          startFolderId = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources";
          relativePath = "/FileUtils";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getObjIdFromRelativePath",
            params: [startFolderId, relativePath]
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
      it("getObjIdFromRelativeSolutionPath", function (done) {
        expect(function () {
          relativePath = "/common/Documentation/images";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getObjIdFromRelativeSolutionPath",
            params: [relativePath]
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
      it("getParentPath", function (done) {
        expect(function () {
          repoPath = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getParentPath",
            params: [repoPath]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getPath", function (done) {
        expect(function () {
          sord = RepoUtilsSord;
          withPrefix = true;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getPath",
            params: [sord, withPrefix, config]
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
      it("getPathFromObjId", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getPathFromObjId",
            params: [objId, config]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("/Administration/Business Solutions/common [unit tests]/Resources/FileUtils");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getPathSeparator", function (done) {
        expect(function () {
          repoPath = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getPathSeparator",
            params: [repoPath]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("/");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getRepoPathObjIds", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getRepoPathObjIds",
            params: [objId]
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
      it("getSessionOptions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getSessionOptions",
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
      it("getSord", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getSord",
            params: [objId, params]
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
      it("getSords", function (done) {
        expect(function () {
          objIds = [RepoUtilsSord.id, 2];
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getSords",
            params: [objIds, config]
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
      it("getValidParent", function (done) {
        expect(function () {
          objId = RepoUtilsSord.id;
          type = "SOL_TYPE";
          values = ["UNITTEST"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getValidParent",
            params: [objId, type, values]
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
      it("getWebLink", function (done) {
        expect(function () {
          guid = RepoUtilsSord.guid;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getWebLink",
            params: [guid]
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
      it("importRepoData", function (done) {
        expect(function () {
          importZipFile = "test.zip";
          dstRepoPath = test.Utils.TESTTEMPFOLDER + "/ZZZ";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "importRepoData",
            params: [importZipFile, dstRepoPath]
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
      it("isArcpath", function (done) {
        expect(function () {
          str = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "isArcpath",
            params: [str]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isGuid", function (done) {
        expect(function () {
          str = RepoUtilsSord.guid;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "isGuid",
            params: [str]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isLMatchPath", function (done) {
        expect(function () {
          str = "LMATCH:/*";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "isLMatchPath",
            params: [str]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isMd5HashPath", function (done) {
        expect(function () {
          str = "MD5:/Test";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "isMd5HashPath",
            params: [str]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isObjId", function (done) {
        expect(function () {
          str = RepoUtilsSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "isObjId",
            params: [str]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isOkeyPath", function (done) {
        expect(function () {
          str = "OKEY:ELOINDEX=/users/data#?";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "isOkeyPath",
            params: [str]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isRepoId", function (done) {
        expect(function () {
          str = RepoUtilsSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "isRepoId",
            params: [str]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("copysord", function (done) {
        expect(function () {
          test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success(objCopyRepoUtilsId1) {
            objCopyRepoUtilsId = objCopyRepoUtilsId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getsord", function (done) {
        expect(function () {
          test.Utils.getSord(objCopyRepoUtilsId).then(function success(copyRepoUtilsSord1) {
            copyRepoUtilsSord = copyRepoUtilsSord1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get dstFolderId", function (done) {
        expect(function () {
          test.Utils.getSord(test.Utils.TESTTEMPFOLDER + "/ZZZ").then(function success(dstFolderSord) {
            dstFolderId = dstFolderSord.id;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("moveSords", function (done) {
        expect(function () {
          objIds = [objCopyRepoUtilsId];
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "moveSords",
            params: [objIds, dstFolderId, params]
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
      it("get dstStoragePathId", function (done) {
        expect(function () {
          test.Utils.getSord(test.Utils.TESTTEMPFOLDER).then(function success(dstStoragePathSord) {
            dstStoragePathId = dstStoragePathSord.id;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("moveToStoragePath", function (done) {
        expect(function () {
          startObjId = objCopyRepoUtilsId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "moveToStoragePath",
            params: [startObjId, dstStoragePathId]
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
      it("normalizePath", function (done) {
        expect(function () {
          repoPath = "/Administration/Business Solutions/common [unit tests]/Resources/FileUtils";
          withPrefix = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "normalizePath",
            params: [repoPath, withPrefix]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("preparePath", function (done) {
        expect(function () {
          repoPath = test.Utils.TESTTEMPFOLDER + "/ZZZ";
          params = { returnDetails: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "preparePath",
            params: [repoPath, params]
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
      it("readColors", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "readColors",
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
      it("resolveSpecialFolder", function (done) {
        expect(function () {
          path = "{{administrationFolderPath}}/Ressources";
          paramObj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "resolveSpecialFolder",
            params: [path, paramObj]
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
      it("preparePath", function (done) {
        expect(function () {
          repoPath = test.Utils.TESTTEMPFOLDER + "/ZZZ";
          params = { returnDetails: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "preparePath",
            params: [repoPath, params]
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
      it("saveToRepo", function (done) {
        expect(function () {
          saveToRepoConfig = { repoPath: test.Utils.TESTTEMPFOLDER + "/ZZZ/Test.txt", contentString: "Test text" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "saveToRepo",
            params: [saveToRepoConfig]
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
      it("setSessionOption", function (done) {
        expect(function () {
          sessionOption = "x9999";
          value = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "setSessionOption",
            params: [sessionOption, value]
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
      it("setSessionOptions", function (done) {
        expect(function () {
          newOptions = { x9998: false, x9999: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "setSessionOptions",
            params: [newOptions]
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
      it("get testTempFolderSord", function (done) {
        expect(function () {
          test.Utils.getSord(test.Utils.TESTTEMPFOLDER).then(function success(testTempFolderSord1) {
            testTempFolderSord = testTempFolderSord1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("sortSordsByObjIdArray", function (done) {
        expect(function () {
          sords = [];
          sords.push(RepoUtilsSord);
          sords.push(testTempFolderSord);
          objIds = [];
          objIds.push(testTempFolderSord.id);
          objIds.push(RepoUtilsSord.id);
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "sortSordsByObjIdArray",
            params: [sords, objIds]
          }).then(function success(jsonResult) {
            expect(jsonResult[0].id).toEqual(testTempFolderSord.id);
            expect(jsonResult[1].id).toEqual(RepoUtilsSord.id);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("uploadSmallContent", function (done) {
        expect(function () {
          objId = test.Utils.TESTTEMPFOLDER + "/ZZZ/Test.txt";
          content = "Neuer Small Content Text";
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "uploadSmallContent",
            params: [objId, content, config]
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
      it("writeColors", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "writeColors",
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