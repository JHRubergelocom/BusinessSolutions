
describe("[libas] sol.unittest.as.services.SolCommonMonitoringCollectorsChildrenCollector", function () {
  var obSolCommonMonitoringCollectorsChildrenCollectorId, originalTimeout, content, sord, config, results, ctx;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonMonitoringCollectorsChildrenCollector").then(function success(obSolCommonMonitoringCollectorsChildrenCollectorId1) {
        obSolCommonMonitoringCollectorsChildrenCollectorId = obSolCommonMonitoringCollectorsChildrenCollectorId1;
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
    describe("sol.common_monitoring.as.collectors.ChildrenCollector", function () {
      it("cleanupMap", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringCollectorsChildrenCollectorId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.collectors.ChildrenCollector",
              classConfig: { objId: obSolCommonMonitoringCollectorsChildrenCollectorId },
              method: "cleanupMap",
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
      it("deleteReference", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringCollectorsChildrenCollectorId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.collectors.ChildrenCollector",
              classConfig: { objId: obSolCommonMonitoringCollectorsChildrenCollectorId },
              method: "deleteReference",
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
      it("dispose", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.collectors.ChildrenCollector",
              classConfig: { objId: obSolCommonMonitoringCollectorsChildrenCollectorId },
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
      it("getContext", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.collectors.ChildrenCollector",
              classConfig: { objId: obSolCommonMonitoringCollectorsChildrenCollectorId },
              method: "getContext",
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
      it("getParentMap", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.collectors.ChildrenCollector",
              classConfig: { objId: obSolCommonMonitoringCollectorsChildrenCollectorId },
              method: "getParentMap",
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
      it("getResults", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.collectors.ChildrenCollector",
              classConfig: { objId: obSolCommonMonitoringCollectorsChildrenCollectorId },
              method: "getResults",
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
      it("hasMoreResults", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.collectors.ChildrenCollector",
              classConfig: { objId: obSolCommonMonitoringCollectorsChildrenCollectorId },
              method: "hasMoreResults",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.collectors.ChildrenCollector",
              classConfig: { objId: obSolCommonMonitoringCollectorsChildrenCollectorId },
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
      it("postProcess", function (done) {
        expect(function () {
          sord = obSolCommonMonitoringCollectorsChildrenCollectorId;
          results = [];
          ctx = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib1",
            config: {
              className: "sol.common_monitoring.as.collectors.ChildrenCollector",
              classConfig: { objId: obSolCommonMonitoringCollectorsChildrenCollectorId },
              method: "postProcess",
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