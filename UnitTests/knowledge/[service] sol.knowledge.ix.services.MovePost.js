
describe("[service] sol.knowledge.ix.services.MovePost", function () {
  var objTempId, objSpaceId1, objSpaceId2, objPostId, originalTimeout,
      objSpaceIdT, objPostIdT, params, post;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("MovePost", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
    it("create space1", function (done) {
      expect(function () {
        test.Utils.createSord(objTempId, "knowledge Space", "TestSpace1", { SOL_TYPE: "KNOWLEDGE_SPACE", KNOWLEDGE_SPACE_REFERENCE: "TSpace1" }).then(function success(objSpaceId11) {
          objSpaceId1 = objSpaceId11;
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
          subject: "Question1",
          spaceFolderId: objSpaceId1
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
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create space2", function (done) {
      expect(function () {
        test.Utils.createSord(objTempId, "knowledge Space", "TestSpace2", { SOL_TYPE: "KNOWLEDGE_SPACE", KNOWLEDGE_SPACE_REFERENCE: "TSpace2" }).then(function success(objSpaceId21) {
          objSpaceId2 = objSpaceId21;
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
    describe("sol.knowledge.ix.services.MovePost", function () {
      it("create spaceT", function (done) {
        expect(function () {
          test.Utils.createSord(objTempId, "knowledge Space", "TestSpaceT", { SOL_TYPE: "KNOWLEDGE_SPACE", KNOWLEDGE_SPACE_REFERENCE: "TSpaceT" }).then(function success(objSpaceIdT1) {
            objSpaceIdT = objSpaceIdT1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("create postT", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
            type: "Question",
            subject: "PostT",
            spaceFolderId: objSpaceIdT
          }).then(function success(jsonResult) {
            objPostIdT = jsonResult.objId;
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
            className: "sol.knowledge.ix.services.MovePost",
            classConfig: { postGuid: objPostIdT, spaceGuid: objSpaceIdT },
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
      it("movePost", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.MovePost",
            classConfig: { postGuid: objPostIdT, spaceGuid: objSpaceIdT },
            method: "movePost",
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
      it("registerUpdates", function (done) {
        expect(function () {
          post = { id: objPostIdT };
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.MovePost",
            classConfig: { postGuid: objPostIdT, spaceGuid: objSpaceIdT },
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
    describe("RF_sol_knowledge_service_Post_Move", function () {
      describe("move post", function () {
        it("should throw if executed without 'postGuid'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Move", {
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
        it("should throw if executed without 'spaceGuid'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Move", {
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
        it("move post with with 'spaceGuid'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Move", {
              postGuid: objPostId,
              spaceGuid: objSpaceId2
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