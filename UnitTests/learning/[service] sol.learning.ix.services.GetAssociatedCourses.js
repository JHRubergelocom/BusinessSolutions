
describe("[service] sol.learning.ix.services.GetAssociatedCourses", function () {
  var originalTimeout, sordCourse,
      relatedPrerequisites, courseRefs, refs, opt, min, guid, guids,
      allReqs, courseGuid, courses;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetAssociatedCourses").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course").then(function success1(sordCourse1) {
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
    describe("sol.learning.ix.services.GetAssociatedCourses", function () {
      it("countCompletedCourses", function (done) {
        expect(function () {
          relatedPrerequisites = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetAssociatedCourses",
            classConfig: { guid: sordCourse.guid },
            method: "countCompletedCourses",
            params: [relatedPrerequisites]
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
      it("filterCourses", function (done) {
        expect(function () {
          courseRefs = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetAssociatedCourses",
            classConfig: { guid: sordCourse.guid },
            method: "filterCourses",
            params: [courseRefs]
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
          refs = [];
          opt = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetAssociatedCourses",
            classConfig: { guid: sordCourse.guid },
            method: "getCourses",
            params: [refs, opt]
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
      it("getCoursesByReference", function (done) {
        expect(function () {
          refs = [];
          min = true;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetAssociatedCourses",
            classConfig: { guid: sordCourse.guid },
            method: "getCoursesByReference",
            params: [refs, min]
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
      it("getRelatedCourses", function (done) {
        expect(function () {
          guid = sordCourse.guid;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetAssociatedCourses",
            classConfig: { guid: sordCourse.guid },
            method: "getRelatedCourses",
            params: [guid]
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
      it("getRequiredCoursesByReferences", function (done) {
        expect(function () {
          guids = [sordCourse.guid];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetAssociatedCourses",
            classConfig: { guid: sordCourse.guid },
            method: "getRequiredCoursesByReferences",
            params: [guids]
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
      it("getRequiredCoursesForGuids", function (done) {
        expect(function () {
          guids = [sordCourse.guid];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetAssociatedCourses",
            classConfig: { guid: sordCourse.guid },
            method: "getRequiredCoursesForGuids",
            params: [guids]
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
      it("getRequirementsResultOfCourse", function (done) {
        expect(function () {
          allReqs = [];
          courseGuid = sordCourse.guid;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetAssociatedCourses",
            classConfig: { guid: sordCourse.guid },
            method: "getRequirementsResultOfCourse",
            params: [allReqs, courseGuid]
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
            className: "sol.learning.ix.services.GetAssociatedCourses",
            classConfig: { guid: sordCourse.guid },
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
      it("sortCourses", function (done) {
        expect(function () {
          courses = [];
          refs = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetAssociatedCourses",
            classConfig: { guid: sordCourse.guid },
            method: "sortCourses",
            params: [courses, refs]
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
    describe("RF_sol_learning_service_GetRelatedCourses", function () {
      it("should throw if executed without 'guid'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetRelatedCourses", {
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
          test.Utils.execute("RF_sol_learning_service_GetRelatedCourses", {
            guid: sordCourse.guid
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.courses).toBeDefined();
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
    describe("RF_sol_learning_service_GetRequiredCourses", function () {
      it("should throw if executed without 'guid'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetRequiredCourses", {
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
          test.Utils.execute("RF_sol_learning_service_GetRequiredCourses", {
            guid: sordCourse.guid
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.courses).toBeDefined();
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