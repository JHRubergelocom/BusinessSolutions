
describe("[function] sol.learning.ix.functions.CreateSessionHeadless", function () {
  var originalTimeout, interval, sessionsPath, objIdSessions,
      courseRef1, coursePath1, courseRef2, coursePath2;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateSessionHeadless").then(function success(objTempId) {
        interval = 4000;
        coursePath1 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Business Logic Provider";
        test.Utils.getSord(coursePath1).then(function success1(sordCourse1) {
          courseRef1 = test.Utils.getObjKeyValue(sordCourse1, "COURSE_REFERENCE");
          coursePath2 = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/learning [unit tests]/Test data/Course3";
          test.Utils.getSord(coursePath2).then(function success2(sordCourse2) {
            courseRef2 = test.Utils.getObjKeyValue(sordCourse2, "COURSE_REFERENCE");
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_learning_function_CreateSessionHeadless", function () {
      it("should throw if executed without 'template'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CreateSessionHeadless", {
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
      it("create session headless", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CreateSessionHeadless", {
            template: { name: "Online" },
            sordMetadata: {
              objKeys: {
                COURSE_REFERENCE: courseRef1,
                SESSION_STARTTIME: "201801010000000"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.data.objId).toBeDefined();
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
      it("remove session", function (done) {
        expect(function () {
          sessionsPath = coursePath1 + "/Sessions";
          test.Utils.getSord(sessionsPath).then(function success(sordSessions) {
            objIdSessions = sordSessions.id;
            test.Utils.deleteSord(objIdSessions).then(function success1(deleteResult) {
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
    describe("RF_sol_learning_function_CreateSessionHeadlessStrict", function () {
      it("should throw if executed without 'template'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CreateSessionHeadlessStrict", {
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
      it("create session headless strict", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_function_CreateSessionHeadlessStrict", {
            template: { name: "Online" },
            sordMetadata: {
              objKeys: {
                COURSE_REFERENCE: courseRef2,
                SESSION_STARTTIME: "201701010000000"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.data.objId).toBeDefined();
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
      it("remove session", function (done) {
        expect(function () {
          sessionsPath = coursePath2 + "/Sessions";
          test.Utils.getSord(sessionsPath).then(function success(sordSessions) {
            objIdSessions = sordSessions.id;
            test.Utils.deleteSord(objIdSessions).then(function success1(deleteResult) {
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