
describe("[service] sol.meeting.ix.services.Voting", function () {
  var originalTimeout, objVotingsId, objVotingId, config,
      templateSord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Voting").then(function success(objTempId1) {
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
    describe("sol.meeting.voting.ix.services.Voting", function () {
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
      it("findVotingFolder", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.ix.services.Voting",
            classConfig: { objId: objVotingId },
            method: "findVotingFolder",
            params: []
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
      it("findVotingsByReference", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.ix.services.Voting",
            classConfig: { objId: objVotingId },
            method: "findVotingsByReference",
            params: []
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
      it("getVoting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.ix.services.Voting",
            classConfig: { objId: objVotingId },
            method: "getVoting",
            params: []
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.ix.services.Voting",
            classConfig: { objId: objVotingId },
            method: "initialize",
            params: [config]
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
      it("shouldTranslateMapKeys", function (done) {
        expect(function () {
          templateSord = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.ix.services.Voting",
            classConfig: { objId: objVotingId },
            method: "shouldTranslateMapKeys",
            params: [templateSord]
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_meeting_voting_service_Voting_FindVotings", function () {
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
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_FindVotings", {
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
      it("find votings", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_FindVotings", {
            objId: objVotingId
          }).then(function success(jsonResult) {
            expect(jsonResult.votings).toBeDefined();
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
    describe("RF_sol_meeting_voting_service_Voting_Get", function () {
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
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Get", {
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
      it("find votings", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Get", {
            objId: objVotingId
          }).then(function success(jsonResult) {
            expect(jsonResult.desc).toBeDefined();
            expect(jsonResult.name).toBeDefined();
            expect(jsonResult.id).toBeDefined();
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