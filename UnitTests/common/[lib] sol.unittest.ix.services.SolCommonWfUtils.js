
describe("[lib] sol.unittest.ix.services.SolCommonWfUtils", function () {
  var WfUtilsSord, userName, userInfo, originalTimeout, assocs, mergeWorkflowTemplate,
      originWorkflowTemplate, nodeName, cycleNo, comment, override, flowId, force, name,
      user, params, prio, wfDiagram, objId, wfName, workflowTemplateId, workflowId, file,
      config, workflowTemplateName, findWorkflowInfo, checkoutOptions, ixConn, currentNodeId,
      destinationNodeIds, filter, wfCollectNode, nodeId, filterConfig, filterType, sord, options,
      nodes, key, workflowJson, iconName, template, workflowName, oldName, newName, startDocMaskWorkflows,
      values, status, templFlowId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonWfUtils").then(function success(obSolCommonWfUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/WfUtils").then(function success1(WfUtilsSord1) {
          WfUtilsSord = WfUtilsSord1;
          userName = test.Utils.getCurrentUserName();
          test.Utils.getUserInfo(userName).then(function success3(userInfo1) {
            userInfo = userInfo1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
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
// TODO get getWorkflow  "UnittestTemplate1WF", "UnittestTemplate2WF"

// TODO get getWorkflow  "UnittestTemplate1WF", "UnittestTemplate2WF"
      xit("addWorkflowTemplateVersions", function (done) {
        expect(function () {
          mergeWorkflowTemplate = PVALUE;
          originWorkflowTemplate = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "addWorkflowTemplateVersions",
            params: [mergeWorkflowTemplate, originWorkflowTemplate]
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
      xit("appendCycleNumber", function (done) {
        expect(function () {
          nodeName = PVALUE;
          cycleNo = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "appendCycleNumber",
            params: [nodeName, cycleNo]
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
      xit("appendNodeComment", function (done) {
        expect(function () {
          node = PVALUE;
          comment = PVALUE;
          override = PVALUE;
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
      xit("cancelWorkflow", function (done) {
        expect(function () {
          flowId = PVALUE;
          force = PVALUE;
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
      xit("changeNodeName", function (done) {
        expect(function () {
          node = PVALUE;
          name = PVALUE;
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
      xit("changeNodeUser", function (done) {
        expect(function () {
          node = PVALUE;
          user = PVALUE;
          params = PVALUE;
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
      xit("changeWorkflowPriority", function (done) {
        expect(function () {
          flowId = PVALUE;
          prio = PVALUE;
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
      xit("checkMainAdminWf", function (done) {
        expect(function () {
          wfDiagram = PVALUE;
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
      xit("checkWfIsRunning", function (done) {
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
      xit("createReminder", function (done) {
        expect(function () {
          objId = PVALUE;
          params = PVALUE;
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
      xit("createServiceWfName", function (done) {
        expect(function () {
          wfName = PVALUE;
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
      xit("deleteWorkflowTemplate", function (done) {
        expect(function () {
          workflowTemplateId = PVALUE;
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
      xit("exportWorkflow", function (done) {
        expect(function () {
          workflowId = PVALUE;
          file = PVALUE;
          config = PVALUE;
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
      xit("exportWorkflowTemplate", function (done) {
        expect(function () {
          workflowTemplateName = PVALUE;
          file = PVALUE;
          config = PVALUE;
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
      xit("findFirstActiveNode", function (done) {
        expect(function () {
          objId = PVALUE;
          flowId = PVALUE;
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
      xit("findFirstActiveNodeWithUrl", function (done) {
        expect(function () {
          objId = PVALUE;
          flowId = PVALUE;
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
      xit("findWorkflows", function (done) {
        expect(function () {
          findWorkflowInfo = PVALUE;
          checkoutOptions = PVALUE;
          ixConn = PVALUE;
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
      xit("forwardWorkflow", function (done) {
        expect(function () {
          flowId = PVALUE;
          currentNodeId = PVALUE;
          destinationNodeIds = PVALUE;
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
      xit("getActiveNodes", function (done) {
        expect(function () {
          workflow = PVALUE;
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
      xit("getActiveUserNodes", function (done) {
        expect(function () {
          workflow = PVALUE;
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
      xit("getActiveWorkflows", function (done) {
        expect(function () {
          objId = PVALUE;
          filter = PVALUE;
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
      xit("getCycleNumber", function (done) {
        expect(function () {
          nodeName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getCycleNumber",
            params: [nodeName]
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
      xit("getFormName", function (done) {
        expect(function () {
          wfCollectNode = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
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
      xit("getFormUrl", function (done) {
        expect(function () {
          wfCollectNode = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
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
      xit("getLastActiveWorkflow", function (done) {
        expect(function () {
          objId = PVALUE;
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
      xit("getNextWorkflowVersionNo", function (done) {
        expect(function () {
          workflowTemplate = PVALUE;
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
      xit("getNode", function (done) {
        expect(function () {
          workflow = PVALUE;
          id = PVALUE;
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
      xit("getNodeById", function (done) {
        expect(function () {
          workflow = PVALUE;
          nodeId = PVALUE;
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
      xit("getNodeByName", function (done) {
        expect(function () {
          workflow = PVALUE;
          name = PVALUE;
          cycleNo = PVALUE;
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
      xit("getNodeName", function (done) {
        expect(function () {
          workflow = PVALUE;
          nodeId = PVALUE;
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
      xit("getNodeUser", function (done) {
        expect(function () {
          wfDiagram = PVALUE;
          nodeId = PVALUE;
          config = PVALUE;
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
      xit("getServiceWfPrefix", function (done) {
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
      xit("getSuccessorNode", function (done) {
        expect(function () {
          workflow = PVALUE;
          nodeId = PVALUE;
          filterConfig = PVALUE;
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
      xit("getSuccessorNodes", function (done) {
        expect(function () {
          workflow = PVALUE;
          nodeId = PVALUE;
          filterType = PVALUE;
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
      xit("getSuccessorNodes2", function (done) {
        expect(function () {
          workflow = PVALUE;
          nodeId = PVALUE;
          filterConfig = PVALUE;
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
      xit("getTasks", function (done) {
        expect(function () {
          filter = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getTasks",
            params: [filter]
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
      xit("getTemplateSord", function (done) {
        expect(function () {
          sord = PVALUE;
          flowId = PVALUE;
          options = PVALUE;
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
      xit("getTemplateWfDiagramNode", function (done) {
        expect(function () {
          wfDiagram = PVALUE;
          nodeId = PVALUE;
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
      xit("getTemplates", function (done) {
        expect(function () {
          params = PVALUE;
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
      xit("getUniqueNodes", function (done) {
        expect(function () {
          nodes = PVALUE;
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
      xit("getWfBaseUrl", function (done) {
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
      xit("getWfMapValue", function (done) {
        expect(function () {
          flowId = PVALUE;
          key = PVALUE;
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
      xit("getWfNameFromJson", function (done) {
        expect(function () {
          workflowJson = PVALUE;
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
      xit("getWorkflow", function (done) {
        expect(function () {
          flowId = PVALUE;
          params = PVALUE;
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
      xit("getWorkflowAsJson", function (done) {
        expect(function () {
          flowId = PVALUE;
          config = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "getWorkflowAsJson",
            params: [flowId, config]
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
      xit("getWorkflowIconGuid", function (done) {
        expect(function () {
          iconName = PVALUE;
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
      xit("getWorkflowStatus", function (done) {
        expect(function () {
          flow = PVALUE;
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
      xit("getWorkflowTemplate", function (done) {
        expect(function () {
          workflowTemplateId = PVALUE;
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
      xit("getWorkflowTemplateId", function (done) {
        expect(function () {
          workflowTemplateName = PVALUE;
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
      xit("getWorkflowTemplateName", function (done) {
        expect(function () {
          workflowTemplateId = PVALUE;
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
      xit("hasActiveWorkflow", function (done) {
        expect(function () {
          objId = PVALUE;
          template = PVALUE;
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
      xit("importWorkflow", function (done) {
        expect(function () {
          workflowName = PVALUE;
          file = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
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
      xit("isServiceWf", function (done) {
        expect(function () {
          wfDiagram = PVALUE;
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
      xit("loadBaseConfig", function (done) {
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
      xit("mergeWorkflowTemplate", function (done) {
        expect(function () {
          workflowTemplateName = PVALUE;
          params = PVALUE;
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
      xit("parseAndCheckParams", function (done) {
        expect(function () {
          workflow = PVALUE;
          nodeId = PVALUE;
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
      xit("readWorkflowIconGuids", function (done) {
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
      xit("renameWorkflowTemplate", function (done) {
        expect(function () {
          oldName = PVALUE;
          newName = PVALUE;
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
      xit("replaceSubTemplateNamesInWorkflowJson", function (done) {
        expect(function () {
          workflowJson = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfUtils",
            classConfig: {},
            method: "replaceSubTemplateNamesInWorkflowJson",
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
      xit("setSessionOptionStartDocMaskWorkflows", function (done) {
        expect(function () {
          startDocMaskWorkflows = PVALUE;
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
      xit("setWfMapValue", function (done) {
        expect(function () {
          objId = PVALUE;
          flowId = PVALUE;
          key = PVALUE;
          values = PVALUE;
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
      xit("setWorkflowStatus", function (done) {
        expect(function () {
          wfDiagram = PVALUE;
          status = PVALUE;
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
      xit("startMaskStandardWorkflow", function (done) {
        expect(function () {
          objId = PVALUE;
          params = PVALUE;
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
      xit("startWorkflow", function (done) {
        expect(function () {
          templFlowId = PVALUE;
          flowName = PVALUE;
          objId = PVALUE;
          prio = PVALUE;
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