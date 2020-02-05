
describe("[libix] sol.unittest.ix.services.SolLearningLearningUtils", function () {
  var userName, originalTimeout, courseId, objId,
      courseReferences, username, learningConfig, obSolLearningLearningUtilsId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolLearningLearningUtils").then(function success(obSolLearningLearningUtilsId1) {
        obSolLearningLearningUtilsId = obSolLearningLearningUtilsId1;
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
    describe("sol.learning.ix.LearningUtils", function () {
      it("courseHasWbt", function (done) {
        expect(function () {
          courseId = obSolLearningLearningUtilsId;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib", {
            className: "sol.learning.ix.LearningUtils",
            classConfig: {},
            method: "courseHasWbt",
            params: [courseId]
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
      it("findEnrollment", function (done) {
        expect(function () {
          courseReferences = ["2222"];
          userName = "Administrator";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib", {
            className: "sol.learning.ix.LearningUtils",
            classConfig: {},
            method: "findEnrollment",
            params: [courseReferences, userName]
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
      it("getUserInfo", function (done) {
        expect(function () {
          username = "Administrator";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib", {
            className: "sol.learning.ix.LearningUtils",
            classConfig: {},
            method: "getUserInfo",
            params: [username]
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
      it("loadLearningConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib", {
            className: "sol.learning.ix.LearningUtils",
            classConfig: {},
            method: "loadLearningConfig",
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