/* eslint-disable linebreak-style */

describe("[libix] sol.unittest.ix.services.SolMeetingRepository", function () {
  var originalTimeout, objMeetingId, meetingOutput, output,
      id, meetingReference, optimizationName, ref,
      participantOutput, meetingRef, options;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolMeetingRepository").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Meeting").then(function success1(objMeetingId1) {
          objMeetingId = objMeetingId1;
          test.Utils.getSord(objMeetingId).then(function success2(sordMeeting) {
            meetingReference = test.Utils.getObjKeyValue(sordMeeting, "MEETING_REFERENCE");
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
    describe("sol.meeting.ix.MeetingRepository", function () {
      it("get 'meetingOutput', 'participantOutput' configuration from meeting.config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
            objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/meeting.config"
          }).then(function success(configResult) {
            meetingOutput = configResult.config.entities.meeting.outputs.meetingFull;
            participantOutput = configResult.config.entities.meeting.outputs.participant;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("meetingOutput must be available", function () {
        expect(meetingOutput).toBeDefined();
      });
      it("findMeeting", function (done) {
        expect(function () {
          id = objMeetingId;
          output = meetingOutput;
          optimizationName = "meeting";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingRepository",
            classConfig: {},
            method: "findMeeting",
            params: [id, output, optimizationName]
          }).then(function success(jsonResult) {
            expect(jsonResult.data).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("findMeetingById", function (done) {
        expect(function () {
          id = objMeetingId;
          output = meetingOutput;
          optimizationName = "meeting";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingRepository",
            classConfig: {},
            method: "findMeetingById",
            params: [id, output, optimizationName]
          }).then(function success(jsonResult) {
            expect(jsonResult.data).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("findMeetingByRef", function (done) {
        expect(function () {
          ref = meetingReference;
          output = meetingOutput;
          optimizationName = "meeting";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingRepository",
            classConfig: {},
            method: "findMeetingByRef",
            params: [ref, output, optimizationName]
          }).then(function success(jsonResult) {
            expect(jsonResult.data).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("findMeetingItemListFolder", function (done) {
        expect(function () {
          id = objMeetingId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingRepository",
            classConfig: {},
            method: "findMeetingItemListFolder",
            params: [id]
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
      it("findParticipants", function (done) {
        expect(function () {
          meetingRef = meetingReference;
          output = participantOutput;
          optimizationName = "participants";
          options = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingRepository",
            classConfig: {},
            method: "findParticipants",
            params: [meetingRef, output, optimizationName, options]
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