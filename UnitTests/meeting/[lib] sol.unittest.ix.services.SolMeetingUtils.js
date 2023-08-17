/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolMeetingUtils", function () {
  var originalTimeout, objMeetingId, sordMeeting, templateSord, sord, meeting, status,
      sordId, value, productLine, attachmentField, tableKind;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolMetingUtils").then(function success(obSolMeetingUtilsId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Meeting").then(function success1(objMeetingId1) {
          objMeetingId = objMeetingId1;
          test.Utils.getSord(objMeetingId).then(function success2(sordMeeting1) {
            sordMeeting = sordMeeting1;
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
    describe("sol.meeting.Utils", function () {
      it("findMeetingBoard", function (done) {
        expect(function () {
          sordId = objMeetingId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "findMeetingBoard",
            params: [sordId]
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
      it("findMeetingObject", function (done) {
        expect(function () {
          sordId = objMeetingId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "findMeetingObject",
            params: [sordId]
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
          sord = sordMeeting;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "getFormattedSord",
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
      it("getMeetingBoardFromMeeting", function (done) {
        expect(function () {
          meeting = objMeetingId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "getMeetingBoardFromMeeting",
            params: [meeting]
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
      it("getMeetingBoardReferenceFromMeeting", function (done) {
        expect(function () {
          meeting = sordMeeting;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "getMeetingBoardReferenceFromMeeting",
            params: [meeting]
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
      it("getMeetingStatus", function (done) {
        expect(function () {
          meeting = { objKeys: { MEETING_STATUS: "A - Freigegeben" } };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "getMeetingStatus",
            params: [meeting]
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
      it("hasMeetingStatus", function (done) {
        expect(function () {
          meeting = { objKeys: { MEETING_STATUS: "A - Freigegeben" } };
          status = "A - Freigegeben";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "hasMeetingStatus",
            params: [meeting, status]
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
      it("isPremium", function (done) {
        expect(function () {
          value = "Premium";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "isPremium",
            params: [value]
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
      it("isInMeeting", function (done) {
        expect(function () {
          sordId = objMeetingId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "isInMeeting",
            params: [sordId]
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
      it("isInMeetingObject", function (done) {
        expect(function () {
          sordId = objMeetingId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "isInMeetingObject",
            params: [sordId]
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
          templateSord = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "isMeeting",
            params: [templateSord]
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
      it("isMeetingBoard", function (done) {
        expect(function () {
          sord = sordMeeting;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "isMeetingBoard",
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
      it("isMeetingObject", function (done) {
        expect(function () {
          sord = sordMeeting;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "isMeetingObject",
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
      it("isProductLine", function (done) {
        expect(function () {
          sord = sordMeeting;
          productLine = "Premium";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "isProductLine",
            params: [sord, productLine]
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
          templateSord = {};
          attachmentField = "attachmentField1";
          tableKind = "tableKind1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.Utils",
            classConfig: {},
            method: "prepareAttachmentList",
            params: [templateSord, attachmentField, tableKind]
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