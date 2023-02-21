
describe("[action] sol.pubsec.ix.actions.OpenProcess", function () {
  var originalTimeout, objTempId, fileTypes, objFPId,
      configAction, checkResult, processTypes,
      wfInfo, objFileId, succNodes, succNodesIds,
      objProcessId11, objProcessId121,
      objProcessId122, objProcessId2;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.OpenProcess", null, null).then(function success(objTempId1) {
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
  describe("test openprocess", function () {
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
    describe("create file", function () {
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
          test.Utils.getSord(wfInfo.objId).then(function success(sordFile) {
            objFileId = wfInfo.objId;
            test.Utils.updateKeywording(sordFile, { FILE_NAME: "Unittest FILE_NAME" }, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateSord(sordFile, [{ key: "desc", value: "Unittest desc" }]).then(function success2(updateSordResult) {
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
    describe("test finish openprocess", function () {
      describe("create process11", function () {
        it("check preconditions should not throw", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_pubsec_service_PrepareProcess", { targetId: objFileId }).then(function success(checkResult1) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("processTypes must be available", function (done) {
          test.Utils.execute("RF_sol_pubsec_service_GetProcessTypes", {}).then(function success(processTypes1) {
            processTypes = processTypes1;
            expect(processTypes).toBeDefined();
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
              parentId: objFileId,
              processType: processTypes[0].name,
              templateId: processTypes[0].objId
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_pubsec_action_CreateProcess", configAction, []).then(function success(jsonResults) {
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
        it("fill process sord", function (done) {
          expect(function () {
            test.Utils.getSord(wfInfo.objId).then(function success(sordProcess11) {
              objProcessId11 = wfInfo.objId;
              test.Utils.updateKeywording(sordProcess11, { PROCESS_NAME: "Unittest PROCESS_NAME11" }, true).then(function success1(updateKeywordingResult) {
                test.Utils.updateSord(sordProcess11, [{ key: "desc", value: "Unittest desc11" }]).then(function success2(updateSordResult) {
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
              succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Create case");
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
      describe("close process11", function () {
        it("check preconditions closeprocess should not throw", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_pubsec_service_CheckClosePreconditions", { targetId: objProcessId11 }).then(function success(checkResult1) {
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
              objId: objProcessId11
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
              succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Close case");
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
            test.Utils.getFinishedWorkflows(objProcessId11).then(function success(wfs) {
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
      describe("'Open case approval' -> 'Open case'", function () {
        it("should throw if executed without 'objId'", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_pubsec_action_Open", {
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
        it("check preconditions openprocess should not throw", function (done) {
          expect(function () {
            test.Utils.execute("RF_sol_pubsec_service_CheckOpenPreconditions", { targetId: [objProcessId11] }).then(function success(checkResult1) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("start action open workflow", function (done) {
          expect(function () {
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_pubsec_action_Open", { objIds: [objProcessId11] }, []).then(function success(jsonResults) {
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
              succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Open elements");
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
      describe("'Open case approval' -> 'Leave case closed'", function () {
        describe("create process121", function () {
          it("check preconditions should not throw", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_pubsec_service_PrepareProcess", { targetId: objFileId }).then(function success(checkResult1) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("processTypes must be available", function (done) {
            test.Utils.execute("RF_sol_pubsec_service_GetProcessTypes", {}).then(function success(processTypes1) {
              processTypes = processTypes1;
              expect(processTypes).toBeDefined();
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
                parentId: objFileId,
                processType: processTypes[0].name,
                templateId: processTypes[0].objId
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_pubsec_action_CreateProcess", configAction, []).then(function success(jsonResults) {
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
          it("fill process sord", function (done) {
            expect(function () {
              test.Utils.getSord(wfInfo.objId).then(function success(sordProcess121) {
                objProcessId121 = wfInfo.objId;
                test.Utils.updateKeywording(sordProcess121, { PROCESS_NAME: "Unittest PROCESS_NAME121" }, true).then(function success1(updateKeywordingResult) {
                  test.Utils.updateSord(sordProcess121, [{ key: "desc", value: "Unittest desc121" }]).then(function success2(updateSordResult) {
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
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Create case");
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
        describe("close process121", function () {
          it("check preconditions closeprocess should not throw", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_pubsec_service_CheckClosePreconditions", { targetId: objProcessId121 }).then(function success(checkResult1) {
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
                objId: objProcessId121
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
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Close case");
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
              test.Utils.getFinishedWorkflows(objProcessId121).then(function success(wfs) {
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
        describe("'Reject Open case' -> 'OK, leave case closed'", function () {
          it("check preconditions openprocess should not throw", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_pubsec_service_CheckOpenPreconditions", { targetId: [objProcessId121] }).then(function success(checkResult1) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("start action open workflow", function (done) {
            expect(function () {
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_pubsec_action_Open", { objIds: [objProcessId121] }, []).then(function success(jsonResults) {
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
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Open elements");
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
        describe("create process122", function () {
          it("check preconditions should not throw", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_pubsec_service_PrepareProcess", { targetId: objFileId }).then(function success(checkResult1) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("processTypes must be available", function (done) {
            test.Utils.execute("RF_sol_pubsec_service_GetProcessTypes", {}).then(function success(processTypes1) {
              processTypes = processTypes1;
              expect(processTypes).toBeDefined();
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
                parentId: objFileId,
                processType: processTypes[0].name,
                templateId: processTypes[0].objId
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_pubsec_action_CreateProcess", configAction, []).then(function success(jsonResults) {
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
          it("fill process sord", function (done) {
            expect(function () {
              test.Utils.getSord(wfInfo.objId).then(function success(sordProcess122) {
                objProcessId122 = wfInfo.objId;
                test.Utils.updateKeywording(sordProcess122, { PROCESS_NAME: "Unittest PROCESS_NAME122" }, true).then(function success1(updateKeywordingResult) {
                  test.Utils.updateSord(sordProcess122, [{ key: "desc", value: "Unittest desc122" }]).then(function success2(updateSordResult) {
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
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Create case");
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
        describe("close process122", function () {
          it("check preconditions closeprocess should not throw", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_pubsec_service_CheckClosePreconditions", { targetId: objProcessId122 }).then(function success(checkResult1) {
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
                objId: objProcessId122
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
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Close case");
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
              test.Utils.getFinishedWorkflows(objProcessId122).then(function success(wfs) {
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
        describe("'Reject Open case' -> 'New request'", function () {
          it("check preconditions openprocess should not throw", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_pubsec_service_CheckOpenPreconditions", { targetId: [objProcessId122] }).then(function success(checkResult1) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("start action open workflow", function (done) {
            expect(function () {
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_pubsec_action_Open", { objIds: [objProcessId122] }, []).then(function success(jsonResults) {
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
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Open elements");
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
    describe("create process2", function () {
      it("check preconditions should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_PrepareProcess", { targetId: objFileId }).then(function success(checkResult1) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("processTypes must be available", function (done) {
        test.Utils.execute("RF_sol_pubsec_service_GetProcessTypes", {}).then(function success(processTypes1) {
          processTypes = processTypes1;
          expect(processTypes).toBeDefined();
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
            parentId: objFileId,
            processType: processTypes[0].name,
            templateId: processTypes[0].objId
          };
          wfInfo = {};
          test.Utils.executeIxActionHandler("RF_sol_pubsec_action_CreateProcess", configAction, []).then(function success(jsonResults) {
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
      it("fill process sord", function (done) {
        expect(function () {
          test.Utils.getSord(wfInfo.objId).then(function success(sordProcess2) {
            objProcessId2 = wfInfo.objId;
            test.Utils.updateKeywording(sordProcess2, { PROCESS_NAME: "Unittest PROCESS_NAME2" }, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateSord(sordProcess2, [{ key: "desc", value: "Unittest desc2" }]).then(function success2(updateSordResult) {
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
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Create case");
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
    describe("close process2", function () {
      it("check preconditions closeprocess should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckClosePreconditions", { targetId: objProcessId2 }).then(function success(checkResult1) {
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
            objId: objProcessId2
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
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Close case");
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
          test.Utils.getFinishedWorkflows(objProcessId2).then(function success(wfs) {
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
    describe("test cancel openprocess", function () {
      it("check preconditions openprocess should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckOpenPreconditions", { targetId: [objProcessId2] }).then(function success(checkResult1) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start action open workflow", function (done) {
        expect(function () {
          wfInfo = {};
          test.Utils.executeIxActionHandler("RF_sol_pubsec_action_Open", { objIds: [objProcessId2] }, []).then(function success(jsonResults) {
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
    describe("try openprocess if item is not a process", function () {
      it("check preconditions openprocess should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckOpenPreconditions", { targetId: [objTempId] }).then(function success(checkResult1) {
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