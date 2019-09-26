
describe("[lib] sol.unittest.ix.services.SolCommonRepoUtils", function () {
  var RepoUtilsSord, userName, userInfo, originalTimeout, newColors, values,
      path, newSeparator, repoPath, currentVersionString, requiredVersionString,
      requiredMainVersionStrings, colorName, startIds, newParentId, params,
      connProps, sessOpts, overrideParams, name, objId, sord, config, docId,
      exportZipFile, exportOptions, ixConn, findInfo, key, filter, startFolderId,
      relativePath, withPrefix, objIds, type, importZipFile, dstRepoPath, guidMethod,
      options, str, dstFolderId, startObjId, dstStoragePathId, paramObj, id, value,
      saveToRepoConfig, sessionOption, newOptions, sords, content, obSolCommonRepoUtilsId,
      objCopyRepoUtilsId, copyRepoUtilsSord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonRepoUtils").then(function success(obSolCommonRepoUtilsId1) {
        obSolCommonRepoUtilsId = obSolCommonRepoUtilsId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/RepoUtils").then(function success1(RepoUtilsSord1) {
          RepoUtilsSord = RepoUtilsSord1;
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
      it("changePathSeparator", function (done) {
        expect(function () {
          path = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/RepoUtils";
          newSeparator = "#";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "changePathSeparator",
            params: [path, newSeparator]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("ARCPATH:#Administration#Business Solutions#common [unit tests]#Resources#RepoUtils");
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
          repoPath = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/RepoUtils";
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
          repoPath = "ARCPATH:/Administration/Business Solutions/common [unit tests]//Resources/RepoUtils";
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
          value = "value";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "createObjKey",
            params: [id, name, value]
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
          test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/RepoUtils").then(function success(objCopyRepoUtilsId1) {
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
          repoPath = "ARCPATH:/Administration/Business Solutions/common [unit tests]//Resources/RepoUtils";
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
          config = { sordTypeNames: ["Filing cabinet"] };
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
      xit("findSords", function (done) {
        expect(function () {
          params = PVALUE;
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
      xit("getColorId", function (done) {
        expect(function () {
          colorName = PVALUE;
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
      xit("getDownloadUrl", function (done) {
        expect(function () {
          objId = PVALUE;
          docId = PVALUE;
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
      xit("getGuid", function (done) {
        expect(function () {
          objId = PVALUE;
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
      xit("getIxId", function (done) {
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
      xit("getIxOption", function (done) {
        expect(function () {
          key = PVALUE;
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
      xit("getIxOptions", function (done) {
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
      xit("getNameFromPath", function (done) {
        expect(function () {
          repoPath = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getNameFromPath",
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
      xit("getObjId", function (done) {
        expect(function () {
          path = PVALUE;
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
      xit("getObjIdByIndex", function (done) {
        expect(function () {
          filter = PVALUE;
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
      xit("getObjIdFromRelativePath", function (done) {
        expect(function () {
          startFolderId = PVALUE;
          relativePath = PVALUE;
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
      xit("getParentPath", function (done) {
        expect(function () {
          repoPath = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getParentPath",
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
      xit("getPath", function (done) {
        expect(function () {
          sord = PVALUE;
          withPrefix = PVALUE;
          config = PVALUE;
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
      xit("getPathFromObjId", function (done) {
        expect(function () {
          objId = PVALUE;
          config = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getPathFromObjId",
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
      xit("getPathSeparator", function (done) {
        expect(function () {
          repoPath = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "getPathSeparator",
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
      xit("getRepoPathObjIds", function (done) {
        expect(function () {
          objId = PVALUE;
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
      xit("getSessionOptions", function (done) {
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
      xit("getSord", function (done) {
        expect(function () {
          objId = PVALUE;
          params = PVALUE;
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
      xit("getSords", function (done) {
        expect(function () {
          objIds = PVALUE;
          config = PVALUE;
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
      xit("getValidParent", function (done) {
        expect(function () {
          objId = PVALUE;
          type = PVALUE;
          values = PVALUE;
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
      xit("importRepoData", function (done) {
        expect(function () {
          importZipFile = PVALUE;
          dstRepoPath = PVALUE;
          guidMethod = PVALUE;
          options = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "importRepoData",
            params: [importZipFile, dstRepoPath, guidMethod, options]
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
      xit("isGuid", function (done) {
        expect(function () {
          str = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "isGuid",
            params: [str]
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
      xit("isObjId", function (done) {
        expect(function () {
          str = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "isObjId",
            params: [str]
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
      xit("moveSords", function (done) {
        expect(function () {
          objIds = PVALUE;
          dstFolderId = PVALUE;
          params = PVALUE;
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
      xit("moveToStoragePath", function (done) {
        expect(function () {
          startObjId = PVALUE;
          dstStoragePathId = PVALUE;
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
      xit("normalizePath", function (done) {
        expect(function () {
          repoPath = PVALUE;
          withPrefix = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "normalizePath",
            params: [repoPath, withPrefix]
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
      xit("preparePath", function (done) {
        expect(function () {
          repoPath = PVALUE;
          params = PVALUE;
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
      xit("readColors", function (done) {
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
      xit("resolveSpecialFolder", function (done) {
        expect(function () {
          path = PVALUE;
          paramObj = PVALUE;
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
      xit("saveToRepo", function (done) {
        expect(function () {
          saveToRepoConfig = PVALUE;
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
      xit("setSessionOption", function (done) {
        expect(function () {
          sessionOption = PVALUE;
          value = PVALUE;
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
      xit("setSessionOptions", function (done) {
        expect(function () {
          newOptions = PVALUE;
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
      xit("sortSordsByObjIdArray", function (done) {
        expect(function () {
          sords = PVALUE;
          objIds = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "sortSordsByObjIdArray",
            params: [sords, objIds]
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
      xit("uploadSmallContent", function (done) {
        expect(function () {
          objId = PVALUE;
          content = PVALUE;
          config = PVALUE;
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
      xit("writeColors", function (done) {
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