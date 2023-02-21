
describe("[service] sol.learning.ix.services.GetEnrolledCourses", function () {
  var originalTimeout, sordCourse, sordEnrollment, courseRef,
      sords, course, enrollment, courses, enrollments, arr, entry,
      criteria, filter, key, value, groupedCourses, coverGuids,
      search, courseReferences, array;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetEnrolledCourses").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course").then(function success1(sordCourse1) {
          sordCourse = sordCourse1;
          courseRef = test.Utils.getObjKeyValue(sordCourse, "COURSE_REFERENCE");
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course/Enrollments/Administrator").then(function success2(sordEnrollment1) {
            sordEnrollment = sordEnrollment1;
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
  describe("Test Lib Functions", function () {
    describe("sol.learning.ix.services.GetEnrolledCourses", function () {
      it("addCourseCovers", function (done) {
        expect(function () {
          sords = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
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
      it("addEnrollmentToCourse", function (done) {
        expect(function () {
          enrollment = sordEnrollment;
          course = sordCourse;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "addEnrollmentToCourse",
            params: [enrollment, course]
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
      it("addEnrollmentsToCourses", function (done) {
        expect(function () {
          courses = [];
          enrollments = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "addEnrollmentsToCourses",
            params: [courses, enrollments]
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
      it("addEntry", function (done) {
        expect(function () {
          arr = [];
          entry = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "addEntry",
            params: [arr, entry]
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
            className: "sol.learning.ix.services.GetEnrolledCourses",
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
      it("createSearchEntry", function (done) {
        expect(function () {
          key = "key1";
          value = "value1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "createSearchEntry",
            params: [key, value]
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
            className: "sol.learning.ix.services.GetEnrolledCourses",
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
      it("getCorrespondingCourse", function (done) {
        expect(function () {
          enrollment = sordEnrollment;
          courses = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "getCorrespondingCourse",
            params: [enrollment, courses]
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
      it("getCorrespondingCourseAndAddEnrollmentToCourse", function (done) {
        expect(function () {
          enrollment = sordEnrollment;
          groupedCourses = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "getCorrespondingCourseAndAddEnrollmentToCourse",
            params: [enrollment, groupedCourses]
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
            className: "sol.learning.ix.services.GetEnrolledCourses",
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
            className: "sol.learning.ix.services.GetEnrolledCourses",
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
      it("getCourseReferencesFromEnrollments", function (done) {
        expect(function () {
          enrollments = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "getCourseReferencesFromEnrollments",
            params: [enrollments]
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
      it("getCourses", function (done) {
        expect(function () {
          search = [{ key: "SOL_TYPE", value: "COURSE" }];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "getCourses",
            params: [search]
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
      it("getCoursesByCourseReference", function (done) {
        expect(function () {
          courseReferences = [courseRef];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "getCoursesByCourseReference",
            params: [courseReferences]
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
      it("getDefaultSearch", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "getDefaultSearch",
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
      it("getDefaultSearchWithCourseReferencesSearchEntry", function (done) {
        expect(function () {
          courseReferences = [courseRef];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "getDefaultSearchWithCourseReferencesSearchEntry",
            params: [courseReferences]
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
      it("getEnrolledCourses", function (done) {
        expect(function () {
          enrollments = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "getEnrolledCourses",
            params: [enrollments]
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
      it("getEnrollmentsWithCourseReferences", function (done) {
        expect(function () {
          enrollments = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "getEnrollmentsWithCourseReferences",
            params: [enrollments]
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
      it("groupBy", function (done) {
        expect(function () {
          array = [];
          key = "key1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "groupBy",
            params: [array, key]
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
            className: "sol.learning.ix.services.GetEnrolledCourses",
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
            className: "sol.learning.ix.services.GetEnrolledCourses",
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
            className: "sol.learning.ix.services.GetEnrolledCourses",
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
      it("transformCourses", function (done) {
        expect(function () {
          courses = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetEnrolledCourses",
            classConfig: {},
            method: "transformCourses",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_learning_service_GetEnrolledCourses", function () {
      it("should not throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetEnrolledCourses", {
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
    describe("RF_sol_learning_service_GetEnrolledCoursesFilters", function () {
      it("should not throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetEnrolledCoursesFilters", {
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