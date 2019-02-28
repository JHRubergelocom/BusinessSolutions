
describe("[service] sol.knowledge.ix.services.SolType", function () {
  var objTempId, objSpaceId, objPostId, objReplyId,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolType", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
          spaceFolderId: objSpaceId
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
    it("create reply", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
          type: "Reply",
          content: "Content1",
          postGuid: objPostId
        }).then(function success(jsonResultReply) {
          objReplyId = jsonResultReply.objId;
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
    describe("RF_sol_knowledge_service_SolType_GetInfo", function () {
      describe("knowledge SolType", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_SolType_GetInfo", {
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
        it("get info reply", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_SolType_GetInfo", {
              objId: objReplyId
            }).then(function success(result) {
              expect(result.solType).toBeDefined();
              expect(result.postId).toBeDefined();
              expect(result.spaceId).toBeDefined();
              expect(result.boardId).toBeDefined();
              expect(result.knowledgeSpaceReference).toBeDefined();
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("get info post", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_SolType_GetInfo", {
              objId: objPostId
            }).then(function success(result) {
              expect(result.solType).toBeDefined();
              expect(result.spaceId).toBeDefined();
              expect(result.boardId).toBeDefined();
              expect(result.knowledgeSpaceReference).toBeDefined();
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("get info space", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_SolType_GetInfo", {
              objId: objSpaceId
            }).then(function success(result) {
              expect(result.solType).toBeDefined();
              expect(result.boardId).toBeDefined();
              expect(result.knowledgeSpaceReference).toBeDefined();
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("get info temp", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_SolType_GetInfo", {
              objId: objTempId
            }).then(function success(result) {
              expect(result.solType).not.toBeDefined();
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