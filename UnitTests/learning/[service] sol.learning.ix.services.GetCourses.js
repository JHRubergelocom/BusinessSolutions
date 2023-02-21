
describe("[service] sol.learning.ix.services.GetCourses", function () {
  var originalTimeout, sordCourse,
      sords, config, courses, userName, criteria, filter,
      course, coverGuids, courseReferences;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetCourses").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course7").then(function success1(sordCourse1) {
          sordCourse = sordCourse1;
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
  describe("Test Lib Functions", function () {
    describe("sol.learning.ix.services.GetCourses", function () {
      it("addCourseCovers", function (done) {
        expect(function () {
          sords = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: { _activeConfig: { coverImageSize: 100 } },
            method: "addCourseCovers",
            params: [sords]
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
      it("addCourseStatusFilter", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: {},
            method: "addCourseStatusFilter",
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
      it("addEnrollmentData", function (done) {
        expect(function () {
          courses = [];
          userName = "Administrator";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: {},
            method: "addEnrollmentData",
            params: [courses, userName]
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
      it("addSearchFilter", function (done) {
        expect(function () {
          criteria = [];
          filter = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: {},
            method: "addSearchFilter",
            params: [criteria, filter]
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
      it("enhanceCourse", function (done) {
        expect(function () {
          course = sordCourse;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: {},
            method: "enhanceCourse",
            params: [course]
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
      it("enhanceCourses", function (done) {
        expect(function () {
          courses = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: {},
            method: "enhanceCourses",
            params: [courses]
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
      it("getCourseCovers", function (done) {
        expect(function () {
          coverGuids = [sordCourse.id];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: { _activeConfig: { coverImageSize: 100 } },
            method: "getCourseCovers",
            params: [coverGuids]
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
      it("getCourseLabels", function (done) {
        expect(function () {
          course = sordCourse;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: {},
            method: "getCourseLabels",
            params: [course]
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
      it("getEnrollmentData", function (done) {
        expect(function () {
          courseReferences = [];
          userName = "Administrator";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: {},
            method: "getEnrollmentData",
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
      it("parseOptions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: {},
            method: "parseOptions",
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
      it("parsePagingOptions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: {},
            method: "parsePagingOptions",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: {},
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
      it("removeVisibilityFilter", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourses",
            classConfig: {},
            method: "removeVisibilityFilter",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_learning_service_GetCourses", function () {
      it("should not throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetCourses", {
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.sords).toBeDefined();
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
    describe("RF_sol_learning_service_GetCoursesFilters", function () {
      it("should not throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetCoursesFilters", {
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.sords).toBeDefined();
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