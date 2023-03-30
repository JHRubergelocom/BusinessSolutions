
describe("[service] sol.knowledge.ix.services.Post", function () {
  var objTempId, objSpaceId, objPostId, views, postStatus, labelkey, postLabel,
      originalTimeout, config, objSpaceTId, objPostTId, sordName, statusClosed,
      sord, objId, templateId, name, list, nameField, idField;

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
  describe("Test Lib Functions", function () {
    describe("sol.knowledge.ix.services.Post", function () {
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
      it("create postT", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
            type: "Question",
            subject: "PostT",
            spaceFolderId: objSpaceTId
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
      it("buildElementName", function (done) {
        expect(function () {
          sordName = "sordName1";
          statusClosed = true;
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId },
            method: "buildElementName",
            params: [sordName, statusClosed]
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
      it("closedPost", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId },
            method: "closedPost",
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
      it("formatSord", function (done) {
        expect(function () {
          sord = objPostTId;
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId },
            method: "formatSord",
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
      it("getPost", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId },
            method: "getPost",
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
      it("getSolution", function (done) {
        expect(function () {
          sord = objPostTId;
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId },
            method: "getSolution",
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
      it("getWfTemplate", function (done) {
        expect(function () {
          statusClosed = true;
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId },
            method: "getWfTemplate",
            params: [statusClosed]
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
      it("hasSolution", function (done) {
        expect(function () {
          sord = objPostTId;
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId },
            method: "hasSolution",
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
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId },
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
      it("openPost", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId },
            method: "openPost",
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
      it("setAuthors", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId, authors: [] },
            method: "setAuthors",
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
      it("setContactpersons", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId, contactpersons: [] },
            method: "setContactpersons",
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
      it("setLabelPost", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId },
            method: "setLabelPost",
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
      it("setPersons", function (done) {
        expect(function () {
          sord = objPostTId;
          list = [];
          nameField = "nameField1";
          idField = "idField1";
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId },
            method: "setPersons",
            params: [sord, list, nameField, idField]
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
      it("startWorkflow", function (done) {
        expect(function () {
          objId = objPostTId;
          templateId = "sol.knowledge.post.open";
          name = "name1";
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.Post",
            classConfig: { objId: objPostTId },
            method: "startWorkflow",
            params: [objId, templateId, name]
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
    describe("RF_sol_knowledge_service_Post_SetAuthors", function () {
      describe("post set authors", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_SetAuthors", {
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
        it("should throw if executed without 'authors'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_SetAuthors", {
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
        it("post set authors", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_SetAuthors", {
              objId: objPostId,
              authors: []
            }).then(function success(result) {
              expect(result.success).toEqual(true);
              expect(result.users).toBeDefined();
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
    describe("RF_sol_knowledge_service_Post_SetContactpersons", function () {
      describe("post set contactpersons", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_SetContactpersons", {
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
        it("should throw if executed without 'contactpersons'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_SetContactpersons", {
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
        it("post set contactpersons", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_Post_SetContactpersons", {
              objId: objPostId,
              contactpersons: []
            }).then(function success(result) {
              expect(result.success).toEqual(true);
              expect(result.users).toBeDefined();
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