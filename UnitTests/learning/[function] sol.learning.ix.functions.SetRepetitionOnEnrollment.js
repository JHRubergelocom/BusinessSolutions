
describe("[function] sol.learning.ix.functions.SetRepetitionOnEnrollment", function () {
  var objIdEnr, objIdCourse, originalTimeout,
      courseRef, coursePath, enrollmentPath,
      attribute, obj, searchEntries;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SetRepetitionOnEnrollment").then(function success(objTempId) {
        coursePath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Business Logic Provider";
        test.Utils.getSord(coursePath).then(function success1(sordCourse) {
          courseRef = test.Utils.getObjKeyValue(sordCourse, "COURSE_REFERENCE");
          objIdCourse = sordCourse.id;
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
    describe("sol.learning.ix.functions.SetRepetitionOnEnrollment", function () {
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
      it("isEmpty", function (done) {
        expect(function () {
          attribute = "attribute1";
          obj = { attribute1: "attribute1" };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.SetRepetitionOnEnrollment",
            classConfig: { objId: objIdEnr },
            method: "isEmpty",
            params: [attribute, obj]
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
      it("isNotEmpty", function (done) {
        expect(function () {
          attribute = "attribute1";
          obj = { attribute1: "attribute1" };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.SetRepetitionOnEnrollment",
            classConfig: { objId: objIdEnr },
            method: "isNotEmpty",
            params: [attribute, obj]
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
            className: "sol.learning.ix.functions.SetRepetitionOnEnrollment",
            classConfig: { objId: objIdEnr },
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
      it("removeEmptySearchEntries", function (done) {
        expect(function () {
          searchEntries = [{ key: "COURSE_REFERENCE", value: "{{sord.objKeys.COURSE_REFERENCE}}" }];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.SetRepetitionOnEnrollment",
            classConfig: { objId: objIdEnr },
            method: "removeEmptySearchEntries",
            params: [searchEntries]
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
    describe("RF_sol_learning_function_SetRepetitionOnEnrollment", function () {
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
          test.Utils.execute("RF_sol_learning_function_SetRepetitionOnEnrollment", {
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
      it("set repetition enrollment", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_SetRepetitionOnEnrollment", {
            objId: objIdEnr
          }).then(function success(jsonResult) {
            expect(jsonResult.objId).toBeDefined();
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