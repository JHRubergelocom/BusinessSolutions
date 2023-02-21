
describe("[lib] sol.unittest.ix.services.SolConnectorXmlConverter", function () {
  var originalTimeout, value, config, fields,
      mapObj, type, converter, object, dependentFields;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolConnectorXmlConverter").then(function success(obSolConnectorXmlConverterId) {
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
    describe("sol.connector_xml.Converter", function () {
      it("convert", function (done) {
        expect(function () {
          value = "value1";
          config = { type: "DefaultConverter", defaultValue: "defaultValue1" };
          fields = {};
          mapObj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Converter",
            classConfig: {},
            method: "convert",
            params: [value, config, fields, mapObj]
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
          type = "UnittestConverter";
          converter = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Converter",
            classConfig: {},
            method: "register",
            params: [type, converter]
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
      it("remove", function (done) {
        expect(function () {
          type = "UnittestConverter";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Converter",
            classConfig: {},
            method: "remove",
            params: [type]
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
      it("isFunction", function (done) {
        expect(function () {
          object = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Converter",
            classConfig: {},
            method: "isFunction",
            params: [object]
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
    describe("sol.connector_xml.Converter.DefaultConverter", function () {
      it("convert", function (done) {
        expect(function () {
          value = "value1";
          config = { defaultValue: "defaultValue1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Converter.DefaultConverter",
            classConfig: {},
            method: "convert",
            params: [value, config]
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
    describe("sol.connector_xml.Converter.DateConverter", function () {
      it("convert", function (done) {
        expect(function () {
          value = "2019-11-22";
          config = { fromPattern: "yyyy-MM-dd", toPattern: "yyyyMMdd" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Converter.DateConverter",
            classConfig: {},
            method: "convert",
            params: [value, config]
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
    describe("sol.connector_xml.Converter.DynamicKwlLookup", function () {
      it("convert", function (done) {
        expect(function () {
          value = "value1";
          config = { kwl: "sol.dev.ix.dynkwl.FindUnitTestIterator", focusfield: "focusfield1", returnfield: "returnfield1" };
          fields = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Converter.DynamicKwlLookup",
            classConfig: {},
            method: "convert",
            params: [value, config, fields]
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
      it("fillDependentFields", function (done) {
        expect(function () {
          fields = [];
          dependentFields = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Converter.DynamicKwlLookup",
            classConfig: {},
            method: "fillDependentFields",
            params: [fields, dependentFields]
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
    describe("sol.connector_xml.Converter.MappingConverter", function () {
      it("convert", function (done) {
        expect(function () {
          value = "value1";
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Converter.MappingConverter",
            classConfig: {},
            method: "convert",
            params: [value, config]
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
    describe("sol.connector_xml.Converter.SetIfEmpty", function () {
      it("convert", function (done) {
        expect(function () {
          value = "value1";
          config = {};
          fields = {};
          mapObj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Converter.SetIfEmpty",
            classConfig: {},
            method: "convert",
            params: [value, config, fields, mapObj]
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