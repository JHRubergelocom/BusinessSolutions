
describe("[service] sol.common.ix.services.ActionDefinitionCollector", function () {
  var originalTimeout, actionDefinition, config, base, obj, fct;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.services.ActionDefinitionCollector", function () {
      it("checkRequiredModules", function (done) {
        expect(function () {
          actionDefinition = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ActionDefinitionCollector",
            classConfig: {},
            method: "checkRequiredModules",
            params: [actionDefinition]
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
      it("collectChildren", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ActionDefinitionCollector",
            classConfig: {},
            method: "collectChildren",
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
      it("computeSordElementSelector", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ActionDefinitionCollector",
            classConfig: {},
            method: "computeSordElementSelector",
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
      it("execute", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ActionDefinitionCollector",
            classConfig: {},
            method: "execute",
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
      it("getButtonMergeMode", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ActionDefinitionCollector",
            classConfig: {},
            method: "getButtonMergeMode",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ActionDefinitionCollector",
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
      it("legacyMergeFct", function (done) {
        expect(function () {
          actionDefinition = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ActionDefinitionCollector",
            classConfig: {},
            method: "legacyMergeFct",
            params: [actionDefinition]
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
      it("multiMergeFct", function (done) {
        expect(function () {
          actionDefinition = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ActionDefinitionCollector",
            classConfig: {},
            method: "multiMergeFct",
            params: [actionDefinition]
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
      it("parseDefinition", function (done) {
        expect(function () {
          base = {};
          obj = {};
          fct = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ActionDefinitionCollector",
            classConfig: {},
            method: "parseDefinition",
            params: [base, obj, fct]
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
      it("replaceMergeFct", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ActionDefinitionCollector",
            classConfig: {},
            method: "replaceMergeFct",
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
      it("transformRibbonDefinitions", function (done) {
        expect(function () {
          actionDefinition = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ActionDefinitionCollector",
            classConfig: {},
            method: "transformRibbonDefinitions",
            params: [actionDefinition]
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
  describe("test ActionDefinitionCollector", function () {
    it("ActionDefinitionCollector", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_services_ActionDefinitionCollector", {
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});