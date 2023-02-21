
describe("[libas] sol.unittest.as.services.SolCommonMonitoringExecutorsSimpleExecutor", function () {
  var obSolCommonMonitoringExecutorsSimpleExecutorId, originalTimeout, content, 
      sord, action, ctx, nameTemplate, value, results, user, config, userConnection, source, key;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonMonitoringExecutorsSimpleExecutor").then(function success(obSolCommonMonitoringExecutorsSimpleExecutorId1) {
        obSolCommonMonitoringExecutorsSimpleExecutorId = obSolCommonMonitoringExecutorsSimpleExecutorId1;
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
    describe("sol.common_monitoring.as.executors.SimpleExecutor", function () {
      it("FUNCTION", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringExecutorsSimpleExecutorId;
          action = { type: "FUNCTION", module: "sol.unittest.as.executors.SimpleExecutor" };
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "FUNCTION",
              params: [sord, action, ctx]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("REMINDER", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringExecutorsSimpleExecutorId;
          action = { type: "REMINDER", user: "Administrator" };
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "REMINDER",
              params: [sord, action, ctx]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("TECHNICAL_WORKFLOW", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringExecutorsSimpleExecutorId;
          action = { type: "TECHNICAL_WORKFLOW", templateId: "UnittestStandardWF" };
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "TECHNICAL_WORKFLOW",
              params: [sord, action, ctx]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("WORKFLOW", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringExecutorsSimpleExecutorId;
          action = { type: "WORKFLOW", templateId: "UnittestStandardWF" };
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "WORKFLOW",
              params: [sord, action, ctx]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("buildName", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringExecutorsSimpleExecutorId;
          ctx = {};
          nameTemplate = null;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "buildName",
              params: [sord, ctx, nameTemplate]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("dispose", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: { _userConnectionCache: {} },
              method: "dispose",
              params: []
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("disposeUserConnection", function (done) {
        expect(function () {
          userConnection = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "disposeUserConnection",
              params: [userConnection]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("eveluateActionProperty", function (done) {
        expect(function () {
          value = "value1";
          sord = obSolCommonMonitoringExecutorsSimpleExecutorId;
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "eveluateActionProperty",
              params: [value, sord, ctx]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("execute", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringExecutorsSimpleExecutorId;
          results = [];
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "execute",
              params: [sord, results, ctx]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("executeAction 'WORKFLOW'", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringExecutorsSimpleExecutorId;
          action = { type: "WORKFLOW", templateId: "UnittestStandardWF" };
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "executeAction",
              params: [sord, action, ctx]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("executeAction 'TECHNICAL_WORKFLOW'", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringExecutorsSimpleExecutorId;
          action = { type: "TECHNICAL_WORKFLOW", templateId: "UnittestStandardWF" };
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "executeAction",
              params: [sord, action, ctx]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("executeAction 'REMINDER'", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringExecutorsSimpleExecutorId;
          action = { type: "REMINDER", user: "Administrator" };
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "executeAction",
              params: [sord, action, ctx]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("executeAction 'FUNCTION'", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringExecutorsSimpleExecutorId;
          action = { type: "FUNCTION", module: "sol.unittest.as.executors.SimpleExecutor" };
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "executeAction",
              params: [sord, action, ctx]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("getConnection", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "getConnection",
              params: [user]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("getValueAtKey", function (done) {
        expect(function () {
          source = { key1: "key1" };
          key = "key1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "getValueAtKey",
              params: [source, key]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_monitoring.as.executors.SimpleExecutor",
              classConfig: {},
              method: "initialize",
              params: [config]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
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