
describe("[service] sol.knowledge.ix.services.CreatePost", function () {
  var objTempId, objSpaceId, objFile1Id, objFile2Id, originalTimeout,
      params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreatePost", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
    describe("sol.knowledge.ix.services.CreatePost", function () {
      it("createPost", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.CreatePost",
            classConfig: { type: "Article", subject: "Subject1", spaceFolderId: objSpaceId },
            method: "createPost",
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
            className: "sol.knowledge.ix.services.CreatePost",
            classConfig: { type: "Article", subject: "Subject1", spaceFolderId: objSpaceId },
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
    describe("RF_sol_knowledge_service_Post_Create", function () {
      describe("create post", function () {
        it("should throw if executed without 'type'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
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
        it("should throw if executed without 'subject'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
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
        it("should throw if executed without 'spaceFolderId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
              type: "Article",
              subject: "Subject1"
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
        it("create post Article", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
              type: "Article",
              subject: "Subject1",
              spaceFolderId: objSpaceId
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
        it("create post Article with topics", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
              type: "Article",
              subject: "Subject2",
              spaceFolderId: objSpaceId,
              topics: ["Topic21", "Topic22"]
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
        it("create post Article with topics, content, createdFiles and lang", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
              type: "Article",
              subject: "Subject3",
              content: "Content3",
              spaceFolderId: objSpaceId,
              lang: "fr",
              topics: ["Topic31", "Topic32", "Topic33"],
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
        it("create post Idea", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
              type: "Idea",
              subject: "Idea1",
              spaceFolderId: objSpaceId
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
        it("create post Guide", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
              type: "Guide",
              subject: "Guide1",
              spaceFolderId: objSpaceId
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
        it("create post Question", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
              type: "Question",
              subject: "Question1",
              spaceFolderId: objSpaceId
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