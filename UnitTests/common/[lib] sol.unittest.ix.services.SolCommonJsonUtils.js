
describe("[lib] sol.unittest.ix.services.SolCommonJsonUtils", function () {
  var originalTimeout, json, classJava, javaObject, obj, objFormat;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonJsonUtils").then(function success(obSolCommonJsonUtilsId) {
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
    describe("sol.common.JsonUtils", function () {
      it("deserialize", function (done) {
        expect(function () {
          json = "{\"aa\":{\"bb\": \"cc\"}}";
          classJava = "java.lang.Object";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.JsonUtils",
            classConfig: {},
            method: "deserialize",
            params: [json, classJava]
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
      it("serialize", function (done) {
        expect(function () {
          javaObject = { aa: { bb: "cc" } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.JsonUtils",
            classConfig: {},
            method: "serialize",
            params: [javaObject]
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
      it("stringifyAll", function (done) {
        expect(function () {
          obj = { key1: "value1", key2: { xx: { aa: "bb" } } };
          objFormat = { tabStop: 2 };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.JsonUtils",
            classConfig: {},
            method: "stringifyAll",
            params: [obj, objFormat]
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
      it("stringifyQuick", function (done) {
        expect(function () {
          obj = { key1: "value1", key2: { xx: { aa: "bb" } } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.JsonUtils",
            classConfig: {},
            method: "stringifyQuick",
            params: [obj]
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