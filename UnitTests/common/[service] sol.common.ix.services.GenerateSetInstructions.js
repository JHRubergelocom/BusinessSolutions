
describe("[service] sol.common.ix.services.GenerateSetInstructions", function () {
  var originalTimeout,
      tSord, mappings, instructions, prot, mandatories,
      mapping, tplObj, flowId, render, renderOptions, asAdmin,
      formBlobs, objId, n, type, objName, s;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GenerateSetInstructions").then(function success(obGenerateSetInstructionsId) {
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
    describe("sol.common.ix.services.GenerateSetInstructions", function () {
      it("buildInstructionsFromTemplateSord", function (done) {
        expect(function () {
          tSord = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: {},
            method: "buildInstructionsFromTemplateSord",
            params: [tSord]
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
      it("executeMapping", function (done) {
        expect(function () {
          mappings = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: {},
            method: "executeMapping",
            params: [mappings]
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
      it("filterInstructions", function (done) {
        expect(function () {
          instructions = [];
          mappings = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: { transformations: [] },
            method: "filterInstructions",
            params: [instructions, mappings]
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
      it("filterProtectedFields", function (done) {
        expect(function () {
          instructions = [];
          prot = [];          
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: {},
            method: "filterProtectedFields",
            params: [instructions, prot]
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
      it("findMissingMandatories", function (done) {
        expect(function () {
          instructions = [];
          mandatories = [];          
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: {},
            method: "findMissingMandatories",
            params: [instructions, mandatories]
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
      it("getConvertedData", function (done) {
        expect(function () {
          mapping = [];
          tplObj = {};
          flowId = "1";
          render = {};
          renderOptions = {};
          asAdmin = true;
          formBlobs = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: {},
            method: "getConvertedData",
            params: [mapping, tplObj, flowId, render, renderOptions, asAdmin, formBlobs]
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
      it("getSordData", function (done) {
        expect(function () {
          objId = "1";
          flowId = "1";
          asAdmin = true,
          formBlobs = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: {},
            method: "getSordData",
            params: [objId, flowId, asAdmin, formBlobs]
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
      it("getTemplate", function (done) {
        expect(function () {
          n = "name1";
          type = "type1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: {},
            method: "getTemplate",
            params: [n, type]
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
      it("getType", function (done) {
        expect(function () {
          objName = "objName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: {},
            method: "getType",
            params: [objName]
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
      it("mappingContainsFormBlobs", function (done) {
        mapping = [];
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: {},
            method: "mappingContainsFormBlobs",
            params: [mapping]
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
      it("optionalDontEscape", function (done) {
        expect(function () {
          s = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: {},
            method: "optionalDontEscape",
            params: [s]
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: {},
            method: "process",
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
      it("reverseMappings", function (done) {
        mappings = [];
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GenerateSetInstructions",
            classConfig: {},
            method: "reverseMappings",
            params: [mappings]
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_service_GenerateSetInstructions", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GenerateSetInstructions", {
          }).then(function success(jsonResult) {
            expect(jsonResult.instructions).toBeDefined();
            expect(jsonResult.instructions.length).toEqual(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed with Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GenerateSetInstructions", {
            dataSource: {
              objKeys: {
                MY_FIELD: "myvalue"
              },
              mapKeys: {
                NO_FIELD: "xyz",
                MY_CUSTOM_FIELD: "this is"
              }
            },
            mapping: [
              { source: { id: "MY_FIELD", type: "GRP" }, target: { id: "YOUR_FIELD", type: "GRP" } },
              { target: { id: "Y_FIELD", type: "MAP", value: "{{sord.mapKeys.MY_CUSTOM_FIELD}} fixed text" } },
              { source: { id: "NO_FIELD", type: "MAP" } },
              { target: { id: "OLD_DATAHISTORY", type: "FORMBLOB", value: "{{sord.formBlobs.DATAHISTORY}}" } }
            ],
            returnRendered: true,
            renderOptions: {
              emptyNonRendered: true
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.instructions).toBeDefined();
            expect(jsonResult.instructions.length).toBeGreaterThan(0);
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
    }).not.toThrow();
  });
});