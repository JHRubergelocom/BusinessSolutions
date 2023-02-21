
describe("[service] sol.knowledge.ix.services.DeletePost", function () {
  var objTempId, objSpaceId, objPostId, objFile1Id, objFile2Id, originalTimeout,
      params, objPostTId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("DeletePost", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
  });
  describe("Test Lib Functions", function () {
    describe("sol.knowledge.ix.services.DeletePost", function () {
      describe("create post", function () {
        it("create post", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
              type: "Article",
              subject: "Subject1",
              spaceFolderId: objSpaceId
            }).then(function success(result) {
              objPostTId = result.objId;
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
      it("deletePost", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.DeletePost",
            classConfig: { objId: objPostTId },
            method: "deletePost",
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
            className: "sol.knowledge.ix.services.DeletePost",
            classConfig: { objId: objPostTId },
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
    describe("RF_sol_knowledge_service_Post_Delete", function () {
      describe("create post", function () {
        it("create post with topics and createdFiles", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
              type: "Article",
              subject: "Subject1",
              spaceFolderId: objSpaceId,
              topics: ["Topic11", "Topic12", "Topic13"],
              createdFiles: [objFile1Id, objFile2Id]
            }).then(function success(result) {
              objPostId = result.objId;
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
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Delete", {
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
        it("delete post with with 'objId'", function (done) {
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