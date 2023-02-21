
describe("[action] sol.hr.ix.actions.CreateEmployeeRequest", function () {
  var personnelFileTypes, objIdHr, objIdRe,
      configAction, wfInfo, succNodes, succNodesIds,
      userNode, nodes, userNodeId,
      requestTypes, originalTimeout, interval, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.CreateEmployeeRequest", null, null).then(function success(objTempId) {
        interval = 4000;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.hr.ix.actions.CreateEmployeeRequest", function () {
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.actions.CreateEmployeeRequest",
            classConfig: {},
            method: "getName",
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
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.actions.CreateEmployeeRequest",
            classConfig: {},
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.actions.CreateEmployeeRequest",
            classConfig: {},
            method: "process",
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
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
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
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getActiveWorkflows().then(function success(wfs) {
            test.Utils.removeActiveWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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
  describe("test create employee request", function () {
    it("should not throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_hr_personnel_action_CreateEmployeeRequest", {
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
    describe("'sol.hr.personnel.informmissingfile'", function () {
      describe("'OK' -> 'Confirm'", function () {
        describe("create personnelfile hr1", function () {
          it("personnelFileTypes must be available", function (done) {
            test.Utils.execute("RF_sol_hr_service_GetPersonnelFileTypes", {}).then(function success(personnelFileTypes1) {
              personnelFileTypes = personnelFileTypes1;
              expect(personnelFileTypes).toBeDefined();
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
                typeName: personnelFileTypes[0].name,
                typeObjId: personnelFileTypes[0].objId,
                typeSource: personnelFileTypes[0].source,
                typeSourceName: personnelFileTypes[0].sourceName
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
          it("fill personnelfile sord", function (done) {
            expect(function () {
              test.Utils.getSord(wfInfo.objId).then(function success(sordHr1) {
                objIdHr = wfInfo.objId;
                test.Utils.updateKeywording(sordHr1, { HR_PERSONNEL_FIRSTNAME: "Bernd", HR_PERSONNEL_LASTNAME: "Stromberg", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
          it("setTimeout (wait for background job change rights)", function (done) {
            expect(function () {
              test.Utils.setTimeout(interval).then(function success(timeoutResult) {
                done();
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
              test.Utils.getFinishedWorkflows().then(function success(wfs) {
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
        describe("test finish createemployeerequest", function () {
          it("get request types", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetRequestTypes", {}).then(function success(requestTypes1) {
                requestTypes = requestTypes1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("requestTypes must be available", function () {
            expect(requestTypes).toBeDefined();
          });
          it("requestTypes.length must greater than zero", function () {
            expect(requestTypes.length).toBeGreaterThan(0);
          });
          it("start action createemployeerequest workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: requestTypes[0].id,
                typeRequester: requestTypes[0].requester,
                typeName: requestTypes[0].name,
                typeDescription: requestTypes[0].desc,
                typeShortdesc: requestTypes[0].shortdesc,
                typeTargetMaskName: requestTypes[0].targetMaskName,
                typeWorkflow: requestTypes[0].workflow,
                typeInheritanceGuid: requestTypes[0].inheritanceGuid
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateEmployeeRequest", configAction, []).then(function success(jsonResults) {
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
          it("get active node 'Personnel' (id = 15) of workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                nodes = test.Utils.getActiveUserNodes(workflow);
                if (nodes.length > 0) {
                  userNode = nodes[0];
                  userNodeId = userNode.id;
                  // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
                } else {
                  // alert("no userNodes available");
                }
                expect(userNodeId).toEqual(15);
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("'Confirm' forwarding Workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.confirm");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Confirm'").then(function success1(forwardWorkflowTaskResult) {
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
              test.Utils.getFinishedWorkflows().then(function success(wfs) {
                test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
                  test.Utils.getActiveWorkflows().then(function success2(wfs1) {
                    test.Utils.removeActiveWorkflows(wfs1).then(function success3(removeFinishedWorkflowsResult1) {
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
          it("remove hr object", function (done) {
            expect(function () {
              test.Utils.deleteSord(objIdHr).then(function success(deleteResult) {
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
      describe("'Cancel'", function () {
        describe("create personnelfile hr2", function () {
          it("personnelFileTypes must be available", function (done) {
            test.Utils.execute("RF_sol_hr_service_GetPersonnelFileTypes", {}).then(function success(personnelFileTypes1) {
              personnelFileTypes = personnelFileTypes1;
              expect(personnelFileTypes).toBeDefined();
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
                typeName: personnelFileTypes[0].name,
                typeObjId: personnelFileTypes[0].objId,
                typeSource: personnelFileTypes[0].source,
                typeSourceName: personnelFileTypes[0].sourceName
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
          it("fill personnelfile sord", function (done) {
            expect(function () {
              test.Utils.getSord(wfInfo.objId).then(function success(sordHr2) {
                objIdHr = wfInfo.objId;
                test.Utils.updateKeywording(sordHr2, { HR_PERSONNEL_FIRSTNAME: "Nils", HR_PERSONNEL_LASTNAME: "Armstrong", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
          it("setTimeout (wait for background job change rights)", function (done) {
            expect(function () {
              test.Utils.setTimeout(interval).then(function success(timeoutResult) {
                done();
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
              test.Utils.getFinishedWorkflows().then(function success(wfs) {
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
        describe("test cancel createemployeerequest", function () {
          it("get request types", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetRequestTypes", {}).then(function success(requestTypes1) {
                requestTypes = requestTypes1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("requestTypes must be available", function () {
            expect(requestTypes).toBeDefined();
          });
          it("requestTypes.length must greater than zero", function () {
            expect(requestTypes.length).toBeGreaterThan(0);
          });
          it("start action createemployeerequest workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: requestTypes[0].id,
                typeRequester: requestTypes[0].requester,
                typeName: requestTypes[0].name,
                typeDescription: requestTypes[0].desc,
                typeShortdesc: requestTypes[0].shortdesc,
                typeTargetMaskName: requestTypes[0].targetMaskName,
                typeWorkflow: requestTypes[0].workflow,
                typeInheritanceGuid: requestTypes[0].inheritanceGuid
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateEmployeeRequest", configAction, []).then(function success(jsonResults) {
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
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.cancel");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest cancel input").then(function success1(forwardWorkflowTaskResult) {
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
              test.Utils.getFinishedWorkflows().then(function success(wfs) {
                test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
                  test.Utils.getActiveWorkflows().then(function success2(wfs1) {
                    test.Utils.removeActiveWorkflows(wfs1).then(function success3(removeFinishedWorkflowsResult1) {
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
          it("remove hr object", function (done) {
            expect(function () {
              test.Utils.deleteSord(objIdHr).then(function success(deleteResult) {
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
    describe("'sol.hr.personnel.request.address'", function () {
      describe("'OK' -> 'Approval'", function () {
        describe("create personnelfile hr1", function () {
          it("personnelFileTypes must be available", function (done) {
            test.Utils.execute("RF_sol_hr_service_GetPersonnelFileTypes", {}).then(function success(personnelFileTypes1) {
              personnelFileTypes = personnelFileTypes1;
              expect(personnelFileTypes).toBeDefined();
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
                typeName: personnelFileTypes[0].name,
                typeObjId: personnelFileTypes[0].objId,
                typeSource: personnelFileTypes[0].source,
                typeSourceName: personnelFileTypes[0].sourceName
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
          it("fill personnelfile sord", function (done) {
            expect(function () {
              test.Utils.getSord(wfInfo.objId).then(function success(sordHr1) {
                objIdHr = wfInfo.objId;
                test.Utils.updateKeywording(sordHr1, { HR_PERSONNEL_FIRSTNAME: "Bernd", HR_PERSONNEL_LASTNAME: "Stromberg", HR_PERSONNEL_ELOUSERID: "Administrator", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
          it("setTimeout (wait for background job change rights)", function (done) {
            expect(function () {
              test.Utils.setTimeout(interval).then(function success(timeoutResult) {
                done();
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
              test.Utils.getFinishedWorkflows().then(function success(wfs) {
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
        describe("test finish createemployeerequest", function () {
          it("get request types", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetRequestTypes", {}).then(function success(requestTypes1) {
                requestTypes = requestTypes1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("requestTypes must be available", function () {
            expect(requestTypes).toBeDefined();
          });
          it("requestTypes.length must greater than zero", function () {
            expect(requestTypes.length).toBeGreaterThan(0);
          });
          it("start action createemployeerequest workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: requestTypes[0].id,
                typeRequester: requestTypes[0].requester,
                typeName: requestTypes[0].name,
                typeDescription: requestTypes[0].desc,
                typeShortdesc: requestTypes[0].shortdesc,
                typeTargetMaskName: requestTypes[0].targetMaskName,
                typeWorkflow: requestTypes[0].workflow,
                typeInheritanceGuid: requestTypes[0].inheritanceGuid
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateEmployeeRequest", configAction, []).then(function success(jsonResults) {
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
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
                  objIdRe = wfInfo.objId;
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
          it("get active node 'Personnel' (id = 15) of workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                nodes = test.Utils.getActiveUserNodes(workflow);
                if (nodes.length > 0) {
                  userNode = nodes[0];
                  userNodeId = userNode.id;
                  // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
                } else {
                  // alert("no userNodes available");
                }
                expect(userNodeId).toEqual(15);
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("'Approve' forwarding Workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.approve");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Approve'").then(function success1(forwardWorkflowTaskResult) {
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
              test.Utils.getFinishedWorkflows().then(function success(wfs) {
                test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
                  test.Utils.getActiveWorkflows().then(function success2(wfs1) {
                    test.Utils.removeActiveWorkflows(wfs1).then(function success3(removeFinishedWorkflowsResult1) {
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
          it("remove hr object", function (done) {
            expect(function () {
              test.Utils.deleteSord(objIdHr).then(function success(deleteResult) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("remove request object", function (done) {
            expect(function () {
              test.Utils.deleteSord(objIdRe).then(function success(deleteResult) {
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
      describe("'OK' -> 'Reject'", function () {
        describe("create personnelfile hr2", function () {
          it("personnelFileTypes must be available", function (done) {
            test.Utils.execute("RF_sol_hr_service_GetPersonnelFileTypes", {}).then(function success(personnelFileTypes1) {
              personnelFileTypes = personnelFileTypes1;
              expect(personnelFileTypes).toBeDefined();
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
                typeName: personnelFileTypes[0].name,
                typeObjId: personnelFileTypes[0].objId,
                typeSource: personnelFileTypes[0].source,
                typeSourceName: personnelFileTypes[0].sourceName
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
          it("fill personnelfile sord", function (done) {
            expect(function () {
              test.Utils.getSord(wfInfo.objId).then(function success(sordHr2) {
                objIdHr = wfInfo.objId;
                test.Utils.updateKeywording(sordHr2, { HR_PERSONNEL_FIRSTNAME: "Nils", HR_PERSONNEL_LASTNAME: "Armstrong", HR_PERSONNEL_ELOUSERID: "Administrator", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
          it("setTimeout (wait for background job change rights)", function (done) {
            expect(function () {
              test.Utils.setTimeout(interval).then(function success(timeoutResult) {
                done();
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
              test.Utils.getFinishedWorkflows().then(function success(wfs) {
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
        describe("test finish createemployeerequest", function () {
          it("get request types", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetRequestTypes", {}).then(function success(requestTypes1) {
                requestTypes = requestTypes1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("requestTypes must be available", function () {
            expect(requestTypes).toBeDefined();
          });
          it("requestTypes.length must greater than zero", function () {
            expect(requestTypes.length).toBeGreaterThan(0);
          });
          it("start action createemployeerequest workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: requestTypes[0].id,
                typeRequester: requestTypes[0].requester,
                typeName: requestTypes[0].name,
                typeDescription: requestTypes[0].desc,
                typeShortdesc: requestTypes[0].shortdesc,
                typeTargetMaskName: requestTypes[0].targetMaskName,
                typeWorkflow: requestTypes[0].workflow,
                typeInheritanceGuid: requestTypes[0].inheritanceGuid
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateEmployeeRequest", configAction, []).then(function success(jsonResults) {
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
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
                  objIdRe = wfInfo.objId;
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
          it("get active node 'Personnel' (id = 15) of workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                nodes = test.Utils.getActiveUserNodes(workflow);
                if (nodes.length > 0) {
                  userNode = nodes[0];
                  userNodeId = userNode.id;
                  // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
                } else {
                  // alert("no userNodes available");
                }
                expect(userNodeId).toEqual(15);
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("'Reject' forwarding Workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.reject");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Reject'").then(function success1(forwardWorkflowTaskResult) {
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
              test.Utils.getFinishedWorkflows().then(function success(wfs) {
                test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
                  test.Utils.getActiveWorkflows().then(function success2(wfs1) {
                    test.Utils.removeActiveWorkflows(wfs1).then(function success3(removeFinishedWorkflowsResult1) {
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
          it("remove hr object", function (done) {
            expect(function () {
              test.Utils.deleteSord(objIdHr).then(function success(deleteResult) {
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("remove request object", function (done) {
            expect(function () {
              test.Utils.deleteSord(objIdRe).then(function success(deleteResult) {
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
      describe("'Cancel'", function () {
        describe("create personnelfile hr3", function () {
          it("personnelFileTypes must be available", function (done) {
            test.Utils.execute("RF_sol_hr_service_GetPersonnelFileTypes", {}).then(function success(personnelFileTypes1) {
              personnelFileTypes = personnelFileTypes1;
              expect(personnelFileTypes).toBeDefined();
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
                typeName: personnelFileTypes[0].name,
                typeObjId: personnelFileTypes[0].objId,
                typeSource: personnelFileTypes[0].source,
                typeSourceName: personnelFileTypes[0].sourceName
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
          it("fill personnelfile sord", function (done) {
            expect(function () {
              test.Utils.getSord(wfInfo.objId).then(function success(sordHr3) {
                objIdHr = wfInfo.objId;
                test.Utils.updateKeywording(sordHr3, { HR_PERSONNEL_FIRSTNAME: "Nobody", HR_PERSONNEL_LASTNAME: "Perfect", HR_PERSONNEL_ELOUSERID: "Administrator", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
          it("setTimeout (wait for background job change rights)", function (done) {
            expect(function () {
              test.Utils.setTimeout(interval).then(function success(timeoutResult) {
                done();
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
              test.Utils.getFinishedWorkflows().then(function success(wfs) {
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
        describe("test cancel createemployeerequest", function () {
          it("get request types", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetRequestTypes", {}).then(function success(requestTypes1) {
                requestTypes = requestTypes1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("requestTypes must be available", function () {
            expect(requestTypes).toBeDefined();
          });
          it("requestTypes.length must greater than zero", function () {
            expect(requestTypes.length).toBeGreaterThan(0);
          });
          it("start action createemployeerequest workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: requestTypes[0].id,
                typeRequester: requestTypes[0].requester,
                typeName: requestTypes[0].name,
                typeDescription: requestTypes[0].desc,
                typeShortdesc: requestTypes[0].shortdesc,
                typeTargetMaskName: requestTypes[0].targetMaskName,
                typeWorkflow: requestTypes[0].workflow,
                typeInheritanceGuid: requestTypes[0].inheritanceGuid
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateEmployeeRequest", configAction, []).then(function success(jsonResults) {
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
                succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.cancel");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest cancel input").then(function success1(forwardWorkflowTaskResult) {
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
              test.Utils.getFinishedWorkflows().then(function success(wfs) {
                test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
                  test.Utils.getActiveWorkflows().then(function success2(wfs1) {
                    test.Utils.removeActiveWorkflows(wfs1).then(function success3(removeFinishedWorkflowsResult1) {
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
          it("remove hr object", function (done) {
            expect(function () {
              test.Utils.deleteSord(objIdHr).then(function success(deleteResult) {
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
        it("remove workflows", function (done) {
          expect(function () {
            test.Utils.getFinishedWorkflows().then(function success(wfs) {
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
        it("remove workflows", function (done) {
          expect(function () {
            test.Utils.getActiveWorkflows().then(function success(wfs) {
              test.Utils.removeActiveWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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