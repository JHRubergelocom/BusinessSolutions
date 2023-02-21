
describe("[service] sol.meeting.ix.services.DeleteVoting", function () {
  var originalTimeout, objVotingsId, objVotingId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("DeleteVoting").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Votings").then(function success1(objVotingsId1) {
          objVotingsId = objVotingsId1;
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
    describe("sol.meeting.voting.ix.services.DeleteVoting", function () {
      it("create voting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Create", {
            votingsFolderId: objVotingsId,
            objId: objVotingsId,
            templateSord: { objKeys: { MEETING_VOTING_TITLE: "Meeting Voting1", SOL_REFERENCE: "SR1" } }
          }).then(function success(jsonResult) {
            expect(jsonResult.result.objId).toBeDefined();
            objVotingId = jsonResult.result.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("deleteVoting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.ix.services.DeleteVoting",
            classConfig: { objId: objVotingId },
            method: "deleteVoting",
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
    describe("RF_sol_meeting_voting_service_Voting_Delete", function () {
      it("create voting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Create", {
            votingsFolderId: objVotingsId,
            objId: objVotingsId,
            templateSord: { objKeys: { MEETING_VOTING_TITLE: "Meeting Voting1", SOL_REFERENCE: "SR1" } }
          }).then(function success(jsonResult) {
            expect(jsonResult.result.objId).toBeDefined();
            objVotingId = jsonResult.result.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Delete", {
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
      it("delete voting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Delete", {
            objId: objVotingId
          }).then(function success(jsonResult) {
            expect(jsonResult.objId).toBeDefined();
            expect(jsonResult.flowId).toBeDefined();
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