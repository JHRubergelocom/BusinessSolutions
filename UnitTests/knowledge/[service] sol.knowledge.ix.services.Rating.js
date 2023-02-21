
describe("[service] sol.knowledge.ix.services.Rating", function () {
  var objTempId, objSpaceId, objPostId1, objReply1Id, objTest1Id,
      objPostId2, objReply2Id, objTest2Id, score,
      originalTimeout, config, objPostTId, solType, down;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Rating", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
  describe("create knowledge space", function () {
    it("create space", function (done) {
      expect(function () {
        test.Utils.createSord(objTempId, "knowledge Space", "TestSpace", { SOL_TYPE: "KNOWLEDGE_SPACE", KNOWLEDGE_SPACE_REFERENCE: "TSpace" }).then(function success1(objSpaceId1) {
          objSpaceId = objSpaceId1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create post1", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
          type: "Article",
          subject: "Subject1",
          spaceFolderId: objSpaceId
        }).then(function success(jsonResultPost) {
          objPostId1 = jsonResultPost.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create reply1", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
          type: "Reply",
          content: "Content1",
          postGuid: objPostId1
        }).then(function success(jsonResultReply) {
          objReply1Id = jsonResultReply.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create post2", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
          type: "Article",
          subject: "Subject2",
          spaceFolderId: objSpaceId
        }).then(function success(jsonResultPost) {
          objPostId2 = jsonResultPost.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create reply2", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
          type: "Reply",
          content: "Content2",
          postGuid: objPostId2
        }).then(function success(jsonResultReply) {
          objReply2Id = jsonResultReply.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create test1", function (done) {
      expect(function () {
        test.Utils.createSord(objTempId).then(function success(objTest1Id1) {
          objTest1Id = objTest1Id1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create test2", function (done) {
      expect(function () {
        test.Utils.createSord(objTempId).then(function success(objTest2Id1) {
          objTest2Id = objTest2Id1;
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
  describe("Test Lib Functions", function () {
    describe("sol.knowledge.ix.services.Rating", function () {
      it("create postT", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
            type: "Question",
            subject: "PostT",
            spaceFolderId: objSpaceId
          }).then(function success(jsonResult) {
            objPostTId = jsonResult.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("checkType", function (done) {
        expect(function () {
          solType = "solType1";
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Rating",
            classConfig: { objId: objPostTId, userId: 0 },
            method: "checkType",
            params: [solType]
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
      it("checkUserHasVoted", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Rating",
            classConfig: { objId: objPostTId, userId: 0 },
            method: "checkUserHasVoted",
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
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Rating",
            classConfig: { objId: objPostTId, userId: 0 },
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
      it("vote", function (done) {
        expect(function () {
          down = true;
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Rating",
            classConfig: { objId: objPostTId, userId: 0 },
            method: "vote",
            params: [down]
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
      it("voteDown", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Rating",
            classConfig: { objId: objPostTId, userId: 0 },
            method: "voteDown",
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
      it("voteUp", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Rating",
            classConfig: { objId: objPostTId, userId: 0 },
            method: "voteUp",
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
    describe("RF_sol_knowledge_service_Rating_VotingDown", function () {
      describe("knowledge Post", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingDown", {
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
        it("voting down first time", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingDown", {
              objId: objPostId1
            }).then(function success(result) {
              test.Utils.getSord(objPostId1).then(function success1(sordPost1) {
                score = test.Utils.getObjKeyValue(sordPost1, "KNOWLEDGE_SCORE");
                expect(result.success).toEqual(false);
                expect(score).toEqual("0");
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
        it("voting down second time", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingDown", {
              objId: objPostId1
            }).then(function success(result) {
              test.Utils.getSord(objPostId1).then(function success1(sordPost1) {
                score = test.Utils.getObjKeyValue(sordPost1, "KNOWLEDGE_SCORE");
                expect(result.success).toEqual(false);
                expect(score).toEqual("0");
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
      describe("knowledge Reply", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingDown", {
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
        it("voting down first time", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingDown", {
              objId: objReply1Id
            }).then(function success(result) {
              test.Utils.getSord(objReply1Id).then(function success1(sordReply1) {
                score = test.Utils.getObjKeyValue(sordReply1, "KNOWLEDGE_SCORE");
                expect(result.success).toEqual(false);
                expect(score).toEqual("0");
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
        it("voting down second time", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingDown", {
              objId: objReply1Id
            }).then(function success(result) {
              test.Utils.getSord(objReply1Id).then(function success1(sordReply1) {
                score = test.Utils.getObjKeyValue(sordReply1, "KNOWLEDGE_SCORE");
                expect(result.success).toEqual(false);
                expect(score).toEqual("0");
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
      describe("Testsord", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingDown", {
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
        it("voting down is ignored with Testsord", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingDown", {
              objId: objTest1Id
            }).then(function success(result) {
              expect(result.success).toEqual(false);
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
    describe("RF_sol_knowledge_service_Rating_VotingUp", function () {
      describe("knowledge Post", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingUp", {
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
        it("voting up first time", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingUp", {
              objId: objPostId2
            }).then(function success(result) {
              test.Utils.getSord(objPostId2).then(function success1(sordPost2) {
                score = test.Utils.getObjKeyValue(sordPost2, "KNOWLEDGE_SCORE");
                expect(result.success).toEqual(false);
                expect(score).toEqual("0");
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
        it("voting up second time", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingUp", {
              objId: objPostId2
            }).then(function success(result) {
              test.Utils.getSord(objPostId2).then(function success1(sordPost2) {
                score = test.Utils.getObjKeyValue(sordPost2, "KNOWLEDGE_SCORE");
                expect(result.success).toEqual(false);
                expect(score).toEqual("0");
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
      describe("knowledge Reply", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingUp", {
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
        it("voting up first time", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingUp", {
              objId: objReply2Id
            }).then(function success(result) {
              test.Utils.getSord(objReply2Id).then(function success1(sordReply2) {
                score = test.Utils.getObjKeyValue(sordReply2, "KNOWLEDGE_SCORE");
                expect(result.success).toEqual(false);
                expect(score).toEqual("0");
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
        it("voting up second time", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingUp", {
              objId: objReply2Id
            }).then(function success(result) {
              test.Utils.getSord(objReply2Id).then(function success1(sordReply2) {
                score = test.Utils.getObjKeyValue(sordReply2, "KNOWLEDGE_SCORE");
                expect(result.success).toEqual(false);
                expect(score).toEqual("0");
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
      describe("Testsord", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingUp", {
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
        it("voting up is ignored with Testsord", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Rating_VotingUp", {
              objId: objTest2Id
            }).then(function success(result) {
              expect(result.success).toEqual(false);
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