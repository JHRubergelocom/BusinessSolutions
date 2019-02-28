
describe("[service] sol.knowledge.ix.services.Post", function () {
  var objTempId, objSpaceId, objPostId, views, postStatus, labelkey, postLabel,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Post", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
          subject: "Subject1",
          spaceFolderId: objSpaceId,
          lang: "fr",
          topics: ["Topic11", "Topic12", "Topic13"]
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
    it("label get all", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Label_GetAll", {}).then(function success(resultGetAll) {
          expect(resultGetAll.success).toEqual(true);
          expect(resultGetAll.labels).toBeDefined();
          labelkey = resultGetAll.labels[0].key;
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
    describe("RF_sol_knowledge_service_Post_Get", function () {
      describe("post get", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Get", {
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
        it("post get without 'isReload'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Get", {
              objId: objPostId
            }).then(function success(result) {
              expect(result).toBeDefined();
              test.Utils.getSord(objPostId).then(function success1(sordPost) {
                views = test.Utils.getObjKeyValue(sordPost, "KNOWLEDGE_COUNT_VIEWS");
                expect(views).toEqual("1");
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
        it("post get with 'isReload' = true ", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Get", {
              objId: objPostId,
              isReload: true
            }).then(function success(result) {
              expect(result).toBeDefined();
              test.Utils.getSord(objPostId).then(function success1(sordPost) {
                views = test.Utils.getObjKeyValue(sordPost, "KNOWLEDGE_COUNT_VIEWS");
                expect(views).toEqual("1");
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
        it("post get with 'isReload' = false ", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Get", {
              objId: objPostId,
              isReload: false
            }).then(function success(result) {
              expect(result).toBeDefined();
              test.Utils.getSord(objPostId).then(function success1(sordPost) {
                views = test.Utils.getObjKeyValue(sordPost, "KNOWLEDGE_COUNT_VIEWS");
                expect(views).toEqual("2");
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
    describe("RF_sol_knowledge_service_Post_Closed", function () {
      describe("post closed", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Closed", {
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
        it("post closed", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Closed", {
              objId: objPostId
            }).then(function success(result) {
              test.Utils.getSord(objPostId).then(function success1(sordPost) {
                postStatus = test.Utils.getObjKeyValue(sordPost, "KNOWLEDGE_STATUS");
                expect(postStatus).toEqual("CLOSED");
                expect(result.success).toEqual(true);
                expect(result.flowIdPost).toBeDefined();
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
    describe("RF_sol_knowledge_service_Post_Open", function () {
      describe("post open", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Open", {
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
        it("post open", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_Open", {
              objId: objPostId
            }).then(function success(result) {
              test.Utils.getSord(objPostId).then(function success1(sordPost) {
                postStatus = test.Utils.getObjKeyValue(sordPost, "KNOWLEDGE_STATUS");
                expect(postStatus).toEqual("OPEN");
                expect(result.success).toEqual(true);
                expect(result.flowIdPost).toBeDefined();
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
    describe("RF_sol_knowledge_service_Post_SetLabel", function () {
      describe("post set label", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_SetLabel", {
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
        it("should throw if executed without 'label'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_SetLabel", {
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
        it("post set label", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_SetLabel", {
              objId: objPostId,
              label: labelkey
            }).then(function success(result) {
              test.Utils.getSord(objPostId).then(function success1(sordPost) {
                postLabel = test.Utils.getObjKeyValue(sordPost, "KNOWLEDGE_LABEL");
                expect(postLabel).toEqual(labelkey);
                expect(result.success).toEqual(true);
                expect(result.label).toBeDefined();
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