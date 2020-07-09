
describe("[lib] sol.unittest.ix.services.SolCommonIxUtils", function () {
  var originalTimeout,
      funcName, paramObj, successFct, failureFct,
      rf, config, cacheObject, optimization, excludeFromConfig,
      currentVersionString, requiredVersionString;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonIxUtils").then(function success(obSolCommonIxUtilsId) {
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
    describe("sol.common.IxUtils", function () {
      it("execute", function (done) {
        expect(function () {
          funcName = "RF_sol_common_service_GetConfig";
          paramObj = { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true };
          successFct = null;
          failureFct = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils",
            classConfig: {},
            method: "execute",
            params: [funcName, paramObj, successFct, failureFct]
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
      it("optimizedExecute", function (done) {
        expect(function () {
          rf = "RF_sol_common_service_GetConfig";
          config = { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true };
          cacheObject = {};
          optimization = null;
          excludeFromConfig = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils",
            classConfig: {},
            method: "optimizedExecute",
            params: [rf, config, cacheObject, optimization, excludeFromConfig]
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
      it("checkVersion", function (done) {
        expect(function () {
          currentVersionString = "9.03.26";
          requiredVersionString = "9.03.021";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils",
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
    });
    describe("sol.common.IxUtils.Proxy", function () {
      it("callAsync", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils.Proxy",
            classConfig: {
              fctName: "RF_sol_common_service_GetConfig",
              params: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true },
              successFct: null,
              failureFct: null
            },
            method: "callAsync",
            params: []
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
      it("callAsyncSessionLight", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils.Proxy",
            classConfig: {
              fctName: "RF_sol_common_service_GetConfig",
              params: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true },
              successFct: null,
              failureFct: null
            },
            method: "callAsyncSessionLight",
            params: []
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
      it("callSync", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils.Proxy",
            classConfig: {
              fctName: "RF_sol_common_service_GetConfig",
              params: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true },
              successFct: null,
              failureFct: null
            },
            method: "callSync",
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
      it("execute", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils.Proxy",
            classConfig: {
              fctName: "RF_sol_common_service_GetConfig",
              params: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true },
              successFct: null,
              failureFct: null
            },
            method: "execute",
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
      it("getAny", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils.Proxy",
            classConfig: {
              fctName: "RF_sol_common_service_GetConfig",
              params: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true },
              successFct: null,
              failureFct: null
            },
            method: "getAny",
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
      it("getIXConnection", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils.Proxy",
            classConfig: {
              fctName: "RF_sol_common_service_GetConfig",
              params: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true },
              successFct: null,
              failureFct: null
            },
            method: "getIXConnection",
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
      it("initialize", function (done) {
        expect(function () {
          config = { params: { adminTicket: "" } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils.Proxy",
            classConfig: {
              fctName: "RF_sol_common_service_GetConfig",
              params: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true },
              successFct: null,
              failureFct: null
            },
            method: "initialize",
            params: [config]
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
      it("isEloApp", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils.Proxy",
            classConfig: {
              fctName: "RF_sol_common_service_GetConfig",
              params: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true },
              successFct: null,
              failureFct: null
            },
            method: "isEloApp",
            params: []
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
      it("isEloWf", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils.Proxy",
            classConfig: {
              fctName: "RF_sol_common_service_GetConfig",
              params: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true },
              successFct: null,
              failureFct: null
            },
            method: "isEloWf",
            params: []
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
      it("isRhino", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils.Proxy",
            classConfig: {
              fctName: "RF_sol_common_service_GetConfig",
              params: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true },
              successFct: null,
              failureFct: null
            },
            method: "isRhino",
            params: []
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
      it("isWebClient", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils.Proxy",
            classConfig: {
              fctName: "RF_sol_common_service_GetConfig",
              params: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true },
              successFct: null,
              failureFct: null
            },
            method: "isWebClient",
            params: []
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
      it("wfSupportsSessionLight", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.IxUtils.Proxy",
            classConfig: {
              fctName: "RF_sol_common_service_GetConfig",
              params: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/unittest.config", forceReload: true },
              successFct: null,
              failureFct: null
            },
            method: "wfSupportsSessionLight",
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