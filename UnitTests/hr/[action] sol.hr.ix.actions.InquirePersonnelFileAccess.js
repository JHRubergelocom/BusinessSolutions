
describe("[action] sol.hr.ix.actions.InquirePersonnelFileAccess", function () {
  var personnelFileTypes, objIdHr,
      configAction, wfInfo, succNodes, succNodesIds, interval,
      userNode, nodes, userNodeId,
      eligiblePersonnelFiles, originalTimeout, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.InquirePersonnelFileAccess", null, null).then(function success(objTempId) {
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
    describe("sol.hr.ix.actions.InquirePersonnelFileAccess", function () {
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.actions.InquirePersonnelFileAccess",
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
            className: "sol.hr.ix.actions.InquirePersonnelFileAccess",
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
            className: "sol.hr.ix.actions.InquirePersonnelFileAccess",
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
  describe("test inquire personnel file access", function () {
    it("should not throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_hr_personnel_action_InquirePersonnelFileAccess", {
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
        describe("test finish inquirepersonalfileaccess", function () {
          it("get eligible personnel files", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetEligiblePersonnelFiles", {}).then(function success(eligiblePersonnelFiles1) {
                eligiblePersonnelFiles = eligiblePersonnelFiles1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("eligiblePersonnelFiles must be available", function () {
            expect(eligiblePersonnelFiles).toBeDefined();
          });
          it("eligiblePersonnelFiles.length must greater than zero", function () {
            expect(eligiblePersonnelFiles.length).toBeGreaterThan(0);
          });
          it("start action inquirepersonalfileaccess workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: "{{type.id}}",
                typeRequester: "{{type.requester}}",
                typeSource: "{{type.source}}",
                typeSourceName: "{{type.sourceName}}",
                typeName: "{{type.name}}",
                typeDescription: "{{type.desc}}",
                typeShortdesc: "{{type.shortdesc}}",
                typeMask: "{{type.mask}}",
                typeWorkflow: "{{type.workflow}}",
                typeTargetMaskName: "{{type.targetMaskName}}",
                typeInheritanceGuid: "{{type.inheritanceGuid}}",
                $templating: {
                  $type: {
                    id: "sol_hr_inform_missingfile",
                    name: "Personalakte digitalisieren",
                    desc: "Personalakte digitalisieren",
                    mask: "",
                    workflow: "sol.hr.personnel.informmissingfile",
                    userId: "Administrator",
                    requester: "Administrator"
                  }
                }
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_InquirePersonnelFileAccess", configAction, []).then(function success(jsonResults) {
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
        describe("test cancel inquirepersonalfileaccess", function () {
          it("get eligible personnel files", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetEligiblePersonnelFiles", {}).then(function success(eligiblePersonnelFiles1) {
                eligiblePersonnelFiles = eligiblePersonnelFiles1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("eligiblePersonnelFiles must be available", function () {
            expect(eligiblePersonnelFiles).toBeDefined();
          });
          it("eligiblePersonnelFiles.length must greater than zero", function () {
            expect(eligiblePersonnelFiles.length).toBeGreaterThan(0);
          });
          it("start action inquirepersonalfileaccess workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: "{{type.id}}",
                typeRequester: "{{type.requester}}",
                typeSource: "{{type.source}}",
                typeSourceName: "{{type.sourceName}}",
                typeName: "{{type.name}}",
                typeDescription: "{{type.desc}}",
                typeShortdesc: "{{type.shortdesc}}",
                typeMask: "{{type.mask}}",
                typeWorkflow: "{{type.workflow}}",
                typeTargetMaskName: "{{type.targetMaskName}}",
                typeInheritanceGuid: "{{type.inheritanceGuid}}",
                $templating: {
                  $type: {
                    id: "sol_hr_inform_missingfile",
                    name: "Personalakte digitalisieren",
                    desc: "Personalakte digitalisieren",
                    mask: "",
                    workflow: "sol.hr.personnel.informmissingfile",
                    userId: "Administrator",
                    requester: "Administrator"
                  }
                }
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_InquirePersonnelFileAccess", configAction, []).then(function success(jsonResults) {
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
    describe("'sol.hr.personnel.inquiry.employee'", function () {
      describe("'Request access' -> 'Approval' -> 'Delete file'", function () {
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
        describe("test finish inquirepersonalfileaccess", function () {
          it("get eligible personnel files", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetEligiblePersonnelFiles", {}).then(function success(eligiblePersonnelFiles1) {
                eligiblePersonnelFiles = eligiblePersonnelFiles1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("eligiblePersonnelFiles must be available", function () {
            expect(eligiblePersonnelFiles).toBeDefined();
          });
          it("eligiblePersonnelFiles.length must greater than zero", function () {
            expect(eligiblePersonnelFiles.length).toBeGreaterThan(0);
          });
          it("start action inquiry employee workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: eligiblePersonnelFiles[0].id,
                typeRequester: eligiblePersonnelFiles[0].requester,
                typeSource: eligiblePersonnelFiles[0].source,
                typeSourceName: eligiblePersonnelFiles[0].sourceName,
                typeName: eligiblePersonnelFiles[0].name,
                typeDescription: eligiblePersonnelFiles[0].desc,
                typeShortdesc: eligiblePersonnelFiles[0].shortdesc,
                typeMask: eligiblePersonnelFiles[0].mask,
                typeWorkflow: eligiblePersonnelFiles[0].workflow,
                typeTargetMaskName: eligiblePersonnelFiles[0].targetMaskName,
                typeInheritanceGuid: eligiblePersonnelFiles[0].inheritanceGuid
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_InquirePersonnelFileAccess", configAction, []).then(function success(jsonResults) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("get active node 'Access' (id = 29) of workflow", function (done) {
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
                expect(userNodeId).toEqual(29);
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("'Delete file' forwarding Workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.hr.personnel.node.inquiry.endinquiry");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Delete file'").then(function success1(forwardWorkflowTaskResult) {
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
      describe("'Request access' -> 'Approval' (set review) -> 'Approve request for access' -> 'Delete file'", function () {
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
        describe("test finish inquirepersonalfileaccess", function () {
          it("get eligible personnel files", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetEligiblePersonnelFiles", {}).then(function success(eligiblePersonnelFiles1) {
                eligiblePersonnelFiles = eligiblePersonnelFiles1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("eligiblePersonnelFiles must be available", function () {
            expect(eligiblePersonnelFiles).toBeDefined();
          });
          it("eligiblePersonnelFiles.length must greater than zero", function () {
            expect(eligiblePersonnelFiles.length).toBeGreaterThan(0);
          });
          it("start action inquiry employee workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: eligiblePersonnelFiles[0].id,
                typeRequester: eligiblePersonnelFiles[0].requester,
                typeSource: eligiblePersonnelFiles[0].source,
                typeSourceName: eligiblePersonnelFiles[0].sourceName,
                typeName: eligiblePersonnelFiles[0].name,
                typeDescription: eligiblePersonnelFiles[0].desc,
                typeShortdesc: eligiblePersonnelFiles[0].shortdesc,
                typeMask: eligiblePersonnelFiles[0].mask,
                typeWorkflow: eligiblePersonnelFiles[0].workflow,
                typeTargetMaskName: eligiblePersonnelFiles[0].targetMaskName,
                typeInheritanceGuid: eligiblePersonnelFiles[0].inheritanceGuid
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_InquirePersonnelFileAccess", configAction, []).then(function success(jsonResults) {
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
          it("set review mapfield", function (done) {
            expect(function () {
              test.Utils.updateMapData(wfInfo.objId, { HR_FILE_REVIEW_ACTIVE: 1 }).then(function success(updateMapDataResult) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("get active node 'Personnel' (id = 51) of workflow", function (done) {
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
                expect(userNodeId).toEqual(51);
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("'Approve request for access' forwarding Workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.ok");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Approve request for access'").then(function success1(forwardWorkflowTaskResult) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("get active node 'Access' (id = 29) of workflow", function (done) {
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
                expect(userNodeId).toEqual(29);
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("'Delete file' forwarding Workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.hr.personnel.node.inquiry.endinquiry");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Delete file'").then(function success1(forwardWorkflowTaskResult) {
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
      describe("'Request access' -> 'Approval' (set review) -> 'Cancel'", function () {
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
        describe("test finish inquirepersonalfileaccess", function () {
          it("get eligible personnel files", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetEligiblePersonnelFiles", {}).then(function success(eligiblePersonnelFiles1) {
                eligiblePersonnelFiles = eligiblePersonnelFiles1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("eligiblePersonnelFiles must be available", function () {
            expect(eligiblePersonnelFiles).toBeDefined();
          });
          it("eligiblePersonnelFiles.length must greater than zero", function () {
            expect(eligiblePersonnelFiles.length).toBeGreaterThan(0);
          });
          it("start action inquiry employee workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: eligiblePersonnelFiles[0].id,
                typeRequester: eligiblePersonnelFiles[0].requester,
                typeSource: eligiblePersonnelFiles[0].source,
                typeSourceName: eligiblePersonnelFiles[0].sourceName,
                typeName: eligiblePersonnelFiles[0].name,
                typeDescription: eligiblePersonnelFiles[0].desc,
                typeShortdesc: eligiblePersonnelFiles[0].shortdesc,
                typeMask: eligiblePersonnelFiles[0].mask,
                typeWorkflow: eligiblePersonnelFiles[0].workflow,
                typeTargetMaskName: eligiblePersonnelFiles[0].targetMaskName,
                typeInheritanceGuid: eligiblePersonnelFiles[0].inheritanceGuid
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_InquirePersonnelFileAccess", configAction, []).then(function success(jsonResults) {
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
          it("set review mapfield", function (done) {
            expect(function () {
              test.Utils.updateMapData(wfInfo.objId, { HR_FILE_REVIEW_ACTIVE: 1 }).then(function success(updateMapDataResult) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("setTimeout (wait for elo as)", function (done) {
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
          it("get active node 'Personnel' (id = 51) of workflow", function (done) {
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
                expect(userNodeId).toEqual(51);
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("'Cancel' forwarding Workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.cancel");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Cancel'").then(function success1(forwardWorkflowTaskResult) {
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
      describe("'Request access' -> 'Reject request' -> 'OK'", function () {
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
        describe("test finish inquirepersonalfileaccess", function () {
          it("get eligible personnel files", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetEligiblePersonnelFiles", {}).then(function success(eligiblePersonnelFiles1) {
                eligiblePersonnelFiles = eligiblePersonnelFiles1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("eligiblePersonnelFiles must be available", function () {
            expect(eligiblePersonnelFiles).toBeDefined();
          });
          it("eligiblePersonnelFiles.length must greater than zero", function () {
            expect(eligiblePersonnelFiles.length).toBeGreaterThan(0);
          });
          it("start action inquiry employee workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: eligiblePersonnelFiles[0].id,
                typeRequester: eligiblePersonnelFiles[0].requester,
                typeSource: eligiblePersonnelFiles[0].source,
                typeSourceName: eligiblePersonnelFiles[0].sourceName,
                typeName: eligiblePersonnelFiles[0].name,
                typeDescription: eligiblePersonnelFiles[0].desc,
                typeShortdesc: eligiblePersonnelFiles[0].shortdesc,
                typeMask: eligiblePersonnelFiles[0].mask,
                typeWorkflow: eligiblePersonnelFiles[0].workflow,
                typeTargetMaskName: eligiblePersonnelFiles[0].targetMaskName,
                typeInheritanceGuid: eligiblePersonnelFiles[0].inheritanceGuid
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_InquirePersonnelFileAccess", configAction, []).then(function success(jsonResults) {
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
          it("'Reject request' forwarding Workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.reject");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Reject request'").then(function success1(forwardWorkflowTaskResult) {
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
          it("get active node 'Info' (id = 30) of workflow", function (done) {
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
                expect(userNodeId).toEqual(30);
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("'OK' forwarding Workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.ok");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'OK'").then(function success1(forwardWorkflowTaskResult) {
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
      describe("'Request access' -> 'Reject request' -> 'Request access again' -> 'Cancel'", function () {
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
        describe("test finish inquirepersonalfileaccess", function () {
          it("get eligible personnel files", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetEligiblePersonnelFiles", {}).then(function success(eligiblePersonnelFiles1) {
                eligiblePersonnelFiles = eligiblePersonnelFiles1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("eligiblePersonnelFiles must be available", function () {
            expect(eligiblePersonnelFiles).toBeDefined();
          });
          it("eligiblePersonnelFiles.length must greater than zero", function () {
            expect(eligiblePersonnelFiles.length).toBeGreaterThan(0);
          });
          it("start action inquiry employee workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: eligiblePersonnelFiles[0].id,
                typeRequester: eligiblePersonnelFiles[0].requester,
                typeSource: eligiblePersonnelFiles[0].source,
                typeSourceName: eligiblePersonnelFiles[0].sourceName,
                typeName: eligiblePersonnelFiles[0].name,
                typeDescription: eligiblePersonnelFiles[0].desc,
                typeShortdesc: eligiblePersonnelFiles[0].shortdesc,
                typeMask: eligiblePersonnelFiles[0].mask,
                typeWorkflow: eligiblePersonnelFiles[0].workflow,
                typeTargetMaskName: eligiblePersonnelFiles[0].targetMaskName,
                typeInheritanceGuid: eligiblePersonnelFiles[0].inheritanceGuid
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_InquirePersonnelFileAccess", configAction, []).then(function success(jsonResults) {
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
          it("'Reject request' forwarding Workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.reject");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Reject request'").then(function success1(forwardWorkflowTaskResult) {
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
          it("get active node 'Info' (id = 30) of workflow", function (done) {
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
                expect(userNodeId).toEqual(30);
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("'Request access again' forwarding Workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.hr.personnel.node.inquiry.repeat");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Request access again'").then(function success1(forwardWorkflowTaskResult) {
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
          it("get active node 'Data entry' (id = 1) of workflow", function (done) {
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
                expect(userNodeId).toEqual(1);
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("'Cancel' forwarding Workflow", function (done) {
            expect(function () {
              test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
                succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.cancel");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Cancel'").then(function success1(forwardWorkflowTaskResult) {
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
        describe("test cancel inquirepersonalfileaccess", function () {
          it("get eligible personnel files", function (done) {
            expect(function () {
              test.Utils.execute("RF_sol_hr_service_GetEligiblePersonnelFiles", {}).then(function success(eligiblePersonnelFiles1) {
                eligiblePersonnelFiles = eligiblePersonnelFiles1;
                done();
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            }).not.toThrow();
          });
          it("eligiblePersonnelFiles must be available", function () {
            expect(eligiblePersonnelFiles).toBeDefined();
          });
          it("eligiblePersonnelFiles.length must greater than zero", function () {
            expect(eligiblePersonnelFiles.length).toBeGreaterThan(0);
          });
          it("start action inquiry employee workflow", function (done) {
            expect(function () {
              configAction = {
                typeId: eligiblePersonnelFiles[0].id,
                typeRequester: eligiblePersonnelFiles[0].requester,
                typeSource: eligiblePersonnelFiles[0].source,
                typeSourceName: eligiblePersonnelFiles[0].sourceName,
                typeName: eligiblePersonnelFiles[0].name,
                typeDescription: eligiblePersonnelFiles[0].desc,
                typeShortdesc: eligiblePersonnelFiles[0].shortdesc,
                typeMask: eligiblePersonnelFiles[0].mask,
                typeWorkflow: eligiblePersonnelFiles[0].workflow,
                typeTargetMaskName: eligiblePersonnelFiles[0].targetMaskName,
                typeInheritanceGuid: eligiblePersonnelFiles[0].inheritanceGuid
              };
              wfInfo = {};
              test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_InquirePersonnelFileAccess", configAction, []).then(function success(jsonResults) {
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