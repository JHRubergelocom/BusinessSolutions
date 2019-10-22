
describe("[lib] sol.unittest.ix.services.SolCommonSordTypeUtils", function () {
  var SordTypeUtilsSord, userName, userInfo, originalTimeout, id, name, iconFileData, disabledIconFileData, linkIconFileData, extensions, kind, iconFileDataArray, disabledIconFileDataArray, linkIconFileDataArray, force, iconExtension, baseDirPath, exportConfig, names, dirPath, objId, sordTypeName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonSordTypeUtils").then(function success(obSolCommonSordTypeUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/SordTypeUtils").then(function success1(SordTypeUtilsSord1) {
          SordTypeUtilsSord = SordTypeUtilsSord1;
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
    describe("sol.common.SordTypeUtils", function () {
      xit("buildSordType", function (done) {
        expect(function () {
          id = PVALUE;
          name = PVALUE;
          iconFileData = PVALUE;
          disabledIconFileData = PVALUE;
          linkIconFileData = PVALUE;
          extensions = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
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
      xit("createSordType", function (done) {
        expect(function () {
          id = PVALUE;
          name = PVALUE;
          kind = PVALUE;
          iconFileDataArray = PVALUE;
          disabledIconFileDataArray = PVALUE;
          linkIconFileDataArray = PVALUE;
          extensions = PVALUE;
          force = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
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
      xit("determinateSordTypeKind", function (done) {
        expect(function () {
          id = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
            method: "determinateSordTypeKind",
            params: [id]
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
      xit("exportSordType", function (done) {
        expect(function () {
          name = PVALUE;
          iconExtension = PVALUE;
          baseDirPath = PVALUE;
          exportConfig = PVALUE;
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
      xit("exportSordTypes", function (done) {
        expect(function () {
          names = PVALUE;
          dirPath = PVALUE;
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
      xit("insertSordTypeIntoCache", function (done) {
        expect(function () {
          id = PVALUE;
          name = PVALUE;
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
      xit("setSordType", function (done) {
        expect(function () {
          objId = PVALUE;
          sordTypeName = PVALUE;
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
      xit("sordTypeExists", function (done) {
        expect(function () {
          name = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordTypeUtils",
            classConfig: {},
            method: "sordTypeExists",
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