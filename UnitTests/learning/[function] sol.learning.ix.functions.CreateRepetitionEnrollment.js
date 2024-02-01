/* eslint-disable linebreak-style */

describe("[function] sol.learning.ix.functions.CreateRepetitionEnrollment", function () {
  var objIdEnr, objIdEnrRep, objIdCourse, originalTimeout, interval,
      courseRef, coursePath, enrollmentPath,
      enrollment,
      sordCourse, course, request, optimizeField, template,
      params, courseReference, enrollmentUser;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateRepetitionEnrollment").then(function success(objTempId) {
        interval = 4000;
        coursePath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Business Logic Provider";
        test.Utils.getSord(coursePath).then(function success1(sordCourse1) {
          courseRef = test.Utils.getObjKeyValue(sordCourse1, "COURSE_REFERENCE");
          sordCourse = sordCourse1;
          objIdCourse = sordCourse1.id;
          enrollmentPath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Business Logic Provider/Enrollments/Administrator";
          test.Utils.getSord(enrollmentPath).then(function success2(sordEnr) {
            objIdEnr = sordEnr.id;
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
    describe("sol.learning.ix.functions.CreateRepetitionEnrollment", function () {
      it("createEnrollment", function (done) {
        expect(function () {
          courseReference = {};
          enrollmentUser = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateRepetitionEnrollment",
            classConfig: {},
            method: "createEnrollment",
            params: [courseReference, enrollmentUser]
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
      it("getCourseFromEnrollment", function (done) {
        expect(function () {
          enrollment = objIdEnr;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateRepetitionEnrollment",
            classConfig: {},
            method: "getCourseFromEnrollment",
            params: [enrollment]
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
      it("getEnrollmentUser", function (done) {
        expect(function () {
          enrollment = objIdEnr;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateRepetitionEnrollment",
            classConfig: {},
            method: "getEnrollmentUser",
            params: [enrollment]
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
      it("getRepetitionCourseReference", function (done) {
        expect(function () {
          course = sordCourse;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateRepetitionEnrollment",
            classConfig: {},
            method: "getRepetitionCourseReference",
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
      it("optimizedExecute", function (done) {
        expect(function () {
          request = { provider: "RF_unittest", params: {} };
          optimizeField = null;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateRepetitionEnrollment",
            classConfig: {},
            method: "optimizedExecute",
            params: [request, optimizeField]
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
            className: "sol.learning.ix.functions.CreateRepetitionEnrollment",
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
      it("renderParams", function (done) {
        expect(function () {
          template = "{{formatDate 'DD.MM.YYYY HH:mm:ss' 20001015120030}}";
          params = { name: "Hans" };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.CreateRepetitionEnrollment",
            classConfig: {},
            method: "renderParams",
            params: [template, params]
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
    describe("RF_sol_learning_function_CreateRepetitionEnrollment", function () {
      it("set course repetition reference in course", function (done) {
        expect(function () {
          test.Utils.updateMapData(objIdCourse, { COURSE_REPETITION_REFERENCE: courseRef }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CreateRepetitionEnrollment", {
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
      it("create repetition enrollment", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CreateRepetitionEnrollment", {
            objId: objIdEnr
          }).then(function success(jsonResult) {
            expect(jsonResult.data.objId).toBeDefined();
            objIdEnrRep = jsonResult.data.objId;
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
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
      it("remove repetition enrollment", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdEnrRep).then(function success2(deleteResult) {
            done();
          }, function error(err) {
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