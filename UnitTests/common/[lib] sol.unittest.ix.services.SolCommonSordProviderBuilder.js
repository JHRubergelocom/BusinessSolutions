/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonSordProviderBuilder", function () {
  var originalTimeout, config, key, start, end, value,
      masks, source, target, outputs, values, type,
      options, id, ids, prop;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonSordProviderBuilder").then(function success(obSolCommonSordProviderBuilderId) {
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
    describe("sol.common.SordProviderBuilder", function () {
      it("addDateRangeCriteria", function (done) {
        expect(function () {
          key = "key1";
          start = "start1";
          end = "end1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "addDateRangeCriteria",
            params: [key, start, end]
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
      it("addDateSearchCriteria", function (done) {
        expect(function () {
          key = "key1";
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "addDateSearchCriteria",
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
      it("addFilterCriteria", function (done) {
        expect(function () {
          prop = "prop1";
          values = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "addFilterCriteria",
            params: [prop, values]
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
      it("addMasks", function (done) {
        expect(function () {
          masks = ["UnitTest"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "addMasks",
            params: [masks]
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
      it("addOutput", function (done) {
        expect(function () {
          source = { type: "type1", key: "key1" };
          target = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "addOutput",
            params: [source, target]
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
      it("addOutputs", function (done) {
        expect(function () {
          outputs = [{ source: { type: "type1", key: "key1" }, target: {} }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "addOutputs",
            params: [outputs]
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
      it("addSearchCriteria", function (done) {
        expect(function () {
          key = "key1";
          values = ["value1"];
          type = "type1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "addSearchCriteria",
            params: [key, values, type]
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
      it("get", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "get",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
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
      it("mapIds", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "mapIds",
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
      it("mapOutput", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "mapOutput",
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
      it("mapToFilterCriteria", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "mapToFilterCriteria",
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
      it("mapToSearchCriteria", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "mapToSearchCriteria",
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
      it("run", function (done) {
        expect(function () {
          options = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: { masks: [""], search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }], output: [{ source: { type: "SORD", key: "guid" }, target: { prop: "xxxx" } }] },
            method: "run",
            params: [options]
          }).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("useId", function (done) {
        expect(function () {
          id = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "useId",
            params: [id]
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
      it("useIds", function (done) {
        expect(function () {
          ids = [1];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProviderBuilder",
            classConfig: {},
            method: "useIds",
            params: [ids]
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