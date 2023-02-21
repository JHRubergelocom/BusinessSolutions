
describe("[action] sol.recruiting.ix.actions.CreateRequisition", function () {
  var objTempId, requisitionTypes,
      configTypes, configAction, wfInfo, succNodes, succNodesIds,
      userNode, nodes, userNodeId, subWfs, subWorkflows, key, i, j,
      subWf, subWfFlowId, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.CreateRequisition", null, null).then(function success(objTempId1) {
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
  describe("test create requisition", function () {
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
    it("requisitionTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Requisition types"
        }
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(requisitionTypes1) {
        requisitionTypes = requisitionTypes1;
        expect(requisitionTypes).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("requisitionTypes.length must greater than zero", function () {
      expect(requisitionTypes.length).toBeGreaterThan(0);
    });
  });
  describe("test finish createrequisition without DynAdHoc Approval", function () {
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          $name: "CreateRequisition",
          objId: objTempId,
          $metadata: {
            solType: "RECRUITING_REQUISITION",
            owner: {
              fromConnection: true
            },
            objKeys: []
          },
          $wf: {
            template: {
              key: "RECRUITING_WF"
            },
            name: "sol.recruiting.requisition.workflow.create.message"
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
            copySource: false,
            inherit: {
              fromDirectParent: false
            }
          },
          $new: {
            target: {
              mode: "DEFAULT"
            },
            template: {
              base: "ARCPATH:/Administration/Business Solutions/recruiting/Configuration/Requisition types",
              name: requisitionTypes[0].name
            },
            name: "Temporary Requisition"
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
    it("wfInfo.flowId must be available", function () {
      expect(wfInfo.flowId).toBeDefined();
    });
    it("wfInfo.nodeId must be available", function () {
      expect(wfInfo.nodeId).toBeDefined();
    });
    it("wfInfo.objId must be available", function () {
      expect(wfInfo.objId).toBeDefined();
    });
    it("fill requisition sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordR) {
          test.Utils.updateKeywording(sordR, { RECRUITING_REQUISITION_NAME: "MSD", RECRUITING_REQUISITION_DESC: "Master of Desaster" }, true).then(function success1(updateKeywordingResult) {
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
    it("remove workflows", function (done) {
      expect(function () {
        test.Utils.getFinishedWorkflows(wfInfo.objId).then(function success(wfs) {
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
    it("remove requisition object", function (done) {
      expect(function () {
        test.Utils.deleteSord(wfInfo.objId).then(function success6(deleteResult5) {
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
  describe("test cancel createrequisition", function () {
    it("start action create workflow", function (done) {
      expect(function () {
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
    it("fill recruiting sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordR) {
          test.Utils.updateKeywording(sordR, { RECRUITING_REQUISITION_NAME: "EZ", RECRUITING_REQUISITION_DESC: "Erbsenzähler" }, true).then(function success1(updateKeywordingResult) {
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
        test.Utils.getFinishedWorkflows(wfInfo.objId).then(function success(wfs) {
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
  });
  describe("test finish createrequisition -> 'Approval Confirm' -> 'Completion Confirm' without ad-hoc workflow start", function () {
    it("start action create workflow", function (done) {
      expect(function () {
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
    it("fill requisition sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordR) {
          test.Utils.updateKeywording(sordR, { RECRUITING_REQUISITION_NAME: "MSD", RECRUITING_REQUISITION_DESC: "Master of Desaster" }, true).then(function success1(updateKeywordingResult) {
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
    it("set DynAdHoc Approval", function (done) {
      expect(function () {
        test.Utils.updateMapData(wfInfo.objId, { RECRUITING_REQUISITION_DYNADHOC_ACTIVE: 1, USER_ROLE_NAME: "STAFFINGREQUIREMENTAPPROVAL" }).then(function success(updateMapDataResult) {
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
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input", true).then(function success1(forwardWorkflowTaskResult) {
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
    it("get active node 'Requisition approved' (id = 54) of Workflow", function (done) {
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
          expect(userNodeId).toEqual(54);
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
          test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Confirm'", true).then(function success1(forwardWorkflowTaskResult) {
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
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove requisition object", function (done) {
      expect(function () {
        test.Utils.deleteSord(wfInfo.objId).then(function success6(deleteResult5) {
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
  describe("test finish createrequisition -> 'Approval Reject' -> 'Completion Confirm' without ad-hoc workflow start", function () {
    it("start action create workflow", function (done) {
      expect(function () {
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
    it("fill requisition sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordR) {
          test.Utils.updateKeywording(sordR, { RECRUITING_REQUISITION_NAME: "PS", RECRUITING_REQUISITION_DESC: "Papiersortierer" }, true).then(function success1(updateKeywordingResult) {
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
    it("set DynAdHoc Approval", function (done) {
      expect(function () {
        test.Utils.updateMapData(wfInfo.objId, { RECRUITING_REQUISITION_DYNADHOC_ACTIVE: 1, USER_ROLE_NAME: "STAFFINGREQUIREMENTAPPROVAL" }).then(function success(updateMapDataResult) {
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
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input", true).then(function success1(forwardWorkflowTaskResult) {
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
    it("get active node 'Requisition approved' (id = 54) of Workflow", function (done) {
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
          expect(userNodeId).toEqual(54);
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
          test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Reject'", true).then(function success1(forwardWorkflowTaskResult) {
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
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove requisition object", function (done) {
      expect(function () {
        test.Utils.deleteSord(wfInfo.objId).then(function success6(deleteResult5) {
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
  describe("test finish createrequisition -> 'Approval Confirm' -> 'Subworkwflow Approve' -> 'Completion Confirm' with ad-hoc workflow start", function () {
    it("start action create workflow", function (done) {
      expect(function () {
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
    it("fill requisition sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordR) {
          test.Utils.updateKeywording(sordR, { RECRUITING_REQUISITION_NAME: "DBB", RECRUITING_REQUISITION_DESC: "Dünnbrettbohrer" }, true).then(function success1(updateKeywordingResult) {
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
    it("set DynAdHoc Approval", function (done) {
      expect(function () {
        test.Utils.updateMapData(wfInfo.objId, { RECRUITING_REQUISITION_DYNADHOC_ACTIVE: 1, USER_ROLE_NAME: "REQUISITIONAPPROVAL" }).then(function success(updateMapDataResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("set hiring manager", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordR) {
          test.Utils.updateKeywording(sordR, { RECRUITING_REQUISITION_HIRINGMANAGER: "Administrator" }, true).then(function success1(updateKeywordingResult) {
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
    it("finish input forwarding workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input", true).then(function success1(forwardWorkflowTaskResult) {
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
    it("get active node 'Approval' (id = 3) of Subworkflow 'sol.recruiting.Requisition.DynAdHoc'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          subWfs = [];
          subWorkflows = workflow.subWorkflows;
          for (key in subWorkflows) {
            subWfs.push(subWorkflows[key]);
          }
          for (i = 0; i < subWfs.length; i++) {
            if (subWfs[i].templateName == "sol.recruiting.Requisition.DynAdHoc") {
              subWf = subWfs[i];
              subWfFlowId = subWf.id;
              nodes = test.Utils.getActiveUserNodes(subWf);
              if (nodes.length > 0) {
                for (j = 0; j < nodes.length; j++) {
                  if (nodes[j].nameTranslationKey == "sol.recruiting.node.requisition.approval") {
                    userNode = nodes[j];
                    userNodeId = userNode.id;
                  }
                }
                // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
              } else {
                // alert("no userNodes available");
              }
            }
          }
          userNodeId = 3;
          expect(userNodeId).toEqual(3);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("'Approve' forwarding Subworkflow 'sol.recruiting.Requisition.DynAdHoc'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(subWfFlowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.approve");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(subWfFlowId, userNodeId, succNodesIds, "Unittest 'Approve'", true).then(function success1(forwardWorkflowTaskResult) {
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
    it("get active node 'Requisition approved' (id = 54) of Workflow", function (done) {
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
          expect(userNodeId).toEqual(54);
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
          test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Confirm'", true).then(function success1(forwardWorkflowTaskResult) {
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
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove requisition object", function (done) {
      expect(function () {
        test.Utils.deleteSord(wfInfo.objId).then(function success6(deleteResult5) {
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
  describe("test finish createrequisition -> 'Approval Confirm' -> 'Subworkwflow Reject' -> 'Completion Reject' with ad-hoc workflow start", function () {
    it("start action create workflow", function (done) {
      expect(function () {
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
    it("fill requisition sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordR) {
          test.Utils.updateKeywording(sordR, { RECRUITING_REQUISITION_NAME: "HS", RECRUITING_REQUISITION_DESC: "Hochstapler" }, true).then(function success1(updateKeywordingResult) {
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
    it("set DynAdHoc Approval", function (done) {
      expect(function () {
        test.Utils.updateMapData(wfInfo.objId, { RECRUITING_REQUISITION_DYNADHOC_ACTIVE: 1, USER_ROLE_NAME: "REQUISITIONAPPROVAL" }).then(function success(updateMapDataResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("set hiring manager", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordR) {
          test.Utils.updateKeywording(sordR, { RECRUITING_REQUISITION_HIRINGMANAGER: "Administrator" }, true).then(function success1(updateKeywordingResult) {
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
    it("finish input forwarding workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input", true).then(function success1(forwardWorkflowTaskResult) {
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
    it("get active node 'Approval' (id = 3) of Subworkflow 'sol.recruiting.Requisition.DynAdHoc'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          subWfs = [];
          subWorkflows = workflow.subWorkflows;
          for (key in subWorkflows) {
            subWfs.push(subWorkflows[key]);
          }
          for (i = 0; i < subWfs.length; i++) {
            if (subWfs[i].templateName == "sol.recruiting.Requisition.DynAdHoc") {
              subWf = subWfs[i];
              subWfFlowId = subWf.id;
              nodes = test.Utils.getActiveUserNodes(subWf);
              if (nodes.length > 0) {
                for (j = 0; j < nodes.length; j++) {
                  if (nodes[j].nameTranslationKey == "sol.recruiting.node.requisition.approval") {
                    userNode = nodes[j];
                    userNodeId = userNode.id;
                  }
                }
                // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
              } else {
                // alert("no userNodes available");
              }
            }
          }
          userNodeId = 3;
          expect(userNodeId).toEqual(3);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("'Reject' forwarding Subworkflow 'sol.recruiting.Requisition.DynAdHoc'", function (done) {
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
    it("get active node 'Requisition rejected' (id = 72) of Workflow", function (done) {
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
          expect(userNodeId).toEqual(72);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("'Resubmit for approval' forwarding Workflow", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.recruiting.node.retryApproval");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Retry Approval'", true).then(function success1(forwardWorkflowTaskResult) {
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
    it("get active node 'Approval' (id = 3) of Subworkflow 'sol.recruiting.Requisition.DynAdHoc'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
          subWfs = [];
          subWorkflows = workflow.subWorkflows;
          for (key in subWorkflows) {
            subWfs.push(subWorkflows[key]);
          }
          for (i = 0; i < subWfs.length; i++) {
            if (subWfs[i].templateName == "sol.recruiting.Requisition.DynAdHoc") {
              subWf = subWfs[i];
              subWfFlowId = subWf.id;
              nodes = test.Utils.getActiveUserNodes(subWf);
              if (nodes.length > 0) {
                for (j = 0; j < nodes.length; j++) {
                  if (nodes[j].nameTranslationKey == "sol.recruiting.node.requisition.approval") {
                    userNode = nodes[j];
                    userNodeId = userNode.id;
                  }
                }
                // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
              } else {
                // alert("no userNodes available");
              }
            }
          }
          userNodeId = 3;
          expect(userNodeId).toEqual(3);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("'Reject' forwarding Subworkflow 'sol.recruiting.Requisition.DynAdHoc'", function (done) {
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
    it("get active node 'Requisition rejected' (id = 72) of Workflow", function (done) {
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
          expect(userNodeId).toEqual(72);
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
          test.Utils.forwardWorkflowTask(wfInfo.flowId, userNodeId, succNodesIds, "Unittest 'Cancel'", true).then(function success1(forwardWorkflowTaskResult) {
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
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove requisition object", function (done) {
      expect(function () {
        test.Utils.deleteSord(wfInfo.objId).then(function success6(deleteResult5) {
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