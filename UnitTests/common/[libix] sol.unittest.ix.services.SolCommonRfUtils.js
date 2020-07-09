
describe("[libix] sol.unittest.ix.services.SolCommonRfUtils", function () {
  var originalTimeout, user, config, ec, funcName, jsonStr, obj;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonRfUtils").then(function success(obSolCommonRfUtilsId) {
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
    describe("sol.common.ix.RfUtils", function () {
      it("checkMainAdminRights", function (done) {
        expect(function () {
          user = "Administrator";
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.RfUtils",
            classConfig: {},
            method: "checkMainAdminRights",
            params: [user, config]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.RfUtils",
            classConfig: {},
            method: "initialize",
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
      it("parseAndCheckParams", function (done) {
        expect(function () {
          ec = {};
          funcName = "funcName1";
          jsonStr = "{\"aa\": \"bb\"}";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.RfUtils",
            classConfig: {},
            method: "parseAndCheckParams",
            params: [ec, funcName, jsonStr]
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
      it("stringify", function (done) {
        expect(function () {
          obj = { aa: "bb" };
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.RfUtils",
            classConfig: {},
            method: "stringify",
            params: [obj, config]
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