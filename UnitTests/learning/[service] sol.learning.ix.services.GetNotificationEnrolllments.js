
describe("[service] sol.learning.ix.services.GetNotificationEnrolllments", function () {
  var originalTimeout, sordCourse, courseRef,
      acc, template, n1, entries;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetNotificationEnrolllments").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course7").then(function success1(sordCourse1) {
          sordCourse = sordCourse1;
          courseRef = test.Utils.getObjKeyValue(sordCourse, "COURSE_REFERENCE");
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
    describe("sol.learning.ix.services.GetNotificationEnrolllments", function () {
      it("getFirstResult", function (done) {
        expect(function () {
          acc = {};
          template = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetNotificationEnrolllments",
            classConfig: { objId: sordCourse.id },
            method: "getFirstResult",
            params: [acc, template]
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
      it("getSearchTemplate", function (done) {
        expect(function () {
          n1 = "E";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetNotificationEnrolllments",
            classConfig: { objId: sordCourse.id },
            method: "getSearchTemplate",
            params: [n1]
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
      it("getSearchTemplatesAsArray", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetNotificationEnrolllments",
            classConfig: { objId: sordCourse.id },
            method: "getSearchTemplatesAsArray",
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
            className: "sol.learning.ix.services.GetNotificationEnrolllments",
            classConfig: { objId: sordCourse.id },
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
      it("removeEmptyValuesFromSearchEntries", function (done) {
        expect(function () {
          entries = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetNotificationEnrolllments",
            classConfig: { objId: sordCourse.id },
            method: "removeEmptyValuesFromSearchEntries",
            params: [entries]
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
    describe("RF_sol_learning_service_GetNotificationEnrolllments", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetNotificationEnrolllments", {
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
      it("should not throw with 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetNotificationEnrolllments", {
            objId: sordCourse.id
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toEqual(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get one element with 'searchTemplateName' == 'E'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetNotificationEnrolllments", {
            objId: sordCourse.id,
            searchTemplateName: "E"
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.sords).toBeDefined();
            expect(jsonResult.sords.length).toEqual(1);
            expect(jsonResult.sords[0].objKeys).toBeDefined();
            expect(jsonResult.sords[0].objKeys.ELOMAILADDRESS).toBeDefined();
            expect(jsonResult.sords[0].objKeys.COURSE_ENROLLMENT_USER).toBeDefined();
            expect(jsonResult.sords[0].objKeys.SESSION_REFERENCE).toBeDefined();
            expect(jsonResult.sords[0].objKeys.COURSE_REFERENCE).toBeDefined();
            expect(jsonResult.sords[0].objKeys.COURSE_REFERENCE).toEqual(courseRef);
            expect(jsonResult.sords[0].objKeys.ELOFULLNAME).toBeDefined();
            expect(jsonResult.sords[0].id).toBeDefined();
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