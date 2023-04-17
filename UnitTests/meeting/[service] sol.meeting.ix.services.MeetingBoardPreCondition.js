
describe("[service] sol.meeting.ix.services.MeetingBoardPrecondition", function () {
  var originalTimeout, objTempId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("MeetingBoardPrecondition").then(function success(objTempId1) {
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
    describe("sol.meeting.services.MeetingBoardPrecondition", function () {
      it("checkBoards", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.services.MeetingBoardPrecondition",
            classConfig: { targetId: objTempId },
            method: "checkBoards",
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
      it("checkMeetingLicense", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.services.MeetingBoardPrecondition",
            classConfig: { targetId: objTempId },
            method: "checkMeetingLicense",
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
            className: "sol.meeting.services.MeetingBoardPrecondition",
            classConfig: { targetId: objTempId },
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
    describe("RF_sol_meeting_services_MeetingBoardPrecondition", function () {
      it("should throw if executed without Parameter 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_services_MeetingBoardPrecondition", {
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("check meeting board precondition", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_services_MeetingBoardPrecondition", {
            targetId: objTempId
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
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