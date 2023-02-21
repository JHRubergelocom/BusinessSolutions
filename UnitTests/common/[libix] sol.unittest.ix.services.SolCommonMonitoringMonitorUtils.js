
describe("[libix] sol.unittest.ix.services.SolCommonMonitoringMonitorUtils", function () {
  var objSolCommonMonitoringMonitorUtilsId, SolCommonMonitoringMonitorUtilsSord, sord, 
      originalTimeout, objId, wfTemplate, str;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonMonitoringMonitorUtils").then(function success(objSolCommonMonitoringMonitorUtilsId1) {
        objSolCommonMonitoringMonitorUtilsId = objSolCommonMonitoringMonitorUtilsId1;
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
    describe("sol.common_monitoring.ix.MonitorUtils", function () {
      it("getsord", function (done) {
        expect(function () {
          test.Utils.getSord(objSolCommonMonitoringMonitorUtilsId).then(function success(SolCommonMonitoringMonitorUtilsSord1) {
            SolCommonMonitoringMonitorUtilsSord = SolCommonMonitoringMonitorUtilsSord1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("evalDateUnitConfig", function (done) {
        expect(function () {
          sord = SolCommonMonitoringMonitorUtilsSord;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.MonitorUtils",
            classConfig: {},
            method: "evalDateUnitConfig",
            params: [sord, config]
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
      it("getLocalizedKwlKey", function (done) {
        expect(function () {
          str = "TEST_UNIT";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.MonitorUtils",
            classConfig: {},
            method: "getLocalizedKwlKey",
            params: [str]
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
      it("registerUpdate", function (done) {
        expect(function () {
          objId = objSolCommonMonitoringMonitorUtilsId;
          wfTemplate = "wfTemplate1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.MonitorUtils",
            classConfig: {},
            method: "registerUpdate",
            params: [objId, wfTemplate]
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