/* eslint-disable linebreak-style */

describe("[service] sol.meeting.ix.services.UpdateVoting", function () {
  var originalTimeout, objVotingId, countUser, users, i, votes, RFs, RFfunction, RFparams,
      answer, userInfos, votedAnswer1, votedAnswer2, votedAnswer3, votingStatus,
      config, map;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UpdateVoting").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Voting").then(function success2(objVotingId1) {
          objVotingId = objVotingId1;
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
    describe("sol.meeting.voting.services.UpdateVoting", function () {
      it("calculateVotes", function (done) {
        expect(function () {
          map = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.services.UpdateVoting",
            classConfig: { objId: objVotingId },
            method: "calculateVotes",
            params: [map]
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
      it("getSourceTemplateSord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.services.UpdateVoting",
            classConfig: { objId: objVotingId },
            method: "getSourceTemplateSord",
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
          config = { objId: objVotingId };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.services.UpdateVoting",
            classConfig: { objId: objVotingId },
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
      it("saveVoting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.services.UpdateVoting",
            classConfig: { objId: objVotingId },
            method: "saveVoting",
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
      it("updateVoting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.services.UpdateVoting",
            classConfig: { objId: objVotingId },
            method: "updateVoting",
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
      it("voteVoting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.voting.services.UpdateVoting",
            classConfig: { objId: objVotingId },
            method: "voteVoting",
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
    describe("RF_sol_meeting_voting_service_Voting_Finish", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Finish", {
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
      it("executed with Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Finish", {
            objId: objVotingId
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
    });
    describe("RF_sol_meeting_voting_service_Voting_Save", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Save", {
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
      it("executed with Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Save", {
            objId: objVotingId
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
    });
    describe("RF_sol_meeting_voting_service_Voting_Open", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Open", {
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
      it("executed with Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Open", {
            objId: objVotingId
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
    });
    describe("RF_sol_meeting_voting_service_Voting_EmptyOpen", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_EmptyOpen", {
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
      it("executed with Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_EmptyOpen", {
            objId: objVotingId
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
    });
    describe("RF_sol_meeting_voting_service_Voting_Vote", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Vote", {
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
      it("executed with Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_voting_service_Voting_Vote", {
            objId: objVotingId
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
    });
  });
  describe("Test Voting 100 User", function () {
    it("create voting", function (done) {
      expect(function () {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Voting").then(function success2(objVotingId1) {
          objVotingId = objVotingId1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("set voting to open", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_meeting_voting_service_Voting_Open", {
          objId: objVotingId
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
    it("create user", function (done) {
      countUser = 100;
      users = [];
      for (i = 0; i < countUser; i++) {
        users.push("User" + i);
      }
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_CreateUsers", {
          users: users
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
    it("get userinfos", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_GetUserInfos", {
          userNames: users
        }).then(function success(jsonResult) {
          userInfos = jsonResult;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("execute vote for all user", function (done) {
      votes = [1, 3, 2, 2, 2, 2, 1, 2, 3, 1, 1, 3, 2, 2, 2, 2, 1, 2, 3, 1,
        1, 3, 2, 2, 2, 2, 1, 2, 3, 1, 1, 3, 2, 2, 2, 2, 1, 2, 3, 1,
        1, 3, 2, 2, 2, 2, 1, 2, 3, 1, 1, 3, 2, 2, 2, 2, 1, 2, 3, 1,
        1, 3, 2, 2, 2, 2, 1, 2, 3, 1, 1, 3, 2, 2, 2, 2, 1, 2, 3, 1,
        1, 3, 2, 2, 2, 2, 1, 2, 3, 1, 1, 3, 2, 2, 2, 2, 1, 2, 3, 1];
      votedAnswer1 = 0;
      votedAnswer2 = 0;
      votedAnswer3 = 0;
      for (i = 0; i < countUser; i++) {
        if (votes[i] == 1) {
          votedAnswer1++;
        }
        if (votes[i] == 2) {
          votedAnswer2++;
        }
        if (votes[i] == 3) {
          votedAnswer3++;
        }
      }
      RFs = [];
      for (i = 0; i < countUser; i++) {
        RFfunction = "RF_sol_meeting_voting_service_Voting_Vote";
        answer = "MEETING_VOTING_VOTED_ANSWER" + votes[i];
        RFparams = { objId: objVotingId, vote: { answer: answer, count: 1, userId: userInfos[i].id } };
        RFs.push({ function: RFfunction, params: RFparams });
      }
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteRFs", {
          RFs: RFs
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
    it("finish vote", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_meeting_voting_service_Voting_Finish", {
          objId: objVotingId,
          options: {
            withReloadVotes: true
          },
          source: {
            templateSord: {}
          }
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
    it("check voting status", function (done) {
      expect(function () {
        test.Utils.getSord(objVotingId).then(function success(sordVoting) {
          votingStatus = test.Utils.getObjKeyValue(sordVoting, "MEETING_VOTING_STATUS");
          expect(votingStatus.substring(0, 3)).toEqual("F -");
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("check voted answer1", function (done) {
      expect(function () {
        test.Utils.getMapValue(objVotingId, "MEETING_VOTING_VOTED_ANSWER1").then(function success(mapValue) {
          votedAnswer1 = String(votedAnswer1);
          expect("30").toEqual(votedAnswer1);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("check voted answer2", function (done) {
      expect(function () {
        test.Utils.getMapValue(objVotingId, "MEETING_VOTING_VOTED_ANSWER2").then(function success(mapValue) {
          votedAnswer2 = String(votedAnswer2);
          expect("50").toEqual(votedAnswer2);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("check voted answer3", function (done) {
      expect(function () {
        test.Utils.getMapValue(objVotingId, "MEETING_VOTING_VOTED_ANSWER3").then(function success(mapValue) {
          votedAnswer3 = String(votedAnswer3);
          expect("20").toEqual(votedAnswer3);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("delete user", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_unittest_meeting_service_DeleteUsers", {
          users: users
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