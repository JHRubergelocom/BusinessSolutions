
describe("[action] sol.privacy.ix.actions.Delegate", function () {
  var objTempId, processingActivityTypes,
      configTypes, configAction, wfInfo, objIdP,
      succNodes, succNodesIds, originalTimeout,
      userNodes, nodeIdUserProcessing;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.Delegate", null, null).then(function success(objTempId1) {
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
  describe("test start delegate", function () {
    it("should not throw if executed without parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_action_Standard", {
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
    describe("'OK'", function () {
      describe("create processing activity", function () {
        it("processingActivityTypes must be available", function (done) {
          configTypes = {
            $types: {
              path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/privacy/Configuration/Processing activity types"
            }
          };
          test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(processingActivityTypes1) {
            processingActivityTypes = processingActivityTypes1;
            expect(processingActivityTypes).toBeDefined();
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
              objId: objTempId,
              $new: {
                target: {
                  mode: "DEFAULT"
                },
                name: "{{translate 'sol.gdpr.processingactivity.create.workflow.name'}}",
                template: {
                  base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/privacy/Configuration/Processing activity types",
                  name: processingActivityTypes[0].name
                }
              },
              $name: "sol.privacy.gdpr.processingactivity.create",
              $wf: {
                name: "{{translate 'sol.gdpr.processingactivity.create.workflow.name'}}",
                template: {
                  name: "sol.privacy.gdpr.processingactivity.create"
                }
              },
              $events: [
                {
                  id: "DIALOG",
                  onWfStatus: ""
                },
                {
                  id: "GOTO",
                  onWfStatus: "CREATED"
                }
              ],
              $permissions: {
                mode: "SET",
                copySource: true,
                inherit: {
                  fromDirectParent: false
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
        it("fill process activity sord", function (done) {
          expect(function () {
            test.Utils.getSord(wfInfo.objId).then(function success(sordP) {
              objIdP = wfInfo.objId;
              test.Utils.updateKeywording(sordP, { PROC_ACTIVITY_CHANGED_DATE: "20191120", PROC_ACTIVITY_DESCRIPTION: "Activität1", PROC_ACTIVITY_RESPONSIBLE_DEPARTMENT: "15 Abteilung A" }, true).then(function success1(updateKeywordingResult) {
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
      });
      describe("test finish delegate", function () {
        it("check preconditions", function (done) {
          test.Utils.execute("RF_sol_privacy_service_DelegateProcessingActivityPreconditions", { targetId: objIdP }).then(function success(result) {
            expect(result.valid).toBeDefined();
            expect(result.valid).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        });
        it("start action delegate workflow", function (done) {
          expect(function () {
            configAction = {
              objId: objIdP,
              $name: "sol.privacy.gdpr.processingactivity.delegate",
              $wf: {
                name: "{{translate 'sol.gdpr.processingactivity.delegate.workflow.name'}}",
                template: {
                  name: "sol.privacy.gdpr.processingactivity.delegate"
                }
              },
              $events: [
                {
                  id: "DIALOG",
                  onWfStatus: "",
                  message: ""
                },
                {
                  id: "FEEDBACK",
                  onWfStatus: "DELEGATE",
                  message: "{{translate 'sol.gdpr.client.processingactivity.delegate.msg'}}"
                },
                {
                  id: "GOTO",
                  onWfStatus: "CREATED"
                }
              ]
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
        it("wfInfo.flowId must be available", function () {
          expect(wfInfo.flowId).toBeDefined();
        });
        it("wfInfo.nodeId must be available", function () {
          expect(wfInfo.nodeId).toBeDefined();
        });
        it("wfInfo.objId must be available", function () {
          expect(wfInfo.objId).toBeDefined();
        });
        it("fill processing activity sord", function (done) {
          expect(function () {
            test.Utils.updateWfMapData(wfInfo.flowId, wfInfo.objId, { DELEGATE_USER: "Administrator" }).then(function success1(updateMapDataResult) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
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
        it("data entry delegated workflow", function (done) {
          expect(function () {
            test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
              userNodes = test.Utils.getActiveUserNodes(workflow);
              if (userNodes.length > 0) {
                nodeIdUserProcessing = userNodes[0].id;
                succNodes = test.Utils.getSuccessorNodes(workflow, nodeIdUserProcessing, null, "sol.gdpr.processingactivity.wf.node.handback");
                succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
                test.Utils.forwardWorkflowTask(wfInfo.flowId, nodeIdUserProcessing, succNodesIds, "Unittest delegate handback").then(function success3(forwardWorkflowTaskResult1) {
                  done();
                }, function error(err) {
                  fail(err);
                  console.error(err);
                  done();
                }
                );
              }
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("delegate finished delegated workflow", function (done) {
          expect(function () {
            test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
              succNodes = test.Utils.getSuccessorNodes(workflow, 10, null, "sol.common.wf.node.confirm");
              succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
              test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest delegate confirm").then(function success1(forwardWorkflowTaskResult) {
                done();
              }, function error(err) {
                // fail(err);
                console.error(err);
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
        it("remove active workflows", function (done) {
          expect(function () {
            test.Utils.getActiveWorkflows().then(function success(wfs) {
              test.Utils.removeActiveWorkflows(wfs).then(function success1(removeActiveWorkflowsResult) {
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
        it("remove processing activity ", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdP).then(function success(deleteResult) {
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
      describe("create processing activity", function () {
        it("processingActivityTypes must be available", function (done) {
          configTypes = {
            $types: {
              path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/privacy/Configuration/Processing activity types"
            }
          };
          test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(processingActivityTypes1) {
            processingActivityTypes = processingActivityTypes1;
            expect(processingActivityTypes).toBeDefined();
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
              objId: objTempId,
              $new: {
                target: {
                  mode: "DEFAULT"
                },
                name: "{{translate 'sol.gdpr.processingactivity.create.workflow.name'}}",
                template: {
                  base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/privacy/Configuration/Processing activity types",
                  name: processingActivityTypes[0].name
                }
              },
              $name: "sol.privacy.gdpr.processingactivity.create",
              $wf: {
                name: "{{translate 'sol.gdpr.processingactivity.create.workflow.name'}}",
                template: {
                  name: "sol.privacy.gdpr.processingactivity.create"
                }
              },
              $events: [
                {
                  id: "DIALOG",
                  onWfStatus: ""
                },
                {
                  id: "GOTO",
                  onWfStatus: "CREATED"
                }
              ],
              $permissions: {
                mode: "SET",
                copySource: true,
                inherit: {
                  fromDirectParent: false
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
        it("fill process activity sord", function (done) {
          expect(function () {
            test.Utils.getSord(wfInfo.objId).then(function success(sordP) {
              objIdP = wfInfo.objId;
              test.Utils.updateKeywording(sordP, { PROC_ACTIVITY_CHANGED_DATE: "20191120", PROC_ACTIVITY_DESCRIPTION: "Activität1", PROC_ACTIVITY_RESPONSIBLE_DEPARTMENT: "15 Abteilung A" }, true).then(function success1(updateKeywordingResult) {
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
      });
      describe("test cancel delegate", function () {
        it("check preconditions", function (done) {
          test.Utils.execute("RF_sol_privacy_service_DelegateProcessingActivityPreconditions", { targetId: objIdP }).then(function success(result) {
            expect(result.valid).toBeDefined();
            expect(result.valid).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        });
        it("start action delegate workflow", function (done) {
          expect(function () {
            configAction = {
              objId: objIdP,
              $name: "sol.privacy.gdpr.processingactivity.delegate",
              $wf: {
                name: "{{translate 'sol.gdpr.processingactivity.delegate.workflow.name'}}",
                template: {
                  name: "sol.privacy.gdpr.processingactivity.delegate"
                }
              },
              $events: [
                {
                  id: "DIALOG",
                  onWfStatus: "",
                  message: ""
                },
                {
                  id: "FEEDBACK",
                  onWfStatus: "DELEGATE",
                  message: "{{translate 'sol.gdpr.client.processingactivity.delegate.msg'}}"
                },
                {
                  id: "GOTO",
                  onWfStatus: "CREATED"
                }
              ]
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
        it("wfInfo.flowId must be available", function () {
          expect(wfInfo.flowId).toBeDefined();
        });
        it("wfInfo.nodeId must be available", function () {
          expect(wfInfo.nodeId).toBeDefined();
        });
        it("wfInfo.objId must be available", function () {
          expect(wfInfo.objId).toBeDefined();
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
        it("remove processing activity ", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdP).then(function success(deleteResult) {
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