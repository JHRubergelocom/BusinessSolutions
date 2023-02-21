
describe("[service] sol.common.ix.services.GetRedactorTemplates", function () {
  var originalTimeout, templates, render, load, objUnittestId,
      objKeysObj, params, config, entities, entityIds, entity, id,
      renderOpts, path, def, tData, results, obj, configProp,
      renderEverything, o;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    templates = [
      { desc: "{{translate 'sol.common.form.unittest.field1'}}", value: "{{UNITTEST.objKeys.UNITTEST_FIELD1}}" },
      { desc: "{{translate 'sol.common.form.unittest.field2'}}", value: "{{UNITTEST.objKeys.UNITTEST_FIELD2}}" }
    ];
    load = {
      config: "/common [unit tests]/Test data/redactorTemplates.config",
      jsonPath: "commonServiceConfig.templates"
    };
    render = {};
    expect(function () {
      test.Utils.createTempSord("GetRedactorTemplates").then(function success(obGetRedactorTemplatesId) {
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
    describe("sol.common.ix.services.GetRedactorTemplates", function () {
      it("collectDataFromIds", function (done) {
        expect(function () {
          entities = [];
          entityIds = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "collectDataFromIds",
            params: [entities, entityIds]
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
      it("collectSordData", function (done) {
        expect(function () {
          entity = {};
          id = "1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "collectSordData",
            params: [entity, id]
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
      it("collectTemplatingData", function (done) {
        expect(function () {
          renderOpts = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "collectTemplatingData",
            params: [renderOpts]
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
      it("getConfigProp", function (done) {
        expect(function () {
          config = "/common [unit tests]/Test data/redactorTemplates.config";
          path = "commonServiceConfig.templates";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "getConfigProp",
            params: [config, path]
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
      it("getPredefinedData", function (done) {
        expect(function () {
          renderOpts = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "getPredefinedData",
            params: [renderOpts]
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
      it("getRawTemplates", function (done) {
        expect(function () {
          templates = templates;
          load = load;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "getRawTemplates",
            params: [templates, load]
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
      it("isValidConfigDef", function (done) {
        expect(function () {
          def = { config: "/common [unit tests]/Test data/redactorTemplates.config", jsonPath: "commonServiceConfig.templates" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "isValidConfigDef",
            params: [def]
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
      it("isValidEntitiesDef", function (done) {
        expect(function () {
          entities = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "isValidEntitiesDef",
            params: [entities]
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
      it("merge", function (done) {
        expect(function () {
          tData = {};
          results = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "merge",
            params: [tData, results]
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
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: { load: load, render: render },
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
      it("renderAny", function (done) {
        expect(function () {
          obj = {};
          tData = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "renderAny",
            params: [obj, tData]
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
      it("renderTemplates", function (done) {
        expect(function () {
          configProp = {};
          tData = {};
          renderEverything = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "renderTemplates",
            params: [configProp, tData, renderEverything]
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
      it("search", function (done) {
        expect(function () {
          entities = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "search",
            params: [entities]
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
      it("searchAndIncludeSords", function (done) {
        expect(function () {
          tData = {};
          entities = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "searchAndIncludeSords",
            params: [tData, entities]
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
      it("searchForEntity", function (done) {
        expect(function () {
          entity = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "searchForEntity",
            params: [entity]
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
      it("shouldRenderEverything", function (done) {
        expect(function () {
          renderOpts = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "shouldRenderEverything",
            params: [renderOpts]
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
      it("shouldSearchForAdditionalData", function (done) {
        expect(function () {
          renderOpts = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "shouldSearchForAdditionalData",
            params: [renderOpts]
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
      it("withRenderedDesc", function (done) {
        expect(function () {
          tData = {};
          o = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetRedactorTemplates",
            classConfig: {},
            method: "withRenderedDesc",
            params: [tData, o]
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
    describe("RF_sol_common_service_GetRedactorTemplates", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetRedactorTemplates", {
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
      it("Get UnitTest sord", function (done) {
        expect(function () {
          objKeysObj = { UNITTEST_FIELD1: "Unittest" };
          params = { objKeysObj: objKeysObj };
          test.Utils.findSords(params).then(function success1(sords) {
            expect(sords).toBeDefined();
            expect(sords.length).toBeGreaterThan(0);
            objUnittestId = sords[0].id;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Only render description text", function (done) {
        expect(function () {
          render = {
            onlyDescription: true
          };
          test.Utils.execute("RF_sol_common_service_GetRedactorTemplates", {
            templates: templates,
            render: render
          }).then(function success(jsonResult) {
            expect(jsonResult.templates).toBeDefined();
            expect(jsonResult.templates.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Use data from sords in templating", function (done) {
        expect(function () {
          render = {
            searchAdditionalData: [
              {
                targetProp: "UNITTEST",
                doubleAsSord: true,
                masks: [],
                criteria: [
                  { key: "UNITTEST_FIELD1", value: "*" },
                  { key: "UNITTEST_FIELD2", value: "*" }
                ]
              }
            ]
          };
          test.Utils.execute("RF_sol_common_service_GetRedactorTemplates", {
            templates: templates,
            render: render
          }).then(function success(jsonResult) {
            expect(jsonResult.templates).toBeDefined();
            expect(jsonResult.templates.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Use data from id in templating", function (done) {
        expect(function () {
          render = {
            searchAdditionalData: [
              {
                targetProp: "UNITTEST",
                doubleAsSord: true,
                id: objUnittestId
              }
            ]
          };
          test.Utils.execute("RF_sol_common_service_GetRedactorTemplates", {
            templates: templates,
            render: render
          }).then(function success(jsonResult) {
            expect(jsonResult.templates).toBeDefined();
            expect(jsonResult.templates.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Loading templates from a configuration", function (done) {
        expect(function () {
          render = {
            onlyDescription: true
          };
          test.Utils.execute("RF_sol_common_service_GetRedactorTemplates", {
            load: load,
            render: render
          }).then(function success(jsonResult) {
            expect(jsonResult.templates).toBeDefined();
            expect(jsonResult.templates.length).toBeGreaterThan(0);
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