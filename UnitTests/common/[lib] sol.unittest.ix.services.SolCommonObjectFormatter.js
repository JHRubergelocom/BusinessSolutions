
describe("[lib] sol.unittest.ix.services.SolCommonObjectFormatter", function () {
  var ObjectFormatterSord, originalTimeout,
      config, partName, configPart, result, params, originalSord, toObj, sord,
      maskName, objKeys, prefix, key, value, flowId, objId, sordObjKey, mask,
      formattedSord, addedObjKeys, objKeyPrefix, objKey, guid, feedActionTypes,
      cfg, originalTask, succNodes, succNodesIds, userTask, nodeId, wfDiagram,
      id;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("solcommonObjectFormatter").then(function success(obsolcommonObjectFormatterId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success1(ObjectFormatterSord1) {
          ObjectFormatterSord = ObjectFormatterSord1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
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
    describe("sol.common.ObjectFormatter", function () {
      it("format", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter",
            classConfig: {},
            method: "format",
            params: [config]
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
      it("formatPart", function (done) {
        expect(function () {
          partName = "part1";
          configPart = { data: [1, 2], formatter: "sol.unittest.ObjectFormatter" };
          result = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter",
            classConfig: {},
            method: "formatPart",
            params: [partName, configPart, result]
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
    describe("sol.common.ObjectFormatter.BaseSord", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", ObjectFormatterSord.id).then(function success(flowId1) {
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
      it("initialize", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
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
      it("addSordTypeKind", function (done) {
        expect(function () {
          formattedSord = [];
          sord = ObjectFormatterSord;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "addSordTypeKind",
            params: [formattedSord, sord]
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
      it("getSordTypeKind", function (done) {
        expect(function () {
          id = 9999;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "getSordTypeKind",
            params: [id]
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
      it("shouldAddSordTypeKind", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "shouldAddSordTypeKind",
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
      it("build", function (done) {
        expect(function () {
          originalSord = ObjectFormatterSord;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "build",
            params: [originalSord]
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
      it("applySordKeys", function (done) {
        expect(function () {
          toObj = {};
          sord = ObjectFormatterSord;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "applySordKeys",
            params: [toObj, sord]
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
      it("applyObjKeys", function (done) {
        expect(function () {
          toObj = {};
          maskName = "UnitTest";
          objKeys = ObjectFormatterSord.objKeys;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: { sord: ObjectFormatterSord },
            method: "applyObjKeys",
            params: [toObj, maskName, objKeys]
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
      it("applyObjKey", function (done) {
        expect(function () {
          toObj = { objKeys: {} };
          prefix = "p";
          key = "key1";
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "applyObjKey",
            params: [toObj, prefix, key, value]
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
      it("applyMapData", function (done) {
        expect(function () {
          toObj = {};
          sord = ObjectFormatterSord;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: { sord: ObjectFormatterSord },
            method: "applyMapData",
            params: [toObj, sord]
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
      it("applyWfMapData", function (done) {
        expect(function () {
          toObj = {};
          sord = ObjectFormatterSord;
          flowId = flowId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "applyWfMapData",
            params: [toObj, sord, flowId]
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
      it("applyFormBlobData", function (done) {
        expect(function () {
          toObj = {};
          objId = ObjectFormatterSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "applyFormBlobData",
            params: [toObj, objId]
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
      it("applyFeedActions", function (done) {
        expect(function () {
          toObj = {};
          sord = ObjectFormatterSord;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "applyFeedActions",
            params: [toObj, sord]
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
      it("applyMapKey", function (done) {
        expect(function () {
          toObj = { mapKeys: {} };
          key = "key1";
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "applyMapKey",
            params: [toObj, key, value]
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
      it("applyWfMapKey", function (done) {
        expect(function () {
          toObj = { wfMapKeys: {} };
          key = "key1";
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "applyWfMapKey",
            params: [toObj, key, value]
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
      it("applyFormBlobKey", function (done) {
        expect(function () {
          toObj = { formBlobs: {} };
          key = "key1";
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "applyFormBlobKey",
            params: [toObj, key, value]
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
      it("buildCacheMaskObjKeys", function (done) {
        expect(function () {
          maskName = "UnitTest";
          objKeys = ObjectFormatterSord.objKeys;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "buildCacheMaskObjKeys",
            params: [maskName, objKeys]
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
      it("isValidObjKey", function (done) {
        expect(function () {
          sordObjKey = ObjectFormatterSord.objKeys[0];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "isValidObjKey",
            params: [sordObjKey]
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
      it("initialiseFormattedSord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "initialiseFormattedSord",
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
      it("buildJson", function (done) {
        expect(function () {
          originalSord = ObjectFormatterSord;
          mask = "UnitTest";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "buildJson",
            params: [originalSord, mask, params]
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
      it("addObjKeyJson", function (done) {
        expect(function () {
          mask = { fields: "name0" };
          params = {};
          formattedSord = [];
          addedObjKeys = false;
          objKeyPrefix = "O_";
          objKey = { data: ["data0"], name: "name0" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "addObjKeyJson",
            params: [mask, params, formattedSord, addedObjKeys, objKeyPrefix, objKey]
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
      it("getFeedActionsJson", function (done) {
        expect(function () {
          guid = ObjectFormatterSord.guid;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "getFeedActionsJson",
            params: [guid]
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
      it("normalizeFeedActionTypes", function (done) {
        expect(function () {
          feedActionTypes = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseSord",
            classConfig: {},
            method: "normalizeFeedActionTypes",
            params: [feedActionTypes]
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
          test.Utils.getWorkflow(flowId).then(function success1(workflow) {
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
    describe("sol.common.ObjectFormatter.StatisticSord", function () {
      it("format", function (done) {
        expect(function () {
          config = {
            sord: {
              formatter: "sol.common.ObjectFormatter.StatisticSord",
              // instance of de.elo.ix.client.Sord
              data: ObjectFormatterSord,
              config: {
                sordKeys: ["id", "maskName", "name", "IDateIso", "XDateIso"],
                objKeys: ["UNITTEST_FIELD1", "UNITTEST_FIELD2", "UNITTEST_FIELD3"]
              }
            }
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter",
            classConfig: {},
            method: "format",
            params: [config]
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
    describe("sol.common.ObjectFormatter.TemplateSord", function () {
      it("format", function (done) {
        expect(function () {
          config = {
            sord: {
              formatter: "sol.common.ObjectFormatter.TemplateSord",
              // instance of de.elo.ix.client.Sord
              data: ObjectFormatterSord
            }
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter",
            classConfig: {},
            method: "format",
            params: [config]
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
    describe("sol.common.ObjectFormatter.WfMap", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", ObjectFormatterSord.id).then(function success(flowId1) {
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
      it("format", function (done) {
        expect(function () {
          config = {
            sord: {
              formatter: "sol.common.ObjectFormatter.WfMap",
              // instance of de.elo.ix.client.Sord
              data: ObjectFormatterSord,
              config: {
                sordKeys: ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName"],
                allMapFields: true,
                allFormBlobFields: true,
                flowId: flowId,
                asAdmin: false
              }
            }
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter",
            classConfig: {},
            method: "format",
            params: [config]
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
          test.Utils.getWorkflow(flowId).then(function success1(workflow) {
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
    describe("sol.common.ObjectFormatter.BaseTask", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", ObjectFormatterSord.id).then(function success(flowId1) {
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
      it("get userTask of first active node", function (done) {
        expect(function () {
          test.Utils.findFirstActiveNodeUserTask(ObjectFormatterSord.id, flowId).then(function success1(firstActiveNodeUserTask) {
            userTask = firstActiveNodeUserTask;
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
          cfg = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseTask",
            classConfig: {},
            method: "initialize",
            params: [cfg]
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
      it("build", function (done) {
        expect(function () {
          originalTask = userTask;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseTask",
            classConfig: {},
            method: "build",
            params: [originalTask]
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
      it("getValues", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseTask",
            classConfig: { task: userTask },
            method: "getValues",
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
      it("prepareMaps", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseTask",
            classConfig: {},
            method: "prepareMaps",
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
      it("finish Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow) {
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
    describe("sol.common.ObjectFormatter.StatisticTask", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", ObjectFormatterSord.id).then(function success(flowId1) {
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
      it("get userTask of first active node", function (done) {
        expect(function () {
          test.Utils.findFirstActiveNodeUserTask(ObjectFormatterSord.id, flowId).then(function success1(firstActiveNodeUserTask) {
            userTask = firstActiveNodeUserTask;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("format", function (done) {
        expect(function () {
          config = {
            sord: {
              formatter: "sol.common.ObjectFormatter.StatisticTask",
              // instance of de.elo.ix.client.UserTask
              data: userTask,
              config: {
                wfKeys: ["activateDateWorkflowIso", "flowId", "flowName", "flowStatus", "nodeId", "nodeName", "objName", "timeLimitIso", "userId", "userName"]
              }
            }
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter",
            classConfig: {},
            method: "format",
            params: [config]
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
          test.Utils.getWorkflow(flowId).then(function success1(workflow) {
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
    describe("sol.common.ObjectFormatter.TemplateTask", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", ObjectFormatterSord.id).then(function success(flowId1) {
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
      it("get userTask of first active node", function (done) {
        expect(function () {
          test.Utils.findFirstActiveNodeUserTask(ObjectFormatterSord.id, flowId).then(function success1(firstActiveNodeUserTask) {
            userTask = firstActiveNodeUserTask;
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.TemplateTask",
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
      it("format", function (done) {
        expect(function () {
          config = {
            sord: {
              formatter: "sol.common.ObjectFormatter.TemplateTask",
              // instance of de.elo.ix.client.UserTask
              data: userTask
            }
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter",
            classConfig: {},
            method: "format",
            params: [config]
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
          test.Utils.getWorkflow(flowId).then(function success1(workflow) {
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
    describe("sol.common.ObjectFormatter.BaseWfDiagramNode", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", ObjectFormatterSord.id).then(function success(flowId1) {
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
      it("get workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success(workflow) {
            wfDiagram = workflow;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get first active node", function (done) {
        expect(function () {
          test.Utils.findFirstActiveNode(ObjectFormatterSord.id, flowId).then(function success1(firstActiveNode) {
            nodeId = firstActiveNode.nodeId;
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
          params = { data: wfDiagram, config: { nodeId: nodeId } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseWfDiagramNode",
            classConfig: { data: wfDiagram, config: { nodeId: nodeId } },
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
      it("build", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.BaseWfDiagramNode",
            classConfig: { data: wfDiagram, config: { nodeId: nodeId } },
            method: "build",
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
      it("finish Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow) {
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
    describe("sol.common.ObjectFormatter.TemplateWfDiagramNode", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", ObjectFormatterSord.id).then(function success(flowId1) {
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
      it("get workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success(workflow) {
            wfDiagram = workflow;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get first active node", function (done) {
        expect(function () {
          test.Utils.findFirstActiveNode(ObjectFormatterSord.id, flowId).then(function success1(firstActiveNode) {
            nodeId = firstActiveNode.nodeId;
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
          params = { data: wfDiagram, config: { nodeId: nodeId } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.TemplateWfDiagramNode",
            classConfig: { data: wfDiagram, config: { nodeId: nodeId } },
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
      it("build", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.TemplateWfDiagramNode",
            classConfig: { data: wfDiagram, config: { nodeId: nodeId } },
            method: "build",
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
      it("finish Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow) {
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