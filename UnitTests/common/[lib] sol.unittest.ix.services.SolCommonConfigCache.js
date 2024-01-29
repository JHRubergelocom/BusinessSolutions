/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonConfigCache", function () {
  var originalTimeout, key, solution, cfg, options;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonConfigCache").then(function success(obSolCommonConfigCacheId) {
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
    describe("sol.common.ConfigCache", function () {
      it("cacheDisabled", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigCache",
            classConfig: {},
            method: "cacheDisabled",
            params: []
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
      it("get", function (done) {
        expect(function () {
          key = "key";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigCache",
            classConfig: {},
            method: "get",
            params: [key]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(null);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getCache", function (done) {
        expect(function () {
          options = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigCache",
            classConfig: {},
            method: "getCache",
            params: [options]
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
      it("getELOasCfg", function (done) {
        expect(function () {
          solution = "common";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigCache",
            classConfig: {},
            method: "getELOasCfg",
            params: [solution]
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
      it("getProtected", function (done) {
        expect(function () {
          key = "key";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigCache",
            classConfig: {},
            method: "getProtected",
            params: [key]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(null);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("initGlobalCache", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigCache",
            classConfig: {},
            method: "initGlobalCache",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({});
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("put", function (done) {
        expect(function () {
          key = "key";
          cfg = { key: "key" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigCache",
            classConfig: {},
            method: "put",
            params: [key, cfg]
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
      it("putELOasCfg", function (done) {
        expect(function () {
          solution = "common";
          cfg = { key: "key" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigCache",
            classConfig: {},
            method: "putELOasCfg",
            params: [solution, cfg]
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