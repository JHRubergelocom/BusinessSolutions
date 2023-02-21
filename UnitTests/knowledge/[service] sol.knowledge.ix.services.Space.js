
describe("[service] sol.knowledge.ix.services.Space", function () {
  var objTempId, objSpaceId, originalTimeout,
      config, objSpaceTId, sord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Space", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
    describe("sol.knowledge.ix.services.Space", function () {
      it("create spaceT", function (done) {
        expect(function () {
          test.Utils.createSord(objTempId, "knowledge Space", "TestSpaceT", { SOL_TYPE: "KNOWLEDGE_SPACE", KNOWLEDGE_SPACE_REFERENCE: "TSpaceT" }).then(function success(objSpaceTId1) {
            objSpaceTId = objSpaceTId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("addPost", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Space",
            classConfig: { objId: objSpaceTId },
            method: "addPost",
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
      it("hasListAccess", function (done) {
        expect(function () {
          sord = { access: {} };
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Space",
            classConfig: { objId: objSpaceTId },
            method: "hasListAccess",
            params: [sord]
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
      it("hasWriteAccess", function (done) {
        expect(function () {
          sord = { access: {} };
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Space",
            classConfig: { objId: objSpaceTId },
            method: "hasWriteAccess",
            params: [sord]
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
            className: "sol.knowledge.ix.services.Space",
            classConfig: { objId: objSpaceTId },
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_knowledge_service_Space_AddPost", function () {
      describe("add post", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Space_AddPost", {
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
        it("add post", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Space_AddPost", {
              objId: objSpaceId
            }).then(function success(result) {
              expect(result.postObjId).toBeDefined();
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("add post with title, content, type, objKeys", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Space_AddPost", {
              objId: objSpaceId,
              title: "title1",
              content: "content1",
              type: "QUESTION"
            }).then(function success(result) {
              expect(result.postObjId).toBeDefined();
              test.Utils.getSord(result.postObjId).then(function success1(postSord) {
                expect(postSord.name).toEqual("title1");
                expect(postSord.desc).toEqual("content1");
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
    }).not.toThrow();
  });
});