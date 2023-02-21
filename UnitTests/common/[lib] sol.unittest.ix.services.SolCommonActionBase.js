
describe("[lib] sol.unittest.ix.services.SolCommonActionBase", function () {
  var ActionBaseSord, originalTimeout, appName, params,
      on, eventdata, message, errorcode, exception, language, objId, checkout,
      flowId, msg, key, value, url, array, config, sord, templateId, name, obj,
      succNodes, succNodesIds;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonActionBase").then(function success(objSolCommonActionBaseId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/ActionBase").then(function success1(ActionBaseSord1) {
          ActionBaseSord = ActionBaseSord1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
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
    describe("sol.common.ActionBase", function () {
      it("addActionEvent", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addActionEvent",
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
      it("addAppDialogEvent", function (done) {
        expect(function () {
          appName = "";
          params = {};
          on = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addAppDialogEvent",
            params: [appName, params, on]
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
      it("addDialogEvent", function (done) {
        expect(function () {
          appName = "";
          params = {};
          on = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addDialogEvent",
            params: [eventdata, params, on]
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
      it("addErrorEvent", function (done) {
        expect(function () {
          message = "";
          errorcode = "";
          exception = "";
          language = "";
          on = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addErrorEvent",
            params: [message, errorcode, exception, language, on]
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
      it("addFeedbackEvent", function (done) {
        expect(function () {
          message = "";
          language = "";
          params = {};
          on = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addFeedbackEvent",
            params: [message, language, params, on]
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
      it("addGotoIdEvent", function (done) {
        expect(function () {
          objId = ActionBaseSord.id;
          checkout = true;
          on = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addGotoIdEvent",
            params: [objId, checkout, on]
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
      it("addGotoWfTaskEvent", function (done) {
        expect(function () {
          flowId = "";
          params = {};
          on = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addGotoWfTaskEvent",
            params: [flowId, params, on]
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
      it("addInfoEvent", function (done) {
        expect(function () {
          message = "";
          language = "";
          params = {};
          on = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addInfoEvent",
            params: [message, language, params, on]
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
      it("addMessage", function (done) {
        expect(function () {
          language = "";
          msg = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addMessage",
            params: [language, msg]
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
      it("addPayload", function (done) {
        expect(function () {
          key = "";
          value = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addPayload",
            params: [key, value]
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
      it("addRefreshEvent", function (done) {
        expect(function () {
          objId = "";
          on = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addRefreshEvent",
            params: [objId, on]
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
      it("addUrlDialogEvent", function (done) {
        expect(function () {
          url = "";
          params = {};
          on = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addUrlDialogEvent",
            params: [url, params, on]
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
      it("addWfDialogEvent", function (done) {
        expect(function () {
          flowId = "";
          params = {};
          on = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "addWfDialogEvent",
            params: [flowId, params, on]
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
      it("arrayIsNotEmpty", function (done) {
        expect(function () {
          array = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "arrayIsNotEmpty",
            params: [array]
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
      it("buildResponse", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "buildResponse",
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
      it("createEvent", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "createEvent",
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
      it("createFeedbackEventCfg", function (done) {
        expect(function () {
          message = "";
          language = "";
          params = {};
          on = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "createFeedbackEventCfg",
            params: [message, language, params, on]
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
      it("execute", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "execute",
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
      it("getLocalizedString", function (done) {
        expect(function () {
          language = "";
          key = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "getLocalizedString",
            params: [language, key]
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
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
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
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "initialize",
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
      it("markCreationAction", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "markCreationAction",
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
      it("onFailure", function (done) {
        expect(function () {
          exception = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "onFailure",
            params: [exception]
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
      it("onSuccess", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "onSuccess",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
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
      it("renderConfig", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "renderConfig",
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
      it("requireUserRights", function (done) {
        expect(function () {
          sord = ActionBaseSord;
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "requireUserRights",
            params: [sord, params]
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
          objId = ActionBaseSord.id;
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "startMaskStandardWorkflow",
            params: [objId, params]
          }).then(function success(jsonResult) {
            flowId = jsonResult;
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
          objId = ActionBaseSord.id;
          templateId = "Unittest";
          name = "Unittest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "startWorkflow",
            params: [objId, templateId, name]
          }).then(function success(jsonResult) {
            flowId = jsonResult;
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
      it("remove workflow", function (done) {
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
      it("stringifyAll", function (done) {
        expect(function () {
          obj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "stringifyAll",
            params: [obj]
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
      it("writeFeedEvent", function (done) {
        expect(function () {
          objId = ActionBaseSord.id;
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.ActionBase",
            classConfig: {},
            method: "writeFeedEvent",
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