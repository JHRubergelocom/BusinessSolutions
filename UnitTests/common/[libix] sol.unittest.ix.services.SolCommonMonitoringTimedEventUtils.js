
describe("[libix] sol.unittest.ix.services.SolCommonMonitoringTimedEventUtils", function () {
  var objSolCommonMonitoringTimedEventUtilsId, key, map,
      originalTimeout, params, cache, message, args, config, sordId, configs, template, entries, 
      keyPrefix, mapKeys, self, requestParameters, requestParams, isRerender, entry, isoDate, shift;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonMonitoringTimedEventUtils").then(function success(objSolCommonMonitoringTimedEventUtilsId1) {
        objSolCommonMonitoringTimedEventUtilsId = objSolCommonMonitoringTimedEventUtilsId1;
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
    describe("sol.common_monitoring.ix.TimedEventUtils", function () {
      it("getAndCacheTimedEventConfigByParams", function (done) {
        expect(function () {
          params = {};
          cache = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getAndCacheTimedEventConfigByParams",
            params: [params, cache]
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
      it("getAndCacheTimedEventConfigs", function (done) {
        expect(function () {
          params = {};
          cache = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getAndCacheTimedEventConfigs",
            params: [params, cache]
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
      it("getConfigId", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getConfigId",
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
      it("getConfigIdDirectly", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getConfigIdDirectly",
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
      it("getConfigIdFromTimedEvent", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getConfigIdFromTimedEvent",
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
      it("getConfigNamespace", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getConfigNamespace",
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
      it("getConfigNamespaceDirectly", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getConfigNamespaceDirectly",
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
      it("getConfigNamespaceFromTimedEvent", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getConfigNamespaceFromTimedEvent",
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
      it("getError", function (done) {
        expect(function () {
          message = "Message1";
          args = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getError",
            params: [message, args]
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
      it("getInjections", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getInjections",
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
      it("getSourceDirectly", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getSourceDirectly",
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
      it("getSourceFromSourceId", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getSourceFromSourceId",
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
      it("getTemplateSord", function (done) {
        expect(function () {
          sordId = objSolCommonMonitoringTimedEventUtilsId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getTemplateSord",
            params: [sordId]
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
      it("getTimedEventConfigDirectly", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getTimedEventConfigDirectly",
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
      it("getTimedEventConfigFromConfigs", function (done) {
        expect(function () {
          configs = {};
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getTimedEventConfigFromConfigs",
            params: [configs, params]
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
      it("getTimedEventConfigs", function (done) {
        expect(function () {
          params = {};
          cache = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getTimedEventConfigs",
            params: [params, cache]
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
      it("getTimedEventConfigsDirectly", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getTimedEventConfigsDirectly",
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
      it("getTimedEventConfigsFromCache", function (done) {
        expect(function () {
          cache = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getTimedEventConfigsFromCache",
            params: [cache]
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
      it("getTimedEventConfigsFromService", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getTimedEventConfigsFromService",
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
      it("getTimedEventDirectly", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getTimedEventDirectly",
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
      it("getTimedEventFromId", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "getTimedEventFromId",
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
      it("hasHandlebarExpression", function (done) {
        expect(function () {
          template = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "hasHandlebarExpression",
            params: [template]
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
      it("mapUpdateEntriesToKeys", function (done) {
        expect(function () {
          entries = [];
          keyPrefix = "keyPrefix1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "mapUpdateEntriesToKeys",
            params: [entries, keyPrefix]
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
      it("mapUpdateKeysToEntries", function (done) {
        expect(function () {
          mapKeys = {};
          keyPrefix = "keyPrefix1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "mapUpdateKeysToEntries",
            params: [mapKeys, keyPrefix]
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
      it("optimizedExecute", function (done) {
        expect(function () {
          self = {};
          requestParameters = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "optimizedExecute",
            params: [self, requestParameters]
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
      it("renderParams", function (done) {
        expect(function () {
          requestParams = {};
          params = {};
          isRerender = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "renderParams",
            params: [requestParams, params, isRerender]
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
      it("renderRequestParams", function (done) {
        expect(function () {
          requestParams = {};
          params = {};
          isRerender = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "renderRequestParams",
            params: [requestParams, params, isRerender]
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
      it("setTimedEventConfigsToCache", function (done) {
        expect(function () {
          configs = {};
          cache = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "setTimedEventConfigsToCache",
            params: [configs, cache]
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
      it("setTimedEventDate", function (done) {
        expect(function () {
          entry = {};
          params = { config: { shift: {} } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "setTimedEventDate",
            params: [entry, params]
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
      it("shiftIso", function (done) {
        expect(function () {
          isoDate = "20210323";
          shift = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "shiftIso",
            params: [isoDate, shift]
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
      it("translateKey", function (done) {
        expect(function () {
          key = "key1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "translateKey",
            params: [key]
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
      it("translateMap", function (done) {
        expect(function () {
          map = ["map1", "map2"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common_monitoring.ix.TimedEventUtils",
            classConfig: {},
            method: "translateMap",
            params: [map]
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