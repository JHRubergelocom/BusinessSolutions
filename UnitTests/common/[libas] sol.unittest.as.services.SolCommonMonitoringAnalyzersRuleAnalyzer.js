
describe("[libas] sol.unittest.as.services.SolCommonMonitoringAnalyzersRuleAnalyzer", function () {
  var obSolCommonMonitoringAnalyzersRuleAnalyzerId, originalTimeout, content, sord, rule, execution, results, config, isoDate, verificationDate, params, date;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonMonitoringAnalyzersRuleAnalyzer").then(function success(obSolCommonMonitoringAnalyzersRuleAnalyzerId1) {
        obSolCommonMonitoringAnalyzersRuleAnalyzerId = obSolCommonMonitoringAnalyzersRuleAnalyzerId1;
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
    describe("sol.common_monitoring.as.analyzers.RuleAnalyzer", function () {
      it("analyze", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersRuleAnalyzerId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.RuleAnalyzer",
              classConfig: { rules: [] },
              method: "analyze",
              params: [sord]
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
      it("analyzeRule", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersRuleAnalyzerId;
          rule = { action: { type: "REMINDER", user: "Administrator" }, date: { type: "GRP", key: "MY_DATE" }, shift: { value: -2, unit: "M" }, execution: { type: "MAP", key: "MY_DATE_EXECUTION" } };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.RuleAnalyzer",
              classConfig: { rules: [] },
              method: "analyzeRule",
              params: [sord, rule]
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
      it("checkExecution", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersRuleAnalyzerId;
          execution = null;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.RuleAnalyzer",
              classConfig: { rules: [] },
              method: "checkExecution",
              params: [sord, execution]
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
      it("countHits", function (done) {
        expect(function () {
          results = [{ action: "action1" }];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.RuleAnalyzer",
              classConfig: { rules: [] },
              method: "countHits",
              params: [results]
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
              className: "sol.common_monitoring.as.analyzers.RuleAnalyzer",
              classConfig: { rules: [] },
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
      it("sanitizeIsoDate", function (done) {
        expect(function () {
          isoDate = "20180101";
          verificationDate = "20170203122030";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.RuleAnalyzer",
              classConfig: { rules: [] },
              method: "sanitizeIsoDate",
              params: [isoDate, verificationDate]
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
      it("shiftIso", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersRuleAnalyzerId;
          isoDate = "20180101";
          params = { value: 10, unit: "y" };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.RuleAnalyzer",
              classConfig: { rules: [] },
              method: "shiftIso",
              params: [sord, isoDate, params]
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
      it("updateExecution", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersRuleAnalyzerId;
          execution = { type: "MAP", key: "MY_DATE_EXECUTION" };
          date = "20180101";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.RuleAnalyzer",
              classConfig: { rules: [] },
              method: "updateExecution",
              params: [sord, execution, date]
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