
describe("[dynkwl] sol.learning.ix.dynkwls.CourseIteratorBase", function () {
  var originalTimeout, objCourseIteratorBaseId,
      filterList, sord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CourseIteratorBase").then(function success(objCourseIteratorBaseId1) {
        objCourseIteratorBaseId = objCourseIteratorBaseId1;
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
    describe("sol.learning.ix.dynkwl.courseIterator.Base", function () {
      it("getFindInfo", function (done) {
        expect(function () {
          filterList = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.dynkwl.courseIterator.Base",
            classConfig: {},
            method: "getFindInfo",
            params: [filterList]
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
      it("getRowData", function (done) {
        expect(function () {
          sord = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.dynkwl.courseIterator.Base",
            classConfig: {},
            method: "getRowData",
            params: [sord]
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
  describe("Tests Dynamic Keyword lists", function () {
    describe("sol.learning.ix.dynkwl.courseIterator.Base", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl", {
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
      it("should throw if executed without 'dynkwl'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl", {
            objId: objCourseIteratorBaseId
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
      it("should throw if executed without 'providerConfig'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl", {
            objId: objCourseIteratorBaseId,
            dynKwl: "sol.learning.ix.dynkwl.courseIterator.Base"
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
      it("should throw if executed without 'inputFieldName'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl", {
            objId: objCourseIteratorBaseId,
            dynKwl: "sol.learning.ix.dynkwl.courseIterator.Base",
            providerConfig: {}
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
      it("should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl", {
            objId: objCourseIteratorBaseId,
            dynKwl: "sol.learning.ix.dynkwl.courseIterator.Base",
            providerConfig: {},
            inputFieldName: "UNITTEST_FIELD2"
          }).then(function success(jsonResult) {   
            if (jsonResult.error) {
              fail(jsonResult.error);
            } else {
              expect(jsonResult.keynames).toBeDefined();
              expect(jsonResult.header).toBeDefined();
              expect(jsonResult.title).toBeDefined();
              expect(jsonResult.data).toBeDefined();  
            }
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