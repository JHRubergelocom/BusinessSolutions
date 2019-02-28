
describe("[service] sol.knowledge.ix.services.Search", function () {
  var username, searchId, idx, moreResults,
      objTempId, objSpaceId, objPostId1, objPostId2, objPostId3,
      renamedTopics, newTopics, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Search", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
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
    it("create post1 with topics", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
          type: "Article",
          subject: "Subject1",
          spaceFolderId: objSpaceId,
          topics: ["TopicRename11x", "TopicRename12", "TopicRename13"]
        }).then(function success(jsonResultPost) {
          objPostId1 = jsonResultPost.objId;
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
          content: "Content11",
          postGuid: objPostId1
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
          content: "Content12",
          postGuid: objPostId1
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
    it("create post2 with topics", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
          type: "Article",
          subject: "Subject2",
          spaceFolderId: objSpaceId,
          topics: ["TopicRename11x", "TopicRename11y", "TopicRename22"]
        }).then(function success(jsonResultPost) {
          objPostId2 = jsonResultPost.objId;
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
          content: "Content21",
          postGuid: objPostId2
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
          content: "Content22",
          postGuid: objPostId2
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
    it("create post3 with topics", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_service_Post_Create", {
          type: "Article",
          subject: "Subject3",
          spaceFolderId: objSpaceId,
          topics: ["TopicRename33x", "TopicRename33y", "TopicRename22"]
        }).then(function success(jsonResultPost) {
          objPostId3 = jsonResultPost.objId;
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
          content: "Content31",
          postGuid: objPostId3
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
          content: "Content32",
          postGuid: objPostId3
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
  });
  describe("Tests Registered Functions", function () {
    it("find posts should throw if executed without parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_services_Search_FindPosts", {
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
    it("search close should throw if executed without parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_knowledge_services_Search_Close", {
        }).then(function success(result) {
          fail(result);
          done();
        }, function error(err) {
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    describe("RF_sol_knowledge_services_Search_FindPosts", function () {
      describe("find posts with owner shouldn't throw", function () {
        it("find posts first", function (done) {
          expect(function () {
            username = test.Utils.getCurrentUserName();
            test.Utils.execute("RF_sol_knowledge_services_Search_FindPosts", {
              owner: username
            }).then(function success(result) {
              moreResults = result.moreResults;
              searchId = result.searchId;
              idx = result.sords.length;
              expect(result).toBeDefined();
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("find posts next", function (done) {
          expect(function () {
            if (moreResults === true) {
              test.Utils.execute("RF_sol_knowledge_services_Search_FindPosts", {
                searchId: searchId,
                idx: idx
              }).then(function success(result) {
                moreResults = result.moreResults;
                searchId = result.searchId;
                idx += result.sords.length;
                expect(result).toBeDefined();
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }
          }).not.toThrow();
        });
        it("find close", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_services_Search_Close", {
              searchId: searchId
            }).then(function success(result) {
              expect(result).toBeDefined();
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
      describe("find posts with query = 'ste'", function () {
        it("find posts first", function (done) {
          expect(function () {
            username = test.Utils.getCurrentUserName();
            test.Utils.execute("RF_sol_knowledge_services_Search_FindPosts", {
              owner: username,
              query: "ste"
            }).then(function success(result) {
              moreResults = result.moreResults;
              searchId = result.searchId;
              idx = result.sords.length;
              expect(result).toBeDefined();
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("find posts next", function (done) {
          expect(function () {
            if (moreResults === true) {
              test.Utils.execute("RF_sol_knowledge_services_Search_FindPosts", {
                searchId: searchId,
                idx: idx
              }).then(function success(result) {
                moreResults = result.moreResults;
                searchId = result.searchId;
                idx += result.sords.length;
                expect(result).toBeDefined();
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }
          }).not.toThrow();
        });
        it("find close", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_knowledge_services_Search_Close", {
              searchId: searchId
            }).then(function success(result) {
              expect(result).toBeDefined();
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
    describe("RF_sol_knowledge_services_Search_FindTopics", function () {
      it("find topics", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_services_Search_FindTopics", {
          }).then(function success(result) {
            expect(result).toBeDefined();
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
    describe("RF_sol_knowledge_services_Search_FindUsers", function () {
      it("find users", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_services_Search_FindUsers", {
            maxUsers: 110
          }).then(function success(result) {
            expect(result).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("find users starting with A*", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_services_Search_FindUsers", {
            userName: "A",
            maxUsers: 120
          }).then(function success(result) {
            expect(result).toBeDefined();
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
    describe("RF_sol_knowledge_services_Search_RenameTopics", function () {
      it("rename topics should throw if executed without parameters", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_services_Search_RenameTopics", {
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
      it("rename topics should throw if executed without parameter 'newTopic' ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_services_Search_RenameTopics", {
            oldTopics: ["TopicRename12", "TopicRename22"]
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
      it("rename topics 'TopicRename12'and 'TopicRename22' to 'TopicRename2'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_services_Search_RenameTopics", {
            oldTopics: ["TopicRename12", "TopicRename22"],
            newTopic: "TopicRename2"
          }).then(function success(result) {
            expect(result).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("rename topic 'TopicRename11x' to 'TopicRename11'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_services_Search_RenameTopics", {
            oldTopics: "TopicRename11x",
            newTopic: "TopicRename11"
          }).then(function success(result) {
            expect(result).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("rename topic 'TopicRename11x' and 'TopicRename11y' to 'TopicRename11'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_services_Search_RenameTopics", {
            oldTopics: ["TopicRename11x", "TopicRename11y"],
            newTopic: "TopicRename11"
          }).then(function success(result) {
            expect(result).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("rename topic 'TopicRename33x' and 'TopicRename33y' to 'TopicRename33'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_services_Search_RenameTopics", {
            oldTopics: ["TopicRename33x", "TopicRename33y"],
            newTopic: "TopicRename33"
          }).then(function success(result) {
            expect(result).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("check renamed topics 'Subject1", function (done) {
        expect(function () {
          test.Utils.getSord(objPostId1).then(function success(sordPost1) {
            renamedTopics = test.Utils.getObjKeyValues(sordPost1, "KNOWLEDGE_TOPICS");
            newTopics = ["TopicRename11", "TopicRename2", "TopicRename13"];
            expect(renamedTopics).toEqual(newTopics);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("check renamed topics 'Subject2", function (done) {
        expect(function () {
          test.Utils.getSord(objPostId2).then(function success(sordPost2) {
            renamedTopics = test.Utils.getObjKeyValues(sordPost2, "KNOWLEDGE_TOPICS");
            newTopics = ["TopicRename11", "TopicRename2"];
            expect(renamedTopics).toEqual(newTopics);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("check renamed topics 'Subject3", function (done) {
        expect(function () {
          test.Utils.getSord(objPostId3).then(function success(sordPost3) {
            renamedTopics = test.Utils.getObjKeyValues(sordPost3, "KNOWLEDGE_TOPICS");
            newTopics = ["TopicRename33", "TopicRename2"];
            expect(renamedTopics).toEqual(newTopics);
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
