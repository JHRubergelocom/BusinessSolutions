
describe("[lib] sol.unittest.ix.services.SolCommonSordTypeUtils", function () {
  var SordTypeUtilsSord, originalTimeout, id, name, iconFileData,
      disabledIconFileData, linkIconFileData, extensions, kind, iconFileDataArray,
      disabledIconFileDataArray, linkIconFileDataArray, force, iconExtension, baseDirPath,
      exportConfig, names, dirPath, objId, sordTypeName, obSolCommonSordTypeUtilsId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonSordTypeUtils").then(function success(obSolCommonSordTypeUtilsId1) {
        obSolCommonSordTypeUtilsId = obSolCommonSordTypeUtilsId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/SordTypeUtils").then(function success1(SordTypeUtilsSord1) {
          SordTypeUtilsSord = SordTypeUtilsSord1;
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
    describe("sol.common.SordTypeUtils", function () {
      it("buildSordType", function (done) {
        expect(function () {
          id = "9999";
          name = "UnittestSordType";
          iconFileData = "fileData";
          disabledIconFileData = "fileData";
          linkIconFileData = "fileData";
          extensions = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: { objId: SordTypeUtilsSord.id, config: { extension: "jpg" } },
            method: "buildSordType",
            params: [id, name, iconFileData, disabledIconFileData, linkIconFileData, extensions]
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
      it("createSordType", function (done) {
        expect(function () {
          id = "9999";
          name = "UnittestSordType";
          kind = "DOCUMENT";
          iconFileDataArray = "fileDataArray";
          disabledIconFileDataArray = "fileDataArray";
          linkIconFileDataArray = "fileDataArray";
          extensions = [];
          force = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: { objId: SordTypeUtilsSord.id, config: { extension: "jpg" } },
            method: "createSordType",
            params: [id, name, kind, iconFileDataArray, disabledIconFileDataArray, linkIconFileDataArray, extensions, force]
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
      it("determinateSordTypeKind", function (done) {
        expect(function () {
          id = 0;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
            method: "determinateSordTypeKind",
            params: [id]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("FOLDER");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("determinateSordTypeKind", function (done) {
        expect(function () {
          id = 255;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
            method: "determinateSordTypeKind",
            params: [id]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("DOCUMENT");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("determinateSordTypeKind", function (done) {
        expect(function () {
          id = 9999;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
            method: "determinateSordTypeKind",
            params: [id]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("REPOSITORY");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("exportSordType", function (done) {
        expect(function () {
          name = "sol.Localization";
          iconExtension = "jpg";
          baseDirPath = "C:\\Temp";
          exportConfig = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
            method: "exportSordType",
            params: [name, iconExtension, baseDirPath, exportConfig]
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
      it("exportSordTypes", function (done) {
        expect(function () {
          names = ["sol.Localization", "sol.Business Solutions"];
          dirPath = "C:\\Temp";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
            method: "exportSordTypes",
            params: [names, dirPath]
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
      it("getSordTypeId", function (done) {
        expect(function () {
          name = "TXT";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
            method: "getSordTypeId",
            params: [name]
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
      it("getSordTypes", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
            method: "getSordTypes",
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
      it("insertSordTypeIntoCache", function (done) {
        expect(function () {
          id = "9999";
          name = "UnittestSordType";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
            method: "insertSordTypeIntoCache",
            params: [id, name]
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
      it("readSordTypes", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
            method: "readSordTypes",
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
      it("setSordType", function (done) {
        expect(function () {
          objId = obSolCommonSordTypeUtilsId;
          sordTypeName = "TXT";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
            method: "setSordType",
            params: [objId, sordTypeName]
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
      it("sordTypeExists", function (done) {
        expect(function () {
          name = "UnittestSordType";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: { sordTypesObj: { UnittestSordType: {} } },
            method: "sordTypeExists",
            params: [name]
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