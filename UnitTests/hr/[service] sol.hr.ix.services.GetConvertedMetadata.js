
describe("[service] sol.hr.ix.services.GetConvertedMetadata", function () {
  var originalTimeout,
      mappings, mapKeys, history, current, mapping, objId, flowId,
      render, renderOptions, sord, asAdmin, name, type, s;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetConvertedMetadata").then(function success(objTempId) {
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
    describe("sol.hr.services", function () {
      it("addMapTablesToMapping", function (done) {
        expect(function () {
          mappings = [];
          mapKeys = [];
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetConvertedMetadata",
            classConfig: {},
            method: "addMapTablesToMapping",
            params: [mappings, mapKeys]
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
      it("compensateForDeletedMapFields", function (done) {
        expect(function () {
          history = [];
          current = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetConvertedMetadata",
            classConfig: {},
            method: "compensateForDeletedMapFields",
            params: [history, current]
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
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetConvertedMetadata",
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
      it("getConvertedData", function (done) {
        expect(function () {
          mapping = [];
          objId = 1;
          flowId = 1;
          render = {};
          renderOptions = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetConvertedMetadata",
            classConfig: {},
            method: "getConvertedData",
            params: [mapping, objId, flowId, render, renderOptions]
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
      it("getMapKeys", function (done) {
        expect(function () {
          sord = { mapKeys: [] };
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetConvertedMetadata",
            classConfig: {},
            method: "getMapKeys",
            params: [sord]
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
      it("getMapKeysFromHistory", function (done) {
        expect(function () {
          history = "[]";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetConvertedMetadata",
            classConfig: {},
            method: "getMapKeysFromHistory",
            params: [history]
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
          objId = 1;
          flowId = 1;
          asAdmin = true;
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetConvertedMetadata",
            classConfig: {},
            method: "getSordData",
            params: [objId, flowId, asAdmin]
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
          name = "name1";
          type = "type1";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetConvertedMetadata",
            classConfig: {},
            method: "getTemplate",
            params: [name, type]
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
          s = "s1";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetConvertedMetadata",
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
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetConvertedMetadata",
            classConfig: { mapping: [] },
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
        expect(function () {
          mappings = [];
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetConvertedMetadata",
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
    describe("RF_sol_hr_service_GetConvertedMetadata", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetConvertedMetadata", {
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
      it("should not throw if executed with Parameter { 'mapping': [{ 'source': { 'id': 'MY_FIELD', 'type': 'GRP' }, 'target': { 'id': 'YOUR_FIELD', 'type': 'GRP' }}] }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetConvertedMetadata", {
            mapping: [{
              source: {
                id: "MY_FIELD",
                type: "GRP"
              },
              target: {
                id: "YOUR_FIELD",
                type: "GRP"
              }
            }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.id).toBeDefined();
            expect(jsonResult.id).toEqual("dataMapping");
            expect(jsonResult.dataMapping).toBeDefined();
            expect(jsonResult.dataMapping.length).toEqual(1);
            expect(jsonResult.dataMapping[0].id).toEqual("YOUR_FIELD");
            expect(jsonResult.dataMapping[0].type).toEqual("GRP");
            expect(jsonResult.dataMapping[0].value).toEqual("{{sord.objKeys.MY_FIELD}}");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed with Parameter { 'mapping': [{ 'source': { 'id': 'MY_FIELD', 'type': 'GRP' }, 'target': { 'id': 'YOUR_FIELD', 'type': 'GRP', value: '{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}' }}] }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetConvertedMetadata", {
            mapping: [{
              source: {
                id: "MY_FIELD",
                type: "GRP"
              },
              target: {
                id: "YOUR_FIELD",
                type: "GRP",
                value: "{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}"
              }
            }
            ]
          }).then(function success(jsonResult) {
            expect(jsonResult.id).toBeDefined();
            expect(jsonResult.id).toEqual("dataMapping");
            expect(jsonResult.dataMapping).toBeDefined();
            expect(jsonResult.dataMapping.length).toEqual(1);
            expect(jsonResult.dataMapping[0].id).toEqual("YOUR_FIELD");
            expect(jsonResult.dataMapping[0].type).toEqual("GRP");
            expect(jsonResult.dataMapping[0].value).toEqual("{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed with Parameter { 'mapping': [{ 'source': { 'id': 'MY_FIELD', 'type': 'GRP' }, 'target': { 'id': 'YOUR_FIELD', 'type': 'GRP', value: '{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}' }}], 'returnRendered' : true, 'emptyNonRendered': true }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetConvertedMetadata", {
            mapping: [{
              source: {
                id: "MY_FIELD",
                type: "GRP"
              },
              target: {
                id: "YOUR_FIELD",
                type: "GRP",
                value: "{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}"
              }
            }
            ],
            returnRendered: true,
            emptyNonRendered: true
          }).then(function success(jsonResult) {
            expect(jsonResult.id).toBeDefined();
            expect(jsonResult.id).toEqual("dataMapping");
            expect(jsonResult.dataMapping).toBeDefined();
            expect(jsonResult.dataMapping.length).toEqual(1);
            expect(jsonResult.dataMapping[0].id).toEqual("YOUR_FIELD");
            expect(jsonResult.dataMapping[0].type).toEqual("GRP");
            expect(jsonResult.dataMapping[0].value).toEqual("{{sordxyz.mapKeys.MY_CUSTOM_FIELD}}");
            expect(jsonResult.rendered).toBeDefined();
            expect(jsonResult.rendered).toEqual(true);
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