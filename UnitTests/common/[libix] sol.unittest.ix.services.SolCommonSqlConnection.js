
describe("[libix] sol.unittest.ix.services.SolCommonSqlConnection", function () {
  var originalTimeout, scriptContent, params, config, resourceName, dbConfig;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonSqlConnection").then(function success(obSolCommonSqlConnectionId) {
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
    describe("sol.common.ix.SqlConnection", function () {
      it("close", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.SqlConnection",
            classConfig: {},
            method: "close",
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
      it("executeSqlScript", function (done) {
        expect(function () {
          scriptContent = "SELECT * FROM sol_common_fx";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.SqlConnection",
            classConfig: {},
            method: "executeSqlScript",
            params: [scriptContent, params]
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
      it("getDbTypeFilePrefix", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.SqlConnection",
            classConfig: {},
            method: "getDbTypeFilePrefix",
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
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.SqlConnection",
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
      it("open", function (done) {
        expect(function () {
          resourceName = "";
          dbConfig = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.SqlConnection",
            classConfig: {},
            method: "open",
            params: [resourceName, dbConfig]
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
      it("parseStatements", function (done) {
        expect(function () {
          scriptContent = "SELECT * FROM sol_common_fx";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.SqlConnection",
            classConfig: {},
            method: "parseStatements",
            params: [scriptContent]
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