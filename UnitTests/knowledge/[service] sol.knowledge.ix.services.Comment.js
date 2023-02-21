
describe("[service] sol.knowledge.ix.services.Comment", function () {
  var objTempId, objSpaceId, objPostId1, objPostId2, objReplyId2, objReplyId3, objReplyId4,
      feedActionId, originalTimeout,
      objPostTId, objReplyTId, feedActionTId, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Comment", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
    it("create post1", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
          type: "Question",
          subject: "Question1",
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
          type: "Question",
          subject: "Question2",
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
          objReplyId2 = jsonResultReply.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create reply3", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
          type: "Reply",
          content: "Content3",
          postGuid: objPostId2
        }).then(function success(jsonResultReply) {
          objReplyId3 = jsonResultReply.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create reply4", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
          type: "Reply",
          content: "Content4",
          postGuid: objPostId2
        }).then(function success(jsonResultReply) {
          objReplyId4 = jsonResultReply.objId;
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
    describe("sol.knowledge.ix.services.Comment", function () {
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
      it("create replyT", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
            type: "Reply",
            content: "ContentT",
            postGuid: objPostTId
          }).then(function success(jsonResultReply) {
            objReplyTId = jsonResultReply.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("result should return new feedActionId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Add", {
            objId: objPostTId, text: "Neuer Test CommentAdd"
          }).then(function success(result) {
            expect(result.feedActionId).toBeDefined();
            feedActionTId = result.feedActionId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("addComment", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Comment",
            classConfig: { objId: objPostTId, text: "Neuer Test CommentAdd" },
            method: "addComment",
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
      it("changeReplyToComment", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Comment",
            classConfig: { postGuid: objPostTId, replyGuid: objReplyTId, objId: objTempId, text: "Neuer Test ChangeReplyToComment" },
            method: "changeReplyToComment",
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
      it("editComment", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Comment",
            classConfig: { objId: objPostTId, text: "Neuer Test CommentAdd", feedActionId: feedActionTId },
            method: "editComment",
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
            className: "sol.knowledge.ix.services.Comment",
            classConfig: { objId: objPostTId, text: "Neuer Test CommentAdd" },
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
    });
  });
  describe("Tests Registered Functions in post", function () {
    describe("RF_sol_knowledge_service_Post_Open", function () {
      describe("post open", function () {
        it("post open", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Open", {
              objId: objPostId1
            }).then(function success(result) {
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
    describe("RF_sol_knowledge_service_Comment_Add", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Add", {
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
      it("should throw if executed without 'text'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Add", {
            objId: objPostId1
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
      it("result should return new feedActionId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Add", {
            objId: objPostId1, text: "Neuer Test CommentAdd"
          }).then(function success(result) {
            expect(result.feedActionId).toBeDefined();
            feedActionId = result.feedActionId;
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
    describe("RF_sol_knowledge_service_Comment_Edit", function () {
      it("should throw if executed without 'feedActionId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Edit", {
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
      it("should throw if executed without 'text'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Edit", {
            feedActionId: feedActionId
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
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Edit", {
            feedActionId: feedActionId,
            text: "Neuer Test CommentEdit"
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
      it("result should return true", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Edit", {
            objId: objPostId1,
            feedActionId: feedActionId,
            text: "Neuer Test CommentEdit"
          }).then(function success(result) {
            expect(result.true).toBeDefined();
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
    describe("RF_sol_knowledge_service_Post_Closed", function () {
      describe("post closed", function () {
        it("post closed", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Closed", {
              objId: objPostId1
            }).then(function success(result) {
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
    describe("RF_sol_knowledge_service_Comment_Add", function () {
      it("should throw if executed with post closed", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Add", {
            objId: objPostId1, text: "Neuer Test CommentAdd"
          }).then(function success(result) {
            expect(result.feedActionId).toBeDefined();
            feedActionId = result.feedActionId;
            fail(result);
            done();
          }, function error(err) {
            feedActionId = undefined;
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
    });
    describe("RF_sol_knowledge_service_Comment_Edit", function () {
      it("should throw if executed with post closed", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Edit", {
            feedActionId: feedActionId,
            text: "Neuer Test CommentEdit"
          }).then(function success(result) {
            expect(result.true).toBeDefined();
            fail(result);
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
  describe("Tests Registered Functions in reply", function () {
    describe("RF_sol_knowledge_service_Post_Open", function () {
      describe("post open", function () {
        it("post open", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Open", {
              objId: objPostId2
            }).then(function success(result) {
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
    describe("RF_sol_knowledge_service_Comment_Add", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Add", {
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
      it("should throw if executed without 'text'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Add", {
            objId: objReplyId2
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
      it("result should return new feedActionId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Add", {
            objId: objReplyId2,
            text: "Neuer Test CommentAdd"
          }).then(function success(result) {
            expect(result.feedActionId).toBeDefined();
            feedActionId = result.feedActionId;
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
    describe("RF_sol_knowledge_service_Comment_Edit", function () {
      it("should throw if executed without 'feedActionId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Edit", {
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
      it("should throw if executed without 'text'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Edit", {
            feedActionId: feedActionId
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
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Edit", {
            feedActionId: feedActionId,
            text: "Neuer Test CommentEdit"
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
      it("result should return true", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Edit", {
            objId: objReplyId2,
            feedActionId: feedActionId,
            text: "Neuer Test CommentEdit"
          }).then(function success(result) {
            expect(result.true).toBeDefined();
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
    describe("RF_sol_knowledge_service_ChangeReplyToComment", function () {
      it("should throw if executed without 'postGuid'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_ChangeReplyToComment", {
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
      it("should throw if executed without 'replyGuid'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_ChangeReplyToComment", {
            postGuid: objPostId2
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
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_ChangeReplyToComment", {
            postGuid: objPostId2,
            replyGuid: objReplyId3
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
      it("should throw if executed without 'text'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_ChangeReplyToComment", {
            postGuid: objPostId2,
            replyGuid: objReplyId3,
            objId: objTempId
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
      it("result should return new feedActionId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_ChangeReplyToComment", {
            postGuid: objPostId2,
            replyGuid: objReplyId3,
            objId: objTempId,
            text: "Neuer Test ChangeReplyToComment"
          }).then(function success(result) {
            expect(result.feedActionId).toBeDefined();
            feedActionId = result.feedActionId;
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
    describe("RF_sol_knowledge_service_Post_Closed", function () {
      describe("post closed", function () {
        it("post closed", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Closed", {
              objId: objPostId2
            }).then(function success(result) {
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
    describe("RF_sol_knowledge_service_Comment_Add", function () {
      it("should throw if executed with post closed", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Add", {
            objId: objReplyId2, text: "Neuer Test CommentAdd"
          }).then(function success(result) {
            expect(result.feedActionId).toBeDefined();
            feedActionId = result.feedActionId;
            fail(result);
            done();
          }, function error(err) {
            feedActionId = undefined;
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
    });
    describe("RF_sol_knowledge_service_Comment_Edit", function () {
      it("should throw if executed with post closed", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Comment_Edit", {
            feedActionId: feedActionId, text: "Neuer Test CommentEdit"
          }).then(function success(result) {
            expect(result.true).toBeDefined();
            fail(result);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
    });
    describe("RF_sol_knowledge_service_ChangeReplyToComment", function () {
      it("should throw if executed with post closed", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_ChangeReplyToComment", {
            postGuid: objPostId2,
            replyGuid: objReplyId4,
            objId: objTempId,
            text: "Neuer Test ChangeReplyToComment"
          }).then(function success(result) {
            expect(result.feedActionId).toBeDefined();
            feedActionId = result.feedActionId;
            fail(result);
            done();
          }, function error(err) {
            feedActionId = undefined;
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