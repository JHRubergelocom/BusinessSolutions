
describe("[service] sol.knowledge.ix.services.LinkPosts", function () {
  var objTempId, objSpaceId1, objSpaceId2, objPostId11, objPostId12, objPostId21, objPostId22, originalTimeout,
      objSpaceIdT, objPostIdT, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("LinkPosts", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
    it("create post11", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
          type: "Question",
          subject: "Question11",
          spaceFolderId: objSpaceId1
        }).then(function success(jsonResultPost) {
          objPostId11 = jsonResultPost.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create post12", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
          type: "Question",
          subject: "Question12",
          spaceFolderId: objSpaceId1
        }).then(function success(jsonResultPost) {
          objPostId12 = jsonResultPost.objId;
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
    it("create post21", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
          type: "Question",
          subject: "Question21",
          spaceFolderId: objSpaceId2
        }).then(function success(jsonResultPost) {
          objPostId21 = jsonResultPost.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create post22", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
          type: "Question",
          subject: "Question22",
          spaceFolderId: objSpaceId2
        }).then(function success(jsonResultPost) {
          objPostId22 = jsonResultPost.objId;
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
    describe("sol.knowledge.ix.services.LinkPosts", function () {
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
            className: "sol.knowledge.ix.services.LinkPosts",
            classConfig: { fromPostGuid: objPostIdT, toPostGuids: [], unlinkPostGuids: [] },
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
      it("linkPosts", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.LinkPosts",
            classConfig: { fromPostGuid: objPostIdT, toPostGuids: [], unlinkPostGuids: [] },
            method: "linkPosts",
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
    describe("RF_sol_knowledge_service_Link_Posts", function () {
      describe("link posts", function () {
        it("should throw if executed without 'fromPostGuid'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Link_Posts", {
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
        it("should throw if executed without 'toPostGuids'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Link_Posts", {
              fromPostGuid: objPostId11
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
        it("should throw if executed without 'unlinkPostGuids'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Link_Posts", {
              fromPostGuid: objPostId11,
              toPostGuids: [objPostId12, objPostId21, objPostId22]
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
        it("link posts with with 'unlinkPostGuids'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Link_Posts", {
              fromPostGuid: objPostId11,
              toPostGuids: [objPostId12, objPostId21, objPostId22],
              unlinkPostGuids: objPostId12
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
        it("link posts with empty 'toPostGuids', 'unlinkPostGuids'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Link_Posts", {
              fromPostGuid: objPostId11,
              toPostGuids: [],
              unlinkPostGuids: []
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