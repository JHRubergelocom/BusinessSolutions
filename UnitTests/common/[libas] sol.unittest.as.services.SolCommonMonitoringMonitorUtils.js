
describe("[libas] sol.unittest.as.services.SolCommonMonitoringMonitorUtils", function () {
  var obSolCommonMonitoringMonitorUtilsId, originalTimeout, content, sord, config, str, objId, wfTemplate;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonMonitoringMonitorUtils").then(function success(obSolCommonMonitoringMonitorUtilsId1) {
        obSolCommonMonitoringMonitorUtilsId = obSolCommonMonitoringMonitorUtilsId1;
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
    describe("sol.common_monitoring.as.MonitorUtils", function () {
      it("evalDateUnitConfig", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringMonitorUtilsId;
          config = { value: 10, unit: "Y" };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.MonitorUtils",
              classConfig: {},
              method: "evalDateUnitConfig",
              params: [sord, config]
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
      it("getLocalizedKwlKey", function (done) {
        expect(function () {
          str = "Y-1000";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.MonitorUtils",
              classConfig: {},
              method: "getLocalizedKwlKey",
              params: [str]
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
      it("registerUpdate", function (done) {
        expect(function () {
          objId = obSolCommonMonitoringMonitorUtilsId;
          wfTemplate = "wfTemplate1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.MonitorUtils",
              classConfig: {},
              method: "registerUpdate",
              params: [objId, wfTemplate]
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