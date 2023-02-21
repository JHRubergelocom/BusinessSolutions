/* eslint-disable linebreak-style */

describe("[libix] sol.unittest.ix.services.SolMeeting", function () {
  var originalTimeout, objMeetingId, objId, output,
      key, config, sordMeeting;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolMeeting").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Meeting").then(function success1(objMeetingId1) {
          objMeetingId = objMeetingId1;
          test.Utils.getSord(objMeetingId).then(function success2(sordMeeting1) {
            sordMeeting = sordMeeting1;
            sordMeeting.solType = "MEETING";
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
    describe("sol.meeting.ix.Meeting", function () {
      it("initialize", function (done) {
        expect(function () {
          objId = objMeetingId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.Meeting",
            classConfig: {},
            method: "initialize",
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
      it("validateAndGet", function (done) {
        expect(function () {
          objId = objMeetingId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.Meeting",
            classConfig: {},
            method: "validateAndGet",
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
      it("getReference", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.Meeting",
            classConfig: {},
            method: "getReference",
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
      it("getItemsFolder", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.Meeting",
            classConfig: {},
            method: "getItemsFolder",
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
      it("getTasksFolder", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.Meeting",
            classConfig: {},
            method: "getTasksFolder",
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
      it("getFormattedSord", function (done) {
        expect(function () {
          output = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.Meeting",
            classConfig: {},
            method: "getFormattedSord",
            params: [output]
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
      it("getAccessRights", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.Meeting",
            classConfig: {},
            method: "getAccessRights",
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
    describe("sol.meeting.entity.Meeting", function () {
      it("get", function (done) {
        expect(function () {
          key = "key1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.entity.Meeting",
            classConfig: { data: sordMeeting },
            method: "get",
            params: [key]
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
      it("getReference", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.entity.Meeting",
            classConfig: { data: sordMeeting },
            method: "getReference",
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
      it("initialize", function (done) {
        expect(function () {
          config = { data: sordMeeting };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.entity.Meeting",
            classConfig: { data: sordMeeting },
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
      it("isMeeting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.entity.Meeting",
            classConfig: { data: sordMeeting },
            method: "isMeeting",
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
      it("isMinuteTaker", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.entity.Meeting",
            classConfig: { data: sordMeeting },
            method: "isMinuteTaker",
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