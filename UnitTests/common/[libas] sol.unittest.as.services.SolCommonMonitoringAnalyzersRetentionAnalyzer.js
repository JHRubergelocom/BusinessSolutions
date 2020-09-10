
describe("[libas] sol.unittest.as.services.SolCommonMonitoringAnalyzersRetentionAnalyzer", function () {
  var obSolCommonMonitoringAnalyzersRetentionAnalyzerId, originalTimeout, content, sord, latestChange, resultWithoutTime, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonMonitoringAnalyzersRetentionAnalyzer").then(function success(obSolCommonMonitoringAnalyzersRetentionAnalyzerId1) {
        obSolCommonMonitoringAnalyzersRetentionAnalyzerId = obSolCommonMonitoringAnalyzersRetentionAnalyzerId1;
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
    describe("sol.common_monitoring.as.analyzers.RetentionAnalyzer", function () {
      it("analyze", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersRetentionAnalyzerId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.RetentionAnalyzer",
              classConfig: { retention: { value: 2, unit: "M" }, action: { type: "WORKFLOW", templateId: "UnittestStandardWF", user: "Administrator" } },
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
      it("calculateNextCheck", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersRetentionAnalyzerId;
          latestChange = "20180622";
          resultWithoutTime = true;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.RetentionAnalyzer",
              classConfig: { retention: { value: 2, unit: "M" }, action: { type: "WORKFLOW", templateId: "UnittestStandardWF", user: "Administrator" } },
              method: "calculateNextCheck",
              params: [sord, latestChange, resultWithoutTime]
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
              className: "sol.common_monitoring.as.analyzers.RetentionAnalyzer",
              classConfig: { retention: { value: 2, unit: "M" }, action: { type: "WORKFLOW", templateId: "UnittestStandardWF", user: "Administrator" } },
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
      it("isObsolete", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersRetentionAnalyzerId;
          latestChange = "20180622";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.RetentionAnalyzer",
              classConfig: { retention: { value: 2, unit: "M" }, action: { type: "WORKFLOW", templateId: "UnittestStandardWF", user: "Administrator" } },
              method: "isObsolete",
              params: [sord, latestChange]
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
      it("retrieveChangedDate", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersRetentionAnalyzerId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.RetentionAnalyzer",
              classConfig: { retention: { value: 2, unit: "M" }, action: { type: "WORKFLOW", templateId: "UnittestStandardWF", user: "Administrator" } },
              method: "retrieveChangedDate",
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
      it("retrieveOldestChildrenChangedDate", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringAnalyzersRetentionAnalyzerId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.analyzers.RetentionAnalyzer",
              classConfig: { retention: { value: 2, unit: "M" }, action: { type: "WORKFLOW", templateId: "UnittestStandardWF", user: "Administrator" } },
              method: "retrieveOldestChildrenChangedDate",
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