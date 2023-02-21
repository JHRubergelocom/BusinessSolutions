/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonWfUtils", function () {
  var WfUtilsSord, originalTimeout, assocs, fromWorkflowTemplate,
      toWorkflowTemplate, nodeName, cycleNo, comment, override, flowId, force, name,
      user, params, prio, wfDiagram, objId, wfName, workflowTemplateId, workflowId, file,
      config, workflowTemplateName, findWorkflowInfo, checkoutOptions, ixConn, currentNodeId,
      destinationNodeIds, filter, wfCollectNode, nodeId, filterConfig, filterType, sord, options,
      nodes, key, workflowJson, iconName, template, workflowName, oldName, newName, startDocMaskWorkflows,
      values, status, templFlowId, node, obSolCommonWfUtilsId, workflow, succNodes, succNodesIds,
      workflowTemplate, id, flow, flowName, nodeEscalations, defaultUserName, mixinString,
      appName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonWfUtils").then(function success(obSolCommonWfUtilsId1) {
        obSolCommonWfUtilsId = obSolCommonWfUtilsId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success1(WfUtilsSord1) {
          WfUtilsSord = WfUtilsSord1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.common.WfUtils", function () {
      it("activateAssocs", function (done) {
        expect(function () {
          assocs = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "activateAssocs",
            params: [assocs]
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
      it("addSubTemplateInfo", function (done) {
        expect(function () {
          flowId = "UnittestTemplate1WF";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "addSubTemplateInfo",
            params: [flowId]
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
      it("addWorkflowTemplateVersions", function (done) {
        expect(function () {
          fromWorkflowTemplate = "UnittestTemplate1WF";
          toWorkflowTemplate = "UnittestTemplate2WF";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "addWorkflowTemplateVersions",
            params: [fromWorkflowTemplate, toWorkflowTemplate]
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
      it("addWorkflowTemplateWorkingVersion", function (done) {
        expect(function () {
          fromWorkflowTemplate = "UnittestTemplate1WF";
          toWorkflowTemplate = "UnittestTemplate2WF";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "addWorkflowTemplateWorkingVersion",
            params: [fromWorkflowTemplate, toWorkflowTemplate]
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
      it("appendCycleNumber", function (done) {
        expect(function () {
          nodeName = "Node1";
          cycleNo = 99;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "appendCycleNumber",
            params: [nodeName, cycleNo]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Node1 [[99]]");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("appendNodeComment", function (done) {
        expect(function () {
          node = {};
          comment = "Comment1";
          override = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "appendNodeComment",
            params: [node, comment, override]
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
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", obSolCommonWfUtilsId).then(function success(flowId1) {
            flowId = flowId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("cancelWorkflow", function (done) {
        expect(function () {
          force = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "cancelWorkflow",
            params: [flowId, force]
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
      it("changeNodeName", function (done) {
        expect(function () {
          node = {};
          name = "Name1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "changeNodeName",
            params: [node, name]
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
      it("changeNodeUser", function (done) {
        expect(function () {
          node = {};
          user = "Administrator";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "changeNodeUser",
            params: [node, user, params]
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
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", obSolCommonWfUtilsId).then(function success(flowId1) {
            flowId = flowId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("changeWorkflowPriority", function (done) {
        expect(function () {
          prio = 0;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "changeWorkflowPriority",
            params: [flowId, prio]
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
      it("cancelWorkflow", function (done) {
        expect(function () {
          force = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "cancelWorkflow",
            params: [flowId, force]
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
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", obSolCommonWfUtilsId).then(function success(flowId1) {
            flowId = flowId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("finish Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow1) {
            workflow = workflow1;
            succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowId, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("checkMainAdminWf", function (done) {
        expect(function () {
          wfDiagram = workflow;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "checkMainAdminWf",
            params: [wfDiagram]
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
      it("checkWfIsRunning", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "checkWfIsRunning",
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
      it("createReminder", function (done) {
        expect(function () {
          objId = obSolCommonWfUtilsId;
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "createReminder",
            params: [objId, params]
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
      it("createServiceWfName", function (done) {
        expect(function () {
          wfName = "Workflow Unittest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "createServiceWfName",
            params: [wfName]
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
      it("deleteWorkflowTemplate", function (done) {
        expect(function () {
          workflowTemplateId = "UnittestTemplateWF";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "deleteWorkflowTemplate",
            params: [workflowTemplateId]
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
      it("exportWorkflow", function (done) {
        expect(function () {
          workflowId = "Unittest";
          file = "File1";
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "exportWorkflow",
            params: [workflowId, file, config]
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
      it("exportWorkflowTemplate", function (done) {
        expect(function () {
          workflowTemplateName = "Unittest";
          file = "File1";
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "exportWorkflowTemplate",
            params: [workflowTemplateName, file, config]
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
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", obSolCommonWfUtilsId).then(function success(flowId1) {
            flowId = flowId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("findFirstActiveNode", function (done) {
        expect(function () {
          objId = obSolCommonWfUtilsId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "findFirstActiveNode",
            params: [objId, flowId]
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
      it("findFirstActiveNodeWithUrl", function (done) {
        expect(function () {
          objId = obSolCommonWfUtilsId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "findFirstActiveNodeWithUrl",
            params: [objId, flowId]
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
      it("findWorkflows", function (done) {
        expect(function () {
          findWorkflowInfo = "findWorkflowInfo";
          checkoutOptions = null;
          ixConn = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "findWorkflows",
            params: [findWorkflowInfo, checkoutOptions, ixConn]
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
      it("forwardWorkflow", function (done) {
        expect(function () {
          currentNodeId = 1;
          destinationNodeIds = [2];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "forwardWorkflow",
            params: [flowId, currentNodeId, destinationNodeIds]
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
      it("getActiveNodes", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getActiveNodes",
            params: [workflow]
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
      it("getActiveUserNodes", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getActiveUserNodes",
            params: [workflow]
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
      it("getActiveWorkflows", function (done) {
        expect(function () {
          objId = obSolCommonWfUtilsId;
          filter = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getActiveWorkflows",
            params: [objId, filter]
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
      it("getAppUrl", function (done) {
        expect(function () {
          appName = "UnitTests";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getAppUrl",
            params: [appName, params]
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
      it("getCycleNumber", function (done) {
        expect(function () {
          nodeName = "node [[233]]";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getCycleNumber",
            params: [nodeName]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("233");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", obSolCommonWfUtilsId).then(function success(flowId1) {
            flowId = flowId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getFormName", function (done) {
        expect(function () {
          wfCollectNode = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: { objId: obSolCommonWfUtilsId, flowId: flowId },
            method: "getFormName",
            params: [wfCollectNode]
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
      it("getFormUrl", function (done) {
        expect(function () {
          wfCollectNode = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: { objId: obSolCommonWfUtilsId, flowId: flowId },
            method: "getFormUrl",
            params: [wfCollectNode]
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
      it("getLastActiveWorkflow", function (done) {
        expect(function () {
          objId = obSolCommonWfUtilsId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getLastActiveWorkflow",
            params: [objId]
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
      it("getNextWorkflowVersionNo", function (done) {
        expect(function () {
          workflowTemplate = "UnittestTemplate1WF";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getNextWorkflowVersionNo",
            params: [workflowTemplate]
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
      it("get Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow1) {
            workflow = workflow1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getNode", function (done) {
        expect(function () {
          id = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getNode",
            params: [workflow, id]
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
      it("getNodeById", function (done) {
        expect(function () {
          nodeId = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getNodeById",
            params: [workflow, nodeId]
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
      it("getNodeByName", function (done) {
        expect(function () {
          name = "node 2";
          cycleNo = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getNodeByName",
            params: [workflow, name, cycleNo]
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
      it("getNodeName", function (done) {
        expect(function () {
          nodeId = 2;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getNodeName",
            params: [workflow, nodeId]
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
      it("getNodeUser", function (done) {
        expect(function () {
          wfDiagram = workflow;
          nodeId = 1;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getNodeUser",
            params: [wfDiagram, nodeId, config]
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
      it("getPreviousUserNodes", function (done) {
        expect(function () {
          nodeId = 2;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getPreviousUserNodes",
            params: [workflow, nodeId]
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
      it("getServiceWfPrefix", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getServiceWfPrefix",
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
      it("getSuccessorNode", function (done) {
        expect(function () {
          nodeId = 2;
          filterConfig = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getSuccessorNode",
            params: [workflow, nodeId, filterConfig]
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
      it("getSuccessorNodes", function (done) {
        expect(function () {
          nodeId = 2;
          filterType = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getSuccessorNodes",
            params: [workflow, nodeId, filterType]
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
      it("getSuccessorNodes2", function (done) {
        expect(function () {
          nodeId = 2;
          filterConfig = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getSuccessorNodes2",
            params: [workflow, nodeId, filterConfig]
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
      it("getTemplateSord", function (done) {
        expect(function () {
          sord = WfUtilsSord;
          options = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getTemplateSord",
            params: [sord, flowId, options]
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
      it("getTemplateWfDiagramNode", function (done) {
        expect(function () {
          wfDiagram = workflow;
          nodeId = 2;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getTemplateWfDiagramNode",
            params: [wfDiagram, nodeId]
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
      it("getTemplates", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getTemplates",
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
      it("getUniqueNodes", function (done) {
        expect(function () {
          nodes = [1, 2, 3];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getUniqueNodes",
            params: [nodes]
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
      it("getWfBaseUrl", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getWfBaseUrl",
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
      it("getWfMapValue", function (done) {
        expect(function () {
          key = "key1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getWfMapValue",
            params: [flowId, key]
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
      it("getWfNameFromJson", function (done) {
        expect(function () {
          workflowJson = "{\"objectTable\": []}";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getWfNameFromJson",
            params: [workflowJson]
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
      it("getWorkflow", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getWorkflow",
            params: [flowId, params]
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
      it("getWorkflowAsJson", function (done) {
        expect(function () {
          templFlowId = "Unittest";
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getWorkflowAsJson",
            params: [templFlowId, config]
          }).then(function success(jsonResult) {
            workflowJson = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getAllWorkflowNamesFromJson", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getAllWorkflowNamesFromJson",
            params: [workflowJson]
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
      it("getWorkflowIconGuid", function (done) {
        expect(function () {
          iconName = "Icon1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getWorkflowIconGuid",
            params: [iconName]
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
      it("getWorkflowStatus", function (done) {
        expect(function () {
          flow = workflow;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getWorkflowStatus",
            params: [flow]
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
      it("getWorkflowTemplate", function (done) {
        expect(function () {
          workflowTemplateId = "Unittest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getWorkflowTemplate",
            params: [workflowTemplateId]
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
      it("getWorkflowTemplateId", function (done) {
        expect(function () {
          workflowTemplateName = "Unittest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getWorkflowTemplateId",
            params: [workflowTemplateName]
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
      it("getWorkflowTemplateName", function (done) {
        expect(function () {
          workflowTemplateId = "Unittest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getWorkflowTemplateName",
            params: [workflowTemplateId]
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
      it("hasActiveWorkflow", function (done) {
        expect(function () {
          objId = obSolCommonWfUtilsId;
          template = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "hasActiveWorkflow",
            params: [objId, template]
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
      it("importWorkflow", function (done) {
        expect(function () {
          workflowName = "XYZ";
          file = "File1";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: { workflowId: "Unittest" },
            method: "importWorkflow",
            params: [workflowName, file, params]
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
      it("isServiceWf", function (done) {
        expect(function () {
          wfDiagram = workflow;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "isServiceWf",
            params: [wfDiagram]
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
      it("isSubworkflowNode", function (done) {
        expect(function () {
          node = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "isSubworkflowNode",
            params: [node]
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
      it("loadBaseConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "loadBaseConfig",
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
      it("mergeWorkflowTemplate", function (done) {
        expect(function () {
          workflowTemplateName = "ABC";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "mergeWorkflowTemplate",
            params: [workflowTemplateName, params]
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
      it("parseAndCheckParams", function (done) {
        expect(function () {
          nodeId = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "parseAndCheckParams",
            params: [workflow, nodeId]
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
      it("readWorkflowIconGuids", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "readWorkflowIconGuids",
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
      it("renameWorkflowTemplate", function (done) {
        expect(function () {
          oldName = "XX";
          newName = "ZZ";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "renameWorkflowTemplate",
            params: [oldName, newName]
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
      it("setNodeEscalations", function (done) {
        expect(function () {
          node = {};
          nodeEscalations = [];
          defaultUserName = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "setNodeEscalations",
            params: [node, nodeEscalations, defaultUserName]
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
      it("setSessionOptionStartDocMaskWorkflows", function (done) {
        expect(function () {
          startDocMaskWorkflows = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "setSessionOptionStartDocMaskWorkflows",
            params: [startDocMaskWorkflows]
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
      it("setWfMapValue", function (done) {
        expect(function () {
          objId = obSolCommonWfUtilsId;
          key = "Key1";
          values = "Value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "setWfMapValue",
            params: [objId, flowId, key, values]
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
      it("setWorkflowStatus", function (done) {
        expect(function () {
          wfDiagram = workflow;
          status = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "setWorkflowStatus",
            params: [wfDiagram, status]
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
      it("startMaskStandardWorkflow", function (done) {
        expect(function () {
          objId = obSolCommonWfUtilsId;
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "startMaskStandardWorkflow",
            params: [objId, params]
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
          templFlowId = "UnittestStandardWF";
          flowName = "XYZ";
          objId = obSolCommonWfUtilsId;
          prio = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "startWorkflow",
            params: [templFlowId, flowName, objId, prio]
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
      it("templateMixin", function (done) {
        expect(function () {
          mixinString = "{}";
          objId = obSolCommonWfUtilsId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "templateMixin",
            params: [mixinString, objId, flowId]
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
      it("finish Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow1) {
            workflow = workflow1;
            succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowId, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
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