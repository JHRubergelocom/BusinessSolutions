
describe("[libix] sol.unittest.ix.services.SolCommonServiceRegistry", function () {
  var originalTimeout, serviceId,
      serviceDescription, params, lookup, serviceProperty, desc, name, masks, queryObject, query;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonServiceRegistry").then(function success(obSolCommonServiceRegistryId) {
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
    describe("sol.common.ix.ServiceRegistry", function () {
      it("buildResult", function (done) {
        expect(function () {
          serviceId = "serviceId1";
          serviceDescription = "serviceDescription1";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.ServiceRegistry",
            classConfig: {},
            method: "buildResult",
            params: [serviceId, serviceDescription, params]
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
      it("checkProperty", function (done) {
        expect(function () {
          lookup = "lookup1";
          serviceProperty = "lookup1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.ServiceRegistry",
            classConfig: {},
            method: "checkProperty",
            params: [lookup, serviceProperty]
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
      it("checkServiceDescription", function (done) {
        expect(function () {
          desc = { type: "type1", name: "name1", ns: "ns1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.ServiceRegistry",
            classConfig: {},
            method: "checkServiceDescription",
            params: [desc]
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
      it("evaluateConfig", function (done) {
        expect(function () {
          serviceDescription = "serviceDescription1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.ServiceRegistry",
            classConfig: {},
            method: "evaluateConfig",
            params: [serviceDescription]
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
          serviceId = "serviceId1";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.ServiceRegistry",
            classConfig: {},
            method: "get",
            params: [serviceId, params]
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
      it("getDocMask", function (done) {
        expect(function () {
          name = "UnitTest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.ServiceRegistry",
            classConfig: {},
            method: "getDocMask",
            params: [name]
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
      it("getMaskLines", function (done) {
        expect(function () {
          masks = ["UnitTest"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.ServiceRegistry",
            classConfig: {},
            method: "getMaskLines",
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
      it("getServiceRegistry", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.ServiceRegistry",
            classConfig: {},
            method: "getServiceRegistry",
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
      it("matchQueryParams", function (done) {
        expect(function () {
          queryObject = {};
          serviceDescription = "serviceDescription1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.ServiceRegistry",
            classConfig: {},
            method: "matchQueryParams",
            params: [queryObject, serviceDescription]
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
      it("query", function (done) {
        expect(function () {
          query = {};
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.ServiceRegistry",
            classConfig: {},
            method: "query",
            params: [query, params]
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
      it("register", function (done) {
        expect(function () {
          serviceId = "serviceId1";
          serviceDescription = { type: "type1", name: "name1", ns: "ns1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.ServiceRegistry",
            classConfig: {},
            method: "register",
            params: [serviceId, serviceDescription]
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