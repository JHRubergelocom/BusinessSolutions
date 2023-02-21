
describe("[service] sol.meeting.ix.services.MeetingItem", function () {
  var originalTimeout, objMeetingItemId, config,
      response, meetingItem, group, user, meeting,
      item;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("MeetingItem").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Meeting/Themen/MeetingItem1").then(function success1(objMeetingItemId1) {
          objMeetingItemId = objMeetingItemId1;
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
    describe("sol.meeting.ix.services.MeetingItem", function () {
      it("appendAttachments", function (done) {
        expect(function () {
          response = {};
          meetingItem = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "appendAttachments",
            params: [response, meetingItem]
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
      it("appendMeetingResponse", function (done) {
        expect(function () {
          response = {};
          meeting = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "appendMeetingResponse",
            params: [response, meeting]
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
      it("appendMembershipResponse", function (done) {
        expect(function () {
          response = {};
          meetingItem = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "appendMembershipResponse",
            params: [response, meetingItem]
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
      it("appendProposalActions", function (done) {
        expect(function () {
          response = {};
          meetingItem = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "appendProposalActions",
            params: [response, meetingItem]
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
      it("appendProposalResponse", function (done) {
        expect(function () {
          response = {};
          meetingItem = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "appendProposalResponse",
            params: [response, meetingItem]
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
      it("checkUserInGroupOrAdmin", function (done) {
        expect(function () {
          group = {};
          user = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "checkUserInGroupOrAdmin",
            params: [group, user]
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
      it("createMeetingItemResponse", function (done) {
        expect(function () {
          meetingItem = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "createMeetingItemResponse",
            params: [meetingItem]
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
      it("findMeeting", function (done) {
        expect(function () {
          meetingItem = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "findMeeting",
            params: [meetingItem]
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
      it("getId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "getId",
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
      it("hideMinutesDetails", function (done) {
        expect(function () {
          item = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "hideMinutesDetails",
            params: [item]
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
          config = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
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
      it("mayUserSeeMinutes", function (done) {
        expect(function () {
          response = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "mayUserSeeMinutes",
            params: [response]
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
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
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
      it("shouldQueryAttachments", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "shouldQueryAttachments",
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
      it("shouldQueryMeeting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "shouldQueryMeeting",
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
      it("shouldQueryMemberships", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "shouldQueryMemberships",
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
      it("shouldQueryProposal", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "shouldQueryProposal",
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
      it("shouldQueryProposalActions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.MeetingItem",
            classConfig: { objId: objMeetingItemId },
            method: "shouldQueryProposalActions",
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
    describe("RF_sol_meeting_service_MeetingItem_Get", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_MeetingItem_Get", {
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
      it("get meeting item", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_MeetingItem_Get", {
            objId: objMeetingItemId
          }).then(function success(jsonResult) {
            expect(jsonResult.item).toBeDefined();
            expect(jsonResult.item.sord).toBeDefined();
            expect(jsonResult.item.sord.accessCode).toBeDefined();
            expect(jsonResult.item.config).toBeDefined();
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