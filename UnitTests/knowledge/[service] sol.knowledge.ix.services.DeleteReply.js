
describe("[service] sol.knowledge.ix.services.DeleteReply", function () {
  var objTempId, objSpaceId, objPostId, objReplyId,
      objFile1Id, objFile2Id, originalTimeout,
      params, objPostTId, objReplyTId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("DeleteReply", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
    it("create attachment1", function (done) {
      expect(function () {
        test.Utils.copySord("ARCPATH:/Administration/Business Solutions/knowledge [unit tests]/Resources/Knowledge/Attachment1").then(function success(objFile1Id1) {
          objFile1Id = objFile1Id1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create attachment2", function (done) {
      expect(function () {
        test.Utils.copySord("ARCPATH:/Administration/Business Solutions/knowledge [unit tests]/Resources/Knowledge/Attachment2").then(function success(objFile2Id1) {
          objFile2Id = objFile2Id1;
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
          type: "Question",
          subject: "Subject1",
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
  });
  describe("Test Lib Functions", function () {
    describe("sol.knowledge.ix.services.DeleteReply", function () {
      it("create post", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
            type: "Question",
            subject: "PostTest",
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
      it("create reply", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
            type: "Reply",
            content: "ContentT",
            postGuid: objPostTId
          }).then(function success(result) {
            objReplyTId = result.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("mark solved reply", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Reply_MarkSolved", {
            replyGuid: objReplyTId
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
      it("execute", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.DeleteReply",
            classConfig: { postGuid: objPostTId, objId: objReplyTId },
            method: "execute",
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
          params = {};
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.DeleteReply",
            classConfig: { postGuid: objPostTId, objId: objReplyTId },
            method: "initialize",
            params: [params]
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
    describe("RF_sol_knowledge_service_Reply_Create", function () {
      describe("create reply", function () {
        it("create reply with createdFiles", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
              type: "Reply",
              content: "Content1",
              postGuid: objPostId,
              createdFiles: [objFile1Id, objFile2Id]
            }).then(function success(result) {
              objReplyId = result.objId;
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("mark solved reply", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_MarkSolved", {
              replyGuid: objReplyId
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
      describe("delete reply", function () {
        it("should throw if executed without 'postGuid'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_Delete", {
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
            test.Utils.execute("RF_sol_knowledge_service_Reply_Delete", {
              postGuid: objPostId
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
        it("delete reply with 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_Delete", {
              postGuid: objPostId,
              objId: objReplyId
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
      describe("delete post", function () {
        it("delete post with topics, content and lang", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Delete", {
              objId: objPostId
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
  });
  afterAll(function (done) {
    expect(function () {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
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