
describe("[function] sol.learning.ix.functions.MoveEnrollmentToCourse", function () {
  var originalTimeout, courseRef, coursePath, objIdCourse,
      enrollmentPath, objIdEnr, enrollmentObjId,
      criteria, objId,
      courseGuid, folderName, courseEnrollmentFolderName,
      courseLanguage, entity, str, targetPath,
      targetMask, fct, params, courseObjId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("MoveEnrollmentToCourse").then(function success(objTempId) {
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
    describe("sol.learning.ix.functions.MoveEnrollmentToCourse", function () {
      it("assembleTargetPath", function (done) {
        expect(function () {
          courseGuid = objIdCourse;
          folderName = "folderName1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.MoveEnrollmentToCourse",
            classConfig: {},
            method: "assembleTargetPath",
            params: [courseGuid, folderName]
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
      it("determineFolderMask", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.MoveEnrollmentToCourse",
            classConfig: {},
            method: "determineFolderMask",
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
      it("getCourse", function (done) {
        expect(function () {
          criteria = { course: courseRef };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.MoveEnrollmentToCourse",
            classConfig: {},
            method: "getCourse",
            params: [criteria]
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
          objId = objIdCourse;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.MoveEnrollmentToCourse",
            classConfig: {},
            method: "getEnrollment",
            params: [objId]
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
      it("getEnrollmentFolderName", function (done) {
        expect(function () {
          courseEnrollmentFolderName = "courseEnrollmentFolderName1";
          courseLanguage = "de";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.MoveEnrollmentToCourse",
            classConfig: {},
            method: "getEnrollmentFolderName",
            params: [courseEnrollmentFolderName, courseLanguage]
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
      it("getSords", function (done) {
        expect(function () {
          entity = "enrollment";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.MoveEnrollmentToCourse",
            classConfig: {},
            method: "getSords",
            params: [entity]
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
      it("isLocale", function (done) {
        expect(function () {
          str = "str1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.MoveEnrollmentToCourse",
            classConfig: {},
            method: "isLocale",
            params: [str]
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
      it("moveEnrollmentToCourse", function (done) {
        expect(function () {
          enrollmentObjId = objIdEnr;
          targetPath = coursePath;
          targetMask = "Course structure";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.MoveEnrollmentToCourse",
            classConfig: {},
            method: "moveEnrollmentToCourse",
            params: [enrollmentObjId, targetPath, targetMask]
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
            className: "sol.learning.ix.functions.MoveEnrollmentToCourse",
            classConfig: { objId: objIdCourse },
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
            className: "sol.learning.ix.functions.MoveEnrollmentToCourse",
            classConfig: {},
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
      it("saveFolderNameInCourse", function (done) {
        expect(function () {
          courseObjId = objIdCourse;
          folderName = "folderName1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.MoveEnrollmentToCourse",
            classConfig: {},
            method: "saveFolderNameInCourse",
            params: [courseObjId, folderName]
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