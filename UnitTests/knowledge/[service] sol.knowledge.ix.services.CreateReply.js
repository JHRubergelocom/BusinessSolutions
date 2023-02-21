
describe("[service] sol.knowledge.ix.services.CreateReply", function () {
  var objTempId, objPostId, objSpaceId, objFile1Id, objFile2Id, 
      feedActionId, originalTimeout,
      params, objPostTId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateReply", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
          type: "Article",
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
    it("result should return new feedActionId", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Comment_Add", {
          objId: objPostId, text: "Neuer Test feedId"
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
  describe("Test Lib Functions", function () {
    describe("sol.knowledge.ix.services.CreateReply", function () {
      it("create post Question", function (done) {
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
      it("initialize", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.CreateReply",
            classConfig: { postGuid: objPostTId, type: "Reply", content: "ContentT" },
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
      it("createReply", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.CreateReply",
            classConfig: { postGuid: objPostTId, type: "Reply", content: "ContentT" },
            method: "createReply",
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
    describe("RF_sol_knowledge_service_Reply_Create", function () {
      describe("create reply", function () {
        it("should throw if executed without 'type'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
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
        it("should throw if executed without 'content'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
              type: "Reply"
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
        it("should throw if executed without 'postGuid'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
              type: "Reply",
              content: "Content1"
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
        it("create reply", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
              type: "Reply",
              content: "Content2",
              postGuid: objPostId
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
        it("create reply with createdFiles", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
              type: "Reply",
              content: "Content3",
              postGuid: objPostId,
              createdFiles: [objFile1Id, objFile2Id]
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
        it("create reply with feedId", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
              type: "Reply",
              content: "Content4",
              postGuid: objPostId,
              feedId: feedActionId
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