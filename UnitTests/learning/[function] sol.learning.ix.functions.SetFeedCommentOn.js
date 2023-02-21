
describe("[function] sol.learning.ix.functions.SetFeedCommentOn", function () {
  var originalTimeout, objSetFeedCommentOnId,
      searchResult;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SetFeedCommentOn").then(function success(objSetFeedCommentOnId1) {
        objSetFeedCommentOnId = objSetFeedCommentOnId1;
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
    describe("sol.learning.functionsSetFeedCommentOn", function () {
      it("getFeedObjectId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.SetFeedCommentOn",
            classConfig: { objId: objSetFeedCommentOnId, on: { type: "COURSE", key: "COURSE_REFERENCE", path: "sord.objKeys.COURSE_REFERENCE" } },
            method: "getFeedObjectId",
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
      it("getObjectId", function (done) {
        expect(function () {
          searchResult = { sords: [{ objId: objSetFeedCommentOnId }] };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.SetFeedCommentOn",
            classConfig: { objId: objSetFeedCommentOnId },
            method: "getObjectId",
            params: [searchResult]
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
      it("hasObjectId", function (done) {
        expect(function () {
          searchResult = { sords: [{ objId: objSetFeedCommentOnId }] };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.SetFeedCommentOn",
            classConfig: { objId: objSetFeedCommentOnId },
            method: "hasObjectId",
            params: [searchResult]
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.SetFeedCommentOn",
            classConfig: { objId: objSetFeedCommentOnId, file: "sol.dev.unittest", key: "should not throw if executed with 'objId' und 'key'" },
            method: "process",
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_learning_function_SetFeedCommentOn", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_SetFeedCommentOn", {
            file: "sol.dev.unittest",
            key: "should throw if executed without 'objId'"    
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
      it("should throw if executed without 'key'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_SetFeedCommentOn", {
            objId: objSetFeedCommentOnId,
            file: "sol.dev.unittest"
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
      it("should not throw if executed with 'objId' und 'key'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_SetFeedCommentOn", {
            objId: objSetFeedCommentOnId,
            file: "sol.dev.unittest",
            key: "should not throw if executed with 'objId' und 'key'"
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
});