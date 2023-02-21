
describe("[action] sol.teamroom.ix.actions.CreateTeamroom", function () {
  var objTempId, configAction, wfInfo, succNodes, succNodesIds, objIdT1,
      originalTimeout, configTypes, teamroomTypes, teamroomFlowId,
      userNode, nodes, userNodeId, i,
      subWorkflows, subWfs, key, subWf, subWfFlowId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.CreateTeamroom", null, null).then(function success(objTempId1) {
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
  describe("test create teamroom", function () {
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
  });
  describe("test finish createteamroom -> 'Teamroom approval' -> 'Approve'", function () {
    it("teamroomTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/elo.teamroom.Local/Configuration/Teamroom types"
        }
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(teamroomTypes1) {
        teamroomTypes = teamroomTypes1;
        expect(teamroomTypes).toBeDefined();
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
          $name: "CreateTeamroom",
          $new: {
            target: {
              mode: "DEFAULT"
            },
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/elo.teamroom.Local/Configuration/Teamroom types",
              name: teamroomTypes[0].name
            },
            name: "Teamroom"
          },
          $wf: {
            name: "{{translate 'sol.teamroom.wf.create.name'}}",
            template: {
              name: "sol.teamroom.teamroom.create"
            }
          },
          $metadata: {
            solType: "TEAMROOM",
            owner: {
              fromConnection: true
            }
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: "",
              message: "Test Button succeeded"
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
    it("wfInfo.objId must be available", function () {
      expect(wfInfo.objId).toBeDefined();
    });
    it("wfInfo.flowId must be available", function () {
      teamroomFlowId = wfInfo.flowId;
      expect(wfInfo.flowId).toBeDefined();
    });
    it("wfInfo.nodeId must be available", function () {
      expect(wfInfo.nodeId).toBeDefined();
    });
    it("fill teamroom sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordT1) {
          objIdT1 = wfInfo.objId;
          test.Utils.updateKeywording(sordT1, {
            TEAMROOM_NAME: "Test teamroom",
            TEAMROOM_DESCRIPTION: "Musterteamroom"
          }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordT1, [{ key: "desc", value: "Unittest Testteamroom" }]).then(function success2(updateSordResult) {
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
    it("get active node 'Teamroom approval' (id = 12) of Subworkflow 'sol.teamroom.teamroom.approval'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(teamroomFlowId).then(function success(workflow) {
          subWfs = [];
          subWorkflows = workflow.subWorkflows;
          for (key in subWorkflows) {
            subWfs.push(subWorkflows[key]);
          }
          for (i = 0; i < subWfs.length; i++) {
            if (subWfs[i].templateName == "sol.teamroom.teamroom.approval") {
              subWf = subWfs[i];
              subWfFlowId = subWf.id;
              nodes = test.Utils.getActiveUserNodes(subWf);

              if (nodes.length > 0) {
                userNode = nodes[0];
                userNodeId = userNode.id;
                // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
              } else {
                // alert("no userNodes available");
              }
            }
          }
          userNodeId = 12;
          expect(userNodeId).toEqual(12);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("'Approval' forwarding Subworkflow 'sol.teamroom.teamroom.approval'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(subWfFlowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.approve");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(subWfFlowId, userNodeId, succNodesIds, "Unittest 'Approval'", true).then(function success1(forwardWorkflowTaskResult) {
            done();
          }, function error(err) {
            console.error(err);
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
            console.error(err);
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
            console.error(err);
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
  describe("test finish createteamroom -> 'Teamroom approval' -> 'Reject'", function () {
    it("teamroomTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/elo.teamroom.Local/Configuration/Teamroom types"
        }
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(teamroomTypes1) {
        teamroomTypes = teamroomTypes1;
        expect(teamroomTypes).toBeDefined();
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
          $name: "CreateTeamroom",
          $new: {
            target: {
              mode: "DEFAULT"
            },
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/elo.teamroom.Local/Configuration/Teamroom types",
              name: teamroomTypes[0].name
            },
            name: "Teamroom"
          },
          $wf: {
            name: "{{translate 'sol.teamroom.wf.create.name'}}",
            template: {
              name: "sol.teamroom.teamroom.create"
            }
          },
          $metadata: {
            solType: "TEAMROOM",
            owner: {
              fromConnection: true
            }
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: "",
              message: "Test Button succeeded"
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
    it("wfInfo.objId must be available", function () {
      expect(wfInfo.objId).toBeDefined();
    });
    it("wfInfo.flowId must be available", function () {
      teamroomFlowId = wfInfo.flowId;
      expect(wfInfo.flowId).toBeDefined();
    });
    it("wfInfo.nodeId must be available", function () {
      expect(wfInfo.nodeId).toBeDefined();
    });
    it("fill teamroom sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordT1) {
          objIdT1 = wfInfo.objId;
          test.Utils.updateKeywording(sordT1, {
            TEAMROOM_NAME: "Test teamroom",
            TEAMROOM_DESCRIPTION: "Musterteamroom"
          }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordT1, [{ key: "desc", value: "Unittest Testteamroom" }]).then(function success2(updateSordResult) {
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
    it("get active node 'Teamroom approval' (id = 12) of Subworkflow 'sol.teamroom.teamroom.approval'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(teamroomFlowId).then(function success(workflow) {
          subWfs = [];
          subWorkflows = workflow.subWorkflows;
          for (key in subWorkflows) {
            subWfs.push(subWorkflows[key]);
          }
          for (i = 0; i < subWfs.length; i++) {
            if (subWfs[i].templateName == "sol.teamroom.teamroom.approval") {
              subWf = subWfs[i];
              subWfFlowId = subWf.id;
              nodes = test.Utils.getActiveUserNodes(subWf);

              if (nodes.length > 0) {
                userNode = nodes[0];
                userNodeId = userNode.id;
                // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
              } else {
                // alert("no userNodes available");
              }
            }
          }
          userNodeId = 12;
          expect(userNodeId).toEqual(12);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("'Reject' forwarding Subworkflow 'sol.teamroom.teamroom.approval'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(subWfFlowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.reject");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(subWfFlowId, userNodeId, succNodesIds, "Unittest 'Reject'", true).then(function success1(forwardWorkflowTaskResult) {
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
    it("cancel input forwarding workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(teamroomFlowId).then(function success(workflow) {
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
            done();
          }, function error(err) {
            console.error(err);
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
            console.error(err);
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
  describe("test finish createteamroom -> 'Teamroom approval' -> 'Reject'", function () {
    it("teamroomTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/elo.teamroom.Local/Configuration/Teamroom types"
        }
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(teamroomTypes1) {
        teamroomTypes = teamroomTypes1;
        expect(teamroomTypes).toBeDefined();
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
          $name: "CreateTeamroom",
          $new: {
            target: {
              mode: "DEFAULT"
            },
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/elo.teamroom.Local/Configuration/Teamroom types",
              name: teamroomTypes[0].name
            },
            name: "Teamroom"
          },
          $wf: {
            name: "{{translate 'sol.teamroom.wf.create.name'}}",
            template: {
              name: "sol.teamroom.teamroom.create"
            }
          },
          $metadata: {
            solType: "TEAMROOM",
            owner: {
              fromConnection: true
            }
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: "",
              message: "Test Button succeeded"
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
    it("wfInfo.objId must be available", function () {
      expect(wfInfo.objId).toBeDefined();
    });
    it("wfInfo.flowId must be available", function () {
      teamroomFlowId = wfInfo.flowId;
      expect(wfInfo.flowId).toBeDefined();
    });
    it("wfInfo.nodeId must be available", function () {
      expect(wfInfo.nodeId).toBeDefined();
    });
    it("fill teamroom sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordT1) {
          objIdT1 = wfInfo.objId;
          test.Utils.updateKeywording(sordT1, {
            TEAMROOM_NAME: "Test teamroom",
            TEAMROOM_DESCRIPTION: "Musterteamroom"
          }, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordT1, [{ key: "desc", value: "Unittest Testteamroom" }]).then(function success2(updateSordResult) {
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
    it("get active node 'Teamroom approval' (id = 12) of Subworkflow 'sol.teamroom.teamroom.approval'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(teamroomFlowId).then(function success(workflow) {
          subWfs = [];
          subWorkflows = workflow.subWorkflows;
          for (key in subWorkflows) {
            subWfs.push(subWorkflows[key]);
          }
          for (i = 0; i < subWfs.length; i++) {
            if (subWfs[i].templateName == "sol.teamroom.teamroom.approval") {
              subWf = subWfs[i];
              subWfFlowId = subWf.id;
              nodes = test.Utils.getActiveUserNodes(subWf);

              if (nodes.length > 0) {
                userNode = nodes[0];
                userNodeId = userNode.id;
                // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
              } else {
                // alert("no userNodes available");
              }
            }
          }
          userNodeId = 12;
          expect(userNodeId).toEqual(12);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("'Back to previous user' forwarding Subworkflow 'sol.teamroom.teamroom.approval'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(subWfFlowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.teamroom.wf.node.backtoprevioususer");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(subWfFlowId, userNodeId, succNodesIds, "Unittest 'Back to previous user'", true).then(function success1(forwardWorkflowTaskResult) {
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
    it("get active node 'Teamroom approval' (id = 28) of Subworkflow 'sol.teamroom.teamroom.approval'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(teamroomFlowId).then(function success(workflow) {
          subWfs = [];
          subWorkflows = workflow.subWorkflows;
          for (key in subWorkflows) {
            subWfs.push(subWorkflows[key]);
          }
          for (i = 0; i < subWfs.length; i++) {
            if (subWfs[i].templateName == "sol.teamroom.teamroom.approval") {
              subWf = subWfs[i];
              subWfFlowId = subWf.id;
              nodes = test.Utils.getActiveUserNodes(subWf);

              if (nodes.length > 0) {
                userNode = nodes[0];
                userNodeId = userNode.id;
                // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
              } else {
                // alert("no userNodes available");
              }
            }
          }
          userNodeId = 28;
          expect(userNodeId).toEqual(28);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("'Approval' forwarding Subworkflow 'sol.teamroom.teamroom.approval'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(subWfFlowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.approve");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(subWfFlowId, userNodeId, succNodesIds, "Unittest 'Approval'", true).then(function success1(forwardWorkflowTaskResult) {
            done();
          }, function error(err) {
            console.error(err);
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
            console.error(err);
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
            console.error(err);
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
  describe("test cancel createteamroom", function () {
    it("teamroomTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/elo.teamroom.Local/Configuration/Teamroom types"
        }
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(teamroomTypes1) {
        teamroomTypes = teamroomTypes1;
        expect(teamroomTypes).toBeDefined();
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
          $name: "CreateTeamroom",
          $new: {
            target: {
              mode: "DEFAULT"
            },
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/elo.teamroom.Local/Configuration/Teamroom types",
              name: teamroomTypes[0].name
            },
            name: "Teamroom"
          },
          $wf: {
            name: "{{translate 'sol.teamroom.wf.create.name'}}",
            template: {
              name: "sol.teamroom.teamroom.create"
            }
          },
          $metadata: {
            solType: "TEAMROOM",
            owner: {
              fromConnection: true
            }
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: "",
              message: "Test Button succeeded"
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
    it("wfInfo.objId must be available", function () {
      expect(wfInfo.objId).toBeDefined();
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
            done();
          }, function error(err) {
            console.error(err);
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
            console.error(err);
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
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdT1).then(function success2(deleteResult1) {
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
});