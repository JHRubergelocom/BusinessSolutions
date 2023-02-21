
describe("[function] sol.meeting.ix.functions.Notify", function () {
  var originalTimeout, objTempId, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Notify", null, null).then(function success(objTempId1) {
        objTempId = objTempId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.meeting.ix.functions.Notify", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {
            objId: objTempId,
            from: "test-business-solutions@elo.local",
            to: "test-business-solutions@elo.local",
            subject: "Neue Aufgabe"
          };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.Notify",
            classConfig: {
              objId: objTempId,
              from: "test-business-solutions@elo.local",
              to: "test-business-solutions@elo.local",
              subject: "Neue Aufgabe"
            },
            method: "initialize",
            params: [config]
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
      it("prepareAttachmentList", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.Notify",
            classConfig: {
              objId: objTempId,
              from: "test-business-solutions@elo.local",
              to: "test-business-solutions@elo.local",
              subject: "Neue Aufgabe"
            },
            method: "prepareAttachmentList",
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.Notify",
            classConfig: {
              objId: objTempId,
              from: "test-business-solutions@elo.local",
              to: "test-business-solutions@elo.local",
              subject: "Neue Aufgabe"
            },
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
      it("shouldAppendAttachments", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.Notify",
            classConfig: {
              objId: objTempId,
              from: "test-business-solutions@elo.local",
              to: "test-business-solutions@elo.local",
              subject: "Neue Aufgabe"
            },
            method: "shouldAppendAttachments",
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
    describe("RF_sol_meeting_function_Notify", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_Notify", {
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
      it("should throw if executed without 'from'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_Notify", {
            objId: objTempId
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
      it("should throw if executed without 'to'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_Notify", {
            objId: objTempId,
            from: "test-business-solutions@elo.local"
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
      it("should throw if executed without 'subject'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_Notify", {
            objId: objTempId,
            from: "test-business-solutions@elo.local",
            to: "test-business-solutions@elo.local"
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
      it("notify", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_Notify", {
            objId: objTempId,
            from: "test-business-solutions@elo.local",
            to: "test-business-solutions@elo.local",
            subject: "Neue Aufgabe"
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
      it("remove workflows", function (done) {
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
          test.Utils.getFinishedWorkflows().then(function success4(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success5(removeFinishedWorkflowsResult) {
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