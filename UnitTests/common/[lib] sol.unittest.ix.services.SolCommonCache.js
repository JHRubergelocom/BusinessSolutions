
describe("[lib] sol.unittest.ix.services.SolCommonCache", function () {
  var originalTimeout, key, config, value, data;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonCache").then(function success(obSolCommonCacheId) {
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
    describe("sol.common.Cache", function () {
      it("clear", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Cache",
            classConfig: {},
            method: "clear",
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
      it("containsKey", function (done) {
        expect(function () {
          key = "key";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Cache",
            classConfig: {},
            method: "containsKey",
            params: [key]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("elements", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Cache",
            classConfig: {},
            method: "elements",
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
      it("get", function (done) {
        expect(function () {
          key = "key";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Cache",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Cache",
            classConfig: {},
            method: "initialize",
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
      it("isEmpty", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Cache",
            classConfig: {},
            method: "isEmpty",
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
      it("keys", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Cache",
            classConfig: {},
            method: "keys",
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
      it("put", function (done) {
        expect(function () {
          key = "key";
          value = "value";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Cache",
            classConfig: {},
            method: "put",
            params: [key, value]
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
      it("putAll", function (done) {
        expect(function () {
          data = { key1: "value1", key2: "value2" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Cache",
            classConfig: {},
            method: "putAll",
            params: [data]
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
      it("remove", function (done) {
        expect(function () {
          key = "key1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Cache",
            classConfig: {},
            method: "remove",
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
      it("size", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Cache",
            classConfig: {},
            method: "size",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("values", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Cache",
            classConfig: {},
            method: "values",
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