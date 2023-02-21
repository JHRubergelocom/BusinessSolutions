
describe("[service] sol.knowledge.ix.services.SolType", function () {
  var objTempId, objBoardId, objSpaceId, objPostId, objReplyId,
      spaceTypes, configTypes, configAction, originalTimeout,
      wfInfo, succNodes, succNodesIds,
      config, objPostTId;

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
  describe("create knowledge board", function () {
    it("create board", function (done) {
      expect(function () {
        test.Utils.createSord(objTempId, "knowledge Board", "TestBoard", { SOL_TYPE: "KNOWLEDGE_BOARD", KNOWLEDGE_BOARD_REFERENCE: "TBoard" }).then(function success(objBoardId1) {
          objBoardId = objBoardId1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("spaceTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/knowledge/Configuration/Space types"
        }
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(spaceTypes1) {
        spaceTypes = spaceTypes1;
        expect(spaceTypes).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objBoardId,
          $metadata: {
            solType: "KNOWLEDGE_SPACE",
            owner: {
              fromConnection: true
            }
          },
          $wf: {
            template: {
              name: "sol.knowledge.space.create"
            },
            name: "Create Space {{formatDate 'YYYY-MM-DD HH:mm:ss'}}"
          },
          $name: "CreateSpace",
          $events: [
            {
              id: "DIALOG"
            },
            {
              id: "GOTO",
              onWfStatus: "CREATE"
            }
          ],
          $new: {
            target: {
              mode: "SELECTED"
            },
            template: {
              name: "Default",
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/knowledge/Configuration/Space types"
            }
          },
          $permissions: {
            mode: "SET",
            copySource: false,
            inherit: {
              fromDirectParent: true
            }
          }
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_common_action_Standard", configAction, []).then(function success(jsonResults) {
          test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo1) {
            wfInfo = wfInfo1;
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
    it("fill space sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordSpace) {
          objSpaceId = wfInfo.objId;
          test.Utils.updateSord(sordSpace, [{ key: "name", value: "Unittest Space" }, { key: "desc", value: "Unittest desc" }]).then(function success1(updateSordResult) {
            test.Utils.updateKeywording(sordSpace, { KNOWLEDGE_SPACE_REFERENCE: "TSpace" }, true).then(function success2(updateKeywordingResult) {
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
      }).not.toThrow();
    });
    it("finish forwarding workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
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
    it("remove workflows", function (done) {
      expect(function () {
        test.Utils.getFinishedWorkflows(wfInfo.objId).then(function success(wfs) {
          test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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
    it("update post reference", function (done) {
      expect(function () {
        test.Utils.getSord(objPostId).then(function success(sordPost) {
          test.Utils.updateKeywording(sordPost, { KNOWLEDGE_POST_REFERENCE: "TPost" }, true).then(function success1(updateKeywordingResult) {
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
    it("update reply reference", function (done) {
      expect(function () {
        test.Utils.getSord(objReplyId).then(function success(sordPeply) {
          test.Utils.updateKeywording(sordPeply, { KNOWLEDGE_REPLY_REFERENCE: "TReply" }, true).then(function success1(updateKeywordingResult) {
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
  describe("Test Lib Functions", function () {
    describe("sol.knowledge.ix.services.SolType", function () {
      it("create postT", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
            type: "Question",
            subject: "PostT",
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
      it("getInfo", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.SolType",
            classConfig: { objId: objPostTId },
            method: "getInfo",
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
          config = {};
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.SolType",
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
              expect(result.knowledgeBoardReference).toBeDefined();
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
              expect(result.knowledgeBoardReference).toBeDefined();
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
              expect(result.knowledgeBoardReference).toBeDefined();
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
        it("get info board", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_service_SolType_GetInfo", {
              objId: objBoardId
            }).then(function success(result) {
              expect(result.solType).toBeDefined();
              expect(result.knowledgeBoardReference).toBeDefined();
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