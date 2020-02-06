
describe("[libix] sol.unittest.ix.services.SolLearningReputationUtils", function () {
  var userName, originalTimeout, type, user, countDown, count;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolLearningReputationUtils").then(function success(obSolLearningReputationUtilsId) {
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
    describe("sol.learning.ix.ReputationUtils", function () {
      it("grant", function (done) {
        expect(function () {
          type = "type1";
          user = "Administrator";
          countDown = true;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib", {
            className: "sol.learning.ix.ReputationUtils",
            classConfig: {},
            method: "grant",
            params: [type, user, countDown]
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
      it("loadConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib", {
            className: "sol.learning.ix.ReputationUtils",
            classConfig: {},
            method: "loadConfig",
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
      it("maxCount", function (done) {
        expect(function () {
          type = "type1";
          userName = "Administrator";
          count = 0;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib", {
            className: "sol.learning.ix.ReputationUtils",
            classConfig: {},
            method: "maxCount",
            params: [type, userName, count]
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
      it("readStatistics", function (done) {
        expect(function () {
          type = "type1";
          userName = "Administrator";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib", {
            className: "sol.learning.ix.ReputationUtils",
            classConfig: {},
            method: "readStatistics",
            params: [type, userName]
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
      it("writeStatistics", function (done) {
        expect(function () {
          type = "type1";
          userName = "Administrator";
          countDown = true;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib", {
            className: "sol.learning.ix.ReputationUtils",
            classConfig: {},
            method: "writeStatistics",
            params: [type, userName, countDown]
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