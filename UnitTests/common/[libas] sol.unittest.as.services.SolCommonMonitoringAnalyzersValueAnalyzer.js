
describe("[libas] sol.unittest.as.services.SolCommonMonitoringAnalyzersValueAnalyzer", function () {
  var obSolCommonMonitoringAnalyzersValueAnalyzerId, originalTimeout, content, sord, ctx, value, referenceValue, comparator, valueCfg, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonMonitoringAnalyzersValueAnalyzer").then(function success(obSolCommonMonitoringAnalyzersValueAnalyzerId1) {
        obSolCommonMonitoringAnalyzersValueAnalyzerId = obSolCommonMonitoringAnalyzersValueAnalyzerId1;
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
    describe("sol.common_monitoring.as.analyzers.ValueAnalyzer", function () {
      it("analyze", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersValueAnalyzerId;
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.ValueAnalyzer",
              classConfig: { action: {}, values: [] },
              method: "analyze",
              params: [sord, ctx]
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
      it("checkReferenceValues", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersValueAnalyzerId;
          value = {};
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.ValueAnalyzer",
              classConfig: { action: {}, values: [] },
              method: "checkReferenceValues",
              params: [sord, value, ctx]
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
      it("compare", function (done) {
        expect(function () {
          value = "1000";
          referenceValue = "123";
          comparator = ">";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.ValueAnalyzer",
              classConfig: { action: {}, values: [] },
              method: "compare",
              params: [value, referenceValue, comparator]
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
      it("exists", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersValueAnalyzerId;
          value = "123";
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.ValueAnalyzer",
              classConfig: { action: {}, values: [] },
              method: "exists",
              params: [sord, value, ctx]
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
      it("getValue", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersValueAnalyzerId;
          valueCfg = "123";
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.ValueAnalyzer",
              classConfig: { action: {}, values: [] },
              method: "getValue",
              params: [sord, valueCfg, ctx]
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
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.ValueAnalyzer",
              classConfig: { action: {}, values: [] },
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
      it("isEmpty", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersValueAnalyzerId;
          value = "123";
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.ValueAnalyzer",
              classConfig: { action: {}, values: [] },
              method: "isEmpty",
              params: [sord, value, ctx]
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
      it("noop", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.ValueAnalyzer",
              classConfig: { action: {}, values: [] },
              method: "noop",
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
      it("notEmpty", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersValueAnalyzerId;
          value = "123";
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.ValueAnalyzer",
              classConfig: { action: {}, values: [] },
              method: "notEmpty",
              params: [sord, value, ctx]
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