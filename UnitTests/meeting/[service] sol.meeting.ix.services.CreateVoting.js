
describe("[service] sol.meeting.ix.services.CreateVoting", function () {
  var originalTimeout, objVotingsId, config,
      votingsFolderId, templateSord, votingResult,
      objId, desc;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateVoting").then(function success(objTempId) {
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
    describe("sol.meeting.voting.ix.services.CreateVoting", function () {
      it("checkPermissions", function (done) {
        expect(function () {
          votingsFolderId = objVotingsId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.ix.services.CreateVoting",
            classConfig: {
              votingsFolderId: objVotingsId,
              objId: objVotingsId,
              templateSord: { objKeys: { MEETING_VOTING_TITLE: "Meeting Voting1", SOL_REFERENCE: "SR1" } }  
            },
            method: "checkPermissions",
            params: [votingsFolderId]
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
      it("createVoting", function (done) {
        expect(function () {
          templateSord = { objKeys: { MEETING_VOTING_TITLE: "Meeting Voting1", SOL_REFERENCE: "SR1" } };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.ix.services.CreateVoting",
            classConfig: {
              votingsFolderId: objVotingsId,
              objId: objVotingsId,
              templateSord: { objKeys: { MEETING_VOTING_TITLE: "Meeting Voting1", SOL_REFERENCE: "SR1" } }  
            },
            method: "createVoting",
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
      it("createVotingFromScratch", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.ix.services.CreateVoting",
            classConfig: {
              votingsFolderId: objVotingsId,
              objId: objVotingsId,
              templateSord: { objKeys: { MEETING_VOTING_TITLE: "Meeting Voting1", SOL_REFERENCE: "SR1" } }  
            },
            method: "createVotingFromScratch",
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
          config = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.ix.services.CreateVoting",
            classConfig: {
              votingsFolderId: objVotingsId,
              objId: objVotingsId,
              templateSord: { objKeys: { MEETING_VOTING_TITLE: "Meeting Voting1", SOL_REFERENCE: "SR1" } }  
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
      it("refreshVoting", function (done) {
        expect(function () {
          votingResult = { objId: objVotingsId };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.ix.services.CreateVoting",
            classConfig: {
              votingsFolderId: objVotingsId,
              objId: objVotingsId,
              templateSord: { objKeys: { MEETING_VOTING_TITLE: "Meeting Voting1", SOL_REFERENCE: "SR1" } }  
            },
            method: "refreshVoting",
            params: [votingResult]
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
      it("updateVotingContent", function (done) {
        expect(function () {
          objId = objVotingsId;
          desc = "desc1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.ix.services.CreateVoting",
            classConfig: {
              votingsFolderId: objVotingsId,
              objId: objVotingsId,
              templateSord: { objKeys: { MEETING_VOTING_TITLE: "Meeting Voting1", SOL_REFERENCE: "SR1" } }  
            },
            method: "updateVotingContent",
            params: [objId, desc]
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
    describe("RF_sol_meeting_voting_service_Voting_Create", function () {
      it("should throw if executed without Parameter 'votingsFolderId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Create", {
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
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Create", {
            votingsFolderId: objVotingsId
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
      it("should throw if executed without Parameter 'templateSord'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Create", {
            votingsFolderId: objVotingsId,
            objId: objVotingsId
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
      it("create voting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Create", {
            votingsFolderId: objVotingsId,
            objId: objVotingsId,
            templateSord: { objKeys: { MEETING_VOTING_TITLE: "Meeting Voting1", SOL_REFERENCE: "SR1" } }
          }).then(function success(jsonResult) {
            expect(jsonResult.params).toBeDefined();
            expect(jsonResult.params.votingFolderId).toBeDefined();
            expect(jsonResult.result).toBeDefined();
            expect(jsonResult.result.objId).toBeDefined();
            expect(jsonResult.sord).toBeDefined();
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
    describe("RF_sol_meeting_voting_service_Voting_CreateItemVoting", function () {
      it("should throw if executed without Parameter 'votingsFolderId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_CreateItemVoting", {
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
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_CreateItemVoting", {
            votingsFolderId: objVotingsId
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
      it("should throw if executed without Parameter 'templateSord'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_CreateItemVoting", {
            votingsFolderId: objVotingsId,
            objId: objVotingsId
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
      it("create voting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_CreateItemVoting", {
            votingsFolderId: objVotingsId,
            objId: objVotingsId,
            templateSord: { objKeys: { MEETING_VOTING_TITLE: "Meeting Voting1", SOL_REFERENCE: "SR1" } }
          }).then(function success(jsonResult) {
            expect(jsonResult.params).toBeDefined();
            expect(jsonResult.params.votingFolderId).toBeDefined();
            expect(jsonResult.result).toBeDefined();
            expect(jsonResult.result.objId).toBeDefined();
            expect(jsonResult.sord).toBeDefined();
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