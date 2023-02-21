
describe("[service] sol.learning.ix.services.ActionCheck", function () {
  var originalTimeout, sordCourse,
      rule, action;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ActionCheck").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course6").then(function success1(sordCourse1) {
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
    describe("sol.learning.ix.services.ActionCheck", function () {
      it("addparticipants", function (done) {
        expect(function () {
          rule = { 
            forbidden: ["CLASSROOM", "VIRTUAL CLASSROOM"], 
            msg: "{{sord.objKeys.COURSE_TYPE}}: {{translate 'sol.learning.course.addParticipants.wrongtype'}}"
          };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.ActionCheck",
            classConfig: { targetId: sordCourse.id },
            method: "addparticipants",
            params: [rule]
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
      it("addsessions", function (done) {
        expect(function () {
          rule = {
            allowed: ["CLASSROOM", "VIRTUAL CLASSROOM"],
            msg: "{{sord.objKeys.COURSE_TYPE}}: {{translate 'sol.learning.course.addSessions.wrongtype'}}"
          };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.ActionCheck",
            classConfig: { targetId: sordCourse.id },
            method: "addsessions",
            params: [rule]
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
      it("check", function (done) {
        expect(function () {
          action = "addsessions";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.ActionCheck",
            classConfig: { targetId: sordCourse.id },
            method: "check",
            params: [action]
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
            className: "sol.learning.ix.services.ActionCheck",
            classConfig: { targetId: sordCourse.id, action: "addsessions" },
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
    describe("RF_sol_learning_service_CheckAddParticipants", function () {
      it("should throw if executed without 'targetId' ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_CheckAddParticipants", {
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
      it("should not throw ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_CheckAddParticipants", {
            targetId: 1
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.valid).toBeDefined();
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
    describe("RF_sol_learning_service_CheckAddSessions", function () {
      it("should throw if executed without 'targetId' ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_CheckAddSessions", {
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
      it("should not throw ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_CheckAddSessions", {
            targetId: sordCourse.id
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.valid).toBeDefined();
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