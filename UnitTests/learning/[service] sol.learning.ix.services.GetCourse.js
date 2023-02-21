
describe("[service] sol.learning.ix.services.GetCourse", function () {
  var originalTimeout, sordCourse, sordCourseMaterials, courseRef,
      config, asessions, sessions, course, obj, courseId, instructor,
      user, session, availableSessions, courses, guid, options,
      eachChild, relatedCourseRefs, courseRefs, username, fct, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetCourse").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course").then(function success1(sordCourse1) {
          sordCourse = sordCourse1;
          courseRef = test.Utils.getObjKeyValue(sordCourse, "COURSE_REFERENCE");
          relatedCourseRefs = test.Utils.getObjKeyValue(sordCourse, "COURSE_RELATED_COURSE_REFS");
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
  describe("Test Lib Functions", function () {
    describe("sol.learning.ix.services.GetCourse", function () {
      it("getAvailableSessions", function (done) {
        expect(function () {
          course = courseRef;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "getAvailableSessions",
            params: [course]
          }).then(function success(jsonResult) {
            asessions = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("addParticipantCount", function (done) {
        expect(function () {
          sessions = ["S99"];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "addParticipantCount",
            params: [sessions]
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
      it("cleanFormattedObject", function (done) {
        expect(function () {
          obj = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "cleanFormattedObject",
            params: [obj]
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
      it("courseHasWbt", function (done) {
        expect(function () {
          courseId = sordCourse.id;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
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
      it("filterPrivateData", function (done) {
        expect(function () {
          instructor = { objKeys: {} };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "filterPrivateData",
            params: [instructor]
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
          course = courseRef;
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "findEnrollment",
            params: [course, user]
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
      it("getActiveSession", function (done) {
        expect(function () {
          session = {};
          availableSessions = asessions;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "getActiveSession",
            params: [session, availableSessions]
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
      it("getCompletedFlag", function (done) {
        expect(function () {
          courses = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "getCompletedFlag",
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
      it("getCourse", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "getCourse",
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
      it("getCourseInteractionElements", function (done) {
        expect(function () {
          course = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "getCourseInteractionElements",
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
      it("getCourseLabels", function (done) {
        expect(function () {
          course = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
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
      it("getCourseMaterialSections", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "getCourseMaterialSections",
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
      it("getEnrollmentCounts", function (done) {
        expect(function () {
          sessions = ["S99"];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "getEnrollmentCounts",
            params: [sessions]
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
      it("getFormattedChildren", function (done) {
        expect(function () {
          guid = sordCourse.guid;
          options = { 
            includeDocuments: false,
            includeFolders: true,
            includeReferences: true,
            maskId: "Course Video"
          };
          config = { sordKeys: ["name", "guid", "id", "maskName", "childCount"] };
          eachChild = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "getFormattedChildren",
            params: [guid, options, config, eachChild]
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
      it("getRelatedCourseCount", function (done) {
        expect(function () {
          courseRefs = relatedCourseRefs;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "getRelatedCourseCount",
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
      it("getRequiredCourses", function (done) {
        expect(function () {
          guid = sordCourse.guid;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "getRequiredCourses",
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
      it("getUserInfo", function (done) {
        expect(function () {
          username = "Administrator";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
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
      it("getVideo", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "getVideo",
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
            className: "sol.learning.ix.services.GetCourse",
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
      it("rfAsAdm", function (done) {
        expect(function () {
          fct = "RF_unittest";
          params = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourse",
            classConfig: { guid: sordCourse.guid },
            method: "rfAsAdm",
            params: [fct, params]
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
    describe("sol.learning.ix.services.GetCourseMaterials", function () {
      it("getCourseMaterials", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetCourseMaterials",
            classConfig: { guid: sordCourseMaterials.guid },
            method: "getCourseMaterials",
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
            className: "sol.learning.ix.services.GetCourseMaterials",
            classConfig: { guid: sordCourseMaterials.guid },
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