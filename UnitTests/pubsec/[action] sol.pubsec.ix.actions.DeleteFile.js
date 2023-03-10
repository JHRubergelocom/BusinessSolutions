
describe("[action] sol.pubsec.ix.actions.DeleteFile", function () {
  var originalTimeout, objTempId, fileTypes, objFPId,
      configAction, checkResult,
      wfInfo, succNodes, succNodesIds,
      objFileId11, objFileId121, objFileId122, objFileId2;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.DeleteFile", null, null).then(function success(objTempId1) {
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
  describe("test deletefile", function () {
    describe("create filingplan", function () {
      it("create filingplan should not throw", function (done) {
        expect(function () {
          test.Utils.createSord(objTempId, "Filing Plan", "4713 Unittest", null, null).then(function success(objFPId1) {
            objFPId = objFPId1;
            test.Utils.getSord(objFPId).then(function success1(sordFP) {
              test.Utils.updateKeywording(sordFP, {
                FILING_PLAN_NAME: "Unittest",
                FILING_PLAN_REFERENCE: "4713",
                ORGANISATIONAL_UNIT: "PubSec.Sachbearbeiter",
                FILE_RIGHTS_READ: "Everyone",
                FILE_RIGHTS_WRITE: "PubSec.Registratur",
                FILE_RIGHTS_CREATEFILE: "*",
                FILING_PLAN_ALLOWED_FILES: "*"
              }, true).then(function success2(updateKeywordingResult) {
                test.Utils.updateSord(sordFP, [{ key: "name", value: "4713 Unittest" }]).then(function success3(updateSordResult) {
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
    describe("test finish deletefile", function () {
      describe("create file11", function () {
        it("fileTypes must be available", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_pubsec_service_PrepareCreateFile", { targetId: objFPId }).then(function success(checkResult1) {
              checkResult = checkResult1;
              fileTypes = checkResult.types;
              expect(fileTypes).toBeDefined();
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("start action create workflow", function (done) {
          expect(function () {
            configAction = {
              parentId: objFPId,
              fileType: fileTypes[0].name,
              templateId: fileTypes[0].objId,
              isSubfile: checkResult.subfile
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_pubsec_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
        it("fill file sord", function (done) {
          expect(function () {
            test.Utils.getSord(wfInfo.objId).then(function success(sordFile11) {
              objFileId11 = wfInfo.objId;
              test.Utils.updateKeywording(sordFile11, { FILE_NAME: "Unittest FILE_NAME11" }, true).then(function success1(updateKeywordingResult) {
                test.Utils.updateSord(sordFile11, [{ key: "desc", value: "Unittest desc11" }]).then(function success2(updateSordResult) {
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
        it("finish workflow", function (done) {
          expect(function () {
            test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
              succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Create file");
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
      });
      describe("close file11", function () {
        it("check preconditions closefile should not throw", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_pubsec_service_CheckClosePreconditions", { targetId: objFileId11 }).then(function success(checkResult1) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("start action close workflow", function (done) {
          expect(function () {
            configAction = {
              objId: objFileId11
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_pubsec_action_Close", configAction, []).then(function success(jsonResults) {
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
        it("finish workflow", function (done) {
          expect(function () {
            test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
              succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Close file");
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
            test.Utils.getFinishedWorkflows(objFileId11).then(function success(wfs) {
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
      });
      describe("'Approve file deletion' -> 'Delete file'", function () {
        it("should throw if executed without 'fileObjId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_pubsec_action_Delete", {
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
        it("check preconditions deletefile should not throw", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_pubsec_service_CheckDeletePreconditions", { targetId: [objFileId11] }).then(function success(checkResult1) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("start action delete workflow", function (done) {
          expect(function () {
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_pubsec_action_Delete", { objIds: [objFileId11] }, []).then(function success(jsonResults) {
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
        it("wfInfo.flowId must be available", function () {
          expect(wfInfo.flowId).toBeDefined();
        });
        it("wfInfo.nodeId must be available", function () {
          expect(wfInfo.nodeId).toBeDefined();
        });
        it("finish input forwarding workflow", function (done) {
          expect(function () {
            test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
              succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Delete elements");
              succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
              test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
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
      describe("'Approve file deletion' -> 'Keep file closed'", function () {
        describe("create file121", function () {
          it("fileTypes must be available", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_pubsec_service_PrepareCreateFile", { targetId: objFPId }).then(function success(checkResult1) {
                checkResult = checkResult1;
                fileTypes = checkResult.types;
                expect(fileTypes).toBeDefined();
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("start action create workflow", function (done) {
            expect(function () {
              configAction = {
                parentId: objFPId,
                fileType: fileTypes[0].name,
                templateId: fileTypes[0].objId,
                isSubfile: checkResult.subfile
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_pubsec_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
          it("fill file sord", function (done) {
            expect(function () {
              test.Utils.getSord(wfInfo.objId).then(function success(sordFile121) {
                objFileId121 = wfInfo.objId;
                test.Utils.updateKeywording(sordFile121, { FILE_NAME: "Unittest FILE_NAME121" }, true).then(function success1(updateKeywordingResult) {
                  test.Utils.updateSord(sordFile121, [{ key: "desc", value: "Unittest desc121" }]).then(function success2(updateSordResult) {
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
          it("finish workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Create file");
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
        });
        describe("close file121", function () {
          it("check preconditions closefile should not throw", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_pubsec_service_CheckClosePreconditions", { targetId: objFileId121 }).then(function success(checkResult1) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("start action close workflow", function (done) {
            expect(function () {
              configAction = {
                objId: objFileId121
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_pubsec_action_Close", configAction, []).then(function success(jsonResults) {
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
          it("finish workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Close file");
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
              test.Utils.getFinishedWorkflows(objFileId121).then(function success(wfs) {
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
        });
        describe("'Rejected file deletion' -> 'OK, don't delete'", function () {
          it("check preconditions deletefile should not throw", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_pubsec_service_CheckDeletePreconditions", { targetId: [objFileId121] }).then(function success(checkResult1) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("start action delete workflow", function (done) {
            expect(function () {
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_pubsec_action_Delete", { objIds: [objFileId121] }, []).then(function success(jsonResults) {
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
          it("wfInfo.flowId must be available", function () {
            expect(wfInfo.flowId).toBeDefined();
          });
          it("wfInfo.nodeId must be available", function () {
            expect(wfInfo.nodeId).toBeDefined();
          });
          it("finish input forwarding workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Delete elements");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
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
        describe("create file122", function () {
          it("fileTypes must be available", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_pubsec_service_PrepareCreateFile", { targetId: objFPId }).then(function success(checkResult1) {
                checkResult = checkResult1;
                fileTypes = checkResult.types;
                expect(fileTypes).toBeDefined();
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("start action create workflow", function (done) {
            expect(function () {
              configAction = {
                parentId: objFPId,
                fileType: fileTypes[0].name,
                templateId: fileTypes[0].objId,
                isSubfile: checkResult.subfile
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_pubsec_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
          it("fill file sord", function (done) {
            expect(function () {
              test.Utils.getSord(wfInfo.objId).then(function success(sordFile122) {
                objFileId122 = wfInfo.objId;
                test.Utils.updateKeywording(sordFile122, { FILE_NAME: "Unittest FILE_NAME122" }, true).then(function success1(updateKeywordingResult) {
                  test.Utils.updateSord(sordFile122, [{ key: "desc", value: "Unittest desc122" }]).then(function success2(updateSordResult) {
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
          it("finish workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Create file");
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
        });
        describe("close file122", function () {
          it("check preconditions closefile should not throw", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_pubsec_service_CheckClosePreconditions", { targetId: objFileId122 }).then(function success(checkResult1) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("start action close workflow", function (done) {
            expect(function () {
              configAction = {
                objId: objFileId122
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_pubsec_action_Close", configAction, []).then(function success(jsonResults) {
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
          it("finish workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Close file");
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
              test.Utils.getFinishedWorkflows(objFileId122).then(function success(wfs) {
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
        });
        describe("'Rejected file deletion' -> 'Request deletion again'", function () {
          it("check preconditions deletefile should not throw", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_pubsec_service_CheckDeletePreconditions", { targetId: [objFileId122] }).then(function success(checkResult1) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("start action delete workflow", function (done) {
            expect(function () {
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_pubsec_action_Delete", { objIds: [objFileId122] }, []).then(function success(jsonResults) {
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
          it("wfInfo.flowId must be available", function () {
            expect(wfInfo.flowId).toBeDefined();
          });
          it("wfInfo.nodeId must be available", function () {
            expect(wfInfo.nodeId).toBeDefined();
          });
          it("finish input forwarding workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Delete elements");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
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
      });
    });
    describe("create file2", function () {
      it("fileTypes must be available", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_PrepareCreateFile", { targetId: objFPId }).then(function success(checkResult1) {
            checkResult = checkResult1;
            fileTypes = checkResult.types;
            expect(fileTypes).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start action create workflow", function (done) {
        expect(function () {
          configAction = {
            parentId: objFPId,
            fileType: fileTypes[0].name,
            templateId: fileTypes[0].objId,
            isSubfile: checkResult.subfile
          };
          wfInfo = {};
          test.Utils.executeIxActionHandler("RF_sol_pubsec_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
      it("fill file sord", function (done) {
        expect(function () {
          test.Utils.getSord(wfInfo.objId).then(function success(sordFile2) {
            objFileId2 = wfInfo.objId;
            test.Utils.updateKeywording(sordFile2, { FILE_NAME: "Unittest FILE_NAME2" }, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateSord(sordFile2, [{ key: "desc", value: "Unittest desc1" }]).then(function success2(updateSordResult) {
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
      it("finish workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Create file");
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
    });
    describe("close file2", function () {
      it("check preconditions closefile should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckClosePreconditions", { targetId: objFileId2 }).then(function success(checkResult1) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start action close workflow", function (done) {
        expect(function () {
          configAction = {
            objId: objFileId2
          };
          wfInfo = {};
          test.Utils.executeIxActionHandler("RF_sol_pubsec_action_Close", configAction, []).then(function success(jsonResults) {
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
      it("finish workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Close file");
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
          test.Utils.getFinishedWorkflows(objFileId2).then(function success(wfs) {
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
    });
    describe("test cancel deletefile", function () {
      it("check preconditions deletefile should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckDeletePreconditions", { targetId: [objFileId2] }).then(function success(checkResult1) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start action delete workflow", function (done) {
        expect(function () {
          wfInfo = {};
          test.Utils.executeIxActionHandler("RF_sol_pubsec_action_Delete", { objIds: [objFileId2] }, []).then(function success(jsonResults) {
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
      it("wfInfo.flowId must be available", function () {
        expect(wfInfo.flowId).toBeDefined();
      });
      it("wfInfo.nodeId must be available", function () {
        expect(wfInfo.nodeId).toBeDefined();
      });
      it("cancel input forwarding workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Cancel");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest cancel input").then(function success1(forwardWorkflowTaskResult) {
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
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.getActiveWorkflows().then(function success2(wfs) {
            test.Utils.removeActiveWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
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