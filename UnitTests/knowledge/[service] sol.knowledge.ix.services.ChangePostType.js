
describe("[service] sol.knowledge.ix.services.ChangePostType", function () {
  var objTempId, objSpaceId, objPostId, originalTimeout, objReplyId,
      params, post, objPostTId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ChangePostType", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
  });
  describe("Test Lib Functions", function () {
    describe("sol.knowledge.ix.services.ChangePostType", function () {
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
      it("changePostType", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.ChangePostType",
            classConfig: { objId: objPostTId, type: "Article", solutionId: "-1" },
            method: "changePostType",
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
            className: "sol.knowledge.ix.services.ChangePostType",
            classConfig: { objId: objPostTId, type: "Article", solutionId: "-1" },
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
      it("registerUpdates", function (done) {
        expect(function () {
          post = { id: objPostTId };
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.ChangePostType",
            classConfig: { objId: objPostTId, type: "Article", solutionId: "-1" },
            method: "registerUpdates",
            params: [post]
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
    describe("RF_sol_knowledge_service_Post_ChangeType", function () {
      it("create post Question", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
            type: "Question",
            subject: "Post1",
            spaceFolderId: objSpaceId
          }).then(function success(jsonResult) {
            objPostId = jsonResult.objId;
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
      it("create reply2", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Reply_Create", {
            type: "Reply",
            content: "Content2",
            postGuid: objPostId
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
      describe("change post type", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_ChangeType", {
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
        it("should throw if executed without 'type'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_ChangeType", {
              objId: objPostId
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
        it("should throw if executed without 'solutionId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_ChangeType", {
              objId: objPostId,
              type: "Article"
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
        it("change post type from 'Question' to 'Article'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_ChangeType", {
              objId: objPostId,
              type: "Article",
              solutionId: "-1"
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
        it("change post type from 'Article' to 'Idea'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_ChangeType", {
              objId: objPostId,
              type: "Idea",
              solutionId: "-1"
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
        it("change post type from 'Idea' to 'Question'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_ChangeType", {
              objId: objPostId,
              type: "Question",
              solutionId: "-1"
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
      describe("change post type with marked solved reply", function () {
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
        it("change post type from 'Question' to 'Article'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_ChangeType", {
              objId: objPostId,
              type: "Article",
              solutionId: objReplyId
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
        it("change post type from 'Article' to 'Idea'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_ChangeType", {
              objId: objPostId,
              type: "Idea",
              solutionId: objReplyId
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
        it("change post type from 'Idea' to 'Question'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_ChangeType", {
              objId: objPostId,
              type: "Question",
              solutionId: objReplyId
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