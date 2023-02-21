/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonMapTableToArray", function () {
  var originalTimeout, result, templateSord, fieldName, config,
      mapKey, outputDefinition, arr, output, key;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonMapTableToArray").then(function success(obSolCommonMapTableToArrayId) {
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
    describe("sol.common.ObjectFormatter.MapTableToArray", function () {
      it("convertToArray", function (done) {
        expect(function () {
          result = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.MapTableToArray",
            classConfig: {
              output: [
                { source: { key: "PERSON_USERNAME1" }, target: { prop: "username" } },
                { source: { key: "PERSON_USERNAME2" }, target: { prop: "username" } }
              ]
            },
            method: "convertToArray",
            params: [result]
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
      it("format", function (done) {
        expect(function () {
          templateSord = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.MapTableToArray",
            classConfig: {
              output: [
                { source: { key: "PERSON_USERNAME1" }, target: { prop: "username" } },
                { source: { key: "PERSON_USERNAME2" }, target: { prop: "username" } }
              ]
            },
            method: "format",
            params: [templateSord]
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
      it("getFieldName", function (done) {
        expect(function () {
          fieldName = "fieldName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.MapTableToArray",
            classConfig: {
              output: [
                { source: { key: "PERSON_USERNAME1" }, target: { prop: "username" } },
                { source: { key: "PERSON_USERNAME2" }, target: { prop: "username" } }
              ]
            },
            method: "getFieldName",
            params: [fieldName]
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
      it("getFieldNameIndex", function (done) {
        expect(function () {
          fieldName = "fieldName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.MapTableToArray",
            classConfig: {
              output: [
                { source: { key: "PERSON_USERNAME1" }, target: { prop: "username" } },
                { source: { key: "PERSON_USERNAME2" }, target: { prop: "username" } }
              ]
            },
            method: "getFieldNameIndex",
            params: [fieldName]
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
      it("getFieldValue", function (done) {
        expect(function () {
          templateSord = {};
          key = "PERSON_USERNAME1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.MapTableToArray",
            classConfig: {
              output: [
                { source: { key: "PERSON_USERNAME1" }, target: { prop: "username" } },
                { source: { key: "PERSON_USERNAME2" }, target: { prop: "username" } }
              ]
            },
            method: "getFieldValue",
            params: [templateSord, key]
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
      it("getIndexPosition", function (done) {
        expect(function () {
          fieldName = "fieldName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.MapTableToArray",
            classConfig: {
              output: [
                { source: { key: "PERSON_USERNAME1" }, target: { prop: "username" } },
                { source: { key: "PERSON_USERNAME2" }, target: { prop: "username" } }
              ]
            },
            method: "getIndexPosition",
            params: [fieldName]
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
      it("getTargetFieldName", function (done) {
        expect(function () {
          mapKey = {};
          outputDefinition = { target: { prop: {} } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.MapTableToArray",
            classConfig: {
              output: [
                { source: { key: "PERSON_USERNAME1" }, target: { prop: "username" } },
                { source: { key: "PERSON_USERNAME2" }, target: { prop: "username" } }
              ]
            },
            method: "getTargetFieldName",
            params: [mapKey, outputDefinition]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.MapTableToArray",
            classConfig: {
              output: [
                { source: { key: "PERSON_USERNAME1" }, target: { prop: "username" } },
                { source: { key: "PERSON_USERNAME2" }, target: { prop: "username" } }
              ]
            },
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
      it("returnOnlyPropSelector", function (done) {
        expect(function () {
          arr = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.MapTableToArray",
            classConfig: {
              output: [
                { source: { key: "PERSON_USERNAME1" }, target: { prop: "username" } },
                { source: { key: "PERSON_USERNAME2" }, target: { prop: "username" } }
              ]
            },
            method: "returnOnlyPropSelector",
            params: [arr]
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
      it("removeKeyFromSource", function (done) {
        expect(function () {
          templateSord = { mapKeys: [{ PERSON_USERNAME1: "User1" }] };
          key = "PERSON_USERNAME1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.MapTableToArray",
            classConfig: {
              output: [
                { source: { key: "PERSON_USERNAME1" }, target: { prop: "username" } },
                { source: { key: "PERSON_USERNAME2" }, target: { prop: "username" } }
              ]
            },
            method: "removeKeyFromSource",
            params: [templateSord, key]
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
      it("sanitizeOutputConfig", function (done) {
        expect(function () {
          output = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ObjectFormatter.MapTableToArray",
            classConfig: {
              output: [
                { source: { key: "PERSON_USERNAME1" }, target: { prop: "username" } },
                { source: { key: "PERSON_USERNAME2" }, target: { prop: "username" } }
              ]
            },
            method: "sanitizeOutputConfig",
            params: [output]
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