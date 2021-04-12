
describe("[libas] sol.unittest.as.services.solcommon_monitoringMonitorTimedEvent", function () {
  var MonitorTimedEventSord, userName, userInfo, originalTimeout, content, params, sord, sords, sordProcessFunction, component, name, functions, secondRun, currentSord, config, value;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("solcommon_monitoringMonitorTimedEvent").then(function success(obsolcommon_monitoringMonitorTimedEventId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common_monitoring [unit tests]/Resources/MonitorTimedEvent").then(function success1(MonitorTimedEventSord1) {
          MonitorTimedEventSord = MonitorTimedEventSord1;
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
    describe("sol.common_monitoring.MonitorTimedEvent", function () {
      xit("checkInjection", function (done) {
        expect(function () {
          params = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "checkInjection",
              params: [params]
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
      xit("checkParameters", function (done) {
        expect(function () {
          params = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "checkParameters",
              params: [params]
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
      xit("getAnalyzer", function (done) {
        expect(function () {
          params = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "getAnalyzer",
              params: [params]
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
      xit("getExecutor", function (done) {
        expect(function () {
          params = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "getExecutor",
              params: [params]
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
      xit("getInjections", function (done) {
        expect(function () {
          params = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "getInjections",
              params: [params]
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
      xit("initialize", function (done) {
        expect(function () {
          params = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "initialize",
              params: [params]
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
      xit("prepareExecution", function (done) {
        expect(function () {
          sord = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "prepareExecution",
              params: [sord, params]
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
      xit("processSord", function (done) {
        expect(function () {
          sord = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "processSord",
              params: [sord, params]
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
      xit("processSords", function (done) {
        expect(function () {
          sords = PVALUE;
          params = PVALUE;
          sordProcessFunction = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "processSords",
              params: [sords, params, sordProcessFunction]
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
      xit("run", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "run",
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
      xit("setupComponent", function (done) {
        expect(function () {
          component = PVALUE;
          name = PVALUE;
          functions = PVALUE;
          secondRun = PVALUE;
          currentSord = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "setupComponent",
              params: [component, name, functions, secondRun, currentSord]
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
      xit("setupComponents", function (done) {
        expect(function () {
          config = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "setupComponents",
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
      xit("wrapInFunction", function (done) {
        expect(function () {
          value = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common_monitoring.as.MonitorTimedEvent",
              classConfig: {},
              method: "wrapInFunction",
              params: [value]
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