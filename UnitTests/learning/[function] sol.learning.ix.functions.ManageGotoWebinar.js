
describe("[function] sol.learning.ix.functions.ManageGotoWebinar", function () {
  var originalTimeout, coursePath, enrollmentPath, courseRef, objIdCourse,
      objIdEnr, enrUser,
      user, params, action, thrw, session, g2wEnrollment, g2wSession,
      full, userName, fields, s, objId, setInstructions, sord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ManageGotoWebinar").then(function success(objTempId) {
        coursePath = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course";
        test.Utils.getSord(coursePath).then(function success1(sordCourse) {
          courseRef = test.Utils.getObjKeyValue(sordCourse, "COURSE_REFERENCE");
          objIdCourse = sordCourse.id;
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
    describe("sol.learning.ix.functions.ManageGotoWebinar", function () {
      it("cancelEnrollment", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdEnr, flowId: 1 },
            method: "cancelEnrollment",
            params: [user]
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
      it("createSession", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdCourse, flowId: 1 },
            method: "createSession",
            params: [user]
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
      it("enrollInSession", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdEnr, flowId: 1 },
            method: "enrollInSession",
            params: [user]
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
      it("findSession", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdEnr, flowId: 1 },
            method: "findSession",
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
      it("g2wCreateSession", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdCourse, flowId: 1 },
            method: "g2wCreateSession",
            params: [params]
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
      it("g2wDeleteEnrollment", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdCourse, flowId: 1 },
            method: "g2wDeleteEnrollment",
            params: [params]
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
      it("g2wRegisterEnrollment", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdCourse, flowId: 1 },
            method: "g2wRegisterEnrollment",
            params: [params]
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
      it("g2wUpdateSession", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdCourse, flowId: 1 },
            method: "g2wUpdateSession",
            params: [params]
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
      it("getAction", function (done) {
        expect(function () {
          action = "action1";
          thrw = false;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdCourse, flowId: 1 },
            method: "getAction",
            params: [action, thrw]
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
      it("getCreateSessionData", function (done) {
        expect(function () {
          session = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdEnr, flowId: 1 },
            method: "getCreateSessionData",
            params: [session]
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
      it("getInstructionsFromEnrollment", function (done) {
        expect(function () {
          g2wEnrollment = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdCourse, flowId: 1 },
            method: "getInstructionsFromEnrollment",
            params: [g2wEnrollment]
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
      it("getInstructionsFromSession", function (done) {
        expect(function () {
          g2wSession = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdCourse, flowId: 1 },
            method: "getInstructionsFromSession",
            params: [g2wSession]
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
      it("getRegistrantKeys", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdEnr, flowId: 1 },
            method: "getRegistrantKeys",
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
      it("getUser", function (done) {
        expect(function () {
          full = true;
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdCourse, flowId: 1 },
            method: "getUser",
            params: [full]
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
      it("getUserData", function (done) {
        expect(function () {
          userName = "Bodo Kraft";
          fields = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdCourse, flowId: 1 },
            method: "getUserData",
            params: [userName, fields]
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
      it("getWebinarKeys", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdEnr, flowId: 1 },
            method: "getWebinarKeys",
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
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdCourse, flowId: 1, action: "action1" },
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
      it("sanitize", function (done) {
        expect(function () {
          s = "s1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdCourse, flowId: 1 },
            method: "sanitize",
            params: [s]
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
      it("saveResultInSord", function (done) {
        expect(function () {
          objId = user = "Administrator";
          setInstructions = { key: "COURSE_ENROLLMENT_USER", value: "Administrator" };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: user = "Administrator", flowId: 1 },
            method: "saveResultInSord",
            params: [objId, setInstructions]
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
      it("updateSession", function (done) {
        expect(function () {
          sord = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ManageGotoWebinar",
            classConfig: { objId: objIdEnr, flowId: 1 },
            method: "updateSession",
            params: [sord]
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