
describe("[service] sol.learning.ix.services.GetCourse", function () {
  var originalTimeout, sordCourse, sordCourseMaterials;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetCourse").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course").then(function success1(sordCourse1) {
          sordCourse = sordCourse1;
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course/CourseMaterials").then(function success2(sordCourseMaterials1) {
            sordCourseMaterials = sordCourseMaterials1;
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
    }).not.toThrow();
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_learning_service_GetCourse", function () {
      it("should throw if executed without 'guid'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetCourse", {
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
          test.Utils.execute("RF_sol_learning_service_GetCourse", {
            guid: sordCourse.guid
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.course).toBeDefined();
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
    describe("RF_sol_learning_service_GetCourseMaterials", function () {
      it("should throw if executed without 'guid'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetCourseMaterials", {
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
          test.Utils.execute("RF_sol_learning_service_GetCourseMaterials", {
            guid: sordCourseMaterials.guid
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.materials).toBeDefined();
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