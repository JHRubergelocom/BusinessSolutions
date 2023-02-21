
describe("[lib] sol.unittest.ix.services.SolCommonTemplateSordUtils", function () {
  var originalTimeout, objKeys, mapKeys, templateSord, key,
      fields, tableKind, typeDef, sord, options;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonTemplateSordUtils").then(function success(obSolCommonTemplateSordUtilsId) {
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
    describe("sol.common.TemplateSordUtils", function () {
      it("create", function (done) {
        expect(function () {
          objKeys = {};
          mapKeys = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.TemplateSordUtils",
            classConfig: {},
            method: "create",
            params: [objKeys, mapKeys]
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
      it("getMapKey", function (done) {
        expect(function () {
          templateSord = {};
          key = "key1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.TemplateSordUtils",
            classConfig: {},
            method: "getMapKey",
            params: [templateSord, key]
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
      it("getObjKey", function (done) {
        expect(function () {
          templateSord = {};
          key = "key1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.TemplateSordUtils",
            classConfig: {},
            method: "getObjKey",
            params: [templateSord, key]
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
      it("getSolType", function (done) {
        expect(function () {
          sord = {};
          options = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.TemplateSordUtils",
            classConfig: {},
            method: "getSolType",
            params: [sord, options]
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
      it("getTable", function (done) {
        expect(function () {
          templateSord = {};
          fields = [];
          tableKind = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.TemplateSordUtils",
            classConfig: {},
            method: "getTable",
            params: [templateSord, fields, tableKind]
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
      it("getValue", function (done) {
        expect(function () {
          templateSord = {};
          typeDef = { type: "type1", key: "key1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.TemplateSordUtils",
            classConfig: {},
            method: "getValue",
            params: [templateSord, typeDef]
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
      it("getWfMapKey", function (done) {
        expect(function () {
          templateSord = {};
          key = "key1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.TemplateSordUtils",
            classConfig: {},
            method: "getWfMapKey",
            params: [templateSord, key]
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