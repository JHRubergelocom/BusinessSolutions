
describe("[service] sol.knowledge.ix.services.Reply", function () {
  var objTempId, objSpaceId, objPostId, objReply1Id, objReply2Id,
      postSolved, replySolved, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Reply", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
        test.Utils.createSord(objTempId, "knowledge Space", "TestSpace", { SOL_TYPE: "KNOWLEDGE_SPACE", KNOWLEDGE_SPACE_REFERENCE: "TSpace" }).then(function success(objSpaceId1) {
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
    it("create post", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
          type: "Article",
          subject: "Subject",
          spaceFolderId: objSpaceId,
          lang: "fr"
        }).then(function success(jsonResultPost) {
          objPostId = jsonResultPost.objId;
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
          postGuid: objPostId
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
    it("create reply2", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
          type: "Reply",
          content: "Content2",
          postGuid: objPostId
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
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_knowledge_service_Reply_MarkSolved", function () {
      describe("knowledge Reply", function () {
        it("should throw if executed without 'replyGuid'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_MarkSolved", {
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
        it("mark solved reply1", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_MarkSolved", {
              replyGuid: objReply1Id
            }).then(function success(result) {
              test.Utils.getSord(objReply1Id).then(function success1(sordReply) {
                replySolved = test.Utils.getObjKeyValue(sordReply, "KNOWLEDGE_SOLVED");
                expect(replySolved).toEqual("1");
                test.Utils.getSord(objPostId).then(function success2(sordPost) {
                  postSolved = test.Utils.getObjKeyValue(sordPost, "KNOWLEDGE_SOLVED");
                  expect(postSolved).toEqual("1");
                  expect(result.success).toEqual(true);
                  expect(result.flowIdReply).toBeDefined();
                  expect(result.flowIdPost).toBeDefined();
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
        it("mark solved reply2", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_MarkSolved", {
              replyGuid: objReply2Id
            }).then(function success(result) {
              test.Utils.getSord(objReply2Id).then(function success1(sordReply) {
                replySolved = test.Utils.getObjKeyValue(sordReply, "KNOWLEDGE_SOLVED");
                expect(replySolved).toEqual("0");
                test.Utils.getSord(objPostId).then(function success2(sordPost) {
                  postSolved = test.Utils.getObjKeyValue(sordPost, "KNOWLEDGE_SOLVED");
                  expect(postSolved).toEqual("1");
                  expect(result.success).toEqual(false);
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
      });
    });
    describe("RF_sol_knowledge_service_Reply_UnMarkSolved", function () {
      describe("knowledge Reply", function () {
        it("should throw if executed without 'replyGuid'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_UnMarkSolved", {
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
        it("unmark solved reply1", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_UnMarkSolved", {
              replyGuid: objReply1Id
            }).then(function success(result) {
              test.Utils.getSord(objReply1Id).then(function success1(sordReply) {
                replySolved = test.Utils.getObjKeyValue(sordReply, "KNOWLEDGE_SOLVED");
                expect(replySolved).toEqual("0");
                test.Utils.getSord(objPostId).then(function success2(sordPost) {
                  postSolved = test.Utils.getObjKeyValue(sordPost, "KNOWLEDGE_SOLVED");
                  expect(postSolved).toEqual("0");
                  expect(result.success).toEqual(true);
                  expect(result.flowIdReply).toBeDefined();
                  expect(result.flowIdPost).toBeDefined();
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
        it("unmark solved reply2", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_UnMarkSolved", {
              replyGuid: objReply2Id
            }).then(function success(result) {
              test.Utils.getSord(objReply2Id).then(function success1(sordReply) {
                replySolved = test.Utils.getObjKeyValue(sordReply, "KNOWLEDGE_SOLVED");
                expect(replySolved).toEqual("0");
                test.Utils.getSord(objPostId).then(function success2(sordPost) {
                  postSolved = test.Utils.getObjKeyValue(sordPost, "KNOWLEDGE_SOLVED");
                  expect(postSolved).toEqual("0");
                  expect(result.success).toEqual(true);
                  expect(result.flowIdReply).toBeDefined();
                  expect(result.flowIdPost).toBeDefined();
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
        it("unmark solved reply2 even postSolved is not marked and replySolved is marked", function (done) {
          expect(function () {
            test.Utils.getSord(objPostId).then(function success(sordPost) {
              test.Utils.updateKeywording(sordPost, { KNOWLEDGE_SOLVED: "0" }, true).then(function success1(updateKeywordingResult) {
                test.Utils.getSord(objReply2Id).then(function success2(sordReply) {
                  test.Utils.updateKeywording(sordReply, { KNOWLEDGE_SOLVED: "1" }, true).then(function success3(updateKeywordingResult1) {
                    test.Utils.execute("RF_sol_knowledge_service_Reply_UnMarkSolved", {
                      replyGuid: objReply2Id
                    }).then(function success4(result) {
                      test.Utils.getSord(objReply2Id).then(function success5(sordReply1) {
                        sordReply = sordReply1;
                        replySolved = test.Utils.getObjKeyValue(sordReply, "KNOWLEDGE_SOLVED");
                        expect(replySolved).toEqual("0");
                        test.Utils.getSord(objPostId).then(function success6(sordPost1) {
                          sordPost = sordPost1;
                          postSolved = test.Utils.getObjKeyValue(sordPost, "KNOWLEDGE_SOLVED");
                          expect(postSolved).toEqual("0");
                          expect(result.success).toEqual(true);
                          expect(result.flowIdReply).toBeDefined();
                          expect(result.flowIdPost).toBeDefined();
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