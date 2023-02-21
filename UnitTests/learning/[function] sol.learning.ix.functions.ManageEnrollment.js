
describe("[function] sol.learning.ix.functions.ManageEnrollment", function () {
  var originalTimeout, courseRef, coursePath,
      enrollmentPath, objIdEnr, enrUser, enrollmentObjId,
      user, courses, courseRefs, course, session, guid,
      searchCriteria, status, fn, lp, criteria, objId,
      deactivateEnrollment, targetStatus;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ManageEnrollment").then(function success(objTempId) {
        coursePath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course";
        test.Utils.getSord(coursePath).then(function success1(sordCourse) {
          courseRef = test.Utils.getObjKeyValue(sordCourse, "COURSE_REFERENCE");
          enrollmentPath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course/Enrollments/Administrator";
          test.Utils.getSord(enrollmentPath).then(function success2(sordEnr) {
            objIdEnr = sordEnr.id;
            enrUser = test.Utils.getObjKeyValue(sordEnr, "COURSE_ENROLLMENT_USER");
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
    describe("sol.learning.ix.functions.ManageEnrollment", function () {
      it("cancelledHandler", function (done) {
        expect(function () {
          enrollmentObjId = objIdEnr;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "cancelledHandler",
            params: [enrollmentObjId]
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
      it("completedHandler", function (done) {
        expect(function () {
          enrollmentObjId = objIdEnr;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "completedHandler",
            params: [enrollmentObjId]
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
      it("getCompletedEnrollmentsOfCourses", function (done) {
        expect(function () {
          user = enrUser;
          courses = [courseRef];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "getCompletedEnrollmentsOfCourses",
            params: [user, courses]
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
      it("getCoursesByReferences", function (done) {
        expect(function () {
          courseRefs = [courseRef];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "getCoursesByReferences",
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
      it("getCoursesHavingRelatedCourse", function (done) {
        expect(function () {
          course = courseRef;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "getCoursesHavingRelatedCourse",
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
      it("getEnrollment", function (done) {
        expect(function () {
          user = enrUser;
          course = courseRef;
          session = null;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "getEnrollment",
            params: [user, course, session]
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
      it("getEnrollmentByGuid", function (done) {
        expect(function () {
          guid = enrollmentObjId;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "getEnrollmentByGuid",
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
      it("getEnrollmentObjIds", function (done) {
        expect(function () {
          searchCriteria = { key: "SOL_TYPE", value: ["COURSE_ENROLLMENT"] };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "getEnrollmentObjIds",
            params: [searchCriteria]
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
      it("getEnrollmentsCourseRefs", function (done) {
        expect(function () {
          searchCriteria = { key: "SOL_TYPE", value: ["COURSE_ENROLLMENT"] };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "getEnrollmentsCourseRefs",
            params: [searchCriteria]
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
      it("getLearningPathEnrollments", function (done) {
        expect(function () {
          user = enrUser;
          course = courseRef;
          status = ["ENROLLED"];
          fn = "getEnrollmentObjIds";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "getLearningPathEnrollments",
            params: [user, course, status, fn]
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
      it("learningPathGoalsReached", function (done) {
        expect(function () {
          user = enrUser;
          course = courseRef;
          lp = { courseRef: course, objId: objIdEnr };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "learningPathGoalsReached",
            params: [user, course, lp]
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
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
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
      it("setCriteria", function (done) {
        expect(function () {
          criteria = [];
          objId = objIdEnr;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "setCriteria",
            params: [criteria, objId]
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
      it("setEnrollmentStatus", function (done) {
        expect(function () {
          status = "COMPLETED";
          enrollmentObjId = objIdEnr;
          deactivateEnrollment = false;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "setEnrollmentStatus",
            params: [status, enrollmentObjId, deactivateEnrollment]
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
      it("setLearningPathEnrollmentsStatus", function (done) {
        expect(function () {
          user = enrUser;
          course = courseRef;
          status = ["ENROLLED"];
          targetStatus = "RUNNING";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageEnrollment",
            classConfig: { guid: objIdEnr },
            method: "setLearningPathEnrollmentsStatus",
            params: [user, course, status, targetStatus]
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
    describe("RF_sol_learning_function_ManageEnrollment", function () {
      it("should throw if executed without 'user'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_ManageEnrollment", {
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
      it("should throw if executed without 'course'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_ManageEnrollment", {
            user: "Administrator"
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
      it("should throw if executed without 'action'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_ManageEnrollment", {
            user: "Administrator",
            course: courseRef
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
      it("manage enrollment 'started'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_ManageEnrollment", {
            user: "Administrator",
            course: courseRef,
            action: "started"
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
      it("manage enrollment 'completed'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_ManageEnrollment", {
            user: "Administrator",
            course: courseRef,
            action: "completed"
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
      it("remove workflow", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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